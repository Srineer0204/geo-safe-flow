import { motion } from "framer-motion";
import { regions, type Region, type Route } from "@/data/mockData";

interface WorldMapProps {
  selectedRegion?: string;
  onRegionClick?: (region: Region) => void;
  defaultRoute?: Route;
  optimizedRoute?: Route | null;
  showOptimized: boolean;
}

const riskColors: Record<string, string> = {
  low: "hsl(142, 70%, 45%)",
  medium: "hsl(45, 93%, 55%)",
  high: "hsl(0, 72%, 55%)",
  critical: "hsl(0, 90%, 40%)",
};

const WorldMap = ({ selectedRegion, onRegionClick, defaultRoute, optimizedRoute, showOptimized }: WorldMapProps) => {
  const pointsToPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x * 8} ${points[0].y * 4}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = ((prev.x + curr.x) / 2) * 8;
      const cpy = ((prev.y + curr.y) / 2) * 4 - 8;
      d += ` Q ${cpx} ${cpy} ${curr.x * 8} ${curr.y * 4}`;
    }
    return d;
  };

  return (
    <div className="glass-panel p-4 h-full relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Global Risk Map</h3>
        <div className="flex gap-3 text-xs">
          {["Low", "Medium", "High"].map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${level === "Low" ? "bg-risk-low" : level === "Medium" ? "bg-risk-medium" : "bg-risk-high"}`} />
              <span className="text-muted-foreground">{level}</span>
            </div>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 800 320" className="w-full h-auto" style={{ minHeight: 220 }}>
        {/* Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(220, 15%, 15%)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="800" height="320" fill="url(#grid)" />

        {/* Simplified continent outlines */}
        <path d="M120,60 Q140,50 180,55 Q200,58 220,65 Q200,90 210,110 Q195,130 180,120 Q160,115 150,100 Q130,85 120,60Z" fill="hsl(220,15%,12%)" stroke="hsl(220,15%,20%)" strokeWidth="0.5" opacity="0.8" />
        <path d="M350,50 Q380,40 420,45 Q440,50 450,65 Q445,80 435,90 Q420,95 400,100 Q380,105 360,95 Q345,80 350,50Z" fill="hsl(220,15%,12%)" stroke="hsl(220,15%,20%)" strokeWidth="0.5" opacity="0.8" />
        <path d="M380,110 Q400,100 430,105 Q450,115 460,140 Q455,170 440,200 Q420,220 400,230 Q385,225 375,200 Q365,170 370,140 Q372,120 380,110Z" fill="hsl(220,15%,12%)" stroke="hsl(220,15%,20%)" strokeWidth="0.5" opacity="0.8" />
        <path d="M450,80 Q480,65 520,70 Q550,80 560,100 Q555,110 540,105 Q520,100 500,95 Q480,90 460,95 Q450,90 450,80Z" fill="hsl(220,15%,12%)" stroke="hsl(220,15%,20%)" strokeWidth="0.5" opacity="0.8" />
        <path d="M520,100 Q550,90 590,95 Q620,105 640,120 Q650,140 645,160 Q635,175 620,170 Q600,155 580,145 Q560,135 545,120 Q530,110 520,100Z" fill="hsl(220,15%,12%)" stroke="hsl(220,15%,20%)" strokeWidth="0.5" opacity="0.8" />

        {/* Routes */}
        {defaultRoute && (
          <motion.path
            d={pointsToPath(defaultRoute.points)}
            fill="none"
            stroke="hsl(0, 72%, 55%)"
            strokeWidth="2"
            strokeDasharray="8 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            opacity={showOptimized ? 0.3 : 0.8}
          />
        )}
        {showOptimized && optimizedRoute && (
          <motion.path
            d={pointsToPath(optimizedRoute.points)}
            fill="none"
            stroke="hsl(185, 80%, 50%)"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          />
        )}

        {/* Risk regions */}
        {regions.map((region) => {
          const color = riskColors[region.riskLevel];
          const isSelected = selectedRegion === region.id;
          return (
            <g key={region.id} onClick={() => onRegionClick?.(region)} className="cursor-pointer">
              <motion.circle
                cx={region.coordinates.x * 8}
                cy={region.coordinates.y * 4}
                r={isSelected ? 28 : 22}
                fill={color}
                opacity={0.15}
                animate={{ r: isSelected ? [28, 32, 28] : 22 }}
                transition={{ duration: 2, repeat: isSelected ? Infinity : 0 }}
              />
              <circle cx={region.coordinates.x * 8} cy={region.coordinates.y * 4} r={6} fill={color} opacity={0.9} />
              <circle cx={region.coordinates.x * 8} cy={region.coordinates.y * 4} r={3} fill={color} />
              <text
                x={region.coordinates.x * 8}
                y={region.coordinates.y * 4 - 14}
                textAnchor="middle"
                fill="hsl(210, 20%, 80%)"
                fontSize="9"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
              >
                {region.name}
              </text>
              <text
                x={region.coordinates.x * 8}
                y={region.coordinates.y * 4 + 20}
                textAnchor="middle"
                fill={color}
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="500"
              >
                {region.riskScore}%
              </text>
            </g>
          );
        })}

        {/* Route endpoints */}
        {defaultRoute && (
          <>
            <circle cx={defaultRoute.points[0].x * 8} cy={defaultRoute.points[0].y * 4} r={5} fill="hsl(185,80%,50%)" />
            <circle cx={defaultRoute.points[defaultRoute.points.length - 1].x * 8} cy={defaultRoute.points[defaultRoute.points.length - 1].y * 4} r={5} fill="hsl(185,80%,50%)" />
          </>
        )}
      </svg>
    </div>
  );
};

export default WorldMap;
