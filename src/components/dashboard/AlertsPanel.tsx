import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, Bell } from "lucide-react";
import { alerts, type Alert } from "@/data/mockData";

const iconMap = {
  danger: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const AlertItem = ({ alert, index }: { alert: Alert; index: number }) => {
  const Icon = iconMap[alert.type];
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-3 rounded-lg border transition-all ${
        alert.type === "danger"
          ? "bg-risk-high/10 border-risk-high"
          : alert.type === "warning"
          ? "bg-risk-medium/10 border-risk-medium"
          : "bg-primary/5 border-primary/20"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${
          alert.type === "danger" ? "text-risk-high" : alert.type === "warning" ? "text-risk-medium" : "text-primary"
        }`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground truncate">{alert.title}</p>
            {alert.isNew && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-primary/20 text-primary">New</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alert.message}</p>
          <p className="text-[10px] text-muted-foreground mt-1 font-mono">{alert.time}</p>
        </div>
      </div>
    </motion.div>
  );
};

const AlertsPanel = () => {
  const newCount = alerts.filter((a) => a.isNew).length;

  return (
    <div className="glass-panel p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Alerts</h3>
        </div>
        {newCount > 0 && (
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-destructive text-destructive-foreground">
            {newCount}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence>
          {alerts.map((alert, i) => (
            <AlertItem key={alert.id} alert={alert} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlertsPanel;
