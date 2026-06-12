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
  const isIncome = transaction.type === "income";

  return (
    <motion.div
      className="w-full grid grid-cols-[2.85rem_1fr_auto] items-center gap-3 cursor-pointer"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          "grid size-11 place-items-center rounded-2xl text-sm font-extrabold",
          transaction.tone === "income" && "bg-income-soft text-income",
          transaction.tone === "expense" && "bg-expense-soft text-expense",
          transaction.tone === "travel" && "bg-sky-500/10 text-sky-600 dark:text-sky-400",
          transaction.tone === "bills" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          transaction.tone === "food" && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
          transaction.tone === "shopping" && "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
          transaction.tone === "transport" && "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
          transaction.tone === "entertainment" && "bg-purple-500/10 text-purple-600 dark:text-purple-400",
          transaction.tone === "health" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          transaction.tone === "education" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
          transaction.tone === "groceries" && "bg-orange-500/10 text-orange-600 dark:text-orange-400"
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
          "text-sm font-extrabold tabular-money text-right",
          isIncome ? "text-income" : "text-expense"
        )}
      >
        {isIncome ? "+" : "-"}₹{transaction.amount.toLocaleString("en-IN")}
      </p>
    </motion.div>
  );
}
