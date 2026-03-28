import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, MapPin } from "lucide-react";
import PageLayout from "@/components/dashboard/PageLayout";
import WorldMap from "@/components/dashboard/WorldMap";
import { alerts, regions, defaultRoute, optimizedRoute } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";

const typeIcons = { danger: AlertTriangle, warning: AlertCircle, info: Info };
const typeColors = { danger: "text-risk-high border-risk-high/30 bg-risk-high/10", warning: "text-risk-medium border-risk-medium/30 bg-risk-medium/10", info: "text-primary border-primary/30 bg-primary/10" };
const severityColors = { low: "text-risk-low", medium: "text-risk-medium", high: "text-risk-high", critical: "text-risk-high" };

const AlertsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>();
  const { t } = useLanguage();

  const filteredAlerts = selectedRegion
    ? alerts.filter((a) => {
        const region = regions.find((r) => r.name === a.region);
        return region?.id === selectedRegion;
      })
    : alerts;

  return (
    <PageLayout title={t("alerts.title")} subtitle={`${alerts.filter((a) => a.isNew).length} new alerts`}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Map */}
        <WorldMap
          defaultRoute={defaultRoute}
          optimizedRoute={optimizedRoute}
          showOptimized={false}
          selectedRegion={selectedRegion}
          onRegionClick={(r) => setSelectedRegion(selectedRegion === r.id ? undefined : r.id)}
        />

        {/* Alert list */}
        <div className="space-y-3">
          {selectedRegion && (
            <button
              onClick={() => setSelectedRegion(undefined)}
              className="text-xs text-primary hover:underline mb-1"
            >
              ← Show all alerts
            </button>
          )}
          {filteredAlerts.map((alert, i) => {
            const Icon = typeIcons[alert.type];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-panel p-4 border-l-2 ${typeColors[alert.type]} cursor-pointer transition-all hover:border-l-primary`}
                onClick={() => {
                  const region = regions.find((r) => r.name === alert.region);
                  if (region) setSelectedRegion(region.id);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg ${typeColors[alert.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold truncate">{alert.title}</h4>
                      {alert.isNew && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary shrink-0 ml-2">NEW</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {alert.region}</span>
                      <span className={severityColors[alert.severity]}>{alert.severity.toUpperCase()}</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default AlertsPage;
