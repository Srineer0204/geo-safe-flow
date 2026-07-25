import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface NewsItem {
  headline: string;
  summary: string;
  severity: "info" | "warning" | "danger";
  source: string;
  time: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { port, region, country } = await req.json();
    if (!port || typeof port !== "string") {
      return new Response(JSON.stringify({ error: "port is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a maritime shipping intelligence analyst. Produce 5 plausible, realistic current-day news bulletins about the port "${port}"${country ? ` in ${country}` : ""}${region ? ` (${region} region)` : ""} that a logistics operations dashboard would surface today.

Each bulletin must cover topics like: port congestion, labour actions, weather/sea conditions, geopolitical risk, terminal expansions, throughput records, customs/regulation, or cyber incidents.

Return ONLY a JSON array (no prose, no markdown fences) of exactly 5 objects with these fields:
- headline: concise, under 90 chars
- summary: 1-2 sentences, factual tone
- severity: one of "info" | "warning" | "danger"
- source: plausible outlet (e.g., "Lloyd's List", "Reuters", "JOC", "port authority")
- time: relative (e.g., "18 min ago", "2 hr ago", "1 day ago")`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      return new Response(JSON.stringify({ error: "AI gateway error", status: resp.status, details: body }), {
        status: resp.status === 429 || resp.status === 402 ? resp.status : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "[]";
    const cleaned = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();

    let items: NewsItem[] = [];
    try {
      const start = cleaned.indexOf("[");
      const end = cleaned.lastIndexOf("]");
      items = JSON.parse(start >= 0 && end >= 0 ? cleaned.slice(start, end + 1) : cleaned);
    } catch {
      items = [];
    }

    return new Response(JSON.stringify({ items }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
