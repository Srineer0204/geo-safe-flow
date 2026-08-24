import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const riskColors: Record<string, string> = {
  low: "hsl(142, 70%, 45%)",
  medium: "hsl(45, 93%, 55%)",
  high: "hsl(0, 72%, 55%)",
  critical: "hsl(0, 90%, 40%)",
};

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
  openTooltipId: string | null;
  onTooltip: (id: string | null) => void;
  splitRoutes?: boolean;
}

const MapInner = ({
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
  openTooltipId,
  onTooltip,
  splitRoutes = true,
}: MapContentProps) => {
  const renderLine = (
    key: string,
    from: [number, number],
    to: [number, number],
    props: React.ComponentProps<typeof Line>
  ) => <Line key={key} from={from} to={to} {...props} />;

  const drawRoute = (
    id: string,
    pts: { coordinates: [number, number] }[],
    style: React.ComponentProps<typeof Line>
  ) => {
    if (splitRoutes) {
      return splitAntimeridian(pts).map((seg, i) =>
        renderLine(`${id}-${i}`, seg[0], seg[1], style)
      );
    }
    const segs: JSX.Element[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      segs.push(renderLine(`${id}-${i}`, pts[i].coordinates, pts[i + 1].coordinates, style));
    }
    return segs;
  };

  return (
    <>
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => (
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


      {extraRoutes.map((r) =>
        drawRoute(r.id, r.points, {
          stroke: r.color ?? "hsl(200, 40%, 55%)",
          strokeWidth: 1,
          strokeDasharray: "2 3",
          strokeLinecap: "round",
          opacity: r.opacity ?? 0.35,
        })
      )}

      {showPorts &&
        ports.map((port) => {
          const isSel = selectedPortId === port.id;
          const isMajor = (port.teuMillions ?? 0) >= 5;
          const showTip = openTooltipId === port.id;
          return (
            <Marker
              key={port.id}
              coordinates={port.coordinates}
              onMouseEnter={() => onTooltip(port.id)}
              onMouseLeave={() =>
                onTooltip(openTooltipId === port.id ? null : openTooltipId)
              }
              onClick={(e: any) => {
                e?.stopPropagation?.();
                onTooltip(port.id);
                onPortClick?.(port);
              }}
              style={{
                default: { cursor: "pointer" },
                hover: { cursor: "pointer" },
                pressed: { cursor: "pointer" },
              }}
            >
              <circle
                r={isSel ? 3.4 : isMajor ? 2.4 : 1.8}
                fill={isSel ? "hsl(45, 93%, 60%)" : "hsl(185,60%,70%)"}
                opacity={0.95}
                style={{ cursor: "pointer" }}
              />
              <circle r={0.8} fill="hsl(220,25%,6%)" style={{ cursor: "pointer" }} />
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

      {defaultRoute && defaultRoute.points.length > 1 &&
        drawRoute("d", defaultRoute.points, {
          stroke: "hsl(0, 72%, 55%)",
          strokeWidth: showOptimized ? 1.2 : 2,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          opacity: showOptimized ? 0.35 : 0.85,
        })}

      {showOptimized && optimizedRoute && optimizedRoute.points.length > 1 &&
        drawRoute("o", optimizedRoute.points, {
          stroke: optimizedRoute.type === "eco" ? "hsl(142, 70%, 50%)" : "hsl(185, 80%, 55%)",
          strokeWidth: 2.4,
          strokeLinecap: "round",
          opacity: 0.95,
        })}

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

      {regions.map((region) => {
        const color = riskColors[region.riskLevel];
        const isSelected = selectedRegion === region.id;
        const regionTipId = `region-${region.id}`;
        const showLabel = isSelected || openTooltipId === regionTipId;
        return (
          <Marker
            key={region.id}
            coordinates={region.coordinates}
            onMouseEnter={() => onTooltip(regionTipId)}
            onMouseLeave={() =>
              onTooltip(openTooltipId === regionTipId ? null : openTooltipId)
            }
            onClick={(e: any) => {
              e?.stopPropagation?.();
              onTooltip(regionTipId);
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
            {showLabel && (
              <g style={{ pointerEvents: "none" }}>
                <text
                  y={-14}
                  textAnchor="middle"
                  fill="hsl(210, 20%, 88%)"
                  fontSize={9}
                  fontFamily="Inter, sans-serif"
                  fontWeight={600}
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
                >
                  {region.riskScore}%
                </text>
              </g>
            )}
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
};

/** Flat inline map (Equal Earth projection). */
const FlatMap = (props: MapContentProps) => (
  <ComposableMap
    projection="geoEqualEarth"
    projectionConfig={{ scale: 155 }}
    width={MAP_WIDTH}
    height={MAP_HEIGHT}
    style={{ width: "100%", height: "100%", display: "block" }}
  >
    <rect
      x={-2000}
      y={-2000}
      width={6000}
      height={6000}
      fill="hsl(220,30%,8%)"
      onClick={() => props.onTooltip(null)}
      style={{ cursor: "default", pointerEvents: "all" }}
    />
    <MapInner {...props} />
  </ComposableMap>
);

/** Interactive 3D globe (orthographic) with drag-rotate + wheel/pinch zoom. */
const Globe = (props: MapContentProps) => {
  const [rot, setRot] = useState<[number, number]>([-20, -15]);
  const [scale, setScale] = useState(340);
  const rotRef = useRef(rot);
  const scaleRef = useRef(scale);
  const rafRef = useRef<number | null>(null);
  const drag = useRef<{ x: number; y: number; rot: [number, number] } | null>(null);
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const velocity = useRef<{ x: number; y: number; t: number }>({ x: 0, y: 0, t: 0 });
  const momentum = useRef<number | null>(null);

  const width = MAP_WIDTH;
  const height = MAP_HEIGHT;

  const scheduleUpdate = (nextRot?: [number, number], nextScale?: number) => {
    if (nextRot) rotRef.current = nextRot;
    if (nextScale !== undefined) scaleRef.current = nextScale;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setRot(rotRef.current);
      setScale(scaleRef.current);
    });
  };

  const stopMomentum = () => {
    if (momentum.current != null) {
      cancelAnimationFrame(momentum.current);
      momentum.current = null;
    }
  };

  const startDrag = (x: number, y: number) => {
    stopMomentum();
    drag.current = { x, y, rot: rotRef.current };
    velocity.current = { x: 0, y: 0, t: performance.now() };
  };
  const doDrag = (x: number, y: number) => {
    if (!drag.current) return;
    const dx = x - drag.current.x;
    const dy = y - drag.current.y;
    const k = 0.35 * (340 / scaleRef.current);
    const nextRot: [number, number] = [
      drag.current.rot[0] + dx * k,
      Math.max(-89, Math.min(89, drag.current.rot[1] + dy * k)),
    ];
    const now = performance.now();
    const dt = Math.max(1, now - velocity.current.t);
    velocity.current = {
      x: (nextRot[0] - rotRef.current[0]) / dt,
      y: (nextRot[1] - rotRef.current[1]) / dt,
      t: now,
    };
    scheduleUpdate(nextRot);
  };
  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    // momentum flick
    let vx = velocity.current.x;
    let vy = velocity.current.y;
    if (Math.hypot(vx, vy) < 0.02) return;
    let last = performance.now();
    const step = () => {
      const now = performance.now();
      const dt = now - last;
      last = now;
      vx *= Math.pow(0.92, dt / 16);
      vy *= Math.pow(0.92, dt / 16);
      const next: [number, number] = [
        rotRef.current[0] + vx * dt,
        Math.max(-89, Math.min(89, rotRef.current[1] + vy * dt)),
      ];
      scheduleUpdate(next);
      if (Math.hypot(vx, vy) > 0.005) {
        momentum.current = requestAnimationFrame(step);
      } else {
        momentum.current = null;
      }
    };
    momentum.current = requestAnimationFrame(step);
  };

  // Wheel zoom needs preventDefault, which React's passive wheel listener forbids;
  // attach a non-passive native listener instead.
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      stopMomentum();
      const next = Math.max(160, Math.min(1600, scaleRef.current * (e.deltaY < 0 ? 1.1 : 0.9)));
      scheduleUpdate(undefined, next);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]];
      pinch.current = { dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), scale: scaleRef.current };
      drag.current = null;
    } else if (e.touches.length === 1) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinch.current) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const next = Math.max(160, Math.min(1600, pinch.current.scale * (d / pinch.current.dist)));
      scheduleUpdate(undefined, next);
    } else if (e.touches.length === 1) {
      doDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const onTouchEnd = () => {
    endDrag();
    pinch.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full touch-none select-none"
      onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
      onMouseMove={(e) => doDrag(e.clientX, e.clientY)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ cursor: drag.current ? "grabbing" : "grab" }}
    >
      <ComposableMap
        projection="geoOrthographic"
        projectionConfig={{ rotate: [rot[0], rot[1], 0], scale }}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%", display: "block", shapeRendering: "geometricPrecision" }}
      >
        <defs>
          <radialGradient id="globe-sphere" cx="35%" cy="35%" r="75%">
            <stop offset="0%" stopColor="hsl(215,45%,16%)" />
            <stop offset="70%" stopColor="hsl(220,50%,10%)" />
            <stop offset="100%" stopColor="hsl(222,55%,6%)" />
          </radialGradient>
          <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="hsl(200,60%,30%)" stopOpacity={0} />
            <stop offset="100%" stopColor="hsl(190,90%,55%)" stopOpacity={0.35} />
          </radialGradient>
        </defs>
        <circle cx={width / 2} cy={height / 2} r={scale} fill="url(#globe-sphere)" />
        <MapInner {...props} splitRoutes={false} />
        <circle
          cx={width / 2}
          cy={height / 2}
          r={scale}
          fill="url(#globe-glow)"
          style={{ pointerEvents: "none" }}
        />
        <circle
          cx={width / 2}
          cy={height / 2}
          r={scale}
          fill="none"
          stroke="hsl(185,70%,60%)"
          strokeWidth={0.7}
          opacity={0.55}
          style={{ pointerEvents: "none" }}
        />
      </ComposableMap>
    </div>
  );
};

const WorldMap = (props: WorldMapProps) => {
  const [openTooltipId, setOpenTooltipId] = useState<string | null>(null);
  const [fsOpen, setFsOpen] = useState(false);
  const [fsTooltipId, setFsTooltipId] = useState<string | null>(null);
  

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
                aria-label="Open fullscreen globe"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-none w-screen h-screen p-0 border-0 rounded-none sm:rounded-none translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2 bg-background flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
                <DialogTitle className="text-sm font-semibold uppercase tracking-wider">
                  Global Risk Globe
                </DialogTitle>
                <DialogDescription className="text-[10px] font-mono text-muted-foreground hidden sm:block">
                  Drag to rotate · scroll / pinch to zoom
                </DialogDescription>
              </div>
              <div className="flex-1 overflow-hidden bg-[hsl(220,25%,6%)]">
                <Globe
                  {...props}
                  openTooltipId={fsTooltipId}
                  onTooltip={setFsTooltipId}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden bg-[hsl(220,25%,6%)] border border-border/40 relative">
        <div className="w-full aspect-[16/9]">
          <FlatMap
            {...props}
            openTooltipId={openTooltipId}
            onTooltip={setOpenTooltipId}
          />
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
