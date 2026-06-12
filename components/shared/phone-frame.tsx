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
      className="mx-auto w-full lg:max-w-none lg:mx-0 lg:w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={screenAnimation}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div
        className={cn(
          "relative flex min-h-screen flex-col overflow-hidden bg-background p-4 dark:bg-background pb-32",
          "lg:min-h-0 lg:rounded-none lg:bg-transparent lg:dark:bg-transparent lg:p-0 lg:pb-0",
          className
        )}
      >
        {children}
      </div>
    </motion.section>
  );
}
