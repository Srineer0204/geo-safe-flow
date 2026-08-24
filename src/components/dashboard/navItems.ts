import { LayoutDashboard, Map, Ship, Bell, Zap, Shield, Settings, User } from "lucide-react";

export const navItems = [
  { icon: LayoutDashboard, labelKey: "nav.dashboard", path: "/" },
  { icon: Map, labelKey: "nav.routes", path: "/routes" },
  { icon: Ship, labelKey: "nav.shipments", path: "/shipments" },
  { icon: Bell, labelKey: "nav.alerts", path: "/alerts" },
  { icon: Zap, labelKey: "nav.simulation", path: "/simulation" },
  { icon: Shield, labelKey: "nav.riskIntel", path: "/risk-intel" },
  { icon: User, labelKey: "nav.profile", path: "/profile" },
];

export const settingsItem = { icon: Settings, labelKey: "nav.settings", path: "/settings" };
