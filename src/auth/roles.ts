export const APP_ROLES = [
  "logistics_manager",
  "supply_chain_analyst",
  "port_operator",
] as const;

export type AppRole = (typeof APP_ROLES)[number] | "admin";

export const roleLabels: Record<AppRole, string> = {
  logistics_manager: "Logistics Manager",
  supply_chain_analyst: "Supply Chain Analyst",
  port_operator: "Port Operator",
  admin: "Administrator",
};

export const roleLabel = (r?: AppRole | null) => (r ? roleLabels[r] : "—");
