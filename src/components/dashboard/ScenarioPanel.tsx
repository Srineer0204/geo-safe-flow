import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, Clock, DollarSign, MapPin } from "lucide-react";
import { scenarios, type Scenario } from "@/data/mockData";

const ScenarioPanel = () => {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);

  return (
    <div className="glass-panel p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
        <Zap className="h-4 w-4 text-primary" />
        What-If Simulation
      </h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveScenario(activeScenario?.id === s.id ? null : s)}
            className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
              activeScenario?.id === s.id
                ? "border-primary/50 bg-primary/10"
                : "border-border/50 hover:border-border bg-secondary/30"
            }`}
          >
            <p className="font-medium text-foreground">{s.name}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeScenario && (
          <motion.div
            key={activeScenario.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
              <p className="text-xs text-muted-foreground mb-3">{activeScenario.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <DollarSign className="h-3.5 w-3.5 text-risk-high" />
                  <span className="text-risk-high font-mono">+${activeScenario.impact.costChange.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3.5 w-3.5 text-risk-medium" />
                  <span className="text-risk-medium font-mono">{activeScenario.impact.timeChange}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="h-3.5 w-3.5 text-risk-high" />
                  <span className="text-risk-high font-mono">+{activeScenario.impact.riskChange}% risk</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{activeScenario.impact.affectedRegion}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScenarioPanel;
