"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

export function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-[480px] max-h-[85vh] rounded-t-lg sm:rounded-lg bg-white dark:bg-[#0a0a0a] border border-border dark:border-[#222222] overflow-hidden flex flex-col shadow-level-5"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body
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
      <div className="flex items-center justify-between p-5 pb-3 border-b border-border dark:border-[#222222] shrink-0">
        <h3 className="text-lg font-semibold tracking-[-0.04em] text-foreground">{title}</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-[#fafafa] dark:hover:bg-[#121212] rounded-md transition-colors text-slate-500 hover:text-foreground"
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

