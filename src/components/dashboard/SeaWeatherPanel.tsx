import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Waves,
  Wind,
  Eye,
  Thermometer,
  Compass,
  AlertTriangle,
  ShieldCheck,
  Cloud,
  CloudRain,
  CloudLightning,
  Sun,
} from "lucide-react";
import { seaWeather, type SeaWeather, type SeaCondition } from "@/data/mockData";

const conditionMeta: Record<SeaCondition, { label: string; color: string; bg: string; border: string; Icon: typeof Sun }> = {
  calm: { label: "Calm", color: "text-risk-low", bg: "bg-risk-low/10", border: "border-risk-low/30", Icon: Sun },
  moderate: { label: "Moderate", color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", Icon: Cloud },
  rough: { label: "Rough", color: "text-risk-medium", bg: "bg-risk-medium/10", border: "border-risk-medium/30", Icon: CloudRain },
  severe: { label: "Severe", color: "text-risk-high", bg: "bg-risk-high/10", border: "border-risk-high/30", Icon: CloudLightning },
};

const WeatherRow = ({ sw, expanded, onToggle }: { sw: SeaWeather; expanded: boolean; onToggle: () => void }) => {
  const meta = conditionMeta[sw.condition];
  const Icon = meta.Icon;

  return (
    <motion.div
      layout
      className={`glass-panel border ${meta.border} overflow-hidden`}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-secondary/30 transition-colors"
      >
        <div className={`p-2 rounded-lg ${meta.bg} ${meta.border} border`}>
          <Icon className={`h-4 w-4 ${meta.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">{sw.region}</h4>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${meta.bg} ${meta.color} font-bold uppercase tracking-wider`}>
              {meta.label}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1"><Waves className="h-3 w-3" /> {sw.waveHeight}m</span>
            <span className="flex items-center gap-1"><Wind className="h-3 w-3" /> {sw.windSpeed}kn</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {sw.visibility}km</span>
          </div>
        </div>
        {sw.condition === "severe" && (
          <span className="animate-pulse-glow">
            <AlertTriangle className="h-4 w-4 text-risk-high" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-border/40 pt-3">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded bg-secondary/50 text-center">
                  <Waves className="h-3.5 w-3.5 mx-auto text-primary mb-1" />
                  <div className="font-mono font-semibold">{sw.waveHeight}m</div>
                  <div className="text-[10px] text-muted-foreground">Waves</div>
                </div>
                <div className="p-2 rounded bg-secondary/50 text-center">
                  <Wind className="h-3.5 w-3.5 mx-auto text-primary mb-1" />
                  <div className="font-mono font-semibold">{sw.windSpeed}kn</div>
                  <div className="text-[10px] text-muted-foreground">Wind</div>
                </div>
                <div className="p-2 rounded bg-secondary/50 text-center">
                  <Thermometer className="h-3.5 w-3.5 mx-auto text-primary mb-1" />
                  <div className="font-mono font-semibold">{sw.temperature}°C</div>
                  <div className="text-[10px] text-muted-foreground">Temp</div>
                </div>
                <div className="p-2 rounded bg-secondary/50 text-center">
                  <Compass className="h-3.5 w-3.5 mx-auto text-primary mb-1" />
                  <div className="font-mono font-semibold">{sw.swellDirection}</div>
                  <div className="text-[10px] text-muted-foreground">Swell</div>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Forecast</p>
                <p className="text-xs text-foreground/90 leading-relaxed">{sw.forecast}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Precautions
                </p>
                <ul className="space-y-1">
                  {sw.precautions.map((p, i) => (
                    <li key={i} className={`text-xs flex items-start gap-2 pl-1 ${meta.color}`}>
                      <span className="mt-1.5 h-1 w-1 rounded-full shrink-0 bg-current" />
                      <span className="text-foreground/90">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SeaWeatherPanel = ({ compact = false }: { compact?: boolean }) => {
  const [expandedId, setExpandedId] = useState<string | null>(seaWeather[0]?.id ?? null);
  const items = compact ? seaWeather.slice(0, 4) : seaWeather;

  return (
    <div className="glass-panel p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Waves className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Sea & Ocean Weather</h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
          {seaWeather.filter((s) => s.condition === "severe" || s.condition === "rough").length} advisories
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {items.map((sw) => (
          <WeatherRow
            key={sw.id}
            sw={sw}
            expanded={expandedId === sw.id}
            onToggle={() => setExpandedId(expandedId === sw.id ? null : sw.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SeaWeatherPanel;
