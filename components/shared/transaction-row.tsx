"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/components/types";

export function TransactionRow({
  transaction,
  onClick,
}: {
  transaction: Transaction;
  onClick?: () => void;
}) {
  const isIncome = transaction.amount.startsWith("+");

  return (
    <motion.div
      className="grid grid-cols-[2.85rem_1fr_auto] items-center gap-3 cursor-pointer"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          "grid size-11 place-items-center rounded-2xl text-sm font-extrabold",
          transaction.tone === "income" && "bg-secondary text-primary",
          transaction.tone === "expense" && "bg-[#fff0ee] text-[#b7473d]",
          transaction.tone === "travel" && "bg-[#edf4ff] text-[#326ab5]",
          transaction.tone === "bills" && "bg-[#fff7df] text-[#986a00]",
          transaction.tone === "food" && "bg-[#fff0ee] text-[#c24940]",
          transaction.tone === "shopping" && "bg-[#fef3c7] text-[#d97706]",
          transaction.tone === "transport" && "bg-[#e0e7ff] text-[#4f46e5]",
          transaction.tone === "entertainment" && "bg-[#f3e8ff] text-[#9333ea]",
          transaction.tone === "health" && "bg-[#dcfce7] text-[#16a34a]",
          transaction.tone === "education" && "bg-[#dbeafe] text-[#2563eb]",
          transaction.tone === "groceries" && "bg-[#fef9c3] text-[#ca8a04]"
        )}
      >
        {transaction.icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-extrabold">{transaction.title}</p>
        <p className="truncate text-xs font-semibold text-muted-foreground">
          {transaction.detail}
        </p>
      </div>
      <p
        className={cn(
          "text-sm font-extrabold",
          isIncome ? "text-primary" : "text-[#c24940]"
        )}
      >
        {transaction.amount}
      </p>
    </motion.div>
  );
}
