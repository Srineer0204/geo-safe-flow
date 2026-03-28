import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ship, ArrowRight, X, Leaf, Fuel, MapPin } from "lucide-react";
import PageLayout from "@/components/dashboard/PageLayout";
import { shipments, regions, type Shipment } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";

const statusColors: Record<string, string> = {
  "In transit": "text-primary",
  "On time": "text-risk-low",
  "Delayed": "text-risk-medium",
  "At risk": "text-risk-high",
  "Delivered": "text-muted-foreground",
};

const statusBgColors: Record<string, string> = {
  "In transit": "bg-primary/10 border-primary/30",
  "On time": "bg-risk-low/10 border-risk-low/30",
  "Delayed": "bg-risk-medium/10 border-risk-medium/30",
  "At risk": "bg-risk-high/10 border-risk-high/30",
  "Delivered": "bg-muted border-border",
};

const ShipmentsPage = () => {
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Shipment | null>(null);
  const { t } = useLanguage();

  const filtered = shipments.filter((s) => {
    if (regionFilter !== "all" && s.region !== regionFilter) return false;
    if (riskFilter !== "all" && s.riskLevel !== riskFilter) return false;
    return true;
  });

  const uniqueRegions = [...new Set(shipments.map((s) => s.region))];

  return (
    <PageLayout title={t("shipments.all")} subtitle={`${shipments.length} ${t("header.activeShipments")}`}>
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg bg-secondary border border-border/50 text-foreground"
        >
          <option value="all">{t("shipments.filterRegion")}</option>
          {uniqueRegions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg bg-secondary border border-border/50 text-foreground"
        >
          <option value="all">{t("shipments.filterRisk")}</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Shipment list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(s)}
              className={`glass-panel p-4 cursor-pointer transition-all hover:border-primary/30 ${
                selected?.id === s.id ? "border-primary/50 glow-primary" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{s.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBgColors[s.status]} ${statusColors[s.status]}`}>
                    {s.status}
                  </span>
                </div>
                <span className={`text-xs font-mono ${s.riskLevel === "high" ? "text-risk-high" : s.riskLevel === "medium" ? "text-risk-medium" : "text-risk-low"}`}>
                  Risk: {s.riskLevel}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="font-medium">{s.origin}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">{s.destination}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{s.vessel} • {s.cargo}</span>
                <div className="flex items-center gap-3">
                  <span>ETA: {s.eta}</span>
                  <span className="flex items-center gap-1">
                    <Leaf className="h-3 w-3" /> {s.co2}t CO₂
                  </span>
                </div>
              </div>
              <div className="mt-2 w-full h-1.5 rounded-full bg-secondary">
                <motion.div
                  className={`h-full rounded-full ${
                    s.riskLevel === "high" ? "bg-risk-high" : s.riskLevel === "medium" ? "bg-risk-medium" : "bg-primary"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.progress}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Details panel */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-panel p-5 h-fit sticky top-24"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider">{t("shipments.details")}</h3>
                <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-secondary">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">ID</span><span className="font-mono">{selected.id}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("shipments.origin")}</span><span>{selected.origin}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("shipments.destination")}</span><span>{selected.destination}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("shipments.status")}</span><span className={statusColors[selected.status]}>{selected.status}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Vessel</span><span>{selected.vessel}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Cargo</span><span>{selected.cargo}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("shipments.eta")}</span><span className="font-mono">{selected.eta}</span></div>
                <div className="border-t border-border/50 pt-3 mt-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Sustainability</p>
                  <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><Leaf className="h-3 w-3" /> CO₂</span><span className="font-mono">{selected.co2} t</span></div>
                  <div className="flex justify-between mt-1"><span className="text-muted-foreground flex items-center gap-1"><Fuel className="h-3 w-3" /> Fuel</span><span className="font-mono">{selected.fuelConsumption} t</span></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};

export default ShipmentsPage;
