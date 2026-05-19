"use client";

import { useState, useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
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
import { PhoneFrame, ScreenHeader, BottomNav, EmptyState, ProgressBar } from "@/components/shared";
import type { Screen, Transaction } from "@/components/types";
import { expenseCategories } from "@/components/constants";

interface AnalyticsScreenProps {
  onNavigate: (screen: Screen) => void;
  transactions: Transaction[];
  monthlyBudget?: number;
  onExport?: () => void;
}

type TimeRange = "week" | "month" | "quarter" | "year" | "all";

export function AnalyticsScreen({ onNavigate, transactions, monthlyBudget = 160000, onExport }: AnalyticsScreenProps) {
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
      .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0),
    [filteredTransactions]
  );

  const totalIncome = useMemo(() => 
    filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0),
    [filteredTransactions]
  );

  const budgetUsed = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  const categoryData = useMemo(() => {
    const data = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + parseInt(t.amount.replace(/[^0-9]/g, ""));
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(data)
      .map(([name, value]) => {
        const cat = expenseCategories.find((c) => c.value === name);
        return { name: cat?.label || name, value, color: cat?.color || "#7766e8" };
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
      const amount = parseInt(t.amount.replace(/[^0-9]/g, ""));
      if (t.type === "income") months[key].income += amount;
      else months[key].expense += amount;
    });

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, data]) => ({ ...data, month: data.label }));
  }, [filteredTransactions]);

  const topExpense = filteredTransactions
    .filter(t => t.type === "expense")
    .sort((a, b) => parseInt(b.amount.replace(/[^0-9]/g, "")) - parseInt(a.amount.replace(/[^0-9]/g, "")))[0];

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
    <PhoneFrame label="Analytics screen" className="pb-28">
      <div className="h-full flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll px-1">
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
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2">
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] p-3 dark:from-[#0f1a15] dark:to-[#0a1210] card-hover"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[10px] font-semibold text-[#16a34a] dark:text-[#16a34a]">Income</p>
              <p className="mt-1 text-lg font-extrabold text-[#16a34a] dark:text-white">
                ₹{totalIncome >= 100000 ? `${(totalIncome / 100000).toFixed(1)}L` : totalIncome.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] font-medium text-[#16a34a]/70">
                {filteredTransactions.filter((t) => t.type === "income").length} txns
              </p>
            </motion.div>
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-[#fee2e2] to-[#fecaca] p-3 dark:from-[#1a0f0e] dark:to-[#100a09] card-hover"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[10px] font-semibold text-[#dc2626] dark:text-[#ff6b5f]">Expense</p>
              <p className="mt-1 text-lg font-extrabold text-[#dc2626] dark:text-white">
                ₹{totalExpenses >= 100000 ? `${(totalExpenses / 100000).toFixed(1)}L` : totalExpenses.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] font-medium text-[#dc2626]/70">
                {filteredTransactions.filter((t) => t.type === "expense").length} txns
              </p>
            </motion.div>
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-[#e0e7ff] to-[#c7d2fe] p-3 dark:from-[#1e1b4b] dark:to-[#0f0a2a] card-hover"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[10px] font-semibold text-[#4f46e5] dark:text-[#818cf8]">Savings</p>
              <p className="mt-1 text-lg font-extrabold text-[#4f46e5] dark:text-white">
                ₹{(totalIncome - totalExpenses) >= 1000 ? `${((totalIncome - totalExpenses) / 1000).toFixed(1)}K` : (totalIncome - totalExpenses).toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] font-medium text-[#4f46e5]/70">
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
                    className="rounded-xl bg-gradient-to-r from-[#ff6b5f] to-[#ff995c]"
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
                        <div className="h-28 w-28">
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
                                ₹{item.value.toLocaleString("en-IN")}
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
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={monthlyTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip 
                              formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`}
                              contentStyle={{ fontSize: 12, borderRadius: 8 }}
                            />
                            <Bar dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" fill="#dc2626" radius={[4, 4, 0, 0]} />
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
                        <h3 className="mt-1 text-2xl font-extrabold dark:text-white">
                          ₹{totalExpenses.toLocaleString("en-IN")}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span
                          className={`rounded-full bg-primary/20 px-2 py-1 text-xs font-extrabold text-primary ${budgetUsed > 100 ? "bg-red-100 text-red-600" : ""}`}
                        >
                          {budgetUsed.toFixed(0)}%
                        </span>
                        <p className="mt-1 text-[10px] font-semibold text-muted-foreground dark:text-white/50">
                          of ₹{monthlyBudget.toLocaleString("en-IN")} budget
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
                    <p className="text-lg font-extrabold dark:text-white">₹{avgDailySpend.toLocaleString("en-IN")}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 card-hover">
                  <CardContent className="p-3">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase">Top Expense</p>
                    <p className="text-lg font-extrabold dark:text-white">
                      {topExpense ? `₹${parseInt(topExpense.amount.replace(/[^0-9]/g, "")).toLocaleString("en-IN")}` : "₹0"}
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
                      <div className="space-y-2.5">
                        {categoryData.slice(0, 5).map((cat) => (
                          <div key={cat.name}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold dark:text-white">{cat.name}</span>
                              <span className="text-xs font-extrabold text-muted-foreground dark:text-white/70">
                                ₹{cat.value.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <ProgressBar value={Math.min((cat.value / monthlyBudget) * 100, 100)} compact className="mt-1" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2 mt-4">
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

      <BottomNav active="Insights" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}
