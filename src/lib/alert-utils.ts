import type { Tables } from "@/integrations/supabase/types";

export type AlertRow = Tables<"alerts">;
export type AlertType = "danger" | "warning" | "info";

export const alertType = (severity: string): AlertType => {
  if (severity === "critical" || severity === "high") return "danger";
  if (severity === "medium") return "warning";
  return "info";
};

export const relativeAlertTime = (timestamp: string) => {
  const elapsedSeconds = Math.round((Date.now() - new Date(timestamp).getTime()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  const unit = units.find(([, seconds]) => Math.abs(elapsedSeconds) >= seconds) ?? ["second", 1] as const;
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    -Math.round(elapsedSeconds / unit[1]),
    unit[0],
  );
};

export const alertLocation = (alert: AlertRow) => alert.affected_region ?? "Location unavailable";