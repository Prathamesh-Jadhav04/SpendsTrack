"use client";

import { motion } from "framer-motion";
import { PhoneFrame, BrandMark } from "@/components/shared";

export function SplashScreen() {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-ds-canvas-soft text-center py-12 relative">
      <motion.div
        className="grid justify-items-center gap-6"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <BrandMark />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080] bg-clip-text text-transparent">
            SpendsTracks.
          </h1>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest font-mono">
            Money clarity, made simple
          </p>
        </div>
        <motion.div
          className="flex gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
