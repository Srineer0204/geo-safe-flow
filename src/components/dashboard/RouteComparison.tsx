import { motion } from "framer-motion";
import { Route as RouteIcon, TrendingDown, Clock, DollarSign, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultRoute, optimizedRoute } from "@/data/mockData";

interface RouteComparisonProps {
  showOptimized: boolean;
  onToggle: () => void;
}

const RouteComparison = ({ showOptimized, onToggle }: RouteComparisonProps) => {
  const active = showOptimized ? optimizedRoute : defaultRoute;
  const savings = showOptimized
    ? {
        cost: `−$${(defaultRoute.cost - optimizedRoute.cost).toLocaleString()}`,
        risk: `−${defaultRoute.risk - optimizedRoute.risk}%`,
        time: "+4 days",
      }
    : null;

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
          <RouteIcon className="h-4 w-4 text-primary" />
          Route Analysis
        </h3>
        <Button
          size="sm"
          variant={showOptimized ? "default" : "outline"}
          onClick={onToggle}
          className="text-xs h-7"
        >
          {showOptimized ? "Showing Optimized" : "Optimize Route"}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <motion.div layout className="p-3 rounded-lg bg-secondary/50 border border-border/50">
          <DollarSign className="h-4 w-4 text-muted-foreground mb-1" />
          <p className="text-lg font-mono font-semibold">${active.cost.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Est. Cost</p>
          {savings && <p className="text-xs text-risk-low font-medium mt-1">{savings.cost}</p>}
        </motion.div>
        <motion.div layout className="p-3 rounded-lg bg-secondary/50 border border-border/50">
          <Clock className="h-4 w-4 text-muted-foreground mb-1" />
          <p className="text-lg font-mono font-semibold">{active.time}</p>
          <p className="text-xs text-muted-foreground">Transit Time</p>
          {savings && <p className="text-xs text-risk-medium font-medium mt-1">{savings.time}</p>}
        </motion.div>
        <motion.div layout className="p-3 rounded-lg bg-secondary/50 border border-border/50">
          <Shield className="h-4 w-4 text-muted-foreground mb-1" />
          <p className={`text-lg font-mono font-semibold ${active.risk > 50 ? "text-risk-high" : "text-risk-low"}`}>{active.risk}%</p>
          <p className="text-xs text-muted-foreground">Risk Score</p>
          {savings && <p className="text-xs text-risk-low font-medium mt-1">{savings.risk}</p>}
        </motion.div>
      </div>

      <div className="mt-3">
        <p className="text-xs text-muted-foreground mb-2">Waypoints</p>
        <div className="flex flex-wrap gap-1.5">
          {active.points.map((p, i) => (
            <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-secondary border border-border/50 text-secondary-foreground font-mono">
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteComparison;
