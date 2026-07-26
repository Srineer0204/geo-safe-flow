import { useState } from "react";
import { motion } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from "react-simple-maps";
import { Maximize2, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { regions, type Region, type Route } from "@/data/mockData";
import { ports as allPorts, type Port } from "@/data/ports";

const MAP_WIDTH = 900;
const MAP_HEIGHT = 520;

export interface ExtraRoute {
  id: string;
  points: { name: string; coordinates: [number, number] }[];
  color?: string;
  opacity?: number;
}

interface WorldMapProps {
  selectedRegion?: string;
  onRegionClick?: (region: Region) => void;
  defaultRoute?: Route;
  optimizedRoute?: Route | null;
  showOptimized: boolean;
  ports?: Port[];
  extraRoutes?: ExtraRoute[];
  showPorts?: boolean;
  onPortClick?: (port: Port) => void;
  selectedPortId?: string;
  showPortLabels?: boolean;
}

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const riskColors: Record<string, string> = {
  low: "hsl(142, 70%, 45%)",
  medium: "hsl(45, 93%, 55%)",
  high: "hsl(0, 72%, 55%)",
  critical: "hsl(0, 90%, 40%)",
};

/** Split a polyline into segments, breaking any segment that crosses the antimeridian
 * so each half draws cleanly to its edge instead of spanning across the whole map. */
function splitAntimeridian(
  points: { coordinates: [number, number] }[]
): Array<[[number, number], [number, number]]> {
  const segs: Array<[[number, number], [number, number]]> = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i].coordinates;
    const [x2, y2] = points[i + 1].coordinates;
    if (Math.abs(x2 - x1) > 180) {
      const east = x1 > 0 ? [x1, y1] : [x2, y2];
      const west = x1 < 0 ? [x1, y1] : [x2, y2];
      const total = 180 - east[0] + (west[0] + 180);
      const t = total === 0 ? 0.5 : (180 - east[0]) / total;
      const yMid = east[1] + (west[1] - east[1]) * t;
      segs.push([[east[0], east[1]], [180, yMid]]);
      segs.push([[-180, yMid], [west[0], west[1]]]);
    } else {
      segs.push([[x1, y1], [x2, y2]]);
    }
  }
  return segs;
}

interface MapContentProps extends WorldMapProps {
  zoomable?: boolean;
  openTooltipId: string | null;
  onTooltip: (id: string | null) => void;
}

const MapContent = ({
  selectedRegion,
  onRegionClick,
  defaultRoute,
  optimizedRoute,
  showOptimized,
  ports = allPorts,
  extraRoutes = [],
  showPorts = true,
  onPortClick,
  selectedPortId,
  zoomable = false,
  openTooltipId,
  onTooltip,
}: MapContentProps) => {
  const inner = (
    <>
      {/* Ocean background — click clears tooltip */}
      <rect
        x={-2000}
        y={-2000}
        width={6000}
        height={6000}
        fill="hsl(220,30%,8%)"
        onClick={() => onTooltip(null)}
        style={{ cursor: "default" }}
      />

      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies
            .filter((geo) => geo.properties?.name !== "India")
            .map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="hsl(220,15%,14%)"
                stroke="hsl(220,15%,22%)"
                strokeWidth={0.4}
                onClick={() => onTooltip(null)}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "hsl(220,15%,18%)", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
        }
      </Geographies>

      <Geographies geography="https://cdn.jsdelivr.net/gh/geohacker/india@master/state/india_telengana.geojson">
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="hsl(220,15%,14%)"
              stroke="hsl(220,15%,22%)"
              strokeWidth={0.3}
              style={{
                default: { outline: "none", pointerEvents: "none" },
                hover: { outline: "none" },
                pressed: { outline: "none" },
              }}
            />
          ))
        }
      </Geographies>

      {/* Extra corridor routes (antimeridian-safe) */}
      {extraRoutes.map((r) =>
        splitAntimeridian(r.points).map((seg, i) => (
          <Line
            key={`${r.id}-${i}`}
            from={seg[0]}
            to={seg[1]}
            stroke={r.color ?? "hsl(200, 40%, 55%)"}
            strokeWidth={1}
            strokeDasharray="2 3"
            strokeLinecap="round"
            opacity={r.opacity ?? 0.35}
          />
        ))
      )}

      {/* Ports */}
      {showPorts &&
        ports.map((port) => {
          const isSel = selectedPortId === port.id;
          const isMajor = (port.teuMillions ?? 0) >= 5;
          const showTip = openTooltipId === port.id;
          return (
            <Marker
              key={port.id}
              coordinates={port.coordinates}
              onClick={(e: any) => {
                e?.stopPropagation?.();
                onTooltip(port.id);
                onPortClick?.(port);
              }}
              style={{ default: { cursor: "pointer" } }}
            >
              <circle
                r={isSel ? 3.4 : isMajor ? 2.4 : 1.8}
                fill={isSel ? "hsl(45, 93%, 60%)" : "hsl(185,60%,70%)"}
                opacity={0.95}
              />
              <circle r={0.8} fill="hsl(220,25%,6%)" />
              {showTip && (
                <g style={{ pointerEvents: "none" }}>
                  <rect
                    x={-Math.max(port.name.length * 3.2, 20)}
                    y={-18}
                    width={Math.max(port.name.length * 6.4, 40)}
                    height={12}
                    rx={2}
                    fill="hsl(220,25%,10%)"
                    stroke="hsl(45, 93%, 60%)"
                    strokeWidth={0.5}
                    opacity={0.95}
                  />
                  <text
                    x={0}
                    y={-9}
                    textAnchor="middle"
                    fill="hsl(45, 93%, 70%)"
                    fontSize={7}
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight={600}
                  >
                    {port.name}
                  </text>
                </g>
              )}
            </Marker>
          );
        })}

      {/* Default route (antimeridian-safe) */}
      {defaultRoute && defaultRoute.points.length > 1 &&
        splitAntimeridian(defaultRoute.points).map((seg, i) => (
          <Line
            key={`d-${i}`}
            from={seg[0]}
            to={seg[1]}
            stroke="hsl(0, 72%, 55%)"
            strokeWidth={showOptimized ? 1.2 : 2}
            strokeDasharray="6 4"
            strokeLinecap="round"
            opacity={showOptimized ? 0.35 : 0.85}
          />
        ))}

      {/* Optimized route */}
      {showOptimized && optimizedRoute && optimizedRoute.points.length > 1 &&
        splitAntimeridian(optimizedRoute.points).map((seg, i) => (
          <Line
            key={`o-${i}`}
            from={seg[0]}
            to={seg[1]}
            stroke={optimizedRoute.type === "eco" ? "hsl(142, 70%, 50%)" : "hsl(185, 80%, 55%)"}
            strokeWidth={2.4}
            strokeLinecap="round"
            opacity={0.95}
          />
        ))}

      {/* Waypoint markers */}
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
            onClick={(e: any) => {
              e?.stopPropagation?.();
              onRegionClick?.(region);
            }}
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
    </>
  );

  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{ scale: 155 }}
      width={MAP_WIDTH}
      height={MAP_HEIGHT}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      {zoomable ? (
        <ZoomableGroup center={[0, 0]} zoom={1} minZoom={1} maxZoom={8}>
          {inner}
        </ZoomableGroup>
      ) : (
        inner
      )}
    </ComposableMap>
  );
};

