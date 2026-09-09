import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

type AlertInsert = {
  external_id: string;
  title: string;
  description: string;
  source: string;
  severity: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  affected_region: string | null;
};

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

const response = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: jsonHeaders });

function noaaSeverity(properties: Record<string, unknown>): string {
  const severity = String(properties.severity ?? "").toLowerCase();
  const urgency = String(properties.urgency ?? "").toLowerCase();
  const event = String(properties.event ?? "").toLowerCase();

  if (severity === "extreme" || severity === "critical" || urgency === "immediate") return "critical";
  if (severity === "severe" || event.includes("warning")) return "high";
  if (severity === "moderate" || event.includes("watch") || event.includes("advisory")) return "medium";
  return "low";
}

function coordinatesFromGeometry(geometry: unknown): [number | null, number | null] {
  if (!geometry || typeof geometry !== "object") return [null, null];
  const coordinates = (geometry as { coordinates?: unknown }).coordinates;
  if (!Array.isArray(coordinates)) return [null, null];

  const points: number[][] = [];
  const visit = (value: unknown) => {
    if (Array.isArray(value) && value.length >= 2 && value.every((item) => typeof item === "number")) {
      points.push(value as number[]);
      return;
    }
    if (Array.isArray(value)) value.forEach(visit);
  };
  visit(coordinates);
  if (points.length === 0) return [null, null];

  const longitude = points.reduce((sum, point) => sum + point[0], 0) / points.length;
  const latitude = points.reduce((sum, point) => sum + point[1], 0) / points.length;
  return [latitude, longitude];
}

async function fetchNoaaAlerts(): Promise<AlertInsert[]> {
  const result = await fetch(
    "https://api.weather.gov/alerts/active?status=actual&message_type=alert,update",
    {
      headers: {
        Accept: "application/geo+json",
        "User-Agent": "GeoSafe Logistics alert ingestion (contact via application)",
      },
    },
  );
  if (!result.ok) throw new Error(`NOAA returned ${result.status}`);

  const payload = await result.json();
  const features = Array.isArray(payload?.features) ? payload.features : [];
  return features.map((feature: { id?: string; properties?: Record<string, unknown>; geometry?: unknown }) => {
    const properties = feature.properties ?? {};
    const [latitude, longitude] = coordinatesFromGeometry(feature.geometry);
    const event = String(properties.event ?? "Weather alert");
    const area = String(properties.areaDesc ?? "United States");
    const description = String(properties.description ?? properties.instruction ?? "NOAA weather alert active.");
    return {
      external_id: `noaa:${feature.id ?? `${event}:${area}:${String(properties.sent ?? "")}`}`,
      title: `${event} — ${area}`,
      description: description.slice(0, 4000),
      source: "NOAA Weather Service",
      severity: noaaSeverity(properties),
      status: "active",
      latitude,
      longitude,
      affected_region: area,
    };
  });
}

async function fetchUsแgsEarthquakes(): Promise<AlertInsert[]> {
  const result = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", {
    headers: { Accept: "application/geo+json" },
  });
  if (!result.ok) throw new Error(`USGS returned ${result.status}`);

  const payload = await result.json();
  const features = Array.isArray(payload?.features) ? payload.features : [];
  return features
    .filter((feature: { properties?: { mag?: unknown } }) => Number(feature.properties?.mag ?? 0) >= 4.5)
    .map((feature: { id?: string; properties?: Record<string, unknown>; geometry?: { coordinates?: unknown } }) => {
      const properties = feature.properties ?? {};
      const coordinates = Array.isArray(feature.geometry?.coordinates) ? feature.geometry.coordinates : [];
      const longitude = typeof coordinates[0] === "number" ? coordinates[0] : null;
      const latitude = typeof coordinates[1] === "number" ? coordinates[1] : null;
      const magnitude = Number(properties.mag ?? 0);
      const place = String(properties.place ?? "Unknown location");
      return {
        external_id: `usgs:${feature.id ?? `${place}:${String(properties.time ?? "")}`}`,
        title: `M${magnitude.toFixed(1)} earthquake — ${place}`,
        description: `USGS reported a magnitude ${magnitude.toFixed(1)} earthquake near ${place}. Review route and port safety conditions before dispatching vessels.`,
        source: "USGS Earthquake Hazards Program",
        severity: magnitude >= 6 ? "high" : magnitude >= 5 ? "medium" : "low",
        status: "active",
        latitude,
        longitude,
        affected_region: place,
      };
    });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return response({ error: "Method not allowed" }, 405);

  try {
    const authorization = req.headers.get("Authorization") ?? "";
    if (!authorization.startsWith("Bearer ")) return response({ error: "Unauthorized" }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authorization } } },
    );
    const { data, error: authError } = await userClient.auth.getUser();
    if (authError || !data.user) return response({ error: "Unauthorized" }, 401);

    const [noaaResult, usgsResult] = await Promise.allSettled([fetchNoaaAlerts(), fetchUsגsEarthquakes()]);
    const alerts = [
      ...(noaaResult.status === "fulfilled" ? noaaResult.value : []),
      ...(usgsResult.status === "fulfilled" ? usgsResult.value : []),
    ];
    if (alerts.length === 0 && noaaResult.status === "rejected" && usgsResult.status === "rejected") {
      return response({ error: "Both NOAA and USGS sources were unavailable" }, 502);
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { error: upsertError } = await adminClient
      .from("alerts")
      .upsert(alerts, { onConflict: "external_id" });
    if (upsertError) throw upsertError;

    return response({
      stored: alerts.length,
      sources: {
        noaa: noaaResult.status === "fulfilled" ? noaaResult.value.length : 0,
        usgs: usgsResult.status === "fulfilled" ? usgsResult.value.length : 0,
      },
      warnings: [noaaResult, usgsResult]
        .filter((result): result is PromiseRejectedResult => result.status === "rejected")
        .map((result) => result.reason instanceof Error ? result.reason.message : "Source unavailable"),
    });
  } catch (error) {
    return response({ error: error instanceof Error ? error.message : "Alert ingestion failed" }, 500);
  }
});