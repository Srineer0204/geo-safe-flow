export interface Port {
  id: string;
  name: string;
  country: string;
  region: string;
  /** [lng, lat] */
  coordinates: [number, number];
  teuMillions?: number;
}

export const ports: Port[] = [
  // East Asia
  { id: "shanghai", name: "Shanghai", country: "China", region: "East Asia", coordinates: [121.47, 31.23], teuMillions: 49.2 },
  { id: "ningbo", name: "Ningbo-Zhoushan", country: "China", region: "East Asia", coordinates: [121.55, 29.87], teuMillions: 35.3 },
  { id: "shenzhen", name: "Shenzhen", country: "China", region: "East Asia", coordinates: [114.06, 22.54], teuMillions: 30.0 },
  { id: "guangzhou", name: "Guangzhou", country: "China", region: "East Asia", coordinates: [113.26, 23.13], teuMillions: 24.6 },
  { id: "qingdao", name: "Qingdao", country: "China", region: "East Asia", coordinates: [120.38, 36.07], teuMillions: 25.7 },
  { id: "tianjin", name: "Tianjin", country: "China", region: "East Asia", coordinates: [117.72, 39.00], teuMillions: 21.0 },
  { id: "hongkong", name: "Hong Kong", country: "Hong Kong", region: "East Asia", coordinates: [114.17, 22.32], teuMillions: 14.4 },
  { id: "busan", name: "Busan", country: "South Korea", region: "East Asia", coordinates: [129.04, 35.10], teuMillions: 22.7 },
  { id: "kaohsiung", name: "Kaohsiung", country: "Taiwan", region: "East Asia", coordinates: [120.30, 22.62], teuMillions: 9.5 },
  { id: "xiamen", name: "Xiamen", country: "China", region: "East Asia", coordinates: [118.08, 24.48], teuMillions: 12.4 },
  { id: "tokyo", name: "Tokyo", country: "Japan", region: "East Asia", coordinates: [139.77, 35.65], teuMillions: 4.5 },
  { id: "yokohama", name: "Yokohama", country: "Japan", region: "East Asia", coordinates: [139.65, 35.44], teuMillions: 2.9 },

  // Southeast Asia
  { id: "singapore", name: "Singapore", country: "Singapore", region: "Southeast Asia", coordinates: [103.85, 1.29], teuMillions: 39.0 },
  { id: "portklang", name: "Port Klang", country: "Malaysia", region: "Southeast Asia", coordinates: [101.39, 3.00], teuMillions: 13.5 },
  { id: "tanjungpelepas", name: "Tanjung Pelepas", country: "Malaysia", region: "Southeast Asia", coordinates: [103.55, 1.36], teuMillions: 10.5 },
  { id: "laemchabang", name: "Laem Chabang", country: "Thailand", region: "Southeast Asia", coordinates: [100.88, 13.08], teuMillions: 8.7 },
  { id: "hochiminh", name: "Ho Chi Minh City", country: "Vietnam", region: "Southeast Asia", coordinates: [106.70, 10.77], teuMillions: 8.3 },
  { id: "manila", name: "Manila", country: "Philippines", region: "Southeast Asia", coordinates: [120.96, 14.60], teuMillions: 5.2 },
  { id: "jakarta", name: "Tanjung Priok", country: "Indonesia", region: "Southeast Asia", coordinates: [106.88, -6.10], teuMillions: 7.6 },

  // South Asia
  { id: "mumbai", name: "Mumbai (JNPT)", country: "India", region: "South Asia", coordinates: [72.95, 18.94], teuMillions: 6.1 },
  { id: "mundra", name: "Mundra", country: "India", region: "South Asia", coordinates: [69.72, 22.83], teuMillions: 7.4 },
  { id: "colombo", name: "Colombo", country: "Sri Lanka", region: "South Asia", coordinates: [79.85, 6.94], teuMillions: 7.3 },
  { id: "chennai", name: "Chennai", country: "India", region: "South Asia", coordinates: [80.29, 13.10], teuMillions: 1.7 },
  { id: "karachi", name: "Karachi", country: "Pakistan", region: "South Asia", coordinates: [67.01, 24.82], teuMillions: 3.3 },

  // Middle East
  { id: "jebelali", name: "Jebel Ali (Dubai)", country: "UAE", region: "Middle East", coordinates: [55.03, 25.01], teuMillions: 13.7 },
  { id: "jeddah", name: "Jeddah", country: "Saudi Arabia", region: "Middle East", coordinates: [39.17, 21.53], teuMillions: 5.0 },
  { id: "salalah", name: "Salalah", country: "Oman", region: "Middle East", coordinates: [54.00, 16.94], teuMillions: 4.5 },
  { id: "suez", name: "Port Said / Suez", country: "Egypt", region: "Middle East", coordinates: [32.31, 31.26], teuMillions: 3.8 },
  { id: "haifa", name: "Haifa", country: "Israel", region: "Middle East", coordinates: [34.99, 32.83], teuMillions: 1.4 },

  // Europe
  { id: "rotterdam", name: "Rotterdam", country: "Netherlands", region: "Europe", coordinates: [4.48, 51.92], teuMillions: 14.4 },
  { id: "antwerp", name: "Antwerp-Bruges", country: "Belgium", region: "Europe", coordinates: [4.40, 51.22], teuMillions: 13.5 },
  { id: "hamburg", name: "Hamburg", country: "Germany", region: "Europe", coordinates: [9.99, 53.55], teuMillions: 7.7 },
  { id: "piraeus", name: "Piraeus", country: "Greece", region: "Europe", coordinates: [23.63, 37.94], teuMillions: 5.4 },
  { id: "valencia", name: "Valencia", country: "Spain", region: "Europe", coordinates: [-0.31, 39.44], teuMillions: 5.1 },
  { id: "algeciras", name: "Algeciras", country: "Spain", region: "Europe", coordinates: [-5.44, 36.13], teuMillions: 4.8 },
  { id: "felixstowe", name: "Felixstowe", country: "UK", region: "Europe", coordinates: [1.30, 51.95], teuMillions: 3.9 },
  { id: "genoa", name: "Genoa", country: "Italy", region: "Europe", coordinates: [8.93, 44.40], teuMillions: 2.6 },

  // North America
  { id: "losangeles", name: "Los Angeles", country: "USA", region: "North America", coordinates: [-118.26, 33.73], teuMillions: 9.9 },
  { id: "longbeach", name: "Long Beach", country: "USA", region: "North America", coordinates: [-118.22, 33.75], teuMillions: 9.1 },
  { id: "newyork", name: "New York / NJ", country: "USA", region: "North America", coordinates: [-74.04, 40.68], teuMillions: 9.5 },
  { id: "savannah", name: "Savannah", country: "USA", region: "North America", coordinates: [-81.14, 32.13], teuMillions: 5.9 },
  { id: "vancouver", name: "Vancouver", country: "Canada", region: "North America", coordinates: [-123.11, 49.29], teuMillions: 3.5 },
  { id: "manzanillo", name: "Manzanillo", country: "Mexico", region: "North America", coordinates: [-104.32, 19.05], teuMillions: 3.7 },
  { id: "colon", name: "Colón (Panama)", country: "Panama", region: "North America", coordinates: [-79.90, 9.36], teuMillions: 4.4 },

  // South America
  { id: "santos", name: "Santos", country: "Brazil", region: "South America", coordinates: [-46.32, -23.98], teuMillions: 4.9 },
  { id: "callao", name: "Callao", country: "Peru", region: "South America", coordinates: [-77.15, -12.05], teuMillions: 2.6 },
  { id: "cartagena", name: "Cartagena", country: "Colombia", region: "South America", coordinates: [-75.51, 10.40], teuMillions: 3.0 },
  { id: "buenosaires", name: "Buenos Aires", country: "Argentina", region: "South America", coordinates: [-58.37, -34.60], teuMillions: 1.5 },

  // Africa
  { id: "durban", name: "Durban", country: "South Africa", region: "Africa", coordinates: [31.04, -29.87], teuMillions: 2.9 },
  { id: "capetown", name: "Cape Town", country: "South Africa", region: "Africa", coordinates: [18.42, -33.92], teuMillions: 0.9 },
  { id: "mombasa", name: "Mombasa", country: "Kenya", region: "Africa", coordinates: [39.67, -4.05], teuMillions: 1.5 },
  { id: "tangermed", name: "Tanger Med", country: "Morocco", region: "Africa", coordinates: [-5.50, 35.89], teuMillions: 8.6 },
  { id: "lagos", name: "Lagos (Apapa)", country: "Nigeria", region: "Africa", coordinates: [3.36, 6.44], teuMillions: 1.4 },

  // Oceania
  { id: "sydney", name: "Sydney (Botany)", country: "Australia", region: "Oceania", coordinates: [151.22, -33.97], teuMillions: 2.7 },
  { id: "melbourne", name: "Melbourne", country: "Australia", region: "Oceania", coordinates: [144.90, -37.83], teuMillions: 3.3 },
  { id: "auckland", name: "Auckland", country: "New Zealand", region: "Oceania", coordinates: [174.78, -36.84], teuMillions: 0.9 },
];

