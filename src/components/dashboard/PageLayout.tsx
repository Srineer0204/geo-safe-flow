import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const PageLayout = ({ children, title, subtitle }: PageLayoutProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border/50 flex flex-wrap items-center justify-between gap-3 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate">{title}</h1>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 font-mono truncate">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-risk-low animate-pulse-glow" />
              <span className="text-xs text-muted-foreground">{t("header.systemsOnline")}</span>
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-6 space-y-5">{children}</div>
      </main>
    </div>
  );
};

export default PageLayout;
