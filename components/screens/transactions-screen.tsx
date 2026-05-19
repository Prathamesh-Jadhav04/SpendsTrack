"use client";

import { useState, useEffect } from "react";
import { Search, TrendingDown, TrendingUp, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PhoneFrame, ScreenHeader, BottomNav, TransactionRow, EmptyState, StatCard } from "@/components/shared";
import type { Screen, Transaction, FilterType } from "@/components/types";

interface TransactionsScreenProps {
  onNavigate: (screen: Screen) => void;
  transactions: Transaction[];
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onTransactionClick?: (transaction: Transaction) => void;
}

export function TransactionsScreen({
  onNavigate,
  transactions,
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onTransactionClick,
}: TransactionsScreenProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery, onSearchChange]);

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Expense", value: "expense" },
    { label: "Income", value: "income" },
  ];

  const totalSpent = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);
  const totalEarned = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);

  return (
    <PhoneFrame label="Transactions screen" className="pb-28">
      <div className="h-full flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll">
        <ScreenHeader eyebrow="Activity" title="Transactions" />

        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="bg-white pl-11 shadow-soft dark:bg-card dark:border dark:border-white/10"
            placeholder="Search transactions"
            type="search"
            aria-label="Search transactions"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </div>

        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={filter === f.value ? "default" : "secondary"}
              className="shrink-0 rounded-full px-4"
              onClick={() => onFilterChange(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <StatCard
            icon={<TrendingDown className="size-5" />}
            label="Spent"
            value={`₹${totalSpent.toLocaleString("en-IN")}`}
            tone="expense"
          />
          <StatCard
            icon={<TrendingUp className="size-5" />}
            label="Earned"
            value={`₹${totalEarned.toLocaleString("en-IN")}`}
            tone="income"
          />
        </div>

        <Card className="flex-1 bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
          <CardContent className="grid gap-3 p-4">
            {transactions.length > 0 ? (
              transactions.map((transaction, idx) => (
                <TransactionRow
                  key={`${transaction.title}-${idx}`}
                  transaction={transaction}
                  onClick={() => onTransactionClick?.(transaction)}
                />
              ))
            ) : (
              <EmptyState
                icon={<ReceiptText className="size-7 text-primary" />}
                title={searchQuery ? "No results found" : "No transactions yet"}
                message={
                  searchQuery
                    ? `No transactions matching "${searchQuery}"`
                    : "Start tracking your expenses by adding your first transaction!"
                }
                action={
                  !searchQuery && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => onNavigate("add-expense")}
                        size="sm"
                        className="rounded-xl bg-gradient-to-r from-[#ff6b5f] to-[#ff995c]"
                      >
                        <TrendingDown className="mr-1.5 size-3.5" />
                        Add Expense
                      </Button>
                    </div>
                  )
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNav active="History" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}
