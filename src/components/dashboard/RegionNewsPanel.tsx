import { motion } from "framer-motion";
import { Newspaper, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { regionNews } from "@/data/ports";

const iconMap = {
  danger: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  danger: "text-risk-high border-risk-high/40 bg-risk-high/5",
  warning: "text-risk-medium border-risk-medium/40 bg-risk-medium/5",
  info: "text-primary border-primary/30 bg-primary/5",
};

const RegionNewsPanel = ({ region }: { region?: string }) => {
  const filtered = region ? regionNews.filter((n) => n.region === region) : regionNews;

  return (
    <div className="glass-panel p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Regional Intel Feed</h3>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">LIVE</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.map((n, i) => {
          const Icon = iconMap[n.severity];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-3 rounded-lg border ${colorMap[n.severity]}`}
            >
              <div className="flex items-start gap-2">
                <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground line-clamp-2">{n.headline}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.summary}</p>
                  <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono text-muted-foreground">
                    <span>{n.region} • {n.source}</span>
                    <span>{n.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">No regional updates.</p>
        )}
      </div>
    </div>
  );
};

export default RegionNewsPanel;
