import { useState } from "react";
import { Menu, Shield } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { navItems, settingsItem } from "./navItems";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/** Compact drawer navigation for small screens (desktop keeps the sidebar). */
const MobileNav = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
      isActive
        ? "bg-sidebar-accent text-sidebar-accent-foreground border border-primary/20"
        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
    }`;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="md:hidden p-2 -ml-1 rounded-md border border-border/50 hover:bg-secondary/60 transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-sidebar border-sidebar-border p-0 flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-sm font-bold text-foreground tracking-tight">GeoSafe</SheetTitle>
              <SheetDescription className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Logistics
              </SheetDescription>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                  <span>{t(item.labelKey)}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-sidebar-border">
          <NavLink to={settingsItem.path} onClick={() => setOpen(false)} className={linkClass}>
            {({ isActive }) => (
              <>
                <settingsItem.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                <span>{t(settingsItem.labelKey)}</span>
              </>
            )}
          </NavLink>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
