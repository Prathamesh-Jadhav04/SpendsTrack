"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, Wallet, FileText } from "lucide-react";

import { PhoneFrame, ScreenHeader, ProgressBar, EmptyState } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { expenseCategories } from "@/components/constants";
import type { Transaction, Screen } from "@/components/types";
import { useCurrency, useTranslation } from "@/components/hooks";
import { cn } from "@/lib/utils";

interface ReportsScreenProps {
  onNavigate: (screen: Screen) => void;
  transactions: Transaction[];
}

type PeriodType = "week" | "month" | "quarter" | "year" | "all";

export function ReportsScreen({ onNavigate, transactions }: ReportsScreenProps) {
  const { symbol, formatRaw } = useCurrency();
  const { t } = useTranslation();
  const [period, setPeriod] = useState<PeriodType>("month");
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));

  const getDateRange = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case "week": {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return weekAgo;
      }
      case "month": {
        const [year, month] = selectedMonth.split("-").map(Number);
        return new Date(year, month - 1, 1);
      }
      case "quarter": {
        const quarterAgo = new Date(today);
        quarterAgo.setMonth(quarterAgo.getMonth() - 3);
        return quarterAgo;
      }
      case "year": {
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return yearAgo;
      }
      default:
        return null;
    }
  }, [period, selectedMonth]);

  const filteredTransactions = useMemo(() => {
    if (!getDateRange) return transactions;
    return transactions.filter(t => t.date && new Date(t.date) >= getDateRange);
  }, [transactions, getDateRange]);

  const totalIncome = useMemo(() => 
    filteredTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const totalExpense = useMemo(() => 
    filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  const categoryBreakdown = useMemo(() => {
    const breakdown = filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(breakdown)
      .map(([cat, amount]) => {
        const catInfo = expenseCategories.find(c => c.value === cat);
        return {
          name: catInfo?.label || cat,
          amount,
          color: catInfo?.color || "#7766e8",
          percent: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions, totalExpense]);

  const topExpense = useMemo(() => 
    filteredTransactions
      .filter(t => t.type === "expense")
      .sort((a, b) => b.amount - a.amount)[0],
    [filteredTransactions]
  );

  const avgDailySpend = useMemo(() => {
    if (!getDateRange || filteredTransactions.length === 0) return 0;
    const days = Math.max(1, Math.ceil((Date.now() - getDateRange.getTime()) / (1000 * 60 * 60 * 24)));
    return Math.round(totalExpense / days);
  }, [filteredTransactions, totalExpense, getDateRange]);

  const periodLabel = period === "week" ? "This Week" : 
                      period === "month" ? "This Month" :
                      period === "quarter" ? "Last 3 Months" :
                      period === "year" ? "This Year" : "All Time";

  return (
    <PhoneFrame label="Reports screen" className="pb-28 lg:pb-0">
      <div className="flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll lg:h-auto lg:overflow-visible">
        <ScreenHeader
          eyebrow="Analytics"
          title="Reports"
          action={
            <Button size="sm" variant="outline" onClick={() => onNavigate("analytics")} className="rounded-full">
              <ArrowLeft className="size-4 mr-1" />
              Back
            </Button>
          }
        />

        <div className="pb-4 space-y-4">
          <div className="flex gap-2">
            <Select value={period} onValueChange={(v: PeriodType) => setPeriod(v)}>
              <SelectTrigger className="flex-1 h-9 text-xs">
                <Calendar className="size-3.5 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            {period === "month" && (
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="flex-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const val = d.toISOString().slice(0, 7);
                    return <SelectItem key={val} value={val}>{d.toLocaleString("en-IN", { month: "short", year: "numeric" })}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-ds-canvas to-income-soft/10 p-4 dark:from-ds-canvas-soft-2 dark:to-income-soft/5"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2">
                <div className="grid size-9 place-items-center rounded-xl bg-income-soft text-income">
                  <TrendingUp className="size-5" />
                </div>
              </div>
              <p className="mt-3 text-xs font-semibold text-income/70">{t("income")}</p>
              <p className="text-lg font-extrabold text-income dark:text-white">
                {symbol}{formatRaw(totalIncome)}
              </p>
            </motion.div>
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-ds-canvas to-expense-soft/10 p-4 dark:from-ds-canvas-soft-2 dark:to-expense-soft/5"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2">
                <div className="grid size-9 place-items-center rounded-xl bg-expense-soft text-expense">
                  <TrendingDown className="size-5" />
                </div>
              </div>
              <p className="mt-3 text-xs font-semibold text-expense/70">{t("expenses")}</p>
              <p className="text-lg font-extrabold text-expense dark:text-white">
                {symbol}{formatRaw(totalExpense)}
              </p>
            </motion.div>
          </div>

          <motion.div
            className={cn(
              "rounded-2xl p-4 border border-border/50 dark:border-white/5",
              netSavings >= 0
                ? "bg-gradient-to-br from-ds-canvas to-savings-soft/10 dark:from-ds-canvas-soft-2 dark:to-savings-soft/5"
                : "bg-gradient-to-br from-ds-canvas to-expense-soft/10 dark:from-ds-canvas-soft-2 dark:to-expense-soft/5"
            )}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn("text-xs font-semibold", netSavings >= 0 ? "text-savings" : "text-expense")}>Net Savings</p>
                <p className={cn("text-2xl font-extrabold", netSavings >= 0 ? "text-savings dark:text-white" : "text-expense dark:text-white")}>
                  {symbol}{formatRaw(netSavings)}
                </p>
              </div>
              <div className="text-right">
                <p className={cn("text-xs font-medium opacity-70", netSavings >= 0 ? "text-savings" : "text-expense")}>
                  {savingsRate}% savings rate
                </p>
                <p className={cn("text-xs font-medium opacity-70", netSavings >= 0 ? "text-savings" : "text-expense")}>
                  {filteredTransactions.length} transactions
                </p>
              </div>
            </div>
          </motion.div>

          {filteredTransactions.length === 0 ? (
            <EmptyState
              icon={<FileText className="size-7 text-primary" />}
              title="No data for this period"
              message="Try selecting a different time period or add some transactions."
              action={
                <Button
                  onClick={() => onNavigate("add-expense")}
                  size="sm"
                  className="rounded-xl bg-expense hover:bg-expense/90"
                >
                  <TrendingDown className="mr-1.5 size-3.5" />
                  Add Expense
                </Button>
              }
            />
          ) : (
            <>
              <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
                <CardContent className="p-5">
                  <h4 className="font-extrabold mb-4 dark:text-white">Spending by Category</h4>
                  <div className="space-y-4">
                    {categoryBreakdown.map((cat) => (
                      <div key={cat.name}>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="font-semibold text-sm dark:text-white">{cat.name}</span>
                          </div>
                          <span className="font-bold text-sm dark:text-white/70">{symbol}{formatRaw(cat.amount)}</span>
                        </div>
                        <ProgressBar value={cat.percent} compact />
                      </div>
                    ))}
                    {categoryBreakdown.length === 0 && (
                      <p className="text-muted-foreground text-sm text-center py-4">No expense data</p>
                    )}
                  </div>
                </CardContent>
              </Card>

          <div className="grid grid-cols-2 gap-3 lg:gap-4 mt-4">
                <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5">
                  <CardContent className="p-4">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase">Avg Daily Spend</p>
                    <p className="text-lg font-extrabold dark:text-white">{symbol}{formatRaw(avgDailySpend)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5">
                  <CardContent className="p-4">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase">Top Expense</p>
                    <p className="text-lg font-extrabold dark:text-white">
                      {topExpense ? `${symbol}${formatRaw(topExpense.amount)}` : `${symbol}0`}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