export interface RegionNews {
  id: string;
  region: string;
  headline: string;
  source: string;
  time: string;
  severity: "info" | "warning" | "danger";
  summary: string;
}

export const regionNews: RegionNews[] = [
  { id: "n1", region: "Middle East", headline: "Red Sea transits down 42% YoY as carriers reroute", source: "Lloyd's List", time: "12 min ago", severity: "danger", summary: "Major carriers continue to divert Asia–Europe volumes around the Cape of Good Hope amid ongoing security advisories." },
  { id: "n2", region: "East Asia", headline: "Shanghai port throughput hits record 4.5M TEU in month", source: "Xinhua", time: "38 min ago", severity: "info", summary: "Shanghai maintains lead as world's busiest container port with double-digit growth on transpacific lane." },
  { id: "n3", region: "Europe", headline: "Rotterdam labour talks resume — strike risk eases", source: "Reuters", time: "1 hr ago", severity: "warning", summary: "Union and port authority return to negotiating table; short-term disruption still possible at ECT and APM terminals." },
  { id: "n4", region: "North America", headline: "LA/LB dwell times drop below 4 days pre-peak season", source: "JOC", time: "2 hr ago", severity: "info", summary: "West coast productivity improves as ILWU contract holds and rail dwell normalizes across San Pedro Bay." },
  { id: "n5", region: "South Asia", headline: "Cyclone watch issued for Bay of Bengal — Chennai on alert", source: "IMD", time: "3 hr ago", severity: "warning", summary: "Depression intensifying east of Chennai; port operations may face 24–48h suspension." },
  { id: "n6", region: "Southeast Asia", headline: "Singapore anchorage congestion clears as vessel calls stabilize", source: "MPA", time: "4 hr ago", severity: "info", summary: "Waiting times at Singapore anchorage back under 24 hours after a 6-week congestion spike." },
  { id: "n7", region: "Africa", headline: "Durban terminal auto-gate launch cuts truck turn times", source: "Transnet", time: "5 hr ago", severity: "info", summary: "New automation at Pier 2 reduces average truck turn from 90 to 55 minutes." },
  { id: "n8", region: "South America", headline: "Santos draft restrictions extended after channel silting", source: "Santos Port Authority", time: "6 hr ago", severity: "warning", summary: "Max draft reduced to 13.2m at Alemoa channel until dredging completes next week." },
  { id: "n9", region: "Oceania", headline: "Sydney Port Botany reopens after weather closure", source: "NSW Ports", time: "7 hr ago", severity: "info", summary: "Operations resume with backlog expected to clear within 36 hours." },
  { id: "n10", region: "Middle East", headline: "Jebel Ali expansion adds 3.5M TEU annual capacity", source: "DP World", time: "9 hr ago", severity: "info", summary: "New berths at Terminal 4 handle first ULCV as commissioning completes." },
];

