import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

const MetricCard = ({ title, value, change, changeType = "neutral", icon: Icon }: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-3 sm:p-5 relative overflow-hidden group min-w-0"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex items-start justify-between gap-2 relative z-10 min-w-0">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-[10px] sm:text-xs font-medium uppercase tracking-wider truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-semibold mt-1 font-mono truncate">{value}</p>
          {change && (
            <p className={`text-[10px] sm:text-xs mt-1 font-medium truncate ${
              changeType === "positive" ? "text-risk-low" : changeType === "negative" ? "text-risk-high" : "text-muted-foreground"
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-1.5 sm:p-2.5 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;
