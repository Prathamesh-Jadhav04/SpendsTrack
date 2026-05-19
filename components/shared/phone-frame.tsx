"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { screenAnimation } from "@/components/constants";

export function PhoneFrame({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <motion.section
      aria-label={label}
      className="mx-auto w-full max-w-[480px] rounded-[2.35rem] border-2 border-white/10 bg-black/80 p-3 shadow-2xl shadow-black/50 backdrop-blur dark:border-white/5 dark:bg-black/60"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      variants={screenAnimation}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div
        className={cn(
          "relative flex h-[850px] flex-col overflow-hidden rounded-[1.9rem] bg-gradient-to-b from-white to-[#f8faf4] p-6 dark:from-[#0a0a0a] dark:to-[#050505]",
          className
        )}
      >
        {children}
      </div>
    </motion.section>
  );
}
