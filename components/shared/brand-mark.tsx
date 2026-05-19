"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-[1.7rem] bg-gradient-to-br from-[#10b889] to-[#0b6c59] shadow-[0_18px_34px_rgb(15_143_114_/_0.28)]",
        compact ? "size-[52px] rounded-2xl" : "size-24"
      )}
    >
      <Image
        src="/spendstracks-logo.svg"
        alt="SpendsTracks logo"
        width={compact ? 42 : 72}
        height={compact ? 42 : 72}
        priority
      />
    </div>
  );
}
