export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Region {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  riskScore: number;
  factors: string[];
  /** [longitude, latitude] */
  coordinates: [number, number];
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
  /** [longitude, latitude] */
  coordinates: [number, number];
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

export type SeaCondition = "calm" | "moderate" | "rough" | "severe";

export interface SeaWeather {
  id: string;
  region: string;
  condition: SeaCondition;
  waveHeight: number; // meters
  windSpeed: number; // knots
  visibility: number; // km
  temperature: number; // °C
  swellDirection: string;
  forecast: string;
  precautions: string[];
}

// Coordinates are [longitude, latitude]
export const regions: Region[] = [
  { id: "me", name: "Middle East", riskLevel: "high", riskScore: 78, factors: ["Political instability", "Port congestion"], coordinates: [48, 27] },
  { id: "eu", name: "Europe", riskLevel: "low", riskScore: 22, factors: ["Labor strikes"], coordinates: [10, 50] },
  { id: "sa", name: "South Asia", riskLevel: "medium", riskScore: 55, factors: ["Weather", "Port congestion"], coordinates: [78, 21] },
  { id: "ea", name: "East Asia", riskLevel: "low", riskScore: 18, factors: ["Weather"], coordinates: [115, 32] },
  { id: "af", name: "East Africa", riskLevel: "high", riskScore: 82, factors: ["Political instability", "Weather"], coordinates: [40, -3] },
  { id: "na", name: "North America", riskLevel: "low", riskScore: 12, factors: [], coordinates: [-100, 40] },
  { id: "sea", name: "Southeast Asia", riskLevel: "medium", riskScore: 45, factors: ["Weather", "Port congestion"], coordinates: [110, 5] },
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
    { name: "Mumbai", coordinates: [72.87, 19.07] },
    { name: "Arabian Sea", coordinates: [63, 15] },
    { name: "Gulf of Aden", coordinates: [48, 12] },
    { name: "Red Sea", coordinates: [38, 20] },
    { name: "Suez Canal", coordinates: [32.5, 30] },
    { name: "Mediterranean", coordinates: [15, 36] },
    { name: "Gibraltar", coordinates: [-5.5, 36] },
    { name: "Bay of Biscay", coordinates: [-5, 45] },
    { name: "Rotterdam", coordinates: [4.48, 51.92] },
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
    { name: "Mumbai", coordinates: [72.87, 19.07] },
    { name: "Arabian Sea", coordinates: [65, 10] },
    { name: "East Africa Coast", coordinates: [45, -10] },
    { name: "Mozambique Channel", coordinates: [40, -25] },
    { name: "Cape of Good Hope", coordinates: [18.47, -34.35] },
    { name: "West Africa Coast", coordinates: [0, -10] },
    { name: "Canary Islands", coordinates: [-16, 28] },
    { name: "Bay of Biscay", coordinates: [-5, 45] },
    { name: "Rotterdam", coordinates: [4.48, 51.92] },
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
    { name: "Mumbai", coordinates: [72.87, 19.07] },
    { name: "Arabian Sea", coordinates: [63, 8] },
    { name: "East Africa Coast", coordinates: [48, -8] },
    { name: "Mozambique Channel", coordinates: [40, -22] },
    { name: "Cape of Good Hope", coordinates: [18.47, -34.35] },
    { name: "Atlantic", coordinates: [-10, -5] },
    { name: "Canary Islands", coordinates: [-18, 28] },
    { name: "English Channel", coordinates: [0, 50] },
    { name: "Rotterdam", coordinates: [4.48, 51.92] },
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

export const seaWeather: SeaWeather[] = [
  {
    id: "sw1",
    region: "Arabian Sea",
    condition: "rough",
    waveHeight: 4.2,
    windSpeed: 32,
    visibility: 6,
    temperature: 28,
    swellDirection: "SW",
    forecast: "Deepening low pressure system. Conditions expected to worsen over 48h with potential cyclone formation.",
    precautions: [
      "Reduce vessel speed to 12 knots",
      "Secure all deck cargo and containers",
      "Maintain continuous VHF Ch.16 monitoring",
      "Consider rerouting via East African coast",
    ],
  },
  {
    id: "sw2",
    region: "Red Sea",
    condition: "moderate",
    waveHeight: 1.8,
    windSpeed: 18,
    visibility: 10,
    temperature: 26,
    swellDirection: "N",
    forecast: "Stable northerly winds. Clear visibility expected through the next 72 hours.",
    precautions: [
      "Standard navigation protocols apply",
      "Monitor for regional security advisories",
      "Maintain convoy transit windows",
    ],
  },
  {
    id: "sw3",
    region: "Bay of Bengal",
    condition: "severe",
    waveHeight: 6.5,
    windSpeed: 48,
    visibility: 3,
    temperature: 29,
    swellDirection: "SSW",
    forecast: "Tropical Cyclone 'Nivar' intensifying. Category 2 conditions with peak gusts up to 75 knots expected.",
    precautions: [
      "AVOID region — reroute mandatory",
      "All vessels in area seek nearest safe harbor",
      "Activate storm reporting to MRCC",
      "Ballast adjustments for heavy weather",
    ],
  },
  {
    id: "sw4",
    region: "Mediterranean Sea",
    condition: "calm",
    waveHeight: 0.8,
    windSpeed: 8,
    visibility: 15,
    temperature: 22,
    swellDirection: "W",
    forecast: "High pressure ridge maintaining excellent conditions. Clear skies and light winds for 5+ days.",
    precautions: [
      "Optimal transit conditions",
      "Standard watchkeeping",
    ],
  },
  {
    id: "sw5",
    region: "South China Sea",
    condition: "moderate",
    waveHeight: 2.4,
    windSpeed: 22,
    visibility: 8,
    temperature: 27,
    swellDirection: "NE",
    forecast: "Monsoon transition. Occasional squalls with brief visibility reduction expected.",
    precautions: [
      "Maintain heightened bridge watch",
      "Radar plotting for reduced visibility",
      "Verify cargo lashing pre-departure",
    ],
  },
  {
    id: "sw6",
    region: "Cape of Good Hope",
    condition: "rough",
    waveHeight: 5.1,
    windSpeed: 38,
    visibility: 7,
    temperature: 14,
    swellDirection: "SW",
    forecast: "Southerly Cape rollers active. Sustained heavy swell with cross-seas near shelf edge.",
    precautions: [
      "Reduce speed and adjust heading for swell",
      "Fuel reserves check — expect +8% consumption",
      "Alert crew to secure loose equipment",
    ],
  },
  {
    id: "sw7",
    region: "English Channel",
    condition: "calm",
    waveHeight: 1.1,
    windSpeed: 12,
    visibility: 12,
    temperature: 11,
    swellDirection: "W",
    forecast: "Stable westerly flow. Fog patches possible near dawn along Dover Strait.",
    precautions: [
      "TSS compliance mandatory",
      "Fog protocols on standby",
    ],
  },
];
