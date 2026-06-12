"use client";

import { motion, AnimatePresence } from "framer-motion";

export function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-[480px] max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white dark:bg-card overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function ModalContent({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col max-h-[85vh]">
      <div className="flex items-center justify-between p-5 pb-3 border-b border-border/50 dark:border-white/10 shrink-0">
        <h3 className="text-lg font-extrabold">{title}</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-full transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>
      <div className="p-5 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
