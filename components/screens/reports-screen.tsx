"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, Wallet, FileText } from "lucide-react";

import { PhoneFrame, ScreenHeader, BottomNav, ProgressBar, EmptyState } from "@/components/shared";
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

interface ReportsScreenProps {
  onNavigate: (screen: Screen) => void;
  transactions: Transaction[];
}

type PeriodType = "week" | "month" | "quarter" | "year" | "all";

export function ReportsScreen({ onNavigate, transactions }: ReportsScreenProps) {
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
      .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0),
    [filteredTransactions]
  );

  const totalExpense = useMemo(() => 
    filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0),
    [filteredTransactions]
  );

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  const categoryBreakdown = useMemo(() => {
    const breakdown = filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + parseInt(t.amount.replace(/[^0-9]/g, ""));
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
      .sort((a, b) => parseInt(b.amount.replace(/[^0-9]/g, "")) - parseInt(a.amount.replace(/[^0-9]/g, "")))[0],
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
    <PhoneFrame label="Reports screen" className="pb-28">
      <div className="h-full flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll">
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

        <div className="pb-4 space-y-3">
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

          <div className="grid grid-cols-2 gap-3">
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] p-3 dark:from-[#0f1a15] dark:to-[#0a1210]"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-xl bg-white/50 dark:bg-white/5">
                  <TrendingUp className="size-4 text-[#16a34a]" />
                </div>
              </div>
              <p className="mt-2 text-xs font-semibold text-[#16a34a]/70">Income</p>
              <p className="text-lg font-extrabold text-[#16a34a] dark:text-white">
                ₹{totalIncome.toLocaleString("en-IN")}
              </p>
            </motion.div>
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-[#fee2e2] to-[#fecaca] p-3 dark:from-[#1a0f0e] dark:to-[#100a09]"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-xl bg-white/50 dark:bg-white/5">
                  <TrendingDown className="size-4 text-[#dc2626]" />
                </div>
              </div>
              <p className="mt-2 text-xs font-semibold text-[#dc2626]/70">Expense</p>
              <p className="text-lg font-extrabold text-[#dc2626] dark:text-white">
                ₹{totalExpense.toLocaleString("en-IN")}
              </p>
            </motion.div>
          </div>

          <motion.div
            className={`rounded-2xl p-4 ${netSavings >= 0 ? "bg-gradient-to-br from-[#e0e7ff] to-[#c7d2fe] dark:from-[#1e1b4b] dark:to-[#0f0a2a]" : "bg-gradient-to-br from-[#fee2e2] to-[#fecaca] dark:from-[#1a0f0e] dark:to-[#100a09]"}`}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-semibold ${netSavings >= 0 ? "text-[#4f46e5]/70 dark:text-[#818cf8]/70" : "text-[#dc2626]/70"}`}>Net Savings</p>
                <p className={`text-2xl font-extrabold ${netSavings >= 0 ? "text-[#4f46e5] dark:text-white" : "text-[#dc2626] dark:text-white"}`}>
                  ₹{netSavings.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-medium ${netSavings >= 0 ? "text-[#4f46e5]/70 dark:text-white/50" : "text-[#dc2626]/70"}`}>
                  {savingsRate}% savings rate
                </p>
                <p className={`text-xs font-medium ${netSavings >= 0 ? "text-[#4f46e5]/70 dark:text-white/50" : "text-[#dc2626]/70"}`}>
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
                  className="rounded-xl bg-gradient-to-r from-[#ff6b5f] to-[#ff995c]"
                >
                  <TrendingDown className="mr-1.5 size-3.5" />
                  Add Expense
                </Button>
              }
            />
          ) : (
            <>
              <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
                <CardContent className="p-4">
                  <h4 className="font-extrabold mb-3 dark:text-white">Spending by Category</h4>
                  <div className="space-y-3">
                    {categoryBreakdown.map((cat) => (
                      <div key={cat.name}>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="font-semibold text-sm dark:text-white">{cat.name}</span>
                          </div>
                          <span className="font-bold text-sm dark:text-white/70">₹{cat.amount.toLocaleString("en-IN")}</span>
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

              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5">
                  <CardContent className="p-3">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase">Avg Daily Spend</p>
                    <p className="text-lg font-extrabold dark:text-white">₹{avgDailySpend.toLocaleString("en-IN")}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5">
                  <CardContent className="p-3">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase">Top Expense</p>
                    <p className="text-lg font-extrabold dark:text-white">
                      {topExpense ? `₹${parseInt(topExpense.amount.replace(/[^0-9]/g, "")).toLocaleString("en-IN")}` : "₹0"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>

      <BottomNav active="Insights" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}
