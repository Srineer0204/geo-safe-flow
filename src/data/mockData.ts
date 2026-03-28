export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Region {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  riskScore: number;
  factors: string[];
  coordinates: { x: number; y: number };
}

export interface Shipment {
  id: string;
  name: string;
  origin: string;
  destination: string;
  status: "In transit" | "Delayed" | "On time" | "At risk" | "Delivered";
  riskLevel: RiskLevel;
  eta: string;
  cargo: string;
  vessel: string;
  progress: number;
  co2: number;
  fuelConsumption: number;
  region: string;
}

export interface Alert {
  id: string;
  type: "warning" | "danger" | "info";
  title: string;
  message: string;
  region: string;
  time: string;
  isNew: boolean;
  severity: RiskLevel;
}

export interface RoutePoint {
  name: string;
  x: number;
  y: number;
}

export interface Route {
  id: string;
  name: string;
  points: RoutePoint[];
  risk: number;
  cost: number;
  time: string;
  isOptimized: boolean;
  co2: number;
  fuelConsumption: number;
  distance: number;
  ecoScore: number;
  type: "shortest" | "safest" | "eco";
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  impact: {
    costChange: number;
    timeChange: string;
    riskChange: number;
    affectedRegion: string;
    co2Change: number;
  };
}

export const regions: Region[] = [
  { id: "me", name: "Middle East", riskLevel: "high", riskScore: 78, factors: ["Political instability", "Port congestion"], coordinates: { x: 58, y: 42 } },
  { id: "eu", name: "Europe", riskLevel: "low", riskScore: 22, factors: ["Labor strikes"], coordinates: { x: 48, y: 28 } },
  { id: "sa", name: "South Asia", riskLevel: "medium", riskScore: 55, factors: ["Weather", "Port congestion"], coordinates: { x: 68, y: 42 } },
  { id: "ea", name: "East Asia", riskLevel: "low", riskScore: 18, factors: ["Weather"], coordinates: { x: 78, y: 35 } },
  { id: "af", name: "East Africa", riskLevel: "high", riskScore: 82, factors: ["Political instability", "Weather"], coordinates: { x: 55, y: 55 } },
  { id: "na", name: "North America", riskLevel: "low", riskScore: 12, factors: [], coordinates: { x: 22, y: 30 } },
  { id: "sea", name: "Southeast Asia", riskLevel: "medium", riskScore: 45, factors: ["Weather", "Port congestion"], coordinates: { x: 75, y: 50 } },
];

export const shipments: Shipment[] = [
  { id: "SHP-001", name: "Mumbai → Rotterdam", origin: "Mumbai", destination: "Rotterdam", status: "In transit", riskLevel: "medium", eta: "Apr 12, 2026", cargo: "Electronics", vessel: "MV Horizon", progress: 62, co2: 1200, fuelConsumption: 450, region: "South Asia" },
  { id: "SHP-002", name: "Shanghai → Hamburg", origin: "Shanghai", destination: "Hamburg", status: "On time", riskLevel: "low", eta: "Apr 8, 2026", cargo: "Auto Parts", vessel: "MV Atlas", progress: 85, co2: 980, fuelConsumption: 380, region: "East Asia" },
  { id: "SHP-003", name: "Dubai → Mombasa", origin: "Dubai", destination: "Mombasa", status: "At risk", riskLevel: "high", eta: "Apr 15, 2026", cargo: "Machinery", vessel: "MV Tempest", progress: 35, co2: 1450, fuelConsumption: 520, region: "Middle East" },
  { id: "SHP-004", name: "Singapore → Los Angeles", origin: "Singapore", destination: "Los Angeles", status: "Delayed", riskLevel: "medium", eta: "Apr 20, 2026", cargo: "Textiles", vessel: "MV Pacific Star", progress: 48, co2: 1680, fuelConsumption: 610, region: "Southeast Asia" },
  { id: "SHP-005", name: "Rotterdam → Mumbai", origin: "Rotterdam", destination: "Mumbai", status: "Delivered", riskLevel: "low", eta: "Mar 28, 2026", cargo: "Pharmaceuticals", vessel: "MV Meridian", progress: 100, co2: 1100, fuelConsumption: 420, region: "Europe" },
  { id: "SHP-006", name: "Dubai → Singapore", origin: "Dubai", destination: "Singapore", status: "In transit", riskLevel: "medium", eta: "Apr 18, 2026", cargo: "Oil & Gas Equipment", vessel: "MV Arabian", progress: 55, co2: 1350, fuelConsumption: 490, region: "Middle East" },
];

