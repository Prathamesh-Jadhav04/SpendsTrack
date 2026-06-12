"use client";

import { useState, useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { BarChart3, Target, RefreshCcw, FileBarChart, Tags, TrendingDown, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PhoneFrame, ScreenHeader, EmptyState, ProgressBar } from "@/components/shared";
import type { Screen, Transaction } from "@/components/types";
import { useCurrency, useTranslation } from "@/components/hooks";
import { expenseCategories } from "@/components/constants";

interface AnalyticsScreenProps {
  onNavigate: (screen: Screen) => void;
  transactions: Transaction[];
  monthlyBudget?: number;
  categoryBudgets: Record<string, number>;
  onExport?: () => void;
}

type TimeRange = "week" | "month" | "quarter" | "year" | "all";

export function AnalyticsScreen({ onNavigate, transactions, monthlyBudget = 160000, categoryBudgets, onExport }: AnalyticsScreenProps) {
  const { symbol, formatRaw } = useCurrency();
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  const getDateRange = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (timeRange) {
      case "week": {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return weekAgo;
      }
      case "month": {
        return new Date(now.getFullYear(), now.getMonth(), 1);
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
  }, [timeRange]);

  const filteredTransactions = useMemo(() => {
    if (!getDateRange) return transactions;
    return transactions.filter(t => t.date && new Date(t.date) >= getDateRange);
  }, [transactions, getDateRange]);

  const totalExpenses = useMemo(() =>
    filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const totalIncome = useMemo(() =>
    filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const budgetUsed = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  const categoryData = useMemo(() => {
    const data = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(data)
      .map(([name, value]) => {
        const cat = expenseCategories.find((c) => c.value === name);
        return { key: name, name: cat?.label || name, value, color: cat?.color || "#7766e8" };
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const monthlyTrend = useMemo(() => {
    const months: Record<string, { income: number; expense: number; label: string }> = {};

    filteredTransactions.forEach(t => {
      if (!t.date) return;
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key]) {
        months[key] = { income: 0, expense: 0, label: d.toLocaleString("en-IN", { month: "short" }) };
      }
      if (t.type === "income") months[key].income += t.amount;
      else months[key].expense += t.amount;
    });

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, data]) => ({ ...data, month: data.label }));
  }, [filteredTransactions]);

  const topExpense = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === "expense");
    if (expenses.length === 0) return null;
    return expenses.reduce((max, t) => t.amount > max.amount ? t : max);
  }, [filteredTransactions]);

  const avgDailySpend = useMemo(() => {
    if (!getDateRange || filteredTransactions.length === 0) return 0;
    const days = Math.max(1, Math.ceil((Date.now() - getDateRange.getTime()) / (1000 * 60 * 60 * 24)));
    return Math.round(totalExpenses / days);
  }, [filteredTransactions, totalExpenses, getDateRange]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <PhoneFrame label="Analytics screen" className="pb-28 lg:pb-0">
      <div className="flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll lg:h-auto lg:overflow-visible">
        <ScreenHeader
          eyebrow="Insights"
          title="Analytics"
          action={
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={(v: TimeRange) => setTimeRange(v)}>
                <SelectTrigger className="h-8 w-auto text-xs px-2">
                  <Calendar className="size-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
              {onExport && (
                <Button size="sm" variant="outline" onClick={onExport} className="rounded-full">
                  Export
                </Button>
              )}
            </div>
          }
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 pb-4"
        >
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 lg:gap-4">
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-ds-canvas to-income-soft/10 p-3 dark:from-ds-canvas-soft-2 dark:to-income-soft/5 card-hover"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[10px] font-semibold text-income">{t("income")}</p>
              <p className="mt-1 text-lg font-extrabold text-income dark:text-white tabular-money">
                {symbol}{totalIncome >= 100000 && symbol === "₹" ? `${(totalIncome / 100000).toFixed(1)}L` : formatRaw(totalIncome)}
              </p>
              <p className="text-[10px] font-medium text-income/70">
                {filteredTransactions.filter((t) => t.type === "income").length} txns
              </p>
            </motion.div>
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-ds-canvas to-expense-soft/10 p-3 dark:from-ds-canvas-soft-2 dark:to-expense-soft/5 card-hover"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[10px] font-semibold text-expense">{t("expenses")}</p>
              <p className="mt-1 text-lg font-extrabold text-expense dark:text-white tabular-money">
                {symbol}{totalExpenses >= 100000 && symbol === "₹" ? `${(totalExpenses / 100000).toFixed(1)}L` : formatRaw(totalExpenses)}
              </p>
              <p className="text-[10px] font-medium text-expense/70">
                {filteredTransactions.filter((t) => t.type === "expense").length} txns
              </p>
            </motion.div>
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-ds-canvas to-savings-soft/10 p-3 dark:from-ds-canvas-soft-2 dark:to-savings-soft/5 card-hover"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[10px] font-semibold text-savings">Savings</p>
              <p className="mt-1 text-lg font-extrabold text-savings dark:text-white tabular-money">
                {symbol}{totalIncome - totalExpenses >= 100000 && symbol === "₹" ? `${((totalIncome - totalExpenses) / 100000).toFixed(1)}L` : formatRaw(totalIncome - totalExpenses)}
              </p>
              <p className="text-[10px] font-medium text-savings/70">
                {savingsRate}% rate
              </p>
            </motion.div>
          </motion.div>

          {filteredTransactions.length === 0 ? (
            <motion.div variants={itemVariants}>
              <EmptyState
                icon={<BarChart3 className="size-7 text-primary" />}
                title="No data to analyze"
                message="Add some transactions to see your spending insights and analytics!"
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
            </motion.div>
          ) : (
            <>
              {categoryData.length > 0 && (
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/10 to-secondary/20 dark:from-primary/5 dark:to-secondary/10 shadow-soft">
                    <CardContent className="p-4">
                      <p className="text-xs font-extrabold text-primary dark:text-primary">Spending by Category</p>
                      <div className="mt-2 flex items-center gap-4">
                        <div
                          className="h-28 w-28"
                          role="img"
                          aria-label={`Pie chart: top category is ${categoryData[0]?.name} at ${symbol}${formatRaw(categoryData[0]?.value || 0)}`}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={50}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {categoryData.map((entry, idx) => (
                                  <Cell key={idx} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value: number) => [`${symbol}${formatRaw(value)}`, "Amount"]}
                                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)" }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          {categoryData.slice(0, 4).map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs font-semibold dark:text-white/80">{item.name}</span>
                              </div>
                              <span className="text-xs font-extrabold text-primary">
                                {symbol}{formatRaw(item.value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {monthlyTrend.length > 1 && (
                <motion.div variants={itemVariants}>
                  <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
                    <CardContent className="p-4">
                      <p className="text-xs font-extrabold text-muted-foreground mb-3">Monthly Trend</p>
                      <div
                        className="h-40"
                        role="img"
                        aria-label={`Bar chart showing monthly income and expense trends for the last ${monthlyTrend.length} months`}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={monthlyTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis
                              tick={{ fontSize: 10 }}
                              axisLine={false}
                              tickLine={false}
                              tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
                            />
                            <Tooltip
                              formatter={(value: number) => `${symbol}${formatRaw(value)}`}
                              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)" }}
                            />
                            <Legend
                              formatter={(value) => value === "income" ? "Income" : "Expense"}
                              iconSize={10}
                              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                            />
                            <Bar dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} name="income" />
                            <Bar dataKey="expense" fill="#dc2626" radius={[4, 4, 0, 0]} name="expense" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <Card className="border-l-4 border-l-primary bg-gradient-to-r from-white to-primary/5 dark:from-card dark:to-primary/10 shadow-soft">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-extrabold text-muted-foreground dark:text-white/60">Total Spent</p>
                        <h3 className="mt-1 text-2xl font-extrabold dark:text-white tabular-money">
                          {symbol}{formatRaw(totalExpenses)}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span
                          className={`rounded-full bg-primary/20 px-2 py-1 text-xs font-extrabold text-primary ${budgetUsed > 100 ? "bg-red-100 text-red-600" : ""}`}
                        >
                          {budgetUsed.toFixed(0)}%
                        </span>
                        <p className="mt-1 text-[10px] font-semibold text-muted-foreground dark:text-white/50">
                          of {symbol}{formatRaw(monthlyBudget)} budget
                        </p>
                      </div>
                    </div>
                    <ProgressBar value={Math.min(budgetUsed, 100)} className="mt-3" />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 card-hover">
                  <CardContent className="p-3">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase">Avg Daily</p>
                    <p className="text-lg font-extrabold dark:text-white">{symbol}{formatRaw(avgDailySpend)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 card-hover">
                  <CardContent className="p-3">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase">Top Expense</p>
                    <p className="text-lg font-extrabold dark:text-white">
                      {topExpense ? `${symbol}${formatRaw(topExpense.amount)}` : `${symbol}0`}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {categoryData.length > 0 && (
                <motion.div variants={itemVariants}>
                  <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
                    <CardContent className="p-3">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-extrabold text-muted-foreground">Budget Breakdown</p>
                        <span className="text-[10px] font-semibold text-primary">
                          {timeRange === "week" ? "This Week" :
                           timeRange === "month" ? "This Month" :
                           timeRange === "quarter" ? "Last 3 Months" :
                           timeRange === "year" ? "This Year" : "All Time"}
                        </span>
                      </div>
                      <div className="space-y-3.5">
                        {categoryData.slice(0, 5).map((cat) => {
                          const budget = categoryBudgets[cat.key] || 0;
                          const spent = cat.value;
                          const pct = budget > 0 ? (spent / budget) * 100 : 0;
                          return (
                            <div key={cat.key || cat.name}>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold dark:text-white">{cat.name}</span>
                                <span className="text-xs font-extrabold text-muted-foreground dark:text-white/70">
                                  {symbol}{formatRaw(spent)}{budget > 0 ? ` / ${symbol}${formatRaw(budget)}` : ""}
                                </span>
                              </div>
                              {budget > 0 ? (
                                <div className="mt-1">
                                  <ProgressBar 
                                    value={Math.min(pct, 100)} 
                                    compact 
                                    className={cn(
                                      "mt-1",
                                      pct > 100 ? "[&>div]:bg-red-500" : pct > 80 ? "[&>div]:bg-amber-500" : ""
                                    )} 
                                  />
                                  <div className="flex justify-between items-center mt-0.5">
                                    <span className={cn(
                                      "text-[9px] font-bold",
                                      pct > 100 ? "text-red-500" : pct > 80 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                                    )}>
                                      {pct > 100 ? `${(pct - 100).toFixed(0)}% over limit!` : `${pct.toFixed(0)}% used`}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground/50">
                                      Limit: {symbol}{formatRaw(budget)}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="mt-1 flex items-center justify-between">
                                  <div className="flex-1 mr-4">
                                    <div className="h-1 bg-muted rounded-full w-full opacity-25" />
                                  </div>
                                  <button
                                    onClick={() => onNavigate("categories")}
                                    className="text-[9px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-0.5"
                                  >
                                    + Set Limit
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
                <Button variant="outline" onClick={() => onNavigate("goals")} className="h-12 dark:bg-white/5 card-hover">
                  <Target className="size-4 mr-2" />
                  Goals
                </Button>
                <Button variant="outline" onClick={() => onNavigate("recurring")} className="h-12 dark:bg-white/5 card-hover">
                  <RefreshCcw className="size-4 mr-2" />
                  Recurring
                </Button>
                <Button variant="outline" onClick={() => onNavigate("reports")} className="h-12 dark:bg-white/5 card-hover">
                  <FileBarChart className="size-4 mr-2" />
                  Reports
                </Button>
                <Button variant="outline" onClick={() => onNavigate("categories")} className="h-12 dark:bg-white/5 card-hover">
                  <Tags className="size-4 mr-2" />
                  Categories
                </Button>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </PhoneFrame>
  );
}
