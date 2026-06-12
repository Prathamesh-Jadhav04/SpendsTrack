"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SettingRow({
  icon,
  title,
  detail,
  action,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  action: React.ReactNode;
  onClick?: () => void;
}) {
  const isClickable = !!onClick;
  
  return (
    <motion.div
      layout="position"
      whileHover={isClickable ? { scale: 1.01, x: 2 } : undefined}
      whileTap={isClickable ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={cn(
        "w-full flex min-h-[4.5rem] items-center justify-between gap-3 px-3 py-3 transition-all duration-200",
        isClickable ? "cursor-pointer hover:bg-muted/40 dark:hover:bg-white/[0.02] active:bg-muted/60" : "",
        "first:rounded-t-2xl last:rounded-b-2xl"
      )}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="grid size-10 place-items-center rounded-xl bg-muted/60 text-primary dark:bg-white/5 transition-colors duration-200 shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-foreground">{title}</p>
          <p className="truncate text-xs font-semibold text-muted-foreground/80 dark:text-muted-foreground/60 mt-0.5">
            {detail}
          </p>
        </div>
      </div>
      <div className="shrink-0 flex items-center">{action}</div>
    </motion.div>
  );
}

