"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { PhoneFrame, ScreenHeader, BottomNav, ProgressBar } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { expenseCategories } from "@/components/constants";
import type { Transaction, Screen } from "@/components/types";

interface ReportsScreenProps {
  onNavigate: (screen: Screen) => void;
  transactions: Transaction[];
}

export function ReportsScreen({ onNavigate, transactions }: ReportsScreenProps) {
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");

  const getFilteredTransactions = () => {
    const now = new Date();
    const startDate = period === "weekly"
      ? new Date(now.setDate(now.getDate() - 7))
      : new Date(now.getFullYear(), now.getMonth(), 1);
    return transactions.filter(t => t.date && new Date(t.date) >= startDate);
  };

  const filtered = getFilteredTransactions();
  const totalIncome = filtered.filter(t => t.type === "income").reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);
  const totalExpense = filtered.filter(t => t.type === "expense").reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);

  const categoryBreakdown = filtered
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      const cat = t.category;
      acc[cat] = (acc[cat] || 0) + parseInt(t.amount.replace(/[^0-9]/g, ""));
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <PhoneFrame label="Reports screen" className="pb-28">
      <ScreenHeader eyebrow="Analytics" title="Reports" />

      <div className="flex gap-2 mb-4">
        <Button variant={period === "weekly" ? "default" : "outline"} onClick={() => setPeriod("weekly")} className="flex-1">Weekly</Button>
        <Button variant={period === "monthly" ? "default" : "outline"} onClick={() => setPeriod("monthly")} className="flex-1">Monthly</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] dark:from-[#0f1a15] dark:to-[#0a1210]">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-[#16a34a] dark:text-[#16a34a]">Income</p>
            <p className="text-xl font-extrabold mt-1">₹{totalIncome.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#fee2e2] to-[#fecaca] dark:from-[#1a0f0e] dark:to-[#100a09]">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-[#dc2626] dark:text-[#ff6b5f]">Expense</p>
            <p className="text-xl font-extrabold mt-1">₹{totalExpense.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
        <CardContent className="p-4">
          <h4 className="font-extrabold mb-3">Top Categories</h4>
          {topCategories.map(([cat, amount], i) => {
            const catInfo = expenseCategories.find(c => c.value === cat);
            const percent = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
            return (
              <div key={i} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-sm">{catInfo?.label || cat}</span>
                  <span className="font-bold text-sm">₹{amount.toLocaleString("en-IN")}</span>
                </div>
                <ProgressBar value={percent} compact />
              </div>
            );
          })}
          {topCategories.length === 0 && <p className="text-muted-foreground text-sm">No data available</p>}
        </CardContent>
      </Card>

      <div className="mt-4 p-4 bg-primary/10 rounded-xl dark:bg-primary/20">
        <p className="font-extrabold text-primary">Net Savings</p>
        <p className={`text-2xl font-extrabold ${totalIncome - totalExpense >= 0 ? "text-primary" : "text-red-500"}`}>
          ₹{(totalIncome - totalExpense).toLocaleString("en-IN")}
        </p>
      </div>

      <BottomNav active="Insights" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}
