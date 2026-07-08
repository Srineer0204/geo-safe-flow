import { Moon, Sun, Bell, Globe, Shield } from "lucide-react";
import PageLayout from "@/components/dashboard/PageLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/theme/ThemeContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { Language, languageNames } from "@/i18n/translations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <PageLayout title="Settings" subtitle="Customize your GeoSafe experience">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Appearance</h3>
          </div>
          <p className="text-xs text-muted-foreground">Choose how GeoSafe looks to you.</p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className="h-20 flex-col gap-2"
            >
              <Sun className="h-5 w-5" />
              <span className="text-xs">Light</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="h-20 flex-col gap-2"
            >
              <Moon className="h-5 w-5" />
              <span className="text-xs">Dark</span>
            </Button>
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Language</h3>
          </div>
          <p className="text-xs text-muted-foreground">Interface language for the dashboard.</p>
          <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(languageNames) as Language[]).map((l) => (
                <SelectItem key={l} value={l}>{languageNames[l]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Notifications</h3>
          </div>
          {[
            { id: "risk", label: "High-risk region alerts", def: true },
            { id: "weather", label: "Severe sea weather warnings", def: true },
            { id: "reroute", label: "Auto-reroute notifications", def: false },
            { id: "digest", label: "Daily digest email", def: true },
          ].map((n) => (
            <div key={n.id} className="flex items-center justify-between">
              <Label htmlFor={n.id} className="text-xs">{n.label}</Label>
              <Switch id={n.id} defaultChecked={n.def} />
            </div>
          ))}
        </div>

        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Security</h3>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Two-factor authentication</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Session activity logs</Label>
            <Switch defaultChecked />
          </div>
          <Button size="sm" variant="outline">Change Password</Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
