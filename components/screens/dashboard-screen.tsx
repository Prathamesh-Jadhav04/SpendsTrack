"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, WalletCards, ReceiptText, Plus, Target, RefreshCcw, ArrowRight, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PhoneFrame, ScreenHeader, BottomNav, SectionTitle, TransactionRow, EmptyState } from "@/components/shared";
import type { Screen, Transaction, User } from "@/components/types";

interface DashboardScreenProps {
  onNavigate: (screen: Screen) => void;
  transactions: Transaction[];
  user?: User | null;
  isAdmin?: boolean;
  isLoading?: boolean;
}

export function DashboardScreen({ onNavigate, transactions, user, isAdmin, isLoading }: DashboardScreenProps) {
  const recentTransactions = transactions.slice(0, 5);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);

  const totalBalance = totalIncome - totalExpense;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { time: "Good morning", emoji: "☀️", message: "Start your day smart" };
    if (hour < 17) return { time: "Good afternoon", emoji: "🌤️", message: "Keep tracking your spends" };
    return { time: "Good evening", emoji: "🌙", message: "Review your day's expenses" };
  };

  const greeting = getGreeting();
  const userName = user?.name || "User";
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  const todayTransactions = transactions.filter(t => {
    if (!t.date) return false;
    const today = new Date().toISOString().split("T")[0];
    return t.date === today;
  });

  const todaySpent = todayTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);

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
    <PhoneFrame label="Dashboard screen" className="pb-28">
      <div className="h-full flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll">
        <ScreenHeader
          eyebrow={greeting.time}
          title={
            <div className="flex items-center gap-2">
              <motion.span
                className="text-2xl"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {greeting.emoji}
              </motion.span>
              <span className="flex items-center gap-1">
                {userName}
                <motion.span
                  className="text-lg"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.span>
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
            className="space-y-4"
          >
            <motion.div variants={itemVariants}>
              <div className="relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-primary via-[#0d9973] to-[#0b6c59] p-5 shadow-fintech dark:from-[#10b889] dark:via-[#0d9973] dark:to-[#085544]">
                <motion.div
                  className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 size-20 rounded-full bg-white/5"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-white/70 dark:text-white/60">Total Balance</p>
                    <Badge className="bg-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                      <Calendar className="mr-1 size-3" />
                      {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </Badge>
                  </div>
                  <motion.h3
                    className="text-[2.4rem] font-extrabold leading-none tracking-tight text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    ₹{totalBalance.toLocaleString("en-IN")}
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
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Today's spending</span>
                  </div>
                  <span className="text-sm font-extrabold text-amber-700 dark:text-amber-300">₹{todaySpent.toLocaleString("en-IN")}</span>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              <motion.div
                className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-white to-[#edf9f1] p-4 shadow-soft dark:from-[#0f1a15] dark:to-[#0a1210] dark:border-white/5 card-hover"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="grid size-9 place-items-center rounded-xl bg-secondary/50 text-primary dark:bg-[#0f2920]">
                    <TrendingUp className="size-4" />
                  </div>
                </div>
                <p className="mt-3 text-xs font-semibold text-muted-foreground dark:text-white/50">Income</p>
                <h4 className="text-lg font-extrabold dark:text-white">₹{totalIncome.toLocaleString("en-IN")}</h4>
              </motion.div>
              <motion.div
                className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-white to-[#fff0ee] p-4 shadow-soft dark:from-[#1a0f0e] dark:to-[#100a09] dark:border-white/5 card-hover"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="grid size-9 place-items-center rounded-xl bg-[#fff0ee] text-[#c24940] dark:bg-[#1a0f0e]">
                    <TrendingDown className="size-4" />
                  </div>
                </div>
                <p className="mt-3 text-xs font-semibold text-muted-foreground dark:text-white/50">Expense</p>
                <h4 className="text-lg font-extrabold dark:text-white">₹{totalExpense.toLocaleString("en-IN")}</h4>
              </motion.div>
            </motion.div>

            {totalIncome > 0 && (
              <motion.div variants={itemVariants}>
                <div className="p-3 rounded-2xl bg-gradient-to-r from-[#e0e7ff] to-[#c7d2fe] dark:from-[#1e1b4b] dark:to-[#0f0a2a] card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#4f46e5] dark:text-[#818cf8]">Savings Rate</p>
                      <p className="text-xl font-extrabold text-[#4f46e5] dark:text-white">{savingsRate}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-[#4f46e5]/70 dark:text-white/50">
                        {transactions.filter(t => t.type === "income").length} income txns
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate("add-expense")}
                className="flex-1 rounded-2xl h-11 bg-gradient-to-r from-[#ff6b5f] to-[#ff995c] shadow-lg shadow-[#ff6b5f]/20 hover:shadow-xl hover:shadow-[#ff6b5f]/30 text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <TrendingDown className="size-4" />
                Expense
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate("add-income")}
                className="flex-1 rounded-2xl h-11 border-primary/20 dark:border-white/10 bg-gradient-to-r from-[#dcfce7] to-[#bbf7d0] dark:from-[#0f2920] dark:to-[#0a1210] font-bold text-sm flex items-center justify-center gap-2 text-primary dark:text-white"
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
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate(item.screen)}
                  className="h-14 rounded-2xl flex flex-col gap-1 dark:bg-white/5 bg-white/80 border border-border/30 shadow-sm card-hover"
                >
                  <item.icon className="size-4 text-primary" />
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </motion.button>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
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
                              className="rounded-xl bg-gradient-to-r from-[#ff6b5f] to-[#ff995c]"
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

      <BottomNav active="Home" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}
