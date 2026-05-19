import { useState, useEffect, useCallback } from "react";
import type {
  Transaction,
  Goal,
  Recurring,
  CustomCategory,
  User,
  FilterType,
} from "@/components/types";
import {
  expenseCategories,
  incomeCategories,
  categoryIcons,
  categoryTitles,
} from "@/components/constants";

const generateId = () => Math.random().toString(36).substring(2, 15);

const initialTransactions: Transaction[] = [
  { id: "1", title: "Zomato", detail: "Food & Dining", amount: "-₹1,250", tone: "food", icon: "Z", type: "expense", category: "food" },
  { id: "2", title: "Salary", detail: "Monthly Salary", amount: "+₹85,000", tone: "income", icon: "S", type: "income", category: "salary" },
  { id: "3", title: "Metro Card", detail: "Transport", amount: "-₹500", tone: "transport", icon: "M", type: "expense", category: "transport" },
  { id: "4", title: "Shopping", detail: "Clothes", amount: "-₹3,200", tone: "shopping", icon: "S", type: "expense", category: "shopping" },
  { id: "5", title: "Electricity", detail: "Bills", amount: "-₹2,800", tone: "bills", icon: "E", type: "expense", category: "bills" },
  { id: "6", title: "Netflix", detail: "Entertainment", amount: "-₹649", tone: "entertainment", icon: "N", type: "expense", category: "entertainment" },
];

const initialHistory: Transaction[] = [
  { id: "7", title: "Swiggy", detail: "Today, 1:30 PM", amount: "-₹420", tone: "food", icon: "S", type: "expense", category: "food" },
  { id: "8", title: "Salary", detail: "Today, 9:00 AM", amount: "+₹85,000", tone: "income", icon: "S", type: "income", category: "salary" },
  { id: "9", title: "Uber", detail: "Yesterday, 8:45 PM", amount: "-₹380", tone: "transport", icon: "U", type: "expense", category: "transport" },
  { id: "10", title: "Myntra", detail: "Yesterday", amount: "-₹2,100", tone: "shopping", icon: "M", type: "expense", category: "shopping" },
  { id: "11", title: "Gas Bill", detail: "2 days ago", amount: "-₹1,450", tone: "bills", icon: "G", type: "expense", category: "bills" },
  { id: "12", title: "Gym", detail: "3 days ago", amount: "-₹2,000", tone: "health", icon: "G", type: "expense", category: "health" },
  { id: "13", title: "Amazon", detail: "4 days ago", amount: "-₹1,890", tone: "shopping", icon: "A", type: "expense", category: "shopping" },
  { id: "14", title: "Movie", detail: "5 days ago", amount: "-₹450", tone: "entertainment", icon: "M", type: "expense", category: "entertainment" },
  { id: "15", title: "Freelance", detail: "Last week", amount: "+₹25,000", tone: "income", icon: "F", type: "income", category: "freelance" },
  { id: "16", title: "Grocery", detail: "Last week", amount: "-₹3,500", tone: "groceries", icon: "G", type: "expense", category: "groceries" },
  { id: "17", title: "Flight", detail: "Last week", amount: "-₹8,500", tone: "travel", icon: "F", type: "expense", category: "travel" },
  { id: "18", title: "Course", detail: "2 weeks ago", amount: "-₹5,000", tone: "education", icon: "C", type: "expense", category: "education" },
];

const initialGoals: Goal[] = [
  { id: "1", name: "Vacation", target: 50000, current: 32500, deadline: "2026-12-31", color: "#7766e8" },
  { id: "2", name: "Emergency Fund", target: 100000, current: 45000, deadline: "2026-06-30", color: "#10b889" },
  { id: "3", name: "New Phone", target: 80000, current: 65000, deadline: "2026-09-15", color: "#f4b740" },
];

const initialRecurring: Recurring[] = [
  { id: "1", title: "Netflix", amount: 649, category: "entertainment", frequency: "monthly", nextDate: "2026-06-15", type: "expense" },
  { id: "2", title: "Gym", amount: 2000, category: "health", frequency: "monthly", nextDate: "2026-06-01", type: "expense" },
  { id: "3", title: "Rent", amount: 25000, category: "bills", frequency: "monthly", nextDate: "2026-06-01", type: "expense" },
];

interface UseAppDataProps {
  isLoggedIn: boolean;
  user: User | null;
  showToast: (message: string, duration?: number, type?: "success" | "error" | "info" | "coming") => void;
}

