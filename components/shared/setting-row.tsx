"use client";

import { motion } from "framer-motion";

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
  const Wrapper = onClick ? motion.button : "div";
  const wrapperProps = onClick
    ? {
        onClick,
        whileHover: { scale: 1.02 } as const,
        whileTap: { scale: 0.98 } as const,
        className:
          "w-full flex min-h-[4.7rem] items-center justify-between gap-3 px-3 py-3 first:pt-2 last:pb-2",
      }
    : {};

  return (
    <Wrapper {...wrapperProps}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-10 place-items-center rounded-2xl bg-muted text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold">{title}</p>
          <p className="truncate text-xs font-semibold text-muted-foreground">
            {detail}
          </p>
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </Wrapper>
  );
}
