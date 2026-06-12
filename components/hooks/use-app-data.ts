import { useState, useEffect, useCallback, useRef } from "react";
import type {
  Transaction,
  Goal,
  Recurring,
  CustomCategory,
  User,
  FilterType,
} from "@/components/types";
import {
  categoryIcons,
  categoryTitles,
  seedTransactions,
  seedHistory,
  seedGoals,
  seedRecurring,
} from "@/components/constants";
import { generateId, formatAmount, sanitizeInput, csvEscape } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "spendstracks_data";
const STORAGE_VERSION = 1;

interface UseAppDataProps {
  isLoggedIn: boolean;
  user: User | null;
  showToast: (message: string, duration?: number, type?: "success" | "error" | "info" | "coming") => void;
}

export function useAppData({ isLoggedIn, user, showToast }: UseAppDataProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recurring, setRecurring] = useState<Recurring[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({
    food: 15000,
    shopping: 10000,
    transport: 5000,
    bills: 30000,
    entertainment: 8000,
    groceries: 12000,
  });
  const [monthlyBudget, setMonthlyBudget] = useState(160000);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const transactionsRef = useRef(transactions);
  transactionsRef.current = transactions;
  const monthlyBudgetRef = useRef(monthlyBudget);
  monthlyBudgetRef.current = monthlyBudget;

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveToStorage = useCallback((data: any) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const payload = { ...data, version: STORAGE_VERSION, savedAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    }, 500);
  }, []);

  // Fetch / Sync Data depending on User Auth State
  useEffect(() => {
    if (!isLoggedIn || !user) {
      setTransactions([]);
      setTransactionHistory([]);
      setGoals([]);
      setRecurring([]);
      setCustomCategories([]);
      setCategoryBudgets({
        food: 15000,
        shopping: 10000,
        transport: 5000,
        bills: 30000,
        entertainment: 8000,
        groceries: 12000,
      });
      setMonthlyBudget(160000);
      setIsLoading(false);
      return;
    }

    if (user.id === "admin-id") {
      setTransactions(seedTransactions);
      setTransactionHistory(seedHistory);
      setGoals(seedGoals);
      setRecurring(seedRecurring);
      setCustomCategories([]);
      setCategoryBudgets({
        food: 15000,
        shopping: 10000,
        transport: 5000,
        bills: 30000,
        entertainment: 8000,
        groceries: 12000,
      });
      setMonthlyBudget(160000);
      setIsLoading(false);
      return;
    }

    if (user.email === "guest@spendstracks.com") {
      setIsLoading(true);
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          setTransactions(data.transactions || []);
          setTransactionHistory(data.transactionHistory || []);
          setGoals(data.goals || []);
          setRecurring(data.recurring || []);
          setCustomCategories(data.customCategories || []);
          setCategoryBudgets(data.categoryBudgets || {
            food: 15000,
            shopping: 10000,
            transport: 5000,
            bills: 30000,
            entertainment: 8000,
            groceries: 12000,
          });
          setMonthlyBudget(data.monthlyBudget || 160000);
        } else {
          setTransactions([]);
          setTransactionHistory([]);
          setGoals([]);
          setRecurring([]);
          setCustomCategories([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Supabase Authenticated User
    const loadSupabaseData = async () => {
      setIsLoading(true);
      try {
        const [txsRes, goalsRes, recRes, catsRes, profileRes] = await Promise.all([
          supabase.from("transactions").select("*").eq("user_id", user.id).order("date", { ascending: false }),
          supabase.from("goals").select("*").eq("user_id", user.id),
          supabase.from("recurring_payments").select("*").eq("user_id", user.id),
          supabase.from("custom_categories").select("*").eq("user_id", user.id),
          supabase.from("profiles").select("*").eq("id", user.id).single()
        ]);

        if (txsRes.error) throw txsRes.error;
        if (goalsRes.error) throw goalsRes.error;
        if (recRes.error) throw recRes.error;
        if (catsRes.error) throw catsRes.error;

        const formattedTxs = txsRes.data.map(t => ({
          id: t.id,
          title: t.title,
          detail: t.detail || "",
          amount: Number(t.amount),
          tone: t.tone || "",
          icon: t.icon || "",
          date: t.date,
          type: t.type as "expense" | "income",
          category: t.category
        }));

        setTransactions(formattedTxs);
        setTransactionHistory(formattedTxs);

        setGoals(goalsRes.data.map(g => ({
          id: g.id,
          name: g.name,
          target: Number(g.target),
          current: Number(g.current),
          deadline: g.deadline,
          color: g.color
        })));

        setRecurring(recRes.data.map(r => ({
          id: r.id,
          title: r.title,
          amount: Number(r.amount),
          category: r.category,
          frequency: r.frequency as "daily" | "weekly" | "monthly",
          nextDate: r.next_date,
          type: r.type as "expense" | "income"
        })));

        setCustomCategories(catsRes.data.map(c => ({
          id: c.id,
          name: c.name,
          icon: c.icon,
          color: c.color,
          type: c.type as "expense" | "income"
        })));

        if (profileRes.data) {
          setMonthlyBudget(Number(profileRes.data.monthly_budget));
          setCategoryBudgets(profileRes.data.category_budgets || {});
        }
      } catch (err: any) {
        console.error("Error loading user data from Supabase:", err);
        showToast("Error loading data: " + err.message, 3000, "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadSupabaseData();
  }, [user, isLoggedIn, showToast]);

  // Local storage auto-save for Guest only
  useEffect(() => {
    if (isLoggedIn && user?.email === "guest@spendstracks.com") {
      saveToStorage({
        transactions,
        transactionHistory,
        goals,
        recurring,
        customCategories,
        categoryBudgets,
        monthlyBudget,
        user
      });
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [transactions, transactionHistory, goals, recurring, customCategories, categoryBudgets, monthlyBudget, user, isLoggedIn, saveToStorage]);

  const handleAddTransaction = useCallback(
    async (data: { amount: string; category: string; date: string; notes: string; type: "expense" | "income" }) => {
      const numericAmount = Math.round(parseFloat(data.amount));
      if (isNaN(numericAmount) || numericAmount <= 0) {
        showToast("Please enter a valid amount", 3000, "error");
        return;
      }

      const newTransaction: Transaction = {
        id: generateId(),
        title: categoryTitles[data.category] || sanitizeInput(data.category),
        detail: sanitizeInput(data.notes) || data.category,
        amount: numericAmount,
        tone: data.type === "income" ? "income" : data.category,
        icon: categoryIcons[data.category] || "T",
        date: data.date,
        type: data.type,
        category: data.category,
      };

      if (isLoggedIn && user && user.email !== "guest@spendstracks.com" && user.id !== "admin-id") {
        const { data: inserted, error } = await supabase
          .from("transactions")
          .insert({
            user_id: user.id,
            title: newTransaction.title,
            detail: newTransaction.detail,
            amount: newTransaction.amount,
            tone: newTransaction.tone,
            icon: newTransaction.icon,
            date: newTransaction.date || new Date().toISOString(),
            type: newTransaction.type,
            category: newTransaction.category
          })
          .select()
          .single();

        if (error) {
          showToast("Failed to save transaction: " + error.message, 3000, "error");
          return;
        }
        newTransaction.id = inserted.id;
      }

      setTransactions((prev) => [newTransaction, ...prev]);
      setTransactionHistory((prev) => [newTransaction, ...prev]);

      if (data.type === "expense") {
        const totalExpenses =
          transactionsRef.current
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0) + numericAmount;
        const budgetUsed = (totalExpenses / monthlyBudgetRef.current) * 100;

        if (budgetUsed > 100) {
          showToast("Budget exceeded! You've spent more than your monthly limit.", 4000, "error");
        } else if (budgetUsed > 80) {
          showToast(`Budget warning: You've used ${budgetUsed.toFixed(0)}% of your budget`, 3000, "info");
        } else {
          showToast("Expense added successfully!");
        }
      } else {
        showToast("Income added successfully!");
      }
    },
    [showToast, isLoggedIn, user]
  );

  const handleDeleteTransaction = useCallback(
    async (id: string) => {
      if (isLoggedIn && user && user.email !== "guest@spendstracks.com" && user.id !== "admin-id") {
        const { error } = await supabase.from("transactions").delete().eq("id", id);
        if (error) {
          showToast("Failed to delete transaction: " + error.message, 3000, "error");
          return;
        }
      }

      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setTransactionHistory((prev) => prev.filter((t) => t.id !== id));
      setSelectedTransaction(null);
      showToast("Transaction deleted");
    },
    [showToast, isLoggedIn, user]
  );

  const handleEditTransaction = useCallback(
    async (id: string, updates: Partial<Transaction>) => {
      const sanitizedUpdates: Partial<Transaction> = {};
      if (updates.title) sanitizedUpdates.title = sanitizeInput(updates.title);
      if (updates.detail) sanitizedUpdates.detail = sanitizeInput(updates.detail);
      if (updates.amount !== undefined) sanitizedUpdates.amount = updates.amount;

      if (isLoggedIn && user && user.email !== "guest@spendstracks.com" && user.id !== "admin-id") {
        const { error } = await supabase
          .from("transactions")
          .update({
            title: sanitizedUpdates.title,
            detail: sanitizedUpdates.detail,
            amount: sanitizedUpdates.amount
          })
          .eq("id", id);

        if (error) {
          showToast("Failed to update transaction: " + error.message, 3000, "error");
          return;
        }
      }

      setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...sanitizedUpdates } : t)));
      setTransactionHistory((prev) => prev.map((t) => (t.id === id ? { ...t, ...sanitizedUpdates } : t)));
      if (selectedTransaction?.id === id) {
        setSelectedTransaction((prev) => (prev ? { ...prev, ...sanitizedUpdates } : null));
      }
      showToast("Transaction updated");
    },
    [showToast, selectedTransaction, isLoggedIn, user]
  );

  const handleAddGoal = useCallback(
    async (goal: { name: string; target: number; deadline: string; color: string }) => {
      const newGoal: Goal = {
        id: generateId(),
        name: sanitizeInput(goal.name),
        target: goal.target,
        current: 0,
        deadline: goal.deadline,
        color: goal.color,
      };

      if (isLoggedIn && user && user.email !== "guest@spendstracks.com" && user.id !== "admin-id") {
        const { data: inserted, error } = await supabase
          .from("goals")
          .insert({
            user_id: user.id,
            name: newGoal.name,
            target: newGoal.target,
            current: newGoal.current,
            deadline: newGoal.deadline,
            color: newGoal.color
          })
          .select()
          .single();

        if (error) {
          showToast("Failed to save goal: " + error.message, 3000, "error");
          return;
        }
        newGoal.id = inserted.id;
      }

      setGoals((prev) => [...prev, newGoal]);
      showToast("Goal added successfully!");
    },
    [showToast, isLoggedIn, user]
  );

  const handleUpdateGoalProgress = useCallback(
    async (id: string, amount: number) => {
      const targetGoal = goals.find((g) => g.id === id);
      if (!targetGoal) return;

      const newCurrent = targetGoal.current + amount;

      if (isLoggedIn && user && user.email !== "guest@spendstracks.com" && user.id !== "admin-id") {
        const { error } = await supabase
          .from("goals")
          .update({ current: newCurrent })
          .eq("id", id);

        if (error) {
          showToast("Failed to update goal: " + error.message, 3000, "error");
          return;
        }
      }

      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, current: newCurrent } : g)));
      showToast("Goal updated!");
    },
    [showToast, goals, isLoggedIn, user]
  );

  const handleDeleteGoal = useCallback(
    async (id: string) => {
      if (isLoggedIn && user && user.email !== "guest@spendstracks.com" && user.id !== "admin-id") {
        const { error } = await supabase.from("goals").delete().eq("id", id);
        if (error) {
          showToast("Failed to delete goal: " + error.message, 3000, "error");
          return;
        }
      }

      setGoals((prev) => prev.filter((g) => g.id !== id));
      showToast("Goal deleted");
    },
    [showToast, isLoggedIn, user]
  );

  const handleAddRecurring = useCallback(
    async (recurringData: { title: string; amount: number; category: string; frequency: "daily" | "weekly" | "monthly"; type: "expense" | "income" }) => {
      const nextDate = new Date();
      if (recurringData.frequency === "daily") nextDate.setDate(nextDate.getDate() + 1);
      else if (recurringData.frequency === "weekly") nextDate.setDate(nextDate.getDate() + 7);
      else nextDate.setMonth(nextDate.getMonth() + 1);

      const newRecurring: Recurring = {
        id: generateId(),
        ...recurringData,
        title: sanitizeInput(recurringData.title),
        nextDate: nextDate.toISOString().split("T")[0],
      };

      if (isLoggedIn && user && user.email !== "guest@spendstracks.com" && user.id !== "admin-id") {
        const { data: inserted, error } = await supabase
          .from("recurring_payments")
          .insert({
            user_id: user.id,
            title: newRecurring.title,
            amount: newRecurring.amount,
            category: newRecurring.category,
            frequency: newRecurring.frequency,
            next_date: newRecurring.nextDate,
            type: newRecurring.type
          })
          .select()
          .single();

        if (error) {
          showToast("Failed to save recurring payment: " + error.message, 3000, "error");
          return;
        }
        newRecurring.id = inserted.id;
      }

      setRecurring((prev) => [...prev, newRecurring]);
      showToast("Recurring transaction added!");
    },
    [showToast, isLoggedIn, user]
  );

  const handleDeleteRecurring = useCallback(
    async (id: string) => {
      if (isLoggedIn && user && user.email !== "guest@spendstracks.com" && user.id !== "admin-id") {
        const { error } = await supabase.from("recurring_payments").delete().eq("id", id);
        if (error) {
          showToast("Failed to delete recurring: " + error.message, 3000, "error");
          return;
        }
      }

      setRecurring((prev) => prev.filter((r) => r.id !== id));
      showToast("Recurring transaction deleted");
    },
    [showToast, isLoggedIn, user]
  );

  const handleAddCustomCategory = useCallback(
    async (cat: { name: string; icon: string; color: string; type: "expense" | "income" }) => {
      const newCat: CustomCategory = { id: generateId(), ...cat, name: sanitizeInput(cat.name) };

      if (isLoggedIn && user && user.email !== "guest@spendstracks.com" && user.id !== "admin-id") {
        const { data: inserted, error } = await supabase
          .from("custom_categories")
          .insert({
            user_id: user.id,
            name: newCat.name,
            icon: newCat.icon,
            color: newCat.color,
            type: newCat.type
          })
          .select()
          .single();

        if (error) {
          showToast("Failed to save category: " + error.message, 3000, "error");
          return;
        }
        newCat.id = inserted.id;
      }

      setCustomCategories((prev) => [...prev, newCat]);
      showToast("Category added!");
    },
    [showToast, isLoggedIn, user]
  );

  const handleDeleteCategory = useCallback(
    async (id: string) => {
      if (isLoggedIn && user && user.email !== "guest@spendstracks.com" && user.id !== "admin-id") {
        const { error } = await supabase.from("custom_categories").delete().eq("id", id);
        if (error) {
          showToast("Failed to delete category: " + error.message, 3000, "error");
          return;
        }
      }

      setCustomCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("Category deleted");
    },
    [showToast, isLoggedIn, user]
  );

  const handleSetCategoryBudget = useCallback(
    async (category: string, amount: number) => {
      const updatedCategoryBudgets = {
        ...categoryBudgets,
        [category]: amount,
      };

      if (isLoggedIn && user && user.email !== "guest@spendstracks.com" && user.id !== "admin-id") {
        const { error } = await supabase
          .from("profiles")
          .update({ category_budgets: updatedCategoryBudgets })
          .eq("id", user.id);

        if (error) {
          showToast("Failed to update category budget: " + error.message, 3000, "error");
          return;
        }
      }

      setCategoryBudgets(updatedCategoryBudgets);
      showToast(`Budget for ${categoryTitles[category] || category} updated to ₹${amount.toLocaleString("en-IN")}`);
    },
    [showToast, categoryBudgets, isLoggedIn, user]
  );

  const handleSetMonthlyBudget = useCallback(
    async (amount: number) => {
      if (isLoggedIn && user && user.email !== "guest@spendstracks.com" && user.id !== "admin-id") {
        const { error } = await supabase
          .from("profiles")
          .update({ monthly_budget: amount })
          .eq("id", user.id);

        if (error) {
          showToast("Failed to update monthly budget: " + error.message, 3000, "error");
          return;
        }
      }

      setMonthlyBudget(amount);
    },
    [showToast, isLoggedIn, user]
  );

  const exportToCSV = useCallback(() => {
    const allTransactions = [...transactions, ...transactionHistory];
    const headers = ["Date", "Title", "Category", "Type", "Amount"];
    const rows = allTransactions.map((t) => [
      csvEscape(t.date || new Date().toISOString().split("T")[0]),
      csvEscape(t.title),
      csvEscape(t.category),
      csvEscape(t.type),
      csvEscape(formatAmount(t.amount, t.type)),
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spendstracks-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Data exported successfully!");
  }, [transactions, transactionHistory, showToast]);

  const getFilteredTransactions = useCallback(() => {
    let filtered =
      filter === "all"
        ? transactionHistory
        : transactionHistory.filter((t) => t.type === filter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.detail.toLowerCase().includes(q)
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
    categoryBudgets,
    setCategoryBudgets,
    handleSetCategoryBudget,
    monthlyBudget,
    setMonthlyBudget: handleSetMonthlyBudget,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    selectedTransaction,
    setSelectedTransaction,
    isLoading,
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
    getFilteredTransactions,
  };
}
