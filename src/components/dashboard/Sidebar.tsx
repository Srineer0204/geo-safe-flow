import { LayoutDashboard, Map, Ship, Bell, Zap, Shield, Settings } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Map, label: "Routes" },
  { icon: Ship, label: "Shipments" },
  { icon: Bell, label: "Alerts" },
  { icon: Zap, label: "Simulation" },
  { icon: Shield, label: "Risk Intel" },
];

const Sidebar = () => {
  return (
    <aside className="w-16 lg:w-56 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-bold text-foreground tracking-tight">GeoSafe</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Logistics</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground border border-primary/20"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <item.icon className={`h-4 w-4 shrink-0 ${item.active ? "text-primary" : ""}`} />
            <span className="hidden lg:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all">
          <Settings className="h-4 w-4 shrink-0" />
          <span className="hidden lg:block">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
