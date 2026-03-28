import { useState } from "react";
import { Ship, AlertTriangle, Globe, TrendingDown } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import MetricCard from "@/components/dashboard/MetricCard";
import WorldMap from "@/components/dashboard/WorldMap";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import ShipmentList from "@/components/dashboard/ShipmentList";
import RouteComparison from "@/components/dashboard/RouteComparison";
import ScenarioPanel from "@/components/dashboard/ScenarioPanel";
import RiskChart from "@/components/dashboard/RiskChart";
import { defaultRoute, optimizedRoute } from "@/data/mockData";

const Index = () => {
  const [selectedShipment, setSelectedShipment] = useState<string | null>("SHP-001");
  const [showOptimized, setShowOptimized] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Operations Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              Last updated: {new Date().toLocaleString()} • 4 active shipments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-risk-low animate-pulse-glow" />
            <span className="text-xs text-muted-foreground">Systems Online</span>
          </div>
        </header>

        <div className="p-6 space-y-5">
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Active Shipments" value="4" change="+1 this week" changeType="neutral" icon={Ship} />
            <MetricCard title="Avg Risk Score" value="44%" change="+3% from last month" changeType="negative" icon={AlertTriangle} />
            <MetricCard title="Regions Monitored" value="7" change="2 high-risk" changeType="negative" icon={Globe} />
            <MetricCard title="Cost Saved (Opt.)" value="$12.3K" change="−25% avg route cost" changeType="positive" icon={TrendingDown} />
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

          {/* Shipments + Route + Scenario */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <ShipmentList selectedShipment={selectedShipment} onSelect={setSelectedShipment} />
            <RouteComparison showOptimized={showOptimized} onToggle={() => setShowOptimized(!showOptimized)} />
            <ScenarioPanel />
          </div>

          {/* Chart */}
          <RiskChart />
        </div>
      </main>
    </div>
  );
};

export default Index;
