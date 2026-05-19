"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, WalletCards, ReceiptText } from "lucide-react";
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
  const recentTransactions = transactions.slice(0, 4);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);

  const totalBalance = totalIncome - totalExpense;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { time: "Good morning", emoji: "🌅" };
    if (hour < 17) return { time: "Good afternoon", emoji: "☀️" };
    return { time: "Good evening", emoji: "🌙" };
  };

  const greeting = getGreeting();
  const userName = user?.name || "User";

  return (
    <PhoneFrame label="Dashboard screen" className="pb-28">
      <div className="h-full flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll">
        <ScreenHeader
          eyebrow={greeting.time}
          title={
            <div className="flex items-center gap-2">
              <motion.span
                className="text-2xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👋
              </motion.span>
              <span className="flex items-center gap-1">
                {userName}
                <motion.span
                  className="text-lg"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
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
              <Button
                size="icon"
                variant="outline"
                aria-label="Wallet"
                className="rounded-2xl"
                onClick={() => onNavigate("transactions")}
              >
                <WalletCards className="size-5 text-primary" />
              </Button>
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
          <>
            <div className="relative mb-4 overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-primary via-[#0d9973] to-[#0b6c59] p-5 shadow-fintech dark:from-[#10b889] dark:via-[#0d9973] dark:to-[#085544]">
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 -left-4 size-20 rounded-full bg-white/5" />
              <div className="relative">
                <p className="text-xs font-semibold text-white/70 dark:text-white/60">Total Balance</p>
                <h3 className="mt-1 text-[2.4rem] font-extrabold leading-none tracking-tight text-white">
                  ₹{totalBalance.toLocaleString("en-IN")}
                </h3>
                <div className="mt-3 flex items-center gap-2">
                  <Badge className="bg-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                    {totalBalance >= 0 ? <TrendingUp className="mr-1 size-3" /> : <TrendingDown className="mr-1 size-3" />}
                    {totalBalance >= 0 ? "+" : ""}
                    {totalBalance > 0 ? Math.round((totalBalance / (totalIncome || 1)) * 100) : 0}%
                  </Badge>
                  <span className="text-xs font-medium text-white/60">Total overview</span>
                </div>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-white to-[#edf9f1] p-4 shadow-soft dark:from-[#0f1a15] dark:to-[#0a1210] dark:border-white/5">
                <div className="flex items-center justify-between">
                  <div className="grid size-9 place-items-center rounded-xl bg-secondary/50 text-primary dark:bg-[#0f2920]">
                    <TrendingUp className="size-4" />
                  </div>
                </div>
                <p className="mt-3 text-xs font-semibold text-muted-foreground dark:text-white/50">Income</p>
                <h4 className="text-lg font-extrabold dark:text-white">₹{totalIncome.toLocaleString("en-IN")}</h4>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-white to-[#fff0ee] p-4 shadow-soft dark:from-[#1a0f0e] dark:to-[#100a09] dark:border-white/5">
                <div className="flex items-center justify-between">
                  <div className="grid size-9 place-items-center rounded-xl bg-[#fff0ee] text-[#c24940] dark:bg-[#1a0f0e]">
                    <TrendingDown className="size-4" />
                  </div>
                </div>
                <p className="mt-3 text-xs font-semibold text-muted-foreground dark:text-white/50">Expense</p>
                <h4 className="text-lg font-extrabold dark:text-white">₹{totalExpense.toLocaleString("en-IN")}</h4>
              </div>
            </div>

            <div className="mb-4 flex gap-3">
              <Button
                onClick={() => onNavigate("add-expense")}
                className="flex-1 rounded-2xl h-11 bg-gradient-to-r from-[#ff6b5f] to-[#ff995c] shadow-lg shadow-[#ff6b5f]/20 hover:shadow-xl hover:shadow-[#ff6b5f]/30"
              >
                <TrendingDown className="mr-2 size-4" />
                Expense
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate("add-income")}
                className="flex-1 rounded-2xl h-11 border-primary/20 dark:border-white/10 bg-gradient-to-r from-[#dcfce7] to-[#bbf7d0] dark:from-[#0f2920] dark:to-[#0a1210]"
              >
                <TrendingUp className="mr-2 size-4" />
                Income
              </Button>
            </div>

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
                      <TransactionRow key={`${transaction.title}-${idx}`} transaction={transaction} />
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
          </>
        )}
      </div>

      <BottomNav active="Home" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}
