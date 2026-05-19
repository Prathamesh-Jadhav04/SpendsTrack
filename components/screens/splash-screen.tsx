"use client";

import { motion } from "framer-motion";
import { PhoneFrame, BrandMark } from "@/components/shared";

export function SplashScreen() {
  return (
    <PhoneFrame
      label="Splash screen"
      className="items-center justify-center bg-gradient-to-br from-white via-[#edf8f1] to-[#f8f1e6] text-center dark:from-[#0a0a0a] dark:via-[#0f1412] dark:to-[#0a0a0a]"
    >
      <motion.div
        className="grid justify-items-center gap-6"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <BrandMark />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-normal bg-gradient-to-r from-primary to-[#0d9973] bg-clip-text text-transparent">
            SpendsTracks
          </h1>
          <p className="text-base font-semibold text-muted-foreground">
            Money clarity, made simple.
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
    </PhoneFrame>
  );
}