export const alerts: Alert[] = [
  { id: "a1", type: "danger", title: "High congestion at Port Aden", message: "Severe port congestion detected. Estimated 48h delay. Rerouting via Salalah recommended.", region: "Middle East", time: "2 min ago", isNew: true, severity: "high" },
  { id: "a2", type: "warning", title: "Storm warning — Arabian Sea", message: "Cyclonic activity predicted. Shipments SHP-001, SHP-003 may be affected.", region: "South Asia", time: "15 min ago", isNew: true, severity: "medium" },
  { id: "a3", type: "warning", title: "Labor strike — Port of Hamburg", message: "Dockworkers' union announced 24h strike starting tomorrow.", region: "Europe", time: "1 hr ago", isNew: false, severity: "medium" },
  { id: "a4", type: "info", title: "Route optimization available", message: "Alternative route via Cape of Good Hope saves $12K with +2 day transit.", region: "East Africa", time: "3 hr ago", isNew: false, severity: "low" },
  { id: "a5", type: "danger", title: "Political unrest — Red Sea corridor", message: "Navigation advisory issued. All vessels advised to use alternate routes.", region: "Middle East", time: "5 hr ago", isNew: false, severity: "critical" },
  { id: "a6", type: "warning", title: "Port congestion — Singapore", message: "Average wait time increased to 36 hours at Singapore port.", region: "Southeast Asia", time: "6 hr ago", isNew: false, severity: "medium" },
  { id: "a7", type: "info", title: "Weather clearing — Bay of Bengal", message: "Monsoon activity subsiding. Routes through Bay of Bengal now safer.", region: "South Asia", time: "8 hr ago", isNew: false, severity: "low" },
];

export const defaultRoute: Route = {
  id: "r1",
  name: "Standard Route (Shortest)",
  points: [
    { name: "Mumbai", x: 68, y: 45 },
    { name: "Arabian Sea", x: 60, y: 44 },
    { name: "Gulf of Aden", x: 55, y: 46 },
    { name: "Red Sea", x: 52, y: 40 },
    { name: "Suez Canal", x: 51, y: 36 },
    { name: "Mediterranean", x: 48, y: 33 },
    { name: "Rotterdam", x: 46, y: 26 },
  ],
  risk: 72,
  cost: 48500,
  time: "18 days",
  isOptimized: false,
  co2: 1200,
  fuelConsumption: 450,
  distance: 6200,
  ecoScore: 35,
  type: "shortest",
};

export const optimizedRoute: Route = {
  id: "r2",
  name: "Optimized Route (Safest)",
  points: [
    { name: "Mumbai", x: 68, y: 45 },
    { name: "Arabian Sea", x: 62, y: 50 },
    { name: "East Africa Coast", x: 55, y: 60 },
    { name: "Cape of Good Hope", x: 48, y: 72 },
    { name: "West Africa Coast", x: 40, y: 55 },
    { name: "Bay of Biscay", x: 44, y: 32 },
    { name: "Rotterdam", x: 46, y: 26 },
  ],
  risk: 25,
  cost: 36200,
  time: "22 days",
  isOptimized: true,
  co2: 900,
  fuelConsumption: 340,
  distance: 9800,
  ecoScore: 72,
  type: "safest",
};

export const ecoRoute: Route = {
  id: "r3",
  name: "Eco-Friendly Route",
  points: [
    { name: "Mumbai", x: 68, y: 45 },
    { name: "Arabian Sea", x: 63, y: 48 },
    { name: "East Africa Coast", x: 56, y: 58 },
    { name: "Mozambique Channel", x: 52, y: 65 },
    { name: "Cape of Good Hope", x: 47, y: 72 },
    { name: "Atlantic", x: 42, y: 45 },
    { name: "Rotterdam", x: 46, y: 26 },
  ],
  risk: 38,
  cost: 39800,
  time: "24 days",
  isOptimized: true,
  co2: 720,
  fuelConsumption: 280,
  distance: 10500,
  ecoScore: 92,
  type: "eco",
};

export const scenarios: Scenario[] = [
  { id: "s1", name: "Suez Canal Closure", description: "Complete closure of Suez Canal due to vessel grounding", impact: { costChange: 15000, timeChange: "+8 days", riskChange: 35, affectedRegion: "Middle East", co2Change: 320 } },
  { id: "s2", name: "Monsoon Season Escalation", description: "Severe monsoon activity across Arabian Sea", impact: { costChange: 8000, timeChange: "+4 days", riskChange: 25, affectedRegion: "South Asia", co2Change: 180 } },
  { id: "s3", name: "Port Workers Strike — EU", description: "Major European port workers strike lasting 1 week", impact: { costChange: 12000, timeChange: "+5 days", riskChange: 15, affectedRegion: "Europe", co2Change: 150 } },
  { id: "s4", name: "Political Instability — Horn of Africa", description: "Escalation of conflict near shipping lanes", impact: { costChange: 20000, timeChange: "+6 days", riskChange: 45, affectedRegion: "East Africa", co2Change: 400 } },
];

export const riskTrendData = [
  { month: "Oct", middleEast: 65, europe: 15, asia: 40, africa: 70 },
  { month: "Nov", middleEast: 70, europe: 18, asia: 38, africa: 75 },
  { month: "Dec", middleEast: 68, europe: 22, asia: 45, africa: 72 },
  { month: "Jan", middleEast: 75, europe: 20, asia: 50, africa: 78 },
  { month: "Feb", middleEast: 72, europe: 25, asia: 48, africa: 80 },
  { month: "Mar", middleEast: 78, europe: 22, asia: 55, africa: 82 },
];