const WorldMap = (props: WorldMapProps) => {
  const [openTooltipId, setOpenTooltipId] = useState<string | null>(null);
  const [fsOpen, setFsOpen] = useState(false);

  return (
    <div className="glass-panel p-3 sm:p-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3 gap-2">
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground truncate">
          Global Risk Map
        </h3>
        <div className="flex gap-2 sm:gap-3 text-[10px] sm:text-xs items-center">
          {["Low", "Medium", "High"].map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  level === "Low" ? "bg-risk-low" : level === "Medium" ? "bg-risk-medium" : "bg-risk-high"
                }`}
              />
              <span className="text-muted-foreground hidden sm:inline">{level}</span>
            </div>
          ))}
          <Dialog open={fsOpen} onOpenChange={setFsOpen}>
            <DialogTrigger asChild>
              <button
                className="p-1.5 rounded-md border border-border/50 hover:bg-secondary/60 transition-colors"
                aria-label="Open fullscreen map"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-none w-screen h-screen p-0 border-0 rounded-none sm:rounded-none translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2 bg-background flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
                <h3 className="text-sm font-semibold uppercase tracking-wider">Global Risk Map</h3>
                <div className="text-[10px] font-mono text-muted-foreground hidden sm:block">
                  Pinch / scroll to zoom · drag to pan
                </div>
                <DialogClose asChild>
                  <button aria-label="Close" className="p-1.5 rounded-md hover:bg-secondary/60">
                    <X className="h-4 w-4" />
                  </button>
                </DialogClose>
              </div>
              <div className="flex-1 overflow-hidden bg-[hsl(220,25%,6%)]">
                <MapContent
                  {...props}
                  zoomable
                  openTooltipId={openTooltipId}
                  onTooltip={setOpenTooltipId}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tap-to-fullscreen surface on mobile; normal interactive map on desktop */}
      <div className="rounded-lg overflow-hidden bg-[hsl(220,25%,6%)] border border-border/40 relative">
        <div className="w-full aspect-[9/5] sm:aspect-auto sm:h-auto">
          <MapContent
            {...props}
            openTooltipId={openTooltipId}
            onTooltip={setOpenTooltipId}
          />
        </div>
        {/* Mobile-only tap overlay to open fullscreen */}
        <button
          type="button"
          onClick={() => setFsOpen(true)}
          className="absolute inset-0 sm:hidden"
          aria-label="Open map fullscreen"
        />
      </div>
    </div>
  );
};

export default WorldMap;