export function useAppData({ isLoggedIn, user, showToast }: UseAppDataProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(initialHistory);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [recurring, setRecurring] = useState<Recurring[]>(initialRecurring);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState(160000);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("spendstracks_data");
    if (saved) {
      const data = JSON.parse(saved);
      setTransactions(data.transactions || initialTransactions);
      setTransactionHistory(data.transactionHistory || initialHistory);
      setGoals(data.goals || initialGoals);
      setRecurring(data.recurring || initialRecurring);
      setCustomCategories(data.customCategories || []);
      setMonthlyBudget(data.monthlyBudget || 160000);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage on data change
  useEffect(() => {
    if (isLoggedIn) {
      const data = { transactions, transactionHistory, goals, recurring, customCategories, monthlyBudget, user };
      localStorage.setItem("spendstracks_data", JSON.stringify(data));
    }
  }, [transactions, transactionHistory, goals, recurring, customCategories, monthlyBudget, user, isLoggedIn]);

  const handleAddTransaction = useCallback(
    (data: { amount: string; category: string; date: string; notes: string; type: "expense" | "income" }) => {
      const prefix = data.type === "expense" ? "-" : "+";
      const newTransaction: Transaction = {
        id: generateId(),
        title: categoryTitles[data.category] || data.category,
        detail: data.notes || data.category,
        amount: `${prefix}₹${Number(data.amount).toLocaleString("en-IN")}`,
        tone: data.type === "income" ? "income" : data.category,
        icon: categoryIcons[data.category] || "T",
        date: data.date,
        type: data.type,
        category: data.category,
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      setTransactionHistory((prev) => [newTransaction, ...prev]);

      if (data.type === "expense") {
        const newExpense = parseInt(data.amount);
        const totalExpenses =
          transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0) + newExpense;
        const budgetUsed = (totalExpenses / monthlyBudget) * 100;

        if (budgetUsed > 100) {
          showToast("⚠️ Budget exceeded! You've spent more than your monthly limit.");
        } else if (budgetUsed > 80) {
          showToast(`⚠️ Budget warning: You've used ${budgetUsed.toFixed(0)}% of your budget`);
        } else {
          showToast("Expense added successfully!");
        }
      } else {
        showToast("Income added successfully!");
      }
    },
    [transactions, monthlyBudget, showToast]
  );

  const handleDeleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setTransactionHistory((prev) => prev.filter((t) => t.id !== id));
      setSelectedTransaction(null);
    },
    []
  );

  const handleEditTransaction = useCallback(
    (id: string, updates: Partial<Transaction>) => {
      setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
      setTransactionHistory((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
      setSelectedTransaction(null);
    },
    []
  );

  const handleAddGoal = useCallback(
    (goal: { name: string; target: number; deadline: string; color: string }) => {
      const newGoal: Goal = {
        id: generateId(),
        name: goal.name,
        target: goal.target,
        current: 0,
        deadline: goal.deadline,
        color: goal.color,
      };
      setGoals((prev) => [...prev, newGoal]);
    },
    []
  );

  const handleUpdateGoalProgress = useCallback((id: string, amount: number) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, current: g.current + amount } : g)));
  }, []);

  const handleDeleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const handleAddRecurring = useCallback(
    (recurringData: { title: string; amount: number; category: string; frequency: "daily" | "weekly" | "monthly"; type: "expense" | "income" }) => {
      const nextDate = new Date();
      if (recurringData.frequency === "daily") nextDate.setDate(nextDate.getDate() + 1);
      else if (recurringData.frequency === "weekly") nextDate.setDate(nextDate.getDate() + 7);
      else nextDate.setMonth(nextDate.getMonth() + 1);

      const newRecurring: Recurring = {
        id: generateId(),
        ...recurringData,
        nextDate: nextDate.toISOString().split("T")[0],
      };
      setRecurring((prev) => [...prev, newRecurring]);
    },
    []
  );

  const handleDeleteRecurring = useCallback((id: string) => {
    setRecurring((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleAddCustomCategory = useCallback(
    (cat: { name: string; icon: string; color: string; type: "expense" | "income" }) => {
      const newCat: CustomCategory = { id: generateId(), ...cat };
      setCustomCategories((prev) => [...prev, newCat]);
    },
    []
  );

  const handleDeleteCategory = useCallback((id: string) => {
    setCustomCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const exportToCSV = useCallback(() => {
    const headers = ["Date", "Title", "Category", "Type", "Amount"];
    const rows = transactionHistory.map((t) => [
      t.date || new Date().toISOString().split("T")[0],
      t.title,
      t.category,
      t.type,
      t.amount,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spendstracks-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Data exported successfully!");
  }, [transactionHistory, showToast]);

  const getMonthlyStats = useCallback(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthTransactions = transactionHistory.filter(
      (t) => t.date && new Date(t.date) >= monthStart
    );
    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);
    const expense = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);
    return { income, expense, savings: income - expense };
  }, [transactionHistory]);

  const getFilteredTransactions = useCallback(() => {
    let filtered =
      filter === "all"
        ? transactionHistory
        : transactionHistory.filter((t) =>
            filter === "expense" ? t.amount.startsWith("-") : t.amount.startsWith("+")
          );
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.detail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [transactionHistory, filter, searchQuery]);

  return {
    transactions,
    setTransactions,
    transactionHistory,
    setTransactionHistory,
    goals,
    setGoals,
    recurring,
    setRecurring,
    customCategories,
    setCustomCategories,
    monthlyBudget,
    setMonthlyBudget,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    selectedTransaction,
    setSelectedTransaction,
    isLoading,
    setIsLoading,
    handleAddTransaction,
    handleDeleteTransaction,
    handleEditTransaction,
    handleAddGoal,
    handleUpdateGoalProgress,
    handleDeleteGoal,
    handleAddRecurring,
    handleDeleteRecurring,
    handleAddCustomCategory,
    handleDeleteCategory,
    exportToCSV,
    getMonthlyStats,
    getFilteredTransactions,
  };
}
