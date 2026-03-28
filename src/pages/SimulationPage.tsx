import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Clock, DollarSign, Shield, Leaf, Play } from "lucide-react";
import PageLayout from "@/components/dashboard/PageLayout";
import WorldMap from "@/components/dashboard/WorldMap";
import { scenarios, defaultRoute, optimizedRoute, type Scenario } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";

const SimulationPage = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { t } = useLanguage();

  const runSimulation = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setIsRunning(true);
    setShowResults(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <PageLayout title={t("simulation.title")} subtitle="Digital Twin Engine">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Scenario selector */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            {t("simulation.select")}
          </h3>
          {scenarios.map((s) => (
            <motion.div
              key={s.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => runSimulation(s)}
              className={`glass-panel p-4 cursor-pointer transition-all ${
                selectedScenario?.id === s.id ? "border-primary/50 glow-primary" : "hover:border-border"
              }`}
            >
              <h4 className="text-sm font-semibold mb-1">{s.name}</h4>
              <p className="text-xs text-muted-foreground">{s.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <Play className="h-3 w-3 text-primary" />
                <span className="text-xs text-primary">{t("simulation.run")}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map + Results */}
        <div className="lg:col-span-2 space-y-5">
          <WorldMap
            defaultRoute={defaultRoute}
            optimizedRoute={showResults ? optimizedRoute : null}
            showOptimized={showResults}
          />

          {/* Loading state */}
          {isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-8 flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Running simulation...</p>
              <p className="text-xs text-muted-foreground mt-1">Recalculating routes and risk assessment</p>
            </motion.div>
          )}

          {/* Results */}
          <AnimatePresence>
            {showResults && selectedScenario && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  {t("simulation.impact")} — {selectedScenario.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass-panel p-4 text-center">
                    <Clock className="h-5 w-5 text-risk-medium mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">{t("simulation.delay")}</p>
                    <p className="text-lg font-mono font-semibold text-risk-medium">{selectedScenario.impact.timeChange}</p>
                  </div>
                  <div className="glass-panel p-4 text-center">
                    <DollarSign className="h-5 w-5 text-risk-high mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">{t("simulation.costIncrease")}</p>
                    <p className="text-lg font-mono font-semibold text-risk-high">+${selectedScenario.impact.costChange.toLocaleString()}</p>
                  </div>
                  <div className="glass-panel p-4 text-center">
                    <Shield className="h-5 w-5 text-risk-high mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">{t("simulation.riskChange")}</p>
                    <p className="text-lg font-mono font-semibold text-risk-high">+{selectedScenario.impact.riskChange}%</p>
                  </div>
                  <div className="glass-panel p-4 text-center">
                    <Leaf className="h-5 w-5 text-risk-medium mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">{t("simulation.co2Change")}</p>
                    <p className="text-lg font-mono font-semibold text-risk-medium">+{selectedScenario.impact.co2Change}t</p>
                  </div>
                </div>
                <div className="mt-4 glass-panel p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Recommendation:</span> Reroute affected shipments via{" "}
                    <span className="text-primary">Cape of Good Hope</span> to reduce risk by{" "}
                    <span className="text-risk-low">{selectedScenario.impact.riskChange}%</span> with an additional{" "}
                    <span className="text-risk-medium">{selectedScenario.impact.timeChange}</span> transit time.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
};

export default SimulationPage;
