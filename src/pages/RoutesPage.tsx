import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Shield, Zap } from "lucide-react";
import PageLayout from "@/components/dashboard/PageLayout";
import WorldMap from "@/components/dashboard/WorldMap";
import SeaWeatherPanel from "@/components/dashboard/SeaWeatherPanel";
import RegionNewsPanel from "@/components/dashboard/RegionNewsPanel";
import CorridorSelector from "@/components/dashboard/CorridorSelector";
import { type Route } from "@/data/mockData";
import { corridors } from "@/data/ports";
import { useLanguage } from "@/i18n/LanguageContext";

type RouteType = "shortest" | "safest" | "eco";

const buildRoute = (
  corridorId: string,
  name: string,
  type: RouteType,
  base: { points: { name: string; coordinates: [number, number] }[]; distance: number; time: string; cost: number; risk: number; co2: number; ecoScore: number }
): Route => ({
  id: `${corridorId}-${type}`,
  name,
  type,
  isOptimized: type !== "shortest",
  fuelConsumption: Math.round(base.co2 * 0.38),
  ...base,
});

const RoutesPage = () => {
  const [corridorId, setCorridorId] = useState<string>("mumbai-rotterdam");
  const [selectedType, setSelectedType] = useState<RouteType>("shortest");
  const { t } = useLanguage();

  const active = useMemo(() => corridors.find((c) => c.id === corridorId)!, [corridorId]);

  const routes = useMemo(
    () => ({
      shortest: buildRoute(active.id, `${active.name} — Shortest`, "shortest", active.shortest),
      safest: buildRoute(active.id, `${active.name} — Safest`, "safest", active.safest),
      eco: buildRoute(active.id, `${active.name} — Eco`, "eco", active.eco),
    }),
    [active]
  );
  const activeRoute = routes[selectedType];

  const extraRoutes = useMemo(
    () =>
      corridors
        .filter((c) => c.id !== corridorId)
        .map((c) => ({
          id: c.id,
          points: c.shortest.points,
          color: "hsl(200,30%,55%)",
          opacity: 0.22,
        })),
    [corridorId]
  );

  const tabs: { key: RouteType; labelKey: string; icon: typeof Zap }[] = [
    { key: "shortest", labelKey: "routes.shortest", icon: Zap },
    { key: "safest", labelKey: "routes.safest", icon: Shield },
    { key: "eco", labelKey: "routes.eco", icon: Leaf },
  ];

  return (
    <PageLayout title={t("routes.title")}>
      <CorridorSelector value={corridorId} onChange={setCorridorId} />

      {/* Route type selector */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedType(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedType === tab.key
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 border border-border/50"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {selectedType === "eco" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-risk-low/10 border border-risk-low/30"
        >
          <Leaf className="h-4 w-4 text-risk-low" />
          <span className="text-sm font-medium text-risk-low">{t("sustainability.badge")}</span>
        </motion.div>
      )}

      {/* Map + panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <WorldMap
            defaultRoute={selectedType === "shortest" ? routes.shortest : undefined}
            optimizedRoute={activeRoute}
            showOptimized={selectedType !== "shortest"}
            extraRoutes={extraRoutes}
          />
        </div>
        <div className="xl:col-span-1 flex flex-col gap-5">
          <div className="min-h-[240px]">
            <SeaWeatherPanel compact />
          </div>
          <div className="min-h-[240px]">
            <RegionNewsPanel />
          </div>
        </div>
      </div>

      {/* Route details comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(routes).map(([key, route]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-panel p-5 cursor-pointer transition-all ${
              selectedType === key ? "border-primary/50 glow-primary" : ""
            }`}
            onClick={() => setSelectedType(key as RouteType)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">{route.name}</h3>
              {key === "eco" && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-risk-low/20 text-risk-low font-medium">
                  {t("routes.recommended")}
                </span>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("routes.distance")}</span>
                <span className="font-mono">{route.distance.toLocaleString()} nm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("routes.cost")}</span>
                <span className="font-mono">${route.cost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("routes.time")}</span>
                <span className="font-mono">{route.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("routes.risk")}</span>
                <span className={`font-mono ${route.risk > 50 ? "text-risk-high" : route.risk > 30 ? "text-risk-medium" : "text-risk-low"}`}>
                  {route.risk}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("routes.co2")}</span>
                <span className="font-mono">{route.co2} t</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("sustainability.ecoScore")}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${route.ecoScore > 70 ? "bg-risk-low" : route.ecoScore > 40 ? "bg-risk-medium" : "bg-risk-high"}`}
                      style={{ width: `${route.ecoScore}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs">{route.ecoScore}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
};

export default RoutesPage;
