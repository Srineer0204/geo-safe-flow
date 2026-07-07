import { motion } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import { geoEqualEarth } from "d3-geo";
import { regions, type Region, type Route } from "@/data/mockData";

// Approx polygon covering the parts of Jammu & Kashmir (incl. PoK/Gilgit-Baltistan
// and Aksai Chin) that the default Natural Earth topojson omits from India.
// Rendered as a filled overlay in the same land colour so India appears whole.
const JK_CLAIM: [number, number][] = [
  [73.9, 34.0],
  [73.5, 34.9],
  [74.1, 36.0],
  [75.3, 36.9],
  [76.8, 36.7],
  [78.2, 35.6],
  [79.6, 35.5],
  [80.3, 34.9],
  [80.2, 34.1],
  [78.8, 33.5],
  [78.3, 32.6],
  [77.1, 32.5],
  [75.6, 32.7],
  [74.3, 32.9],
];

// Match ComposableMap projection config below so overlays align.
const MAP_WIDTH = 900;
const MAP_HEIGHT = 440;
const jkProjection = geoEqualEarth()
  .scale(155)
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
const jkPoints = JK_CLAIM.map((c) => jkProjection(c))
  .filter((p): p is [number, number] => !!p)
  .map(([x, y]) => `${x},${y}`)
  .join(" ");

interface WorldMapProps {
  selectedRegion?: string;
  onRegionClick?: (region: Region) => void;
  defaultRoute?: Route;
  optimizedRoute?: Route | null;
  showOptimized: boolean;
}

// Public world atlas topojson (countries-110m) hosted on unpkg
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const riskColors: Record<string, string> = {
  low: "hsl(142, 70%, 45%)",
  medium: "hsl(45, 93%, 55%)",
  high: "hsl(0, 72%, 55%)",
  critical: "hsl(0, 90%, 40%)",
};

const WorldMap = ({ selectedRegion, onRegionClick, defaultRoute, optimizedRoute, showOptimized }: WorldMapProps) => {
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

      <div className="rounded-lg overflow-hidden bg-[hsl(220,25%,6%)] border border-border/40">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 155 }}
          width={900}
          height={440}
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          {/* Ocean background */}
          <rect x={-1000} y={-1000} width={3000} height={3000} fill="hsl(220,30%,8%)" />

          {/* Graticule-like grid via CSS pattern using rect fill won't work in svg easily; skip for cleanliness */}

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="hsl(220,15%,14%)"
                  stroke="hsl(220,15%,22%)"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "hsl(220,15%,18%)", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Default route */}
          {defaultRoute && defaultRoute.points.length > 1 && (
            <>
              {defaultRoute.points.slice(0, -1).map((p, i) => (
                <Line
                  key={`d-${i}`}
                  from={p.coordinates}
                  to={defaultRoute.points[i + 1].coordinates}
                  stroke="hsl(0, 72%, 55%)"
                  strokeWidth={showOptimized ? 1.2 : 2}
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  opacity={showOptimized ? 0.35 : 0.85}
                />
              ))}
            </>
          )}

          {/* Optimized route */}
          {showOptimized && optimizedRoute && optimizedRoute.points.length > 1 && (
            <>
              {optimizedRoute.points.slice(0, -1).map((p, i) => (
                <Line
                  key={`o-${i}`}
                  from={p.coordinates}
                  to={optimizedRoute.points[i + 1].coordinates}
                  stroke={optimizedRoute.type === "eco" ? "hsl(142, 70%, 50%)" : "hsl(185, 80%, 55%)"}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  opacity={0.95}
                />
              ))}
            </>
          )}

          {/* Route waypoint markers */}
          {defaultRoute?.points.map((p, i) => (
            <Marker key={`dm-${i}`} coordinates={p.coordinates}>
              <circle r={2} fill="hsl(185,80%,60%)" opacity={0.7} />
            </Marker>
          ))}
          {showOptimized && optimizedRoute?.points.map((p, i) => (
            <Marker key={`om-${i}`} coordinates={p.coordinates}>
              <circle r={2.5} fill={optimizedRoute.type === "eco" ? "hsl(142,70%,55%)" : "hsl(185,80%,65%)"} />
            </Marker>
          ))}

          {/* Region risk pins */}
          {regions.map((region) => {
            const color = riskColors[region.riskLevel];
            const isSelected = selectedRegion === region.id;
            return (
              <Marker
                key={region.id}
                coordinates={region.coordinates}
                onClick={() => onRegionClick?.(region)}
                style={{ default: { cursor: "pointer" } }}
              >
                <motion.circle
                  r={isSelected ? 16 : 12}
                  fill={color}
                  opacity={0.18}
                  initial={{ scale: 1 }}
                  animate={isSelected ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                  transition={{ duration: 2, repeat: isSelected ? Infinity : 0 }}
                />
                <circle r={5} fill={color} opacity={0.9} />
                <circle r={2} fill="hsl(220,20%,7%)" />
                <text
                  y={-14}
                  textAnchor="middle"
                  fill="hsl(210, 20%, 88%)"
                  fontSize={9}
                  fontFamily="Inter, sans-serif"
                  fontWeight={600}
                  style={{ pointerEvents: "none" }}
                >
                  {region.name}
                </text>
                <text
                  y={16}
                  textAnchor="middle"
                  fill={color}
                  fontSize={8}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight={600}
                  style={{ pointerEvents: "none" }}
                >
                  {region.riskScore}%
                </text>
              </Marker>
            );
          })}

          {/* Endpoint highlights for routes (origin/destination) */}
          {defaultRoute && (
            <>
              <Marker coordinates={defaultRoute.points[0].coordinates}>
                <circle r={4.5} fill="hsl(185,80%,55%)" stroke="hsl(220,20%,7%)" strokeWidth={1.5} />
              </Marker>
              <Marker coordinates={defaultRoute.points[defaultRoute.points.length - 1].coordinates}>
                <circle r={4.5} fill="hsl(185,80%,55%)" stroke="hsl(220,20%,7%)" strokeWidth={1.5} />
              </Marker>
            </>
          )}
        </ComposableMap>
      </div>
    </div>
  );
};

export default WorldMap;
