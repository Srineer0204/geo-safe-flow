import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, AlertCircle, AlertTriangle, Info, RefreshCw, Loader2 } from "lucide-react";
import { regionNews } from "@/data/ports";
import { supabase } from "@/integrations/supabase/client";

const iconMap = { danger: AlertCircle, warning: AlertTriangle, info: Info };
const colorMap = {
  danger: "text-risk-high border-risk-high/40 bg-risk-high/5",
  warning: "text-risk-medium border-risk-medium/40 bg-risk-medium/5",
  info: "text-primary border-primary/30 bg-primary/5",
};

interface AiItem {
  headline: string;
  summary: string;
  severity: "info" | "warning" | "danger";
  source: string;
  time: string;
}

interface Props {
  region?: string;
  port?: { name: string; country?: string; region?: string };
}

const RegionNewsPanel = ({ region, port }: Props) => {
  const [aiItems, setAiItems] = useState<AiItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    if (!port) return;
    setLoading(true);
    setErr(null);
    try {
      const { data, error } = await supabase.functions.invoke("port-news", {
        body: { port: port.name, country: port.country, region: port.region },
      });
      if (error) throw error;
      setAiItems(Array.isArray(data?.items) ? data.items : []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAiItems(null);
    if (port) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [port?.name]);

  const filtered = port
    ? aiItems ?? []
    : region
      ? regionNews.filter((n) => n.region === region)
      : regionNews;

  return (
    <div className="glass-panel p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">
            {port ? `${port.name} Intel` : "Regional Intel Feed"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {port && (
            <button
              onClick={load}
              disabled={loading}
              className="text-primary hover:text-primary/80 transition-colors disabled:opacity-40"
              aria-label="Refresh"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            </button>
          )}
          <span className="text-[10px] font-mono text-muted-foreground">
            {port ? "AI LIVE" : "LIVE"}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {loading && !aiItems && (
          <div className="flex items-center justify-center py-10 text-xs text-muted-foreground gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Fetching latest bulletins…
          </div>
        )}
        {err && !loading && (
          <p className="text-xs text-risk-high text-center py-8">{err}</p>
        )}
        {filtered.map((n, i) => {
          const Icon = iconMap[n.severity];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`p-3 rounded-lg border ${colorMap[n.severity]}`}
            >
              <div className="flex items-start gap-2">
                <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{n.headline}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.summary}</p>
                  <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono text-muted-foreground">
                    <span>{("region" in n ? (n as { region: string }).region : port?.region) ?? ""} • {n.source}</span>
                    <span>{n.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        {!loading && filtered.length === 0 && !err && (
          <p className="text-xs text-muted-foreground text-center py-8">No updates available.</p>
        )}
      </div>
    </div>
  );
};

export default RegionNewsPanel;
