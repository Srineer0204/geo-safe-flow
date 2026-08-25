import { Moon, Sun, Globe, Shield, LogOut } from "lucide-react";
import PageLayout from "@/components/dashboard/PageLayout";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/theme/ThemeContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { Language, languageNames } from "@/i18n/translations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";


const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { signOut } = useAuth();
  const nav = useNavigate();

  return (
    <PageLayout title="Settings" subtitle="Customize your GeoSafe experience">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Appearance</h2>
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
            <h2 className="text-sm font-semibold uppercase tracking-wider">Language</h2>
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
            <Shield className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Security</h2>
          </div>
          <div className="flex gap-2 pt-2">
            <ChangePasswordDialog
              trigger={<Button size="sm" variant="outline">Change Password</Button>}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                await signOut();
                nav("/auth", { replace: true });
              }}
            >
              <LogOut className="h-3.5 w-3.5 mr-1" /> Sign out
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
