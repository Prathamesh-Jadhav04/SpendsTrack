"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Sparkles, Bot, User, IndianRupee, Brain, Target, RefreshCcw, ShieldCheck, Wallet } from "lucide-react";
import { PhoneFrame, ScreenHeader } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Screen, Transaction, Goal, Recurring } from "@/components/types";
import { categoryTitles } from "@/components/constants";
import { useCurrency } from "@/components/hooks";

interface AskAIScreenProps {
  onNavigate: (screen: Screen) => void;
  transactions: Transaction[];
  goals: Goal[];
  recurring: Recurring[];
  monthlyBudget: number;
  categoryBudgets: Record<string, number>;
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
  insightType?: "spending" | "goals" | "budgets" | "subscriptions" | "general";
}

export function AskAIScreen({
  onNavigate,
  transactions,
  goals,
  recurring,
  monthlyBudget,
  categoryBudgets,
}: AskAIScreenProps) {
  const { symbol, formatRaw } = useCurrency();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I am your SpendsTracks AI Financial Advisor. I have analyzed your transactions, budgets, savings goals, and recurring subscriptions. How can I help you optimize your finances today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState("Analyzing transaction history...");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Rotate typing status labels
  useEffect(() => {
    if (!isTyping) {
      setTypingStatus("Analyzing transaction history...");
      return;
    }

    const statuses = [
      "Analyzing transaction history...",
      "Auditing budget constraints...",
      "Evaluating goals milestones...",
      "Projecting savings rates...",
      "Drafting financial recommendations..."
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx = (currentIdx + 1) % statuses.length;
      setTypingStatus(statuses[currentIdx]);
    }, 1500);

    return () => clearInterval(interval);
  }, [isTyping]);

  // Dynamically analyze user financial metrics
  const financialStats = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const income = transactions.filter((t) => t.type === "income");

    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

    // Highest spending category
    const spendsByCat = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    let topCategory = "None";
    let topCategoryAmount = 0;
    Object.entries(spendsByCat).forEach(([cat, amount]) => {
      if (amount > topCategoryAmount) {
        topCategory = cat;
        topCategoryAmount = amount;
      }
    });

    const topCategoryLabel = categoryTitles[topCategory] || topCategory;

    // Budget check
    const exceededCategories: { category: string; spent: number; budget: number }[] = [];
    Object.entries(categoryBudgets).forEach(([cat, limit]) => {
      const spent = spendsByCat[cat] || 0;
      if (limit > 0 && spent > limit) {
        exceededCategories.push({
          category: categoryTitles[cat] || cat,
          spent,
          budget: limit,
        });
      }
    });

    return {
      totalExpenses,
      totalIncome,
      netSavings,
      savingsRate,
      topCategoryLabel,
      topCategoryAmount,
      spendsByCat,
      exceededCategories,
    };
  }, [transactions, categoryBudgets]);

  // Generate dynamic, hyper-personalized AI response based on real state
  const getAIResponse = (text: string): { reply: string; type: ChatMessage["insightType"] } => {
    const query = text.toLowerCase();

    // 1. Spending habits query
    if (query.includes("spending") || query.includes("habit") || query.includes("expense") || query.includes("spent") || query.includes("1")) {
      const rate = financialStats.savingsRate;
      let advice = "";
      if (rate >= 40) {
        advice = "Excellent job! Your savings rate is outstanding. You have strong control over your cash flow.";
      } else if (rate >= 20) {
        advice = "Good! You are maintaining a healthy savings buffer. Aim to increase it by cutbacks on discretionary spending.";
      } else if (rate > 0) {
        advice = "Your savings rate is positive but low. Consider checking your top spending categories for potential savings.";
      } else {
        advice = "Warning: Your net cash flow is negative. You are spending more than you earn. Immediate action is recommended to cut non-essential expenses.";
      }

      const reply = `### 📊 Spending Habits Analysis

• **Total Earned:** ${symbol}${formatRaw(financialStats.totalIncome)}
• **Total Spent:** ${symbol}${formatRaw(financialStats.totalExpenses)}
• **Net Savings:** ${symbol}${formatRaw(financialStats.netSavings)}
• **Savings Rate:** ${financialStats.savingsRate}%

Your highest spending category is **${financialStats.topCategoryLabel}**, where you spent **${symbol}${formatRaw(financialStats.topCategoryAmount)}**.

**Advisor Recommendation:** ${advice}`;

      return { reply, type: "spending" };
    }

    // 2. Savings goals query
    if (query.includes("goal") || query.includes("savings") || query.includes("save") || query.includes("target") || query.includes("2")) {
      if (goals.length === 0) {
        return {
          reply: "### 🎯 Savings Goals status\n\nYou currently have no active savings goals set. Setting up specific goals (like an emergency fund, travel plan, or electronics purchases) is a great motivator for savings! Go to the **Goals** screen to add one.",
          type: "goals",
        };
      }

      let goalsReport = "### 🎯 Savings Goals Analysis\n\n";
      goals.forEach((goal) => {
        const remaining = goal.target - goal.current;
        const pct = Math.min((goal.current / goal.target) * 100, 100);
        const days = Math.round((new Date(goal.deadline).getTime() - Date.now()) / (86400000));
        const months = Math.max(1, Math.round(days / 30));
        const neededPerMonth = remaining > 0 ? Math.round(remaining / months) : 0;

        goalsReport += `• **${goal.name}:** Completed **${pct.toFixed(0)}%** (${symbol}${formatRaw(goal.current)} of ${symbol}${formatRaw(goal.target)}).
  * *Deadline:* ${new Date(goal.deadline).toLocaleDateString("en-IN")} (${days > 0 ? `${days} days left` : "past due"})
  * *Required Contribution:* Save **${symbol}${formatRaw(neededPerMonth)}/month** to hit your target.
\n`;
      });

      const canHitAll = financialStats.netSavings >= goals.reduce((sum, g) => sum + (g.target - g.current), 0) / 12;
      goalsReport += `**Advisor Recommendation:** ${
        canHitAll
          ? "Based on your current monthly savings rate, you are on track to fund your savings targets comfortably."
          : "Your current savings buffer may be tight for these targets. Consider extending your deadlines or allocating more cash flow to savings."
      }`;

      return { reply: goalsReport, type: "goals" };
    }

    // 3. Budgets query
    if (query.includes("budget") || query.includes("limit") || query.includes("exceed") || query.includes("3")) {
      const totalBudget = monthlyBudget;
      const totalSpent = financialStats.totalExpenses;
      const overallUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

      let budgetReport = `### 📋 Budget Tracking Report

• **Monthly Budget Limit:** ${symbol}${formatRaw(totalBudget)}
• **Total Month Expenses:** ${symbol}${formatRaw(totalSpent)}
• **Budget Exhaustion:** **${overallUsed}%**
\n`;

      if (financialStats.exceededCategories.length > 0) {
        budgetReport += `⚠️ **Over-budget Categories:**\n`;
        financialStats.exceededCategories.forEach((cat) => {
          budgetReport += `• **${cat.category}:** Spent ${symbol}${formatRaw(cat.spent)} (Limit: ${symbol}${formatRaw(cat.budget)}) — **${symbol}${formatRaw(cat.spent - cat.budget)} over budget**\n`;
        });
      } else {
        budgetReport += `✅ **All category budgets are within limits.** Nice tracking!\n`;
      }

      budgetReport += `\n**Advisor Recommendation:** ${
        overallUsed > 100
          ? "You have breached your total monthly budget. Restrict your shopping and dining spends for the remainder of the month."
          : overallUsed > 80
          ? "You have consumed over 80% of your monthly budget. Slow down on discretionary categories."
          : "Your overall spending is well within your monthly budget limits."
      }`;

      return { reply: budgetReport, type: "budgets" };
    }

    // 4. Subscriptions query
    if (query.includes("subscription") || query.includes("recurring") || query.includes("bill") || query.includes("4")) {
      if (recurring.length === 0) {
        return {
          reply: "### 🔄 Recurring Subscriptions\n\nNo recurring transactions or subscriptions found. Keeping recurring bills to a minimum is a powerful way to plug minor cash leaks!",
          type: "subscriptions",
        };
      }

      const monthlyCost = recurring
        .filter((r) => r.type === "expense")
        .reduce((sum, r) => sum + r.amount, 0);
      const annualCost = monthlyCost * 12;

      let subReport = `### 🔄 Recurring Subscriptions Audit

You have **${recurring.length}** active recurring expense items:
\n`;

      recurring.forEach((sub) => {
        subReport += `• **${sub.title}:** ${symbol}${formatRaw(sub.amount)} / ${sub.frequency} (Category: ${categoryTitles[sub.category] || sub.category})\n`;
      });

      subReport += `\n• **Monthly Recurring Burden:** ${symbol}${formatRaw(monthlyCost)}
• **Projected Annual Cost:** **${symbol}${formatRaw(annualCost)} / year**
\n
**Advisor Recommendation:** Check if you still actively use these subscriptions. Canceling even a single ${symbol}${formatRaw(500)}/month entertainment platform returns ${symbol}${formatRaw(6000)} back to your yearly savings!`;

      return { reply: subReport, type: "subscriptions" };
    }

    // 5. Help / Greeting
    if (query.includes("help") || query.includes("hi") || query.includes("hello") || query.includes("how")) {
      return {
        reply: "### 💡 SpendsTracks Advisor Help\n\nYou can ask me specific questions or type details. Here are some of the popular checks:\n\n1. **Analyze Spending:** 'How much did I spend this month?'\n2. **Goals Progress:** 'Will I reach my Vacation goal?'\n3. **Budget Status:** 'Show my category budget limits'\n4. **Subscriptions:** 'List my subscriptions'\n\nJust type your question below or click a quick suggestion button!",
        type: "general",
      };
    }

    // Default Fallback
    return {
      reply: `### 🤖 AI Financial Summary

Thanks for your query. Here is a quick review of your active account stats:

• **Income vs. Spends:** Earned ${symbol}${formatRaw(financialStats.totalIncome)} and spent ${symbol}${formatRaw(financialStats.totalExpenses)} (Net savings: ${symbol}${formatRaw(financialStats.netSavings)}).
• **Budget Alert:** You have utilized **${(financialStats.totalExpenses / (monthlyBudget || 1) * 100).toFixed(0)}%** of your ${symbol}${formatRaw(monthlyBudget)} global budget limit.
• **Top Spend:** Your highest outgo is under **${financialStats.topCategoryLabel}** (${symbol}${formatRaw(financialStats.topCategoryAmount)}).

Please ask a specific question (e.g., about budgets, goals, or subscriptions) for a deep-dive analysis!`,
      type: "general",
    };
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          context: {
            transactions,
            goals,
            recurring,
            monthlyBudget,
            categoryBudgets,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to contact advisor server.");
      }

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "ai",
        text: data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "ai",
        text: "### ⚠️ Advisor Connection Error\n\nI was unable to analyze your finances at this moment. Please check your internet connection or server configurations.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <PhoneFrame label="Ask AI screen" className="pb-28 lg:pb-0">
      <div className="flex flex-col h-[calc(100dvh-130px)] lg:h-[750px] relative overflow-hidden">
        {/* Vercel Mesh Gradient Atmosphere Backdrop */}
        <div className="absolute inset-0 mesh-gradient opacity-40 dark:opacity-20 pointer-events-none z-0" aria-hidden="true" />

        <div className="relative z-10 flex flex-col h-full">
          <ScreenHeader
            eyebrow="AI Assistant"
            title={
              <div className="flex items-center gap-1.5">
                <Brain className="size-5 text-primary animate-pulse" />
                <span>Ask AI Advisor</span>
              </div>
            }
            action={
              <Button size="sm" variant="outline" onClick={() => onNavigate("dashboard")} className="rounded-full">
                <ArrowLeft className="size-4 mr-1" />
                Back
              </Button>
            }
          />

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto px-1 py-4 space-y-4 no-scrollbar smooth-scroll">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex items-start gap-2 max-w-[85%]",
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "size-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm",
                  msg.sender === "user" ? "bg-primary" : "bg-gradient-to-tr from-purple-600 to-indigo-500"
                )}>
                  {msg.sender === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                </div>

                {/* Message bubble */}
                <div className={cn(
                  "p-3 rounded-2xl border text-sm shadow-level-2 transition-all",
                  msg.sender === "user"
                    ? "bg-primary text-white border-primary rounded-tr-none"
                    : "bg-white/95 dark:bg-card border-border/80 rounded-tl-none text-foreground prose prose-sm dark:prose-invert"
                )}>
                  {msg.sender === "user" ? (
                    <p className="whitespace-pre-wrap font-semibold leading-snug">{msg.text}</p>
                  ) : (
                    <div className="space-y-1.5 leading-snug font-medium">
                      {/* Markdown processing for headers/bullets */}
                      {msg.text.split("\n").map((line, idx) => {
                        if (line.startsWith("### ")) {
                          return <h4 key={idx} className="text-sm font-extrabold text-primary border-b border-border/40 pb-1 mt-1 mb-2">{line.replace("### ", "")}</h4>;
                        }
                        if (line.startsWith("• ")) {
                          return <div key={idx} className="pl-1.5 py-0.5">{line}</div>;
                        }
                        if (line.startsWith("  * ")) {
                          return <div key={idx} className="pl-6 text-xs text-muted-foreground">{line.replace("  * ", "• ")}</div>;
                        }
                        if (line.startsWith("⚠️") || line.startsWith("✅")) {
                          return <p key={idx} className="font-extrabold text-xs mt-2">{line}</p>;
                        }
                        return <p key={idx} className="text-xs">{line}</p>;
                      })}
                    </div>
                  )}
                  <span className={cn(
                    "text-[8px] mt-1 block text-right font-medium opacity-60",
                    msg.sender === "user" ? "text-white/85" : "text-muted-foreground"
                  )}>
                    {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* AI Typing Simulator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 max-w-[80%] mr-auto"
                >
                  <div className="size-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shrink-0">
                    <Bot className="size-4" />
                  </div>
                  <div className="p-3 bg-white/95 dark:bg-card border border-border/80 rounded-2xl rounded-tl-none shadow-level-2 flex flex-col gap-1.5 min-w-[200px]">
                    <div className="flex items-center gap-1">
                      <span className="size-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="size-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="size-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold italic animate-pulse">
                      {typingStatus}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-1 py-2 overflow-x-auto no-scrollbar flex gap-2 shrink-0 border-t border-border/20 bg-white/20 dark:bg-black/10 backdrop-blur-md">
            {[
              { text: "Analyze Spending", icon: Wallet, query: "Analyze my spending habits" },
              { text: "Verify Goals", icon: Target, query: "Will I reach my goals?" },
              { text: "Check Budgets", icon: ShieldCheck, query: "Compare spends vs budgets" },
              { text: "Subscription Audit", icon: RefreshCcw, query: "Scan for recurring subscriptions" },
            ].map((chip) => (
              <button
                key={chip.text}
                onClick={() => handleSendMessage(chip.query)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-white/80 dark:bg-white/5 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/10 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
              >
                <chip.icon className="size-3 text-primary" />
                <span>{chip.text}</span>
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="p-2 border-t border-border/30 bg-white/90 dark:bg-black/60 backdrop-blur-md shrink-0 flex gap-2 items-center">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage(inputText);
              }}
              placeholder="Ask anything about your spends..."
              className="flex-1 rounded-2xl h-10 border-border/80 focus-visible:ring-primary focus-visible:ring-1"
            />
            <Button
              onClick={() => handleSendMessage(inputText)}
              className="size-10 rounded-2xl bg-primary hover:bg-primary/95 text-white flex items-center justify-center shrink-0"
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
