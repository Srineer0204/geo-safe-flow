import { motion } from "framer-motion";
import { Shield, TrendingUp, AlertTriangle, Cloud, Anchor } from "lucide-react";
import PageLayout from "@/components/dashboard/PageLayout";
import RiskChart from "@/components/dashboard/RiskChart";
import { regions } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";

const riskFactorData = [
  { name: "Political Instability", icon: AlertTriangle, score: 72, trend: "+5%", regions: ["Middle East", "East Africa"] },
  { name: "Weather Disruptions", icon: Cloud, score: 55, trend: "+12%", regions: ["South Asia", "Southeast Asia"] },
  { name: "Port Congestion", icon: Anchor, score: 48, trend: "-3%", regions: ["Europe", "Southeast Asia", "South Asia"] },
  { name: "Labor Strikes", icon: Shield, score: 30, trend: "+8%", regions: ["Europe"] },
];

const riskColors: Record<string, string> = {
  low: "text-risk-low",
  medium: "text-risk-medium",
  high: "text-risk-high",
  critical: "text-risk-high",
};

const RiskIntelPage = () => {
  const { t } = useLanguage();

  const sortedRegions = [...regions].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <PageLayout title={t("riskIntel.title")} subtitle="Real-time geopolitical & operational risk monitoring">
      {/* Region risk breakdown */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          {t("riskIntel.byRegion")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {sortedRegions.map((region, i) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold">{region.name}</h4>
                <span className={`text-xs font-mono font-medium ${riskColors[region.riskLevel]}`}>
                  {region.riskScore}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-secondary mb-3">
                <motion.div
                  className={`h-full rounded-full ${
                    region.riskLevel === "high" || region.riskLevel === "critical"
                      ? "bg-risk-high"
                      : region.riskLevel === "medium"
                      ? "bg-risk-medium"
                      : "bg-risk-low"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${region.riskScore}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {region.factors.map((f) => (
                  <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Risk factors */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          {t("riskIntel.factors")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskFactorData.map((factor, i) => (
            <motion.div
              key={factor.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-4 flex items-center gap-4"
            >
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <factor.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{factor.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-semibold">{factor.score}%</span>
                    <span className={`text-xs ${factor.trend.startsWith("+") ? "text-risk-high" : "text-risk-low"}`}>
                      {factor.trend}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 mt-1.5">
                  {factor.regions.map((r) => (
                    <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trend chart */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          {t("riskIntel.trends")}
        </h3>
        <RiskChart />
      </div>
    </PageLayout>
  );
};

export default RiskIntelPage;
