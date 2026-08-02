import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import type { AppRole } from "./roles";

interface RoleCtx {
  role: AppRole | null;
  loading: boolean;
  saveRole: (r: AppRole) => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<RoleCtx>({
  role: null,
  loading: true,
  saveRole: async () => {},
  refresh: async () => {},
});

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    setRole((data?.role as AppRole) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    refresh();
  }, [authLoading, refresh]);

  const saveRole = useCallback(
    async (r: AppRole) => {
      if (!user) return;
      // one role per user: clear previous selection, then set the new one
      await supabase.from("user_roles").delete().eq("user_id", user.id);
      const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: r });
      if (error) throw error;
      setRole(r);
    },
    [user],
  );

  return <Ctx.Provider value={{ role, loading, saveRole, refresh }}>{children}</Ctx.Provider>;
};

export const useUserRole = () => useContext(Ctx);
