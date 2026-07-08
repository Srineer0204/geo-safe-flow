import { User, Mail, MapPin, Shield, Briefcase } from "lucide-react";
import PageLayout from "@/components/dashboard/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProfilePage = () => {
  return (
    <PageLayout title="Profile" subtitle="Manage your account information">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="glass-panel p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-lg font-bold">Alex Morgan</h2>
          <p className="text-xs text-muted-foreground font-mono">Logistics Manager</p>
          <div className="mt-4 w-full space-y-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5" /> alex.morgan@geosafe.io
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Rotterdam, NL
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5" /> GeoSafe Ops Team
            </div>
            <div className="flex items-center gap-2 text-risk-low">
              <Shield className="h-3.5 w-3.5" /> Verified Admin
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider">Account Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name</Label>
              <Input defaultValue="Alex Morgan" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input defaultValue="alex.morgan@geosafe.io" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Role</Label>
              <Input defaultValue="Logistics Manager" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Region</Label>
              <Input defaultValue="EMEA" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="sm">Save Changes</Button>
            <Button size="sm" variant="outline">Cancel</Button>
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
