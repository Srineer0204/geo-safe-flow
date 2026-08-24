import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";

const ChangePasswordDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const identities = user?.identities ?? [];
  const hasPassword = identities.length === 0 || identities.some((i) => i.provider === "email");
  const email = user?.email ?? "";

  const reset = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasPassword && !current) return toast.error("Enter your current password");
    if (next.length < 8) return toast.error("Password must be at least 8 characters");
    if (next !== confirm) return toast.error("Passwords do not match");
    if (hasPassword && next === current) return toast.error("New password must be different from the current password");

    setBusy(true);
    try {
      if (hasPassword) {
        if (!email) {
          toast.error("No email on this account");
          return;
        }
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password: current });
        if (authError) {
          toast.error("Current password is incorrect");
          return;
        }
      }
      const { error } = await supabase.auth.updateUser({ password: next });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success(hasPassword ? "Password updated" : "Password set");
      setOpen(false);
      reset();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{hasPassword ? "Change password" : "Set password"}</DialogTitle>
          <DialogDescription className="sr-only">
            {hasPassword
              ? "Confirm your current password, then choose a new one."
              : "Choose a password to also sign in with email."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          {hasPassword ? (
            <div className="space-y-1.5">
              <Label className="text-xs">Current password</Label>
              <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              You signed in with a social provider. Set a password to also sign in with email.
            </p>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs">New password</Label>
            <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} minLength={8} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Confirm password</Label>
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={8} required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
