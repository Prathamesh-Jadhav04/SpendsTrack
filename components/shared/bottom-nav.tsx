"use client";

import {
  Home,
  ReceiptText,
  Plus,
  BarChart3,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Screen } from "@/components/types";

const navItems = [
  { label: "Home", icon: Home },
  { label: "History", icon: ReceiptText },
  { label: "Add", icon: Plus },
  { label: "Insights", icon: BarChart3 },
  { label: "Profile", icon: UserRound },
];

const screenMap: Record<string, Screen> = {
  Home: "dashboard",
  History: "transactions",
  Add: "add-expense",
  Insights: "analytics",
  Profile: "profile",
};

export function BottomNav({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <nav
      className="absolute inset-x-6 bottom-5 grid grid-cols-5 gap-1 rounded-[1.55rem] border border-border/80 bg-white/90 p-2.5 shadow-fintech backdrop-blur-xl dark:border-white/5 dark:bg-black/70 dark:shadow-2xl dark:shadow-black/50"
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            type="button"
            key={item.label}
            onClick={() => onNavigate(screenMap[item.label] || "dashboard")}
            className={cn(
              "grid min-w-0 justify-items-center gap-1 rounded-2xl px-1 py-2 text-[0.67rem] font-extrabold text-muted-foreground transition-all hover:bg-muted",
              active === item.label && "bg-secondary text-primary"
            )}
            aria-current={active === item.label ? "page" : undefined}
          >
            <Icon className="size-5" strokeWidth={2.2} />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
