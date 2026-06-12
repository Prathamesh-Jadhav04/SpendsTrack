"use client";

import {
  Home,
  ReceiptText,
  Plus,
  BarChart3,
  UserRound,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Screen } from "@/components/types";
import { APP_VERSION } from "@/components/constants";
import { useTranslation } from "@/components/hooks";

const navItems = [
  { label: "Home", icon: Home },
  { label: "History", icon: ReceiptText },
  { label: "Add", icon: Plus },
  { label: "Insights", icon: BarChart3 },
  { label: "Profile", icon: UserRound },
];

const desktopNavItems = [
  { label: "Home", icon: Home },
  { label: "History", icon: ReceiptText },
  { label: "Add", icon: Plus },
  { label: "Insights", icon: BarChart3 },
  { label: "Ask AI", icon: Sparkles },
  { label: "Profile", icon: UserRound },
];

const screenMap: Record<string, Screen> = {
  Home: "dashboard",
  History: "transactions",
  Add: "add-expense",
  Insights: "analytics",
  "Ask AI": "ask-ai",
  Profile: "profile",
};

export function BottomNav({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: (screen: Screen) => void;
}) {
  const { t } = useTranslation();
  return (
    <>
      <nav
        className="fixed inset-x-4 bottom-4 z-40 grid grid-cols-5 gap-1 rounded-[1.55rem] border border-border/80 bg-white/90 p-2.5 shadow-fintech backdrop-blur-xl dark:border-white/5 dark:bg-black/70 dark:shadow-2xl dark:shadow-black/50 lg:hidden"
        role="navigation"
        aria-label="Main navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.label || (item.label === "Insights" && active === "Ask AI");
          return (
            <button
              type="button"
              key={item.label}
              onClick={() => onNavigate(screenMap[item.label] || "dashboard")}
              className={cn(
                "grid min-w-[44px] min-h-[44px] justify-items-center gap-0.5 rounded-2xl px-1 py-2 text-[0.67rem] font-extrabold text-muted-foreground transition-all hover:bg-muted cursor-pointer",
                isActive && "bg-secondary text-primary"
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
            >
              <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="truncate">{t(item.label.toLowerCase())}</span>
            </button>
          );
        })}
      </nav>
 
      <nav
        className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-64 lg:border-r lg:border-border/30 lg:bg-white/90 lg:dark:bg-[#0a0a0a]/95 lg:backdrop-blur-xl lg:z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="p-6 pb-4 border-b border-border/20">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-extrabold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-foreground leading-tight">SpendsTracks</h1>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Finance Tracker</p>
            </div>
          </div>
        </div>
 
        <div className="flex-1 flex flex-col gap-1 p-4">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigate(screenMap[item.label] || "dashboard")}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
                <span>{t(item.label.toLowerCase())}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-border/20">
          <p className="text-[10px] text-muted-foreground/50 text-center">
            SpendsTracks v{APP_VERSION}
          </p>
        </div>
      </nav>
    </>
  );
}
