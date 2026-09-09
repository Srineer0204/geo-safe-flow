import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AlertRow } from "@/lib/alert-utils";

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: queryError } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false });
    if (queryError) {
      setError(queryError.message);
      setLoading(false);
      return;
    }
    setAlerts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    const sync = async () => {
      await loadAlerts();
      const { error: syncError } = await supabase.functions.invoke("alerts-ingest", { body: {} });
      if (syncError && mounted) setError(syncError.message);
      if (!syncError && mounted) await loadAlerts();
    };
    void sync();

    const channel = supabase
      .channel("alerts-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts" }, () => {
        void loadAlerts();
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [loadAlerts]);

  return { alerts, loading, error, retry: loadAlerts };
};