"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, WalletCards, ReceiptText, Plus, Target, RefreshCcw, Calendar, Clock, Sun, CloudSun, Moon, Sparkles, ArrowRight, Brain, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PhoneFrame, ScreenHeader, SectionTitle, TransactionRow, EmptyState } from "@/components/shared";
import type { Screen, Transaction, User } from "@/components/types";
import { categoryTitles } from "@/components/constants";
import { useCurrency, useTranslation } from "@/components/hooks";
import { cn } from "@/lib/utils";

interface DashboardScreenProps {
  onNavigate: (screen: Screen) => void;
  transactions: Transaction[];
  user?: User | null;
  isAdmin?: boolean;
  isLoading?: boolean;
  categoryBudgets: Record<string, number>;
  monthlyBudget?: number;
  onTransactionClick?: (transaction: Transaction) => void;
}

export function DashboardScreen({
  onNavigate,
  transactions,
  user,
  isAdmin,
  isLoading,
  categoryBudgets,
  monthlyBudget,
  onTransactionClick,
}: DashboardScreenProps) {
  const { symbol, format, formatRaw } = useCurrency();
  const { t } = useTranslation();
  const [isFabOpen, setIsFabOpen] = useState(false);
  const recentTransactions = transactions.slice(0, 5);

  const totalIncome = useMemo(() =>
    transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpense = useMemo(() =>
    transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalBalance = totalIncome - totalExpense;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { time: "Good morning", Icon: Sun, message: "Start your day smart" };
    if (hour < 17) return { time: "Good afternoon", Icon: CloudSun, message: "Keep tracking your spends" };
    return { time: "Good evening", Icon: Moon, message: "Review your day's expenses" };
  };

  const greeting = getGreeting();
  const userName = user?.name || "User";
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayTransactions = useMemo(() =>
    transactions.filter(t => t.date === todayStr),
    [transactions, todayStr]
  );

  const todaySpent = useMemo(() =>
    todayTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0),
    [todayTransactions]
  );
 
  const exceededCategories = useMemo(() => {
    const expenses = transactions.filter(t => t.type === "expense");
    const spendsByCat = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
 
    const exceeded: string[] = [];
    Object.entries(categoryBudgets || {}).forEach(([cat, limit]) => {
      const spent = spendsByCat[cat] || 0;
      if (limit > 0 && spent > limit) {
        exceeded.push(categoryTitles[cat] || cat);
      }
    });
    return exceeded;
  }, [transactions, categoryBudgets]);

  const currentMonthSpent = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    
    return transactions
      .filter((t) => {
        if (t.type !== "expense" || !t.date) return false;
        const parts = t.date.split("-");
        if (parts.length < 2) return false;
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1; // 0-11
        return y === currentYear && m === currentMonth;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const budgetLimit = monthlyBudget || 160000;
  const percentageSpent = Math.min(Math.round((currentMonthSpent / budgetLimit) * 100), 100);
  const actualPercentage = budgetLimit > 0 ? Math.round((currentMonthSpent / budgetLimit) * 100) : 0;
  const remainingBudget = Math.max(budgetLimit - currentMonthSpent, 0);

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
    <PhoneFrame label="Dashboard screen" className="pb-28 lg:pb-0">
      <div className="flex flex-col overflow-y-visible no-scrollbar smooth-scroll momentum-scroll lg:h-auto lg:overflow-visible">
        <ScreenHeader
          eyebrow={greeting.time}
          title={
            <div className="flex items-center gap-2">
              <greeting.Icon className="size-5 text-primary" strokeWidth={2} />
              <span className="flex items-center gap-1.5">
                {userName}
                <Sparkles className="size-4 text-amber-400" />
              </span>
            </div>
          }
          action={
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-2 py-1 rounded-full">
                  Admin
                </Badge>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate("ask-ai")}
                className="p-2 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white border-0 shadow-md shadow-purple-500/20"
                aria-label="Ask AI Advisor"
              >
                <Brain className="size-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate("transactions")}
                className="p-2 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-border/50 shadow-sm"
              >
                <WalletCards className="size-5 text-primary" />
              </motion.button>
            </div>
          }
        />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[10rem] rounded-3xl" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-[6rem] rounded-2xl" />
              <Skeleton className="h-[6rem] rounded-2xl" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-11 flex-1 rounded-2xl" />
              <Skeleton className="h-11 flex-1 rounded-2xl" />
            </div>
            <Skeleton className="h-[12rem] rounded-2xl" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 lg:space-y-6"
          >
            <motion.div variants={itemVariants}>
              <div className="relative overflow-hidden rounded-xl brand-card-gradient p-5 lg:p-8 shadow-level-4 hover:shadow-[0_0_30px_rgba(0,112,243,0.25)] hover:scale-[1.01] transition-all duration-300 cursor-pointer">
                {/* Decorative orbs — static, no infinite animation for perf */}
                <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10" aria-hidden="true" />
                <div className="absolute -bottom-4 -left-4 size-20 rounded-full bg-white/5" aria-hidden="true" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-white/70">{t("total_balance")}</p>
                    <Badge className="bg-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                      <Calendar className="mr-1 size-3" />
                      {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </Badge>
                  </div>
                  <motion.h3
                    className="text-[2.4rem] font-extrabold leading-none tracking-tight text-white tabular-money"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.45 }}
                    aria-label={`Total balance ${symbol}${formatRaw(totalBalance)}`}
                  >
                    <span className="text-3xl font-extrabold mr-1.5 opacity-90">{symbol}</span>
                    {formatRaw(totalBalance)}
                  </motion.h3>
                  <div className="mt-3 flex items-center gap-3">
                    <Badge className="bg-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                      {totalBalance >= 0 ? <TrendingUp className="mr-1 size-3" /> : <TrendingDown className="mr-1 size-3" />}
                      {totalBalance >= 0 ? "+" : ""}
                      {totalBalance > 0 ? Math.round((totalBalance / (totalIncome || 1)) * 100) : 0}%
                    </Badge>
                    <span className="text-xs font-medium text-white/60">Total overview</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="w-full bg-white/80 dark:bg-[#111111]/90 backdrop-blur-md border border-border/50 dark:border-white/5 shadow-soft dark:shadow-xl dark:shadow-black/35 hover:shadow-[0_0_30px_rgba(0,112,243,0.08)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-300 overflow-hidden">
                <CardContent className="p-5 flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative flex items-center justify-center shrink-0">
                    {/* SVG Ring */}
                    <svg height={110} width={110} className="rotate-[-90deg] drop-shadow-sm">
                      <circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={8}
                        r={46}
                        cx={55}
                        cy={55}
                        className="text-muted/20 dark:text-white/5"
                      />
                      <motion.circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={8}
                        strokeDasharray={2 * Math.PI * 46}
                        initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - Math.min(percentageSpent, 100) / 100) }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        r={46}
                        cx={55}
                        cy={55}
                        className={cn(
                          "transition-colors duration-500",
                          actualPercentage < 60 ? "text-emerald-500 dark:text-emerald-400" :
                          actualPercentage < 90 ? "text-amber-500 dark:text-amber-400" :
                          "text-rose-500 dark:text-rose-400 stroke-[10] animate-pulse"
                        )}
                      />
                    </svg>
                    {/* Percentage text center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-foreground tabular-money">{actualPercentage}%</span>
                      <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider leading-none">Spent</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 w-full text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Monthly Budget Index</h4>
                        <div className="flex items-baseline gap-1.5 mt-0.5 justify-center sm:justify-start">
                          <span className="text-xl font-extrabold text-foreground tabular-money">{symbol}{formatRaw(currentMonthSpent)}</span>
                          <span className="text-xs font-medium text-muted-foreground">of {symbol}{formatRaw(budgetLimit)}</span>
                        </div>
                      </div>
                      
                      <Badge className={cn(
                        "px-2.5 py-1 text-[10px] rounded-full self-center sm:self-start border font-extrabold shadow-sm",
                        actualPercentage < 60 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" :
                        actualPercentage < 90 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" :
                        "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse"
                      )}>
                        {actualPercentage < 60 ? "Healthy Balance" :
                         actualPercentage < 90 ? "Approaching Limit" :
                         "Budget Exceeded"}
                      </Badge>
                    </div>

                    {/* Financial advice box */}
                    <div className={cn(
                      "p-3 rounded-xl border text-xs font-semibold leading-relaxed transition-all duration-300",
                      actualPercentage < 60 ? "bg-emerald-50/50 border-emerald-100/50 text-emerald-800 dark:bg-emerald-950/10 dark:border-emerald-900/25 dark:text-emerald-300" :
                      actualPercentage < 90 ? "bg-amber-50/50 border-amber-100/50 text-amber-800 dark:bg-amber-950/10 dark:border-amber-900/25 dark:text-amber-300" :
                      "bg-rose-50/50 border-rose-100/50 text-rose-800 dark:bg-rose-950/10 dark:border-rose-900/25 dark:text-rose-300"
                    )}>
                      <p className="flex items-center gap-1.5 justify-center sm:justify-start mb-1 font-bold">
                        <Sparkles className="size-3.5 shrink-0 text-amber-500" />
                        Budget Advice
                      </p>
                      <p className="opacity-90">
                        {actualPercentage < 50 ? `Good job! You have ${symbol}${formatRaw(remainingBudget)} remaining. You are on track to save a lot this month. Keep it up!` :
                         actualPercentage < 80 ? `You have spent more than half of your budget. You have ${symbol}${formatRaw(remainingBudget)} remaining. Be mindful of non-essential purchases for the rest of the month.` :
                         actualPercentage < 100 ? `Warning: You are approaching your budget limit with only ${symbol}${formatRaw(remainingBudget)} left. Consider pausing optional spending.` :
                         `Alert: You have exceeded your monthly budget limit by ${symbol}${formatRaw(currentMonthSpent - budgetLimit)}. Try to review and cut down on expenses immediately.`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {todayTransactions.length > 0 && (
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200/50 dark:border-amber-800/30">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">{t("today_spent")}</span>
                  </div>
                  <span className="text-sm font-extrabold text-amber-700 dark:text-amber-300">{symbol}{formatRaw(todaySpent)}</span>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 lg:gap-4">
              <motion.div
                className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-ds-canvas to-income-soft/10 p-4 shadow-soft dark:from-ds-canvas-soft-2 dark:to-income-soft/5 dark:border-white/5 card-hover hover:border-income/40 hover:shadow-[0_0_20px_rgba(0,112,243,0.15)] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="grid size-9 place-items-center rounded-xl bg-income-soft text-income">
                  <TrendingUp className="size-4" strokeWidth={2.5} />
                </div>
                <p className="mt-3 text-xs font-semibold text-muted-foreground dark:text-white/50">{t("income")}</p>
                <h4 className="text-lg font-extrabold dark:text-white tabular-money">{symbol}{formatRaw(totalIncome)}</h4>
              </motion.div>
              <motion.div
                className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-ds-canvas to-expense-soft/10 p-4 shadow-soft dark:from-ds-canvas-soft-2 dark:to-expense-soft/5 dark:border-white/5 card-hover hover:border-expense/40 hover:shadow-[0_0_20px_rgba(238,0,0,0.15)] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="grid size-9 place-items-center rounded-xl bg-expense-soft text-expense">
                  <TrendingDown className="size-4" strokeWidth={2.5} />
                </div>
                <p className="mt-3 text-xs font-semibold text-muted-foreground dark:text-white/50">{t("expenses")}</p>
                <h4 className="text-lg font-extrabold dark:text-white tabular-money">{symbol}{formatRaw(totalExpense)}</h4>
              </motion.div>
            </motion.div>

            {totalIncome > 0 && (
              <motion.div variants={itemVariants}>
                <div className="p-3 rounded-2xl bg-gradient-to-r from-savings-soft/40 to-savings-soft dark:from-savings-soft/20 dark:to-savings-soft/5 card-hover border border-transparent hover:border-savings/20 hover:shadow-[0_0_20px_rgba(121,40,202,0.15)] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-savings">Savings Rate</p>
                      <p className="text-xl font-extrabold text-savings dark:text-white">{savingsRate}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-savings/70 dark:text-white/50">
                        {transactions.filter(t => t.type === "income").length} income txns
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {exceededCategories.length > 0 && (
              <motion.div variants={itemVariants}>
                <div className="flex flex-col gap-1.5 p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200/50 dark:border-red-900/30">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="size-4 shrink-0 animate-bounce" />
                    <span className="text-xs font-bold">Category Budgets Exceeded</span>
                  </div>
                  <p className="text-[10px] text-red-700/80 dark:text-red-300/80 leading-relaxed font-semibold">
                    You have spent more than your target limit in: {exceededCategories.join(", ")}.
                  </p>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <div
                onClick={() => onNavigate("ask-ai")}
                className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent p-4 shadow-soft dark:border-white/5 card-hover hover:border-purple-500/35 hover:shadow-[0_0_20px_rgba(121,40,202,0.18)] transition-all duration-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-500/25">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      Ask AI Financial Advisor
                    </h4>
                    <p className="text-[9px] text-muted-foreground font-semibold leading-none mt-1">
                      Get smart suggestions, goal forecast & audit reports
                    </p>
                  </div>
                </div>
                <div className="size-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted-foreground/10 transition-colors shrink-0">
                  <ArrowRight className="size-3" />
                </div>
              </div>
            </motion.div>
 
            <motion.div variants={itemVariants} className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate("add-expense")}
                className="flex-1 rounded-2xl h-11 bg-expense hover:bg-expense/90 shadow-level-2 text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <TrendingDown className="size-4" />
                Expense
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate("add-income")}
                className="flex-1 rounded-2xl h-11 bg-income hover:bg-income/90 shadow-level-2 text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <TrendingUp className="size-4" />
                Income
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2">
              {[
                { icon: Target, label: "Goals", screen: "goals" as Screen },
                { icon: RefreshCcw, label: "Recurring", screen: "recurring" as Screen },
                { icon: Plus, label: "Insights", screen: "analytics" as Screen },
              ].map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onNavigate(item.screen)}
                  aria-label={`Navigate to ${item.label}`}
                  className="h-16 min-w-[44px] rounded-2xl flex flex-col items-center justify-center gap-1.5 dark:bg-white/5 bg-white/80 border border-border/30 shadow-sm transition-all hover:shadow-md cursor-pointer"
                >
                  <item.icon className="size-4 text-primary" strokeWidth={2} />
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </motion.button>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="w-full">
              <Card className="w-full bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
                <CardContent className="p-4">
                  <SectionTitle
                    title={t("recent_transactions")}
                    action={recentTransactions.length > 0 ? t("view_all") : undefined}
                    onAction={() => onNavigate("transactions")}
                  />
                  <div className="grid gap-2">
                    {recentTransactions.length > 0 ? (
                      recentTransactions.map((transaction, idx) => (
                        <TransactionRow
                          key={`${transaction.id}-${idx}`}
                          transaction={transaction}
                          onClick={() => onTransactionClick?.(transaction)}
                        />
                      ))
                    ) : (
                      <EmptyState
                        icon={<ReceiptText className="size-7 text-primary" />}
                        title={t("no_transactions")}
                        message={t("add_one_to_start")}
                        action={
                          <div className="flex gap-3">
                            <Button
                              onClick={() => onNavigate("add-expense")}
                              size="sm"
                              className="rounded-xl bg-expense hover:bg-expense/90"
                            >
                              <TrendingDown className="mr-1.5 size-3.5" />
                              {t("add_expense")}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => onNavigate("add-income")}
                              size="sm"
                              className="rounded-xl"
                            >
                              <TrendingUp className="mr-1.5 size-3.5" />
                              {t("add_income")}
                            </Button>
                          </div>
                        }
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* FAB Backdrop Overlay */}
      <AnimatePresence>
        {isFabOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFabOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-24 right-4 z-[45] lg:bottom-8 lg:right-8 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isFabOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.05
                  }
                },
                closed: {
                  transition: {
                    staggerChildren: 0.05,
                    staggerDirection: -1
                  }
                }
              }}
              className="flex flex-col items-end gap-3 mb-2"
            >
              {/* Add Income Shortcut */}
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
                  closed: { opacity: 0, y: 15, scale: 0.8, transition: { duration: 0.15 } }
                }}
                className="flex items-center gap-2"
              >
                <span className="bg-white/95 dark:bg-[#161616]/95 shadow-md border border-border/40 px-2.5 py-1 rounded-lg text-[10px] font-bold text-foreground">
                  Add Income
                </span>
                <button
                  onClick={() => {
                    onNavigate("add-income");
                    setIsFabOpen(false);
                  }}
                  className="size-11 rounded-full bg-income hover:bg-income/95 text-white flex items-center justify-center shadow-lg cursor-pointer"
                  aria-label="Add Income Shortcut"
                >
                  <TrendingUp className="size-5" />
                </button>
              </motion.div>

              {/* Add Expense Shortcut */}
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
                  closed: { opacity: 0, y: 15, scale: 0.8, transition: { duration: 0.15 } }
                }}
                className="flex items-center gap-2"
              >
                <span className="bg-white/95 dark:bg-[#161616]/95 shadow-md border border-border/40 px-2.5 py-1 rounded-lg text-[10px] font-bold text-foreground">
                  Add Expense
                </span>
                <button
                  onClick={() => {
                    onNavigate("add-expense");
                    setIsFabOpen(false);
                  }}
                  className="size-11 rounded-full bg-expense hover:bg-expense/95 text-white flex items-center justify-center shadow-lg cursor-pointer"
                  aria-label="Add Expense Shortcut"
                >
                  <TrendingDown className="size-5" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="size-14 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-xl shadow-primary/20 z-50 cursor-pointer border border-primary/20"
          aria-label="Quick Action Menu"
        >
          <motion.div
            animate={{ rotate: isFabOpen ? 135 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Plus className="size-6" />
          </motion.div>
        </motion.button>
      </div>
    </PhoneFrame>
  );
}
