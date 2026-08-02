import { useState } from "react";
import { User, Mail, MapPin, Shield, Briefcase, LogOut, Loader2 } from "lucide-react";
import PageLayout from "@/components/dashboard/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/auth/AuthContext";
import { useUserRole } from "@/auth/useUserRole";
import { APP_ROLES, AppRole, roleLabel, roleLabels } from "@/auth/roles";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { role, saveRole } = useUserRole();
  const nav = useNavigate();
  const email = user?.email ?? "";
  const meta = (user?.user_metadata ?? {}) as Record<string, string | undefined>;
  const displayName = meta.full_name || meta.name || email.split("@")[0] || "User";
  const [name, setName] = useState(displayName);
  const [region, setRegion] = useState((meta.region as string) || "EMEA");
  const [pendingRole, setPendingRole] = useState<AppRole | null>(null);
  const [savingRole, setSavingRole] = useState(false);

  const currentRole = (pendingRole ?? role ?? "logistics_manager") as AppRole;

  const changeRole = async (r: AppRole) => {
    setPendingRole(r);
    setSavingRole(true);
    try {
      await saveRole(r);
      toast.success(`Role updated to ${roleLabels[r]}`);
    } catch (err: unknown) {
      setPendingRole(null);
      toast.error(err instanceof Error ? err.message : "Could not update role");
    } finally {
      setSavingRole(false);
    }
  };

  const initials = displayName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();


  return (
    <PageLayout title="Profile" subtitle="Manage your account information">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="glass-panel p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mb-4">
            {meta.avatar_url ? (
              <img src={meta.avatar_url} alt={displayName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-primary font-mono">{initials || <User className="h-12 w-12" />}</span>
            )}
          </div>
          <h2 className="text-lg font-bold">{displayName}</h2>
          <p className="text-xs text-muted-foreground font-mono">{role}</p>
          <div className="mt-4 w-full space-y-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5" /> {email || "—"}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {region}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5" /> GeoSafe Ops
            </div>
            <div className="flex items-center gap-2 text-risk-low">
              <Shield className="h-3.5 w-3.5" /> Authenticated
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider">Account Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input value={email} disabled />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Role</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Region</Label>
              <Input value={region} onChange={(e) => setRegion(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <ChangePasswordDialog trigger={<Button size="sm" variant="outline">Change Password</Button>} />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: "Shipments Managed", value: "142" },
          { label: "Routes Optimized", value: "89" },
          { label: "CO₂ Saved", value: "18.4t" },
        ].map((s) => (
          <div key={s.label} className="glass-panel p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-1 font-mono">{s.value}</p>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
