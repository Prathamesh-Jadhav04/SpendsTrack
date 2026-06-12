"use client";

import { cn } from "@/lib/utils";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const iconSize = compact ? 28 : 52;
  return (
    <div
      className={cn(
        "grid place-items-center bg-black dark:bg-white text-white dark:text-black border border-border/10 shadow-level-2 transition-colors duration-200",
        compact ? "size-[48px] rounded-sm" : "size-20 rounded-md"
      )}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-current"
      >
        {/* Interlocking S Shape */}
        <path
          d="M30 58C30 62.4183 33.5817 66 38 66H58C62.4183 66 66 62.4183 66 58V50C66 45.5817 62.4183 42 58 42H38C33.5817 42 30 38.4183 30 34V26C30 21.5817 33.5817 18 38 18H58C62.4183 18 66 21.5817 66 26"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Upward Trend Indicator Line in neon cyan */}
        <path
          d="M48 42L72 18"
          stroke="#50e3c2"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 18H72V30"
          stroke="#50e3c2"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
