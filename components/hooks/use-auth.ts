import { useState, useCallback } from "react";
import type { User, Screen, Transaction, Goal, Recurring, CustomCategory } from "@/components/types";

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

interface UseAuthProps {
  showToast: (message: string, duration?: number, type?: "success" | "error" | "info" | "coming") => void;
  setCurrentScreen: (screen: Screen) => void;
  setTransactions: (fn: Transaction[] | ((prev: Transaction[]) => Transaction[])) => void;
  setTransactionHistory: (fn: Transaction[] | ((prev: Transaction[]) => Transaction[])) => void;
  setGoals: (fn: Goal[] | ((prev: Goal[]) => Goal[])) => void;
  setRecurring: (fn: Recurring[] | ((prev: Recurring[]) => Recurring[])) => void;
  setCustomCategories: (fn: CustomCategory[] | ((prev: CustomCategory[]) => CustomCategory[])) => void;
  setMonthlyBudget: (budget: number) => void;
}

export function useAuth({
  showToast,
  setCurrentScreen,
  setTransactions,
  setTransactionHistory,
  setGoals,
  setRecurring,
  setCustomCategories,
  setMonthlyBudget,
}: UseAuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = useCallback(
    (email: string, name?: string) => {
      const isAdmin = email.toLowerCase().includes("admin");
      const userName = name || email.split("@")[0];
      const newUser: User = {
        id: generateId(),
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        email: email.toLowerCase(),
        role: isAdmin ? "admin" : "user",
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      setIsLoggedIn(true);

      if (isAdmin) {
        setTransactions(initialTransactions);
        setTransactionHistory(initialHistory);
        setGoals(initialGoals);
        setRecurring(initialRecurring);
        setMonthlyBudget(160000);
        showToast("Welcome Admin! Testing mode enabled");
      } else {
        const saved = localStorage.getItem("spendstracks_data");
        if (saved) {
          const data = JSON.parse(saved);
          setTransactions(data.transactions || []);
          setTransactionHistory(data.transactionHistory || []);
          setGoals(data.goals || []);
          setRecurring(data.recurring || []);
          setCustomCategories(data.customCategories || []);
          setMonthlyBudget(data.monthlyBudget || 160000);
        }
        showToast(`Welcome back, ${newUser.name}!`);
      }
      setCurrentScreen("dashboard");
    },
    [showToast, setCurrentScreen, setTransactions, setTransactionHistory, setGoals, setRecurring, setCustomCategories, setMonthlyBudget]
  );

  const handleGuestLogin = useCallback(() => {
    const guestUser: User = {
      id: generateId(),
      name: "Guest",
      email: "guest@spendstracks.com",
      role: "user",
      createdAt: new Date().toISOString(),
    };
    setUser(guestUser);
    setTransactions([]);
    setTransactionHistory([]);
    setGoals([]);
    setRecurring([]);
    setCustomCategories([]);
    setMonthlyBudget(160000);
    setIsLoggedIn(true);
    setCurrentScreen("dashboard");
    showToast("Welcome! Create an account to save your data");
  }, [showToast, setCurrentScreen, setTransactions, setTransactionHistory, setGoals, setRecurring, setCustomCategories, setMonthlyBudget]);

  const handleSignUp = useCallback(
    (email: string, name: string) => {
      const newUser: User = {
        id: generateId(),
        name,
        email: email.toLowerCase(),
        role: "user",
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      setTransactions([]);
      setTransactionHistory([]);
      setGoals([]);
      setRecurring([]);
      setCustomCategories([]);
      setMonthlyBudget(160000);
      setIsLoggedIn(true);
      setCurrentScreen("dashboard");
      showToast(`Welcome, ${newUser.name}! Your account is created.`);
    },
    [showToast, setCurrentScreen, setTransactions, setTransactionHistory, setGoals, setRecurring, setCustomCategories, setMonthlyBudget]
  );

  const handleLogout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentScreen("login");
  }, [setCurrentScreen]);

  return {
    user,
    isLoggedIn,
    setUser,
    handleLogin,
    handleGuestLogin,
    handleSignUp,
    handleLogout,
    initialTransactions,
    initialHistory,
    initialGoals,
    initialRecurring,
  };
}
