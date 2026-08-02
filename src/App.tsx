import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider } from "@/theme/ThemeContext";
import { AuthProvider } from "@/auth/AuthContext";
import { RoleProvider } from "@/auth/useUserRole";
import RequireAuth from "@/auth/RequireAuth";
import Index from "./pages/Index";
import RoutesPage from "./pages/RoutesPage";
import ShipmentsPage from "./pages/ShipmentsPage";
import AlertsPage from "./pages/AlertsPage";
import SimulationPage from "./pages/SimulationPage";
import RiskIntelPage from "./pages/RiskIntelPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <RoleProvider>
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
                  <Route path="/routes" element={<RequireAuth><RoutesPage /></RequireAuth>} />
                  <Route path="/shipments" element={<RequireAuth><ShipmentsPage /></RequireAuth>} />
                  <Route path="/alerts" element={<RequireAuth><AlertsPage /></RequireAuth>} />
                  <Route path="/simulation" element={<RequireAuth><SimulationPage /></RequireAuth>} />
                  <Route path="/risk-intel" element={<RequireAuth><RiskIntelPage /></RequireAuth>} />
                  <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                  <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </RoleProvider>
            </AuthProvider>
          </BrowserRouter>

        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
