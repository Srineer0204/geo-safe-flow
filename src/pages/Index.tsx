import { useState } from "react";
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
import { defaultRoute, optimizedRoute } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";

const Index = () => {
  const [selectedShipment, setSelectedShipment] = useState<string | null>("SHP-001");
  const [showOptimized, setShowOptimized] = useState(false);
  const { t } = useLanguage();

  return (
    <PageLayout
      title={t("nav.dashboard")}
      subtitle={`${t("header.lastUpdated")}: ${new Date().toLocaleString()} • 4 ${t("header.activeShipments")}`}
    >
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title={t("metric.activeShipments")} value="6" change="+2 this week" changeType="neutral" icon={Ship} />
        <MetricCard title={t("metric.avgRisk")} value="44%" change="+3% from last month" changeType="negative" icon={AlertTriangle} />
        <MetricCard title={t("metric.regions")} value="7" change="2 high-risk" changeType="negative" icon={Globe} />
        <MetricCard title={t("metric.costSaved")} value="$12.3K" change="−25% avg route cost" changeType="positive" icon={TrendingDown} />
        <MetricCard title={t("metric.co2Saved")} value="2.4t" change="−25% emissions" changeType="positive" icon={Leaf} />
      </div>

      {/* Map + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <WorldMap
            defaultRoute={defaultRoute}
            optimizedRoute={optimizedRoute}
            showOptimized={showOptimized}
          />
        </div>
        <div className="xl:col-span-1 min-h-[400px]">
          <AlertsPanel />
        </div>
      </div>

      {/* Sea Weather + Route + Scenario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 min-h-[520px]">
          <SeaWeatherPanel compact />
        </div>
        <RouteComparison showOptimized={showOptimized} onToggle={() => setShowOptimized(!showOptimized)} />
        <ScenarioPanel />
      </div>

      {/* Shipments + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ShipmentList selectedShipment={selectedShipment} onSelect={setSelectedShipment} />
        <RiskChart />
      </div>
    </PageLayout>
  );
};

export default Index;
