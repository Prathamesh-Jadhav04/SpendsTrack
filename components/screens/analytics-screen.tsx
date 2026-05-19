"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { BarChart3, Target, RefreshCcw, FileBarChart, Tags, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PhoneFrame, ScreenHeader, BottomNav, EmptyState, ProgressBar } from "@/components/shared";
import type { Screen, Transaction } from "@/components/types";
import { expenseCategories, chartData } from "@/components/constants";

interface AnalyticsScreenProps {
  onNavigate: (screen: Screen) => void;
  transactions: Transaction[];
  monthlyBudget?: number;
  onExport?: () => void;
}

export function AnalyticsScreen({ onNavigate, transactions, monthlyBudget = 160000, onExport }: AnalyticsScreenProps) {
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);
  const budgetUsed = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;

  return (
    <PhoneFrame label="Analytics screen" className="pb-28">
      <div className="h-full flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll px-1">
        <ScreenHeader
          eyebrow="Insights"
          title="Analytics"
          action={
            onExport ? (
              <Button size="sm" variant="outline" onClick={onExport} className="rounded-full">
                Export
              </Button>
            ) : undefined
          }
        />

        <div className="space-y-3 pb-4">
          <div className="grid grid-cols-3 gap-2">
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] p-3 dark:from-[#0f1a15] dark:to-[#0a1210]"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[10px] font-semibold text-[#16a34a] dark:text-[#16a34a]">Income</p>
              <p className="mt-1 text-lg font-extrabold text-[#16a34a] dark:text-white">
                ₹{totalIncome >= 100000 ? `${(totalIncome / 100000).toFixed(1)}L` : totalIncome.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] font-medium text-[#16a34a]/70">
                {transactions.filter((t) => t.type === "income").length} transactions
              </p>
            </motion.div>
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-[#fee2e2] to-[#fecaca] p-3 dark:from-[#1a0f0e] dark:to-[#100a09]"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[10px] font-semibold text-[#dc2626] dark:text-[#ff6b5f]">Expense</p>
              <p className="mt-1 text-lg font-extrabold text-[#dc2626] dark:text-white">
                ₹{totalExpenses >= 100000 ? `${(totalExpenses / 100000).toFixed(1)}L` : totalExpenses.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] font-medium text-[#dc2626]/70">
                {transactions.filter((t) => t.type === "expense").length} transactions
              </p>
            </motion.div>
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-[#e0e7ff] to-[#c7d2fe] p-3 dark:from-[#1e1b4b] dark:to-[#0f0a2a]"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[10px] font-semibold text-[#4f46e5] dark:text-[#818cf8]">Savings</p>
              <p className="mt-1 text-lg font-extrabold text-[#4f46e5] dark:text-white">
                ₹{(totalIncome - totalExpenses) >= 1000 ? `${((totalIncome - totalExpenses) / 1000).toFixed(1)}K` : (totalIncome - totalExpenses).toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] font-medium text-[#4f46e5]/70">
                {totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%
              </p>
            </motion.div>
          </div>

          {transactions.length === 0 ? (
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
          ) : (
            <>
              {(() => {
                const categoryData = transactions
                  .filter((t) => t.type === "expense")
                  .reduce((acc, t) => {
                    acc[t.category] = (acc[t.category] || 0) + parseInt(t.amount.replace(/[^0-9]/g, ""));
                    return acc;
                  }, {} as Record<string, number>);

                const dynamicChartData = Object.entries(categoryData)
                  .map(([name, value]) => {
                    const cat = expenseCategories.find((c) => c.value === name);
                    return { name: cat?.label || name, value, color: cat?.color || "#7766e8" };
                  })
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 7);

                return (
                  <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/10 to-secondary/20 dark:from-primary/5 dark:to-secondary/10 shadow-soft">
                    <CardContent className="p-4">
                      <p className="text-xs font-extrabold text-primary dark:text-primary">Spending by Category</p>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="h-28 w-28">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={dynamicChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={50}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {chartData.map((entry) => (
                                  <Cell key={entry.name} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          {dynamicChartData.slice(0, 4).map((item) => (
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
                );
              })()}

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

              {(() => {
                const categoryData = transactions
                  .filter((t) => t.type === "expense")
                  .reduce((acc, t) => {
                    acc[t.category] = (acc[t.category] || 0) + parseInt(t.amount.replace(/[^0-9]/g, ""));
                    return acc;
                  }, {} as Record<string, number>);

                const categoryBreakdown = Object.entries(categoryData)
                  .map(([cat, spent]) => {
                    const info = expenseCategories.find((c) => c.value === cat);
                    return {
                      name: info?.label || cat,
                      spent,
                      progress: monthlyBudget > 0 ? (spent / monthlyBudget) * 100 : 0,
                    };
                  })
                  .sort((a, b) => b.spent - a.spent)
                  .slice(0, 5);

                return (
                  <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
                    <CardContent className="p-3">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-extrabold text-muted-foreground">Budget Breakdown</p>
                        <span className="text-[10px] font-semibold text-primary">This month</span>
                      </div>
                      <div className="space-y-2.5">
                        {categoryBreakdown.map((budget) => (
                          <div key={budget.name}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold dark:text-white">{budget.name}</span>
                              <span className="text-xs font-extrabold text-muted-foreground dark:text-white/70">
                                ₹{budget.spent.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <ProgressBar value={Math.min(budget.progress, 100)} compact className="mt-1" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button variant="outline" onClick={() => onNavigate("goals")} className="h-12 dark:bg-white/5">
                  <Target className="size-4 mr-2" />
                  Goals
                </Button>
                <Button variant="outline" onClick={() => onNavigate("recurring")} className="h-12 dark:bg-white/5">
                  <RefreshCcw className="size-4 mr-2" />
                  Recurring
                </Button>
                <Button variant="outline" onClick={() => onNavigate("reports")} className="h-12 dark:bg-white/5">
                  <FileBarChart className="size-4 mr-2" />
                  Reports
                </Button>
                <Button variant="outline" onClick={() => onNavigate("categories")} className="h-12 dark:bg-white/5">
                  <Tags className="size-4 mr-2" />
                  Categories
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <BottomNav active="Insights" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}