// Global shipping corridors — multiple options per corridor
export interface Corridor {
  id: string;
  name: string;
  from: string;
  to: string;
  shortest: { points: { name: string; coordinates: [number, number] }[]; distance: number; time: string; cost: number; risk: number; co2: number; ecoScore: number };
  safest: { points: { name: string; coordinates: [number, number] }[]; distance: number; time: string; cost: number; risk: number; co2: number; ecoScore: number };
  eco: { points: { name: string; coordinates: [number, number] }[]; distance: number; time: string; cost: number; risk: number; co2: number; ecoScore: number };
}

const p = (name: string, coords: [number, number]) => ({ name, coordinates: coords });

export const corridors: Corridor[] = [
  {
    id: "mumbai-rotterdam",
    name: "Mumbai → Rotterdam",
    from: "Mumbai",
    to: "Rotterdam",
    shortest: {
      points: [p("Mumbai", [72.87, 19.07]), p("Arabian Sea", [63, 15]), p("Gulf of Aden", [48, 12]), p("Red Sea", [38, 20]), p("Suez", [32.5, 30]), p("Mediterranean", [15, 36]), p("Gibraltar", [-5.5, 36]), p("Bay of Biscay", [-5, 45]), p("Rotterdam", [4.48, 51.92])],
      distance: 6200, time: "18 days", cost: 48500, risk: 72, co2: 1200, ecoScore: 35,
    },
    safest: {
      points: [p("Mumbai", [72.87, 19.07]), p("Arabian Sea", [65, 10]), p("East Africa", [45, -10]), p("Mozambique Channel", [40, -25]), p("Cape of Good Hope", [18.47, -34.35]), p("West Africa", [0, -10]), p("Canary Islands", [-16, 28]), p("Bay of Biscay", [-5, 45]), p("Rotterdam", [4.48, 51.92])],
      distance: 9800, time: "22 days", cost: 36200, risk: 25, co2: 900, ecoScore: 72,
    },
    eco: {
      points: [p("Mumbai", [72.87, 19.07]), p("Arabian Sea", [63, 8]), p("East Africa", [48, -8]), p("Mozambique Channel", [40, -22]), p("Cape of Good Hope", [18.47, -34.35]), p("Atlantic", [-10, -5]), p("Canary Islands", [-18, 28]), p("English Channel", [0, 50]), p("Rotterdam", [4.48, 51.92])],
      distance: 10500, time: "24 days", cost: 39800, risk: 38, co2: 720, ecoScore: 92,
    },
  },
  {
    id: "shanghai-rotterdam",
    name: "Shanghai → Rotterdam",
    from: "Shanghai", to: "Rotterdam",
    shortest: {
      points: [p("Shanghai", [121.47, 31.23]), p("East China Sea", [123, 27]), p("South China Sea", [115, 15]), p("Singapore", [103.85, 1.29]), p("Malacca Strait", [98, 5]), p("Indian Ocean", [80, 8]), p("Arabian Sea", [60, 12]), p("Gulf of Aden", [48, 12]), p("Red Sea", [38, 22]), p("Suez", [32.5, 30]), p("Mediterranean", [15, 36]), p("Gibraltar", [-5.5, 36]), p("Rotterdam", [4.48, 51.92])],
      distance: 10500, time: "27 days", cost: 62000, risk: 68, co2: 1900, ecoScore: 32,
    },
    safest: {
      points: [p("Shanghai", [121.47, 31.23]), p("South China Sea", [115, 15]), p("Singapore", [103.85, 1.29]), p("Indian Ocean", [75, -5]), p("Mozambique Channel", [40, -22]), p("Cape of Good Hope", [18.47, -34.35]), p("Atlantic", [-5, -10]), p("Canary Islands", [-16, 28]), p("Rotterdam", [4.48, 51.92])],
      distance: 13800, time: "34 days", cost: 51000, risk: 22, co2: 1450, ecoScore: 68,
    },
    eco: {
      points: [p("Shanghai", [121.47, 31.23]), p("South China Sea", [115, 12]), p("Singapore", [103.85, 1.29]), p("Indian Ocean", [70, -8]), p("Cape of Good Hope", [18.47, -34.35]), p("Atlantic", [-8, -5]), p("English Channel", [0, 50]), p("Rotterdam", [4.48, 51.92])],
      distance: 14200, time: "36 days", cost: 54500, risk: 30, co2: 1150, ecoScore: 90,
    },
  },
  {
    id: "shanghai-losangeles",
    name: "Shanghai → Los Angeles (Transpacific)",
    from: "Shanghai", to: "Los Angeles",
    shortest: {
      points: [p("Shanghai", [121.47, 31.23]), p("North Pacific", [160, 38]), p("Mid Pacific", [-170, 40]), p("Aleutian Approach", [-150, 42]), p("NE Pacific", [-130, 38]), p("Los Angeles", [-118.26, 33.73])],
      distance: 6500, time: "14 days", cost: 42000, risk: 28, co2: 1350, ecoScore: 45,
    },
    safest: {
      points: [p("Shanghai", [121.47, 31.23]), p("North Pacific", [155, 35]), p("Mid Pacific", [-175, 36]), p("NE Pacific", [-135, 35]), p("Los Angeles", [-118.26, 33.73])],
      distance: 6700, time: "15 days", cost: 43500, risk: 18, co2: 1400, ecoScore: 55,
    },
    eco: {
      points: [p("Shanghai", [121.47, 31.23]), p("Great Circle", [170, 42]), p("Mid Pacific", [-160, 40]), p("Los Angeles", [-118.26, 33.73])],
      distance: 6300, time: "16 days", cost: 41000, risk: 22, co2: 1050, ecoScore: 88,
    },
  },
  {
    id: "newyork-rotterdam",
    name: "New York → Rotterdam (Transatlantic)",
    from: "New York", to: "Rotterdam",
    shortest: {
      points: [p("New York", [-74.04, 40.68]), p("N Atlantic", [-50, 45]), p("Mid Atlantic", [-25, 50]), p("English Channel", [0, 50]), p("Rotterdam", [4.48, 51.92])],
      distance: 3500, time: "8 days", cost: 28000, risk: 20, co2: 720, ecoScore: 60,
    },
    safest: {
      points: [p("New York", [-74.04, 40.68]), p("N Atlantic", [-45, 43]), p("Mid Atlantic", [-20, 48]), p("English Channel", [0, 50]), p("Rotterdam", [4.48, 51.92])],
      distance: 3600, time: "8 days", cost: 28500, risk: 12, co2: 740, ecoScore: 62,
    },
    eco: {
      points: [p("New York", [-74.04, 40.68]), p("Great Circle", [-40, 47]), p("English Channel", [0, 50]), p("Rotterdam", [4.48, 51.92])],
      distance: 3550, time: "9 days", cost: 27500, risk: 15, co2: 580, ecoScore: 91,
    },
  },
  {
    id: "singapore-durban",
    name: "Singapore → Durban",
    from: "Singapore", to: "Durban",
    shortest: {
      points: [p("Singapore", [103.85, 1.29]), p("Indian Ocean", [75, -5]), p("Madagascar", [50, -20]), p("Durban", [31.04, -29.87])],
      distance: 5100, time: "13 days", cost: 32000, risk: 25, co2: 890, ecoScore: 58,
    },
    safest: {
      points: [p("Singapore", [103.85, 1.29]), p("Indian Ocean", [80, -8]), p("Madagascar E", [55, -22]), p("Mozambique Channel", [40, -28]), p("Durban", [31.04, -29.87])],
      distance: 5300, time: "14 days", cost: 32800, risk: 15, co2: 910, ecoScore: 62,
    },
    eco: {
      points: [p("Singapore", [103.85, 1.29]), p("Indian Ocean", [70, -10]), p("Madagascar", [50, -22]), p("Durban", [31.04, -29.87])],
      distance: 5000, time: "14 days", cost: 31000, risk: 20, co2: 720, ecoScore: 89,
    },
  },
  {
    id: "dubai-mumbai",
    name: "Dubai → Mumbai",
    from: "Dubai", to: "Mumbai",
    shortest: {
      points: [p("Jebel Ali", [55.03, 25.01]), p("Gulf of Oman", [58, 24]), p("Arabian Sea", [65, 22]), p("Mumbai", [72.95, 18.94])],
      distance: 1200, time: "4 days", cost: 12000, risk: 35, co2: 260, ecoScore: 55,
    },
    safest: {
      points: [p("Jebel Ali", [55.03, 25.01]), p("Gulf of Oman", [59, 23]), p("Arabian Sea", [65, 20]), p("Mumbai", [72.95, 18.94])],
      distance: 1250, time: "4 days", cost: 12200, risk: 20, co2: 265, ecoScore: 58,
    },
    eco: {
      points: [p("Jebel Ali", [55.03, 25.01]), p("Arabian Sea", [63, 22]), p("Mumbai", [72.95, 18.94])],
      distance: 1180, time: "5 days", cost: 11500, risk: 28, co2: 200, ecoScore: 90,
    },
  },
  {
    id: "rotterdam-santos",
    name: "Rotterdam → Santos",
    from: "Rotterdam", to: "Santos",
    shortest: {
      points: [p("Rotterdam", [4.48, 51.92]), p("Bay of Biscay", [-5, 45]), p("Canary Islands", [-16, 28]), p("Mid Atlantic", [-25, 5]), p("Santos", [-46.32, -23.98])],
      distance: 5700, time: "15 days", cost: 38000, risk: 18, co2: 1100, ecoScore: 55,
    },
    safest: {
      points: [p("Rotterdam", [4.48, 51.92]), p("Bay of Biscay", [-8, 44]), p("Canary Islands", [-18, 27]), p("Mid Atlantic", [-28, 0]), p("Santos", [-46.32, -23.98])],
      distance: 5850, time: "16 days", cost: 38800, risk: 12, co2: 1140, ecoScore: 58,
    },
    eco: {
      points: [p("Rotterdam", [4.48, 51.92]), p("Canary Islands", [-16, 28]), p("Equatorial Atlantic", [-25, -5]), p("Santos", [-46.32, -23.98])],
      distance: 5750, time: "17 days", cost: 37000, risk: 15, co2: 880, ecoScore: 92,
    },
  },
  {
    id: "sydney-losangeles",
    name: "Sydney → Los Angeles",
    from: "Sydney", to: "Los Angeles",
    shortest: {
      points: [p("Sydney", [151.22, -33.97]), p("S Pacific", [180, -20]), p("Equatorial Pacific", [-160, 0]), p("NE Pacific", [-130, 25]), p("Los Angeles", [-118.26, 33.73])],
      distance: 6500, time: "17 days", cost: 44000, risk: 22, co2: 1250, ecoScore: 50,
    },
    safest: {
      points: [p("Sydney", [151.22, -33.97]), p("S Pacific", [175, -18]), p("Auckland", [174.78, -36.84]), p("Equatorial Pacific", [-165, 0]), p("Los Angeles", [-118.26, 33.73])],
      distance: 6800, time: "18 days", cost: 45200, risk: 15, co2: 1290, ecoScore: 54,
    },
    eco: {
      points: [p("Sydney", [151.22, -33.97]), p("S Pacific", [-175, -15]), p("Mid Pacific", [-150, 10]), p("Los Angeles", [-118.26, 33.73])],
      distance: 6400, time: "19 days", cost: 42500, risk: 20, co2: 980, ecoScore: 90,
    },
  },
];
