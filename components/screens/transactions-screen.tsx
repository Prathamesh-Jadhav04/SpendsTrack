"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingDown, TrendingUp, ReceiptText, ArrowUpDown, Calendar, Filter, X, ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type SortOption = "newest" | "oldest" | "highest" | "lowest";
type DateFilter = "all" | "today" | "week" | "month";

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
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [focusedSearch, setFocusedSearch] = useState(false);

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

  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    switch (dateFilter) {
      case "today":
        return today;
      case "week":
        return weekAgo;
      case "month":
        return monthAgo;
      default:
        return null;
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filter !== "all") {
      filtered = filtered.filter((t) =>
        filter === "expense" ? t.type === "expense" : t.type === "income"
      );
    }

    const dateRange = getDateRange();
    if (dateRange) {
      filtered = filtered.filter((t) => {
        if (!t.date) return false;
        return new Date(t.date) >= dateRange;
      });
    }

    if (localQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(localQuery.toLowerCase()) ||
          t.detail.toLowerCase().includes(localQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => {
          if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
          return 0;
        });
        break;
      case "oldest":
        filtered.sort((a, b) => {
          if (a.date && b.date) return new Date(a.date).getTime() - new Date(b.date).getTime();
          return 0;
        });
        break;
      case "highest":
        filtered.sort((a, b) => {
          const aAmt = parseInt(a.amount.replace(/[^0-9]/g, ""));
          const bAmt = parseInt(b.amount.replace(/[^0-9]/g, ""));
          return bAmt - aAmt;
        });
        break;
      case "lowest":
        filtered.sort((a, b) => {
          const aAmt = parseInt(a.amount.replace(/[^0-9]/g, ""));
          const bAmt = parseInt(b.amount.replace(/[^0-9]/g, ""));
          return aAmt - bAmt;
        });
        break;
    }

    return filtered;
  };

  const filteredTransactions = applyFilters();

  const totalSpent = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);
  const totalEarned = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);

  const activeFiltersCount = (dateFilter !== "all" ? 1 : 0) + (sortBy !== "newest" ? 1 : 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <PhoneFrame label="Transactions screen" className="pb-28">
      <div className="h-full flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll">
        <ScreenHeader eyebrow="Activity" title="Transactions" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className={`relative mb-3 transition-all duration-200 ${focusedSearch ? "scale-[1.02]" : ""}`}>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="bg-white pl-11 shadow-soft dark:bg-card dark:border dark:border-white/10 input-glow transition-all"
              placeholder="Search transactions"
              type="search"
              aria-label="Search transactions"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onFocus={() => setFocusedSearch(true)}
              onBlur={() => setFocusedSearch(false)}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="no-scrollbar mb-3 flex gap-2 overflow-x-auto"
        >
          {filters.map((f) => (
            <motion.button
              key={f.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`shrink-0 rounded-full px-4 h-9 text-sm font-semibold transition-all ${
                filter === f.value
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              onClick={() => onFilterChange(f.value)}
            >
              {f.label}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`shrink-0 rounded-full px-3 h-9 text-sm font-semibold flex items-center gap-1.5 transition-all ${
              showFilters
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border/50"
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="size-3.5" />
            {activeFiltersCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full"
              >
                {activeFiltersCount}
              </motion.span>
            )}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mb-3 overflow-hidden"
            >
              <div className="bg-muted/30 dark:bg-muted/20 rounded-2xl">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    onClick={() => setShowFilters(false)}
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </button>
                  <span className="text-sm font-bold">Filters</span>
                  <button
                    type="button"
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="p-3 space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Date</label>
                      <Select value={dateFilter} onValueChange={(v: DateFilter) => setDateFilter(v)}>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Sort By</label>
                      <Select value={sortBy} onValueChange={(v: SortOption) => setSortBy(v)}>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="highest">Highest Amount</SelectItem>
                          <SelectItem value="lowest">Lowest Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {activeFiltersCount > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-8 text-xs"
                      onClick={() => {
                        setDateFilter("all");
                        setSortBy("newest");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-5 grid grid-cols-2 gap-3"
        >
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
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
            <CardContent className="grid gap-3 p-4">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, idx) => (
                  <motion.div key={`${transaction.id}-${idx}`} variants={itemVariants}>
                    <TransactionRow
                      transaction={transaction}
                      onClick={() => onTransactionClick?.(transaction)}
                    />
                  </motion.div>
                ))
              ) : (
                <EmptyState
                  icon={<ReceiptText className="size-7 text-primary" />}
                  title={localQuery || activeFiltersCount > 0 ? "No results found" : "No transactions yet"}
                  message={
                    localQuery
                      ? `No transactions matching "${localQuery}"`
                      : activeFiltersCount > 0
                      ? "Try adjusting your filters"
                      : "Start tracking your expenses by adding your first transaction!"
                  }
                  action={
                    !localQuery && activeFiltersCount === 0 && (
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
        </motion.div>

        {filteredTransactions.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-[10px] text-muted-foreground mt-2"
          >
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </motion.p>
        )}
      </div>

      <BottomNav active="History" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}
