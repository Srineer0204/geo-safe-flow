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
      className="glass-panel p-5 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-semibold mt-1 font-mono">{value}</p>
          {change && (
            <p className={`text-xs mt-1 font-medium ${
              changeType === "positive" ? "text-risk-low" : changeType === "negative" ? "text-risk-high" : "text-muted-foreground"
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;
