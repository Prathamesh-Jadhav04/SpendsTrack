"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, WalletCards, ReceiptText, Plus, Target, RefreshCcw, Calendar, Clock, Sun, CloudSun, Moon, Sparkles, IndianRupee, ArrowRight, Brain, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PhoneFrame, ScreenHeader, SectionTitle, TransactionRow, EmptyState } from "@/components/shared";
import type { Screen, Transaction, User } from "@/components/types";
import { categoryTitles } from "@/components/constants";

interface DashboardScreenProps {
  onNavigate: (screen: Screen) => void;
  transactions: Transaction[];
  user?: User | null;
  isAdmin?: boolean;
  isLoading?: boolean;
  categoryBudgets: Record<string, number>;
}

export function DashboardScreen({ onNavigate, transactions, user, isAdmin, isLoading, categoryBudgets }: DashboardScreenProps) {
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
      <div className="flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll lg:h-auto lg:overflow-visible">
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
              <div className="relative overflow-hidden rounded-3xl border-0 brand-card-gradient p-5 lg:p-8 shadow-fintech">
                {/* Decorative orbs — static, no infinite animation for perf */}
                <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10" aria-hidden="true" />
                <div className="absolute -bottom-4 -left-4 size-20 rounded-full bg-white/5" aria-hidden="true" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-white/70">Total Balance</p>
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
                    aria-label={`Total balance ₹${totalBalance.toLocaleString("en-IN")}`}
                  >
                    <IndianRupee className="inline size-7 mb-1 mr-0.5 opacity-90" strokeWidth={2.5} />
                    {totalBalance.toLocaleString("en-IN")}
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

            {todayTransactions.length > 0 && (
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200/50 dark:border-amber-800/30">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Today&apos;s spending</span>
                  </div>
                  <span className="text-sm font-extrabold text-amber-700 dark:text-amber-300">₹{todaySpent.toLocaleString("en-IN")}</span>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 lg:gap-4">
              <motion.div
                className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-ds-canvas to-income-soft/10 p-4 shadow-soft dark:from-ds-canvas-soft-2 dark:to-income-soft/5 dark:border-white/5 card-hover"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="grid size-9 place-items-center rounded-xl bg-income-soft text-income">
                  <TrendingUp className="size-4" strokeWidth={2.5} />
                </div>
                <p className="mt-3 text-xs font-semibold text-muted-foreground dark:text-white/50">Income</p>
                <h4 className="text-lg font-extrabold dark:text-white tabular-money">₹{totalIncome.toLocaleString("en-IN")}</h4>
              </motion.div>
              <motion.div
                className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-ds-canvas to-expense-soft/10 p-4 shadow-soft dark:from-ds-canvas-soft-2 dark:to-expense-soft/5 dark:border-white/5 card-hover"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="grid size-9 place-items-center rounded-xl bg-expense-soft text-expense">
                  <TrendingDown className="size-4" strokeWidth={2.5} />
                </div>
                <p className="mt-3 text-xs font-semibold text-muted-foreground dark:text-white/50">Expense</p>
                <h4 className="text-lg font-extrabold dark:text-white tabular-money">₹{totalExpense.toLocaleString("en-IN")}</h4>
              </motion.div>
            </motion.div>

            {totalIncome > 0 && (
              <motion.div variants={itemVariants}>
                <div className="p-3 rounded-2xl bg-gradient-to-r from-savings-soft/40 to-savings-soft dark:from-savings-soft/20 dark:to-savings-soft/5 card-hover">
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
                className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent p-4 shadow-soft dark:border-white/5 card-hover flex items-center justify-between cursor-pointer"
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
                    title="Recent transactions"
                    action={recentTransactions.length > 0 ? "View all" : undefined}
                    onAction={() => onNavigate("transactions")}
                  />
                  <div className="grid gap-2">
                    {recentTransactions.length > 0 ? (
                      recentTransactions.map((transaction, idx) => (
                        <TransactionRow
                          key={`${transaction.id}-${idx}`}
                          transaction={transaction}
                          onClick={() => onNavigate("transaction-detail")}
                        />
                      ))
                    ) : (
                      <EmptyState
                        icon={<ReceiptText className="size-7 text-primary" />}
                        title="No transactions yet"
                        message="Start tracking your expenses by adding your first transaction!"
                        action={
                          <div className="flex gap-3">
                            <Button
                              onClick={() => onNavigate("add-expense")}
                              size="sm"
                              className="rounded-xl bg-expense hover:bg-expense/90"
                            >
                              <TrendingDown className="mr-1.5 size-3.5" />
                              Add Expense
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => onNavigate("add-income")}
                              size="sm"
                              className="rounded-xl"
                            >
                              <TrendingUp className="mr-1.5 size-3.5" />
                              Add Income
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
    </PhoneFrame>
  );
}
