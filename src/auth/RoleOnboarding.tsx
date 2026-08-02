import { useEffect, useState } from "react";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "./AuthContext";
import { useUserRole } from "./useUserRole";
import { APP_ROLES, AppRole, roleLabels } from "./roles";

/**
 * Shown once, right after a user first signs in without a stored role.
 * If a role was chosen at signup it is applied automatically (no prompt).
 */
const RoleOnboarding = () => {
  const { user } = useAuth();
  const { saveRole } = useUserRole();
  const [selected, setSelected] = useState<AppRole>("logistics_manager");
  const [busy, setBusy] = useState(false);
  const [autoApplying, setAutoApplying] = useState(true);

  useEffect(() => {
    const pending = (user?.user_metadata as Record<string, unknown> | undefined)?.role as
      | AppRole
      | undefined;
    if (pending && (APP_ROLES as readonly string[]).includes(pending)) {
      saveRole(pending)
        .catch(() => setAutoApplying(false))
        .finally(() => setAutoApplying(false));
    } else {
      setAutoApplying(false);
    }
  }, [user, saveRole]);

  if (autoApplying) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  const confirm = async () => {
    setBusy(true);
    try {
      await saveRole(selected);
      toast.success(`Role set to ${roleLabels[selected]}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not save role");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md glass-panel p-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold tracking-tight">GeoSafe Logistics</h1>
        </div>
        <h2 className="text-xl font-semibold mb-1">Select your role</h2>
        <p className="text-xs text-muted-foreground mb-6">
          This tailors your dashboard. You can change it later in Profile.
        </p>
        <Select value={selected} onValueChange={(v) => setSelected(v as AppRole)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {APP_ROLES.map((r) => (
              <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="w-full mt-5" onClick={confirm} disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Continue
        </Button>
      </div>
    </main>
  );
};

export default RoleOnboarding;
