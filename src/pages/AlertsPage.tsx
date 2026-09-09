import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, MapPin } from "lucide-react";
import PageLayout from "@/components/dashboard/PageLayout";
import WorldMap from "@/components/dashboard/WorldMap";
import { regions, defaultRoute, optimizedRoute } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";
import { alertLocation, alertType, relativeAlertTime } from "@/lib/alert-utils";
import { useAlerts } from "@/hooks/useAlerts";

const typeIcons = { danger: AlertTriangle, warning: AlertCircle, info: Info };
const typeColors = { danger: "text-risk-high border-risk-high/30 bg-risk-high/10", warning: "text-risk-medium border-risk-medium/30 bg-risk-medium/10", info: "text-primary border-primary/30 bg-primary/10" };
const severityColors = { low: "text-risk-low", medium: "text-risk-medium", high: "text-risk-high", critical: "text-risk-high" };

const AlertsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>();
  const { t } = useLanguage();
  const { alerts, loading, error } = useAlerts();

  const filteredAlerts = useMemo(() => {
    if (!selectedRegion) return alerts;
    const region = regions.find((item) => item.id === selectedRegion);
    if (!region) return alerts;
    return alerts.filter((alert) => {
      const textMatch = alertLocation(alert).toLowerCase().includes(region.name.toLowerCase());
      const coordinateMatch = alert.latitude !== null && alert.longitude !== null
        && Math.abs(alert.latitude - region.coordinates[1]) < 25
        && Math.abs(alert.longitude - region.coordinates[0]) < 35;
      return textMatch || coordinateMatch;
    });
  }, [alerts, selectedRegion]);

  const newCount = alerts.filter((alert) => Date.now() - new Date(alert.created_at).getTime() < 86_400_000).length;

  return (
    <PageLayout
      seoTitle="Real-Time Logistics Alerts — Port, Weather & Geopolitical Disruptions | GeoSafe"
       seoDescription="Live alerts for port congestion, strikes, storms and geopolitical events affecting your shipments, with rerouting recommendations." title={t("alerts.title")} subtitle={`${newCount} alerts in the last 24 hours`}>
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
          {loading && (
            <p className="text-xs text-muted-foreground text-center py-10">Loading live alerts…</p>
          )}
          {!loading && error && alerts.length === 0 && (
            <p className="text-xs text-risk-high text-center py-10">Unable to load live alerts. Please try again later.</p>
          )}
          {!loading && !error && filteredAlerts.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-10">No active alerts are available from NOAA or USGS.</p>
          )}
          {filteredAlerts.map((alert, i) => {
            const type = alertType(alert.severity);
            const Icon = typeIcons[type];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                 className={`glass-panel p-4 border-l-2 ${typeColors[type]} cursor-pointer transition-all hover:border-l-primary`}
              >
                <div className="flex items-start gap-3">
                   <div className={`p-1.5 rounded-lg ${typeColors[type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold truncate">{alert.title}</h4>
                       {Date.now() - new Date(alert.created_at).getTime() < 86_400_000 && (
                         <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary shrink-0 ml-2">NEW</span>
                      )}
                    </div>
                     <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                       <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {alertLocation(alert)}</span>
                       <span className={severityColors[alert.severity as keyof typeof severityColors] ?? "text-muted-foreground"}>{alert.severity.toUpperCase()}</span>
                       <span>{alert.status} • {alert.source} • {relativeAlertTime(alert.created_at)}</span>
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
