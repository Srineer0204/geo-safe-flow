import { useMemo, useState } from "react";
import { Ship, AlertTriangle, Globe, TrendingDown, Leaf } from "lucide-react";
import PageLayout from "@/components/dashboard/PageLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import WorldMap from "@/components/dashboard/WorldMap";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import ShipmentList from "@/components/dashboard/ShipmentList";
import RouteComparison from "@/components/dashboard/RouteComparison";
import ScenarioPanel from "@/components/dashboard/ScenarioPanel";
import RiskChart from "@/components/dashboard/RiskChart";
import SeaWeatherPanel from "@/components/dashboard/SeaWeatherPanel";
import RegionNewsPanel from "@/components/dashboard/RegionNewsPanel";
import CorridorSelector from "@/components/dashboard/CorridorSelector";
import { defaultRoute, optimizedRoute, type Route } from "@/data/mockData";
import { corridors } from "@/data/ports";
import { useLanguage } from "@/i18n/LanguageContext";

const Index = () => {
  const [selectedShipment, setSelectedShipment] = useState<string | null>("SHP-001");
  const [showOptimized, setShowOptimized] = useState(false);
  const [corridorId, setCorridorId] = useState<string>("mumbai-rotterdam");
  const { t } = useLanguage();

  const active = useMemo(() => corridors.find((c) => c.id === corridorId)!, [corridorId]);

  const currentDefault: Route = useMemo(
    () => ({
      id: `${active.id}-shortest`,
      name: `${active.name} (Shortest)`,
      type: "shortest",
      isOptimized: false,
      fuelConsumption: 0,
      ...active.shortest,
    }),
    [active]
  );
  const currentOptimized: Route = useMemo(
    () => ({
      id: `${active.id}-safest`,
      name: `${active.name} (Safest)`,
      type: "safest",
      isOptimized: true,
      fuelConsumption: 0,
      ...active.safest,
    }),
    [active]
  );

  // All other corridors rendered faintly as background context
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

  return (
    <PageLayout
      title={t("nav.dashboard")}
      subtitle={`${t("header.lastUpdated")}: ${new Date().toLocaleString()} • ${corridors.length} global corridors`}
    >
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title={t("metric.activeShipments")} value="6" change="+2 this week" changeType="neutral" icon={Ship} />
        <MetricCard title={t("metric.avgRisk")} value="44%" change="+3% from last month" changeType="negative" icon={AlertTriangle} />
        <MetricCard title={t("metric.regions")} value="8" change="2 high-risk" changeType="negative" icon={Globe} />
        <MetricCard title={t("metric.costSaved")} value="$12.3K" change="−25% avg route cost" changeType="positive" icon={TrendingDown} />
        <MetricCard title={t("metric.co2Saved")} value="2.4t" change="−25% emissions" changeType="positive" icon={Leaf} />
      </div>

      {/* Corridor selector */}
      <CorridorSelector value={corridorId} onChange={setCorridorId} />

      {/* Map + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <WorldMap
            defaultRoute={currentDefault}
            optimizedRoute={currentOptimized}
            showOptimized={showOptimized}
            extraRoutes={extraRoutes}
          />
        </div>
        <div className="xl:col-span-1 min-h-[400px]">
          <AlertsPanel />
        </div>
      </div>

      {/* Region news + Sea Weather + Scenario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="min-h-[520px]">
          <RegionNewsPanel />
        </div>
        <div className="min-h-[520px]">
          <SeaWeatherPanel compact />
        </div>
        <ScenarioPanel />
      </div>

      {/* Route + Shipments + Chart */}
      <RouteComparison showOptimized={showOptimized} onToggle={() => setShowOptimized(!showOptimized)} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ShipmentList selectedShipment={selectedShipment} onSelect={setSelectedShipment} />
        <RiskChart />
      </div>
    </PageLayout>
  );
};

export default Index;
