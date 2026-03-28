import { motion } from "framer-motion";
import { Ship, ArrowRight } from "lucide-react";
import { shipments, type Shipment } from "@/data/mockData";

interface ShipmentListProps {
  selectedShipment: string | null;
  onSelect: (id: string) => void;
}

const statusColors: Record<string, string> = {
  "In transit": "text-primary",
  "On time": "text-risk-low",
  "Delayed": "text-risk-medium",
  "At risk": "text-risk-high",
};

const ShipmentList = ({ selectedShipment, onSelect }: ShipmentListProps) => {
  return (
    <div className="glass-panel p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
        <Ship className="h-4 w-4 text-primary" />
        Active Shipments
      </h3>
      <div className="space-y-2">
        {shipments.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onSelect(s.id)}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedShipment === s.id
                ? "border-primary/50 bg-primary/5"
                : "border-border/50 hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-muted-foreground">{s.id}</span>
              <span className={`text-xs font-medium ${statusColors[s.status]}`}>{s.status}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-foreground font-medium">{s.origin}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-foreground font-medium">{s.destination}</span>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>{s.vessel}</span>
                <span>{s.progress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-secondary">
                <motion.div
                  className={`h-full rounded-full ${
                    s.riskLevel === "high" ? "bg-risk-high" : s.riskLevel === "medium" ? "bg-risk-medium" : "bg-primary"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.progress}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{s.cargo}</span>
              <span>ETA: {s.eta}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentList;
