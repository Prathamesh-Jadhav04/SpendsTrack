"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Eye,
  EyeOff,
  FileBarChart,
  FileText,
  Globe,
  Headphones,
  HelpCircle,
  Home,
  KeyRound,
  Languages,
  LockKeyhole,
  LogIn,
  LogOut,
  Mail,
  Moon,
  Plus,
  ReceiptText,
  RefreshCcw,
  Shield,
  ShieldCheck,
  Search,
  Settings2,
  Smartphone,
  Sparkles,
  Sun,
  Tags,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  UserPlus,
  UserRound,
  WalletCards,
  Bell,
  Zap
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

type Transaction = {
  id: string;
  title: string;
  detail: string;
  amount: string;
  tone: string;
  icon: string;
  date?: string;
  type: "expense" | "income";
  category: string;
};

type Goal = {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
};

type Recurring = {
  id: string;
  title: string;
  amount: number;
  category: string;
  frequency: "daily" | "weekly" | "monthly";
  nextDate: string;
  type: "expense" | "income";
};

type CustomCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "expense" | "income";
};

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
};

const expenseCategories = [
  { value: "food", label: "Food & Dining", icon: "F", color: "#ff6b5f" },
  { value: "shopping", label: "Shopping", icon: "S", color: "#f4b740" },
  { value: "transport", label: "Transport", icon: "T", color: "#64a7ff" },
  { value: "bills", label: "Bills", icon: "B", color: "#ff6b5f" },
  { value: "entertainment", label: "Entertainment", icon: "E", color: "#7766e8" },
  { value: "health", label: "Health & Fitness", icon: "H", color: "#10b889" },
  { value: "education", label: "Education", icon: "U", color: "#0f8f72" },
  { value: "groceries", label: "Groceries", icon: "G", color: "#f97316" },
  { value: "travel", label: "Travel", icon: "T", color: "#64a7ff" },
  { value: "other", label: "Other", icon: "O", color: "#7766e8" }
];

const incomeCategories = [
  { value: "salary", label: "Salary", icon: "S", color: "#10b889" },
  { value: "freelance", label: "Freelance", icon: "F", color: "#0f8f72" },
  { value: "investment", label: "Investment", icon: "I", color: "#64a7ff" },
  { value: "gift", label: "Gift", icon: "G", color: "#f4b740" },
  { value: "refund", label: "Refund", icon: "R", color: "#7766e8" },
  { value: "other", label: "Other", icon: "O", color: "#10b889" }
];

const navItems = [
  { label: "Home", icon: Home },
  { label: "History", icon: ReceiptText },
  { label: "Add", icon: Plus },
  { label: "Insights", icon: BarChart3 },
  { label: "Profile", icon: UserRound }
];

const chartData = [
  { name: "Food & Dining", value: 28, color: "#0f8f72" },
  { name: "Shopping", value: 18, color: "#f4b740" },
  { name: "Transport", value: 15, color: "#64a7ff" },
  { name: "Bills", value: 14, color: "#ff6b5f" },
  { name: "Entertainment", value: 10, color: "#7766e8" },
  { name: "Health & Fitness", value: 8, color: "#10b889" },
  { name: "Groceries", value: 7, color: "#f97316" }
];

const budgets = [
  { name: "Food & Dining", spent: "₹31,000", limit: "₹40,000", progress: 78 },
  { name: "Shopping", spent: "₹19,500", limit: "₹25,000", progress: 72 },
  { name: "Transport", spent: "₹10,500", limit: "₹17,500", progress: 60 },
  { name: "Bills", spent: "₹15,000", limit: "₹20,000", progress: 75 },
  { name: "Entertainment", spent: "₹8,000", limit: "₹12,000", progress: 67 },
  { name: "Health & Fitness", spent: "₹5,500", limit: "₹10,000", progress: 55 }
];

const screenAnimation = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 }
};

type Screen = "splash" | "login" | "signup" | "dashboard" | "add-expense" | "add-income" | "transactions" | "analytics" | "profile" | "transaction-detail" | "goals" | "recurring" | "reports" | "categories";
type FilterType = "all" | "expense" | "income";

const initialTransactions: Transaction[] = [
  { id: "1", title: "Zomato", detail: "Food & Dining", amount: "-₹1,250", tone: "food", icon: "Z", type: "expense", category: "food" },
  { id: "2", title: "Salary", detail: "Monthly Salary", amount: "+₹85,000", tone: "income", icon: "S", type: "income", category: "salary" },
  { id: "3", title: "Metro Card", detail: "Transport", amount: "-₹500", tone: "transport", icon: "M", type: "expense", category: "transport" },
  { id: "4", title: "Shopping", detail: "Clothes", amount: "-₹3,200", tone: "shopping", icon: "S", type: "expense", category: "shopping" },
  { id: "5", title: "Electricity", detail: "Bills", amount: "-₹2,800", tone: "bills", icon: "E", type: "expense", category: "bills" },
  { id: "6", title: "Netflix", detail: "Entertainment", amount: "-₹649", tone: "entertainment", icon: "N", type: "expense", category: "entertainment" }
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
  { id: "18", title: "Course", detail: "2 weeks ago", amount: "-₹5,000", tone: "education", icon: "C", type: "expense", category: "education" }
];

const initialGoals: Goal[] = [
  { id: "1", name: "Vacation", target: 50000, current: 32500, deadline: "2026-12-31", color: "#7766e8" },
  { id: "2", name: "Emergency Fund", target: 100000, current: 45000, deadline: "2026-06-30", color: "#10b889" },
  { id: "3", name: "New Phone", target: 80000, current: 65000, deadline: "2026-09-15", color: "#f4b740" }
];

const initialRecurring: Recurring[] = [
  { id: "1", title: "Netflix", amount: 649, category: "entertainment", frequency: "monthly", nextDate: "2026-06-15", type: "expense" },
  { id: "2", title: "Gym", amount: 2000, category: "health", frequency: "monthly", nextDate: "2026-06-01", type: "expense" },
  { id: "3", title: "Rent", amount: 25000, category: "bills", frequency: "monthly", nextDate: "2026-06-01", type: "expense" }
];

const generateId = () => Math.random().toString(36).substring(2, 15);

export function SpendsTracksApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [prevScreen, setPrevScreen] = useState<Screen | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(initialHistory);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [recurring, setRecurring] = useState<Recurring[]>(initialRecurring);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [budgetAlert, setBudgetAlert] = useState<string | null>(null);
  const [monthlyBudget, setMonthlyBudget] = useState(160000);
  const [showBudgetAlert, setShowBudgetAlert] = useState(false);
const [toast, setToast] = useState<string | null>(null);
const [isNavigating, setIsNavigating] = useState(false);
const [toastType, setToastType] = useState<"success" | "error" | "info" | "coming">("success");
const [isLoading, setIsLoading] = useState(true);

  const showToast = (message: string, duration = 3000, type: "success" | "error" | "info" | "coming" = "success") => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(null), duration);
  };

  const handleScreenChange = (screen: Screen) => {
    setIsNavigating(true);
    setPrevScreen(currentScreen);
    setTimeout(() => {
      setCurrentScreen(screen);
      setTimeout(() => setIsNavigating(false), 100);
    }, 50);
  };

  const handleAddTransaction = (data: { amount: string; category: string; date: string; notes: string; type: "expense" | "income" }) => {
    const categoryIcons: Record<string, string> = {
      food: "F", shopping: "S", transport: "T", bills: "B", entertainment: "E",
      health: "H", education: "U", groceries: "G", travel: "T", salary: "S",
      investment: "I", gift: "G", refund: "R", other: "O"
    };
    const getCategoryTitle = (cat: string) => {
      const titles: Record<string, string> = {
        food: "Food & Dining", shopping: "Shopping", transport: "Transport", bills: "Bills",
        entertainment: "Entertainment", health: "Health & Fitness", education: "Education",
        groceries: "Groceries", travel: "Travel", salary: "Salary", investment: "Investment",
        gift: "Gift", refund: "Refund", other: "Other"
      };
      return titles[cat] || cat;
    };
    const prefix = data.type === "expense" ? "-" : "+";
    const newTransaction: Transaction = {
      id: generateId(),
      title: getCategoryTitle(data.category),
      detail: data.notes || data.category,
      amount: `${prefix}₹${Number(data.amount).toLocaleString("en-IN")}`,
      tone: data.type === "income" ? "income" : data.category,
      icon: categoryIcons[data.category] || "T",
      date: data.date,
      type: data.type,
      category: data.category
    };
    setTransactions([newTransaction, ...transactions]);
    setTransactionHistory([newTransaction, ...transactionHistory]);
    
    if (data.type === "expense") {
      const newExpense = parseInt(data.amount);
      const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0) + newExpense;
      const budgetUsed = (totalExpenses / monthlyBudget) * 100;
      
      if (budgetUsed > 100) {
        showToast("⚠️ Budget exceeded! You've spent more than your monthly limit.");
        setBudgetAlert("You've exceeded your monthly budget!");
        setShowBudgetAlert(true);
      } else if (budgetUsed > 80) {
        showToast(`⚠️ Budget warning: You've used ${budgetUsed.toFixed(0)}% of your budget`);
        setBudgetAlert(`You've used ${budgetUsed.toFixed(0)}% of your budget!`);
        setShowBudgetAlert(true);
      } else {
        showToast(data.type === "expense" ? "Expense added successfully!" : "Income added successfully!");
      }
    } else {
      showToast("Income added successfully!");
    }
    
    setCurrentScreen("dashboard");
  };

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
      if (data.user) {
        setUser(data.user);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const data = { transactions, transactionHistory, goals, recurring, customCategories, monthlyBudget, user };
      localStorage.setItem("spendstracks_data", JSON.stringify(data));
    }
  }, [transactions, transactionHistory, goals, recurring, customCategories, monthlyBudget, user, isLoggedIn]);

  useEffect(() => {
    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);
    if (totalExpenses > monthlyBudget * 0.8 && totalExpenses <= monthlyBudget) {
      setBudgetAlert(`You've used ${Math.round((totalExpenses / monthlyBudget) * 100)}% of your budget!`);
      setShowBudgetAlert(true);
    } else if (totalExpenses > monthlyBudget) {
      setBudgetAlert("You've exceeded your monthly budget!");
      setShowBudgetAlert(true);
    }
  }, [transactions, monthlyBudget]);

  useEffect(() => {
    if (currentScreen === "splash") {
      const timer = setTimeout(() => {
        setCurrentScreen("login");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleLogin = (email: string, name?: string) => {
    const isAdmin = email.toLowerCase().includes("admin");
    const userName = name || email.split("@")[0];
    const newUser: User = {
      id: generateId(),
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      email: email.toLowerCase(),
      role: isAdmin ? "admin" : "user",
      createdAt: new Date().toISOString()
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
  };

  const handleGuestLogin = () => {
    const guestUser: User = {
      id: generateId(),
      name: "Guest",
      email: "guest@spendstracks.com",
      role: "user",
      createdAt: new Date().toISOString()
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
  };

  const handleSignUp = (email: string, name: string) => {
    const newUser: User = {
      id: generateId(),
      name: name,
      email: email.toLowerCase(),
      role: "user",
      createdAt: new Date().toISOString()
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
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentScreen("login");
  };

  const handleNavigation = (screen: Screen) => {
    if (screen !== "login" && screen !== "splash") {
      handleScreenChange(screen);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    setTransactionHistory(transactionHistory.filter(t => t.id !== id));
    setSelectedTransaction(null);
  };

  const handleEditTransaction = (id: string, updates: Partial<Transaction>) => {
    const updated = transactions.map(t => t.id === id ? { ...t, ...updates } : t);
    setTransactions(updated);
    const historyUpdated = transactionHistory.map(t => t.id === id ? { ...t, ...updates } : t);
    setTransactionHistory(historyUpdated);
    setSelectedTransaction(null);
  };

  const handleAddGoal = (goal: { name: string; target: number; deadline: string; color: string }) => {
    const newGoal: Goal = {
      id: generateId(),
      name: goal.name,
      target: goal.target,
      current: 0,
      deadline: goal.deadline,
      color: goal.color
    };
    setGoals([...goals, newGoal]);
  };

  const handleUpdateGoalProgress = (id: string, amount: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, current: g.current + amount } : g));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleAddRecurring = (recurringData: { title: string; amount: number; category: string; frequency: "daily" | "weekly" | "monthly"; type: "expense" | "income" }) => {
    const nextDate = new Date();
    if (recurringData.frequency === "daily") nextDate.setDate(nextDate.getDate() + 1);
    else if (recurringData.frequency === "weekly") nextDate.setDate(nextDate.getDate() + 7);
    else nextDate.setMonth(nextDate.getMonth() + 1);
    
    const newRecurring: Recurring = {
      id: generateId(),
      ...recurringData,
      nextDate: nextDate.toISOString().split("T")[0]
    };
    setRecurring([...recurring, newRecurring]);
  };

  const handleDeleteRecurring = (id: string) => {
    setRecurring(recurring.filter(r => r.id !== id));
  };

  const handleAddCustomCategory = (cat: { name: string; icon: string; color: string; type: "expense" | "income" }) => {
    const newCat: CustomCategory = { id: generateId(), ...cat };
    setCustomCategories([...customCategories, newCat]);
  };

  const handleDeleteCategory = (id: string) => {
    setCustomCategories(customCategories.filter(c => c.id !== id));
  };

  const exportToCSV = () => {
    const headers = ["Date", "Title", "Category", "Type", "Amount"];
    const rows = transactionHistory.map(t => [
      t.date || new Date().toISOString().split("T")[0],
      t.title,
      t.category,
      t.type,
      t.amount
    ]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spendstracks-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMonthlyStats = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthTransactions = transactionHistory.filter(t => t.date && new Date(t.date) >= monthStart);
    const income = monthTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);
    const expense = monthTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);
    return { income, expense, savings: income - expense };
  };

  const getFilteredTransactions = () => {
    let filtered = filter === "all" ? transactionHistory : transactionHistory.filter(t => 
      filter === "expense" ? t.amount.startsWith("-") : t.amount.startsWith("+")
    );
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.detail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const handleFilterClick = (f: FilterType) => {
    setFilter(f);
  };

  const getScreenComponent = (screen: Screen) => {
    switch (screen) {
      case "splash":
        return <SplashScreen />;
      case "login":
        return <LoginScreen onLogin={handleLogin} onGuestLogin={handleGuestLogin} onSignUpClick={() => handleScreenChange("signup")} />;
      case "signup":
        return <SignUpScreen onSignUp={handleSignUp} onLogin={() => handleScreenChange("login")} />;
      case "dashboard":
        return <DashboardScreen onNavigate={handleNavigation} transactions={transactions} user={user} isAdmin={user?.role === "admin"} isLoading={isLoading} />;
      case "add-expense":
        return <AddTransactionScreen onNavigate={handleNavigation} onSave={handleAddTransaction} type="expense" />;
      case "add-income":
        return <AddTransactionScreen onNavigate={handleNavigation} onSave={handleAddTransaction} type="income" />;
      case "transactions":
        return (
          <TransactionsScreen 
            onNavigate={handleNavigation} 
            transactions={getFilteredTransactions()}
            filter={filter}
            onFilterChange={handleFilterClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onTransactionClick={(t) => { setSelectedTransaction(t); handleScreenChange("transaction-detail"); }}
          />
        );
      case "transaction-detail":
        if (selectedTransaction) {
          return (
            <TransactionDetailScreen 
              transaction={selectedTransaction}
              onNavigate={handleNavigation}
              onDelete={handleDeleteTransaction}
              onEdit={handleEditTransaction}
            />
          );
        }
        return (
          <TransactionsScreen 
            onNavigate={handleNavigation} 
            transactions={getFilteredTransactions()}
            filter={filter}
            onFilterChange={handleFilterClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onTransactionClick={() => {}}
          />
        );
      case "analytics":
        return <AnalyticsScreen onNavigate={handleNavigation} transactions={[...transactions, ...transactionHistory]} monthlyBudget={monthlyBudget} onExport={exportToCSV} />;
      case "goals":
        return <GoalsScreen onNavigate={handleNavigation} goals={goals} onAddGoal={handleAddGoal} onUpdateProgress={handleUpdateGoalProgress} onDeleteGoal={handleDeleteGoal} />;
      case "recurring":
        return <RecurringScreen onNavigate={handleNavigation} recurring={recurring} onAddRecurring={handleAddRecurring} onDeleteRecurring={handleDeleteRecurring} />;
      case "reports":
        return <ReportsScreen onNavigate={handleNavigation} transactions={transactionHistory} />;
      case "categories":
        return <CategoriesScreen onNavigate={handleNavigation} customCategories={customCategories} onAddCategory={handleAddCustomCategory} onDeleteCategory={handleDeleteCategory} />;
      case "profile":
        return <ProfileScreen onNavigate={handleNavigation} onLogout={handleLogout} monthlyBudget={monthlyBudget} setMonthlyBudget={setMonthlyBudget} onExport={exportToCSV} user={user} />;
      default:
        return <SplashScreen />;
    }
  };

  const getDirection = () => {
    const order: Screen[] = ["splash", "login", "signup", "dashboard", "transactions", "analytics", "goals", "recurring", "reports", "categories", "profile", "add-expense", "add-income", "transaction-detail"];
    const currentIdx = order.indexOf(currentScreen);
    const prevIdx = prevScreen ? order.indexOf(prevScreen) : -1;
    if (prevIdx === -1 || currentIdx === -1) return 0;
    return currentIdx > prevIdx ? 1 : -1;
  };

  return (
    <main className="soft-page-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: getDirection() * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: getDirection() * -30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {getScreenComponent(currentScreen)}
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn(
              "fixed bottom-28 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl font-bold text-sm shadow-xl z-50 max-w-[90%] text-center border",
              toastType === "success" && "bg-gradient-to-r from-primary to-secondary text-white border-white/20",
              toastType === "error" && "bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-400",
              toastType === "info" && "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400",
              toastType === "coming" && "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400"
            )}
          >
            {toastType === "success" && <Check className="inline size-4 mr-1.5 mb-0.5" />}
            {toastType === "error" && <AlertCircle className="inline size-4 mr-1.5 mb-0.5" />}
            {toastType === "info" && <Zap className="inline size-4 mr-1.5 mb-0.5" />}
            {toastType === "coming" && <Sparkles className="inline size-4 mr-1.5 mb-0.5" />}
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function PhoneFrame({
  children,
  label,
  className
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <motion.section
      aria-label={label}
      className="mx-auto w-full max-w-[480px] rounded-[2.35rem] border-2 border-white/10 bg-black/80 p-3 shadow-2xl shadow-black/50 backdrop-blur dark:border-white/5 dark:bg-black/60"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      variants={screenAnimation}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div
        className={cn(
          "relative flex h-[850px] flex-col overflow-hidden rounded-[1.9rem] bg-gradient-to-b from-white to-[#f8faf4] p-6 dark:from-[#0a0a0a] dark:to-[#050505]",
          className
        )}
      >
        {children}
      </div>
    </motion.section>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-[1.7rem] bg-gradient-to-br from-[#10b889] to-[#0b6c59] shadow-[0_18px_34px_rgb(15_143_114_/_0.28)]",
        compact ? "size-[52px] rounded-2xl" : "size-24"
      )}
    >
      <Image
        src="/spendstracks-logo.svg"
        alt="SpendsTracks logo"
        width={compact ? 42 : 72}
        height={compact ? 42 : 72}
        priority
      />
    </div>
  );
}

function ScreenHeader({
  eyebrow,
  title,
  action
}: {
  eyebrow: string;
  title: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-5 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="mb-1 text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-primary">
          {eyebrow}
        </p>
        <h2 className="truncate text-2xl font-extrabold tracking-normal text-foreground">
          {title}
        </h2>
      </div>
      {action}
    </header>
  );
}

function BottomNav({ active, onNavigate }: { active: string; onNavigate: (screen: Screen) => void }) {
  const screenMap: Record<string, Screen> = {
    Home: "dashboard",
    History: "transactions",
    Add: "add-expense",
    Insights: "analytics",
    Profile: "profile"
  };

  return (
    <nav className="absolute inset-x-6 bottom-5 grid grid-cols-5 gap-1 rounded-[1.55rem] border border-border/80 bg-white/90 p-2.5 shadow-fintech backdrop-blur-xl dark:border-white/5 dark:bg-black/70 dark:shadow-2xl dark:shadow-black/50" role="navigation" aria-label="Main navigation">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <button
            type="button"
            key={item.label}
            onClick={() => onNavigate(screenMap[item.label] || "dashboard")}
            className={cn(
              "grid min-w-0 justify-items-center gap-1 rounded-2xl px-1 py-2 text-[0.67rem] font-extrabold text-muted-foreground transition-all hover:bg-muted",
              active === item.label && "bg-secondary text-primary"
            )}
            aria-current={active === item.label ? "page" : undefined}
          >
            <Icon className="size-5" strokeWidth={2.2} />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function SplashScreen() {
  return (
    <PhoneFrame
      label="Splash screen"
      className="items-center justify-center bg-gradient-to-br from-white via-[#edf8f1] to-[#f8f1e6] text-center dark:from-[#0a0a0a] dark:via-[#0f1412] dark:to-[#0a0a0a]"
    >
      <motion.div
        className="grid justify-items-center gap-6"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <BrandMark />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-normal bg-gradient-to-r from-primary to-[#0d9973] bg-clip-text text-transparent">
            SpendsTracks
          </h1>
          <p className="text-base font-semibold text-muted-foreground">Money clarity, made simple.</p>
        </div>
        <motion.div 
          className="flex gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </PhoneFrame>
  );
}

function LoginScreen({ onLogin, onGuestLogin, onSignUpClick }: { onLogin: (email: string, name?: string) => void; onGuestLogin: () => void; onSignUpClick?: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    onLogin(email, name || undefined);
  };

  return (
    <PhoneFrame label="Login screen">
      <div className="relative overflow-hidden min-h-[180px]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-transparent" />

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * 300,
              y: Math.random() * 150,
              scale: 0
            }}
            animate={{
              y: [null, Math.random() * -50],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}

        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/40 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 10, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-secondary/40 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            y: [0, -10, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        <div className="relative flex justify-between items-start pt-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              className="relative mb-4"
            >
              <motion.div
                className="absolute inset-0 bg-primary/40 rounded-3xl blur-2xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative"
              >
                <BrandMark />
                <motion.div
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-3 border-white dark:border-[#1a1a2e]"
                  animate={{ scale: [1, 1.3, 1], boxShadow: ["0 0 0 rgba(34,197,94,0)", "0 0 20px rgba(34,197,94,0.5)", "0 0 0 rgba(34,197,94,0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>

            <motion.div className="space-y-1">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary"
              >
                Welcome back
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-[1.75rem] font-extrabold leading-tight"
              >
                <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient">
                  Sign in to continue
                </span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center justify-center gap-1.5"
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-sm"
                >
                  💰
                </motion.span>
                <motion.p
                  className="text-xs font-medium text-muted-foreground/80"
                >
                  Track your finances smarter
                </motion.p>
                <motion.span
                  animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="text-sm"
                >
                  📈
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-3 rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-xl shadow-xl border border-white/30 dark:border-white/10 hover:shadow-2xl transition-all group"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              >
                <Sun className="size-5 text-amber-400" />
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Moon className="size-5 text-indigo-500" />
              </motion.div>
            )}
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
      >
        <Card className="mt-6 border-0 bg-white/95 dark:bg-[#1a1a2e]/95 backdrop-blur-2xl shadow-2xl shadow-primary/10 dark:shadow-black/40 rounded-[1.75rem] overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

          <CardContent className="grid gap-6 p-6 pt-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-center"
            >
              <h3 className="text-xl font-extrabold">Good to see you! 👋</h3>
              <p className="text-xs text-muted-foreground mt-1.5">Enter your details to access your account</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-5">
                <motion.div
                  whileFocus={{ scale: 1.005 }}
                  transition={{ duration: 0.15 }}
                  className="relative group"
                >
                  <Field label="Email Address">
                    <div className="relative">
                      <motion.div
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-all duration-300"
                        animate={{ scale: email ? 1 : 1 }}
                      >
                        <Mail className={cn(
                          "size-[18px] transition-all duration-300",
                          email ? "text-primary" : "text-muted-foreground/60 group-focus-within:text-primary"
                        )} />
                      </motion.div>
                      <Input
                        className={cn(
                          "pl-12 pr-4 h-13 bg-gradient-to-br from-white to-primary/5 dark:from-white/5 dark:to-primary/10",
                          "border-2 border-transparent rounded-2xl transition-all duration-300",
                          "focus:border-primary/60 focus:ring-0 focus:shadow-xl focus:shadow-primary/15",
                          "dark:bg-gradient-to-br dark:from-white/5 dark:to-primary/10",
                          emailError && "border-red-400/50 focus:border-red-500 focus:shadow-red-500/15"
                        )}
                        placeholder="name@example.com"
                        type="email"
                        required
                        autoComplete="email"
                        aria-label="Email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                      />
                      {email && !emailError && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <Check className="size-5 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    {emailError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, x: -10 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        className="flex items-center gap-1.5 mt-2"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          <AlertCircle className="size-3.5 text-red-500" />
                        </motion.div>
                        <span className="text-xs text-red-500 font-medium">{emailError}</span>
                      </motion.div>
                    )}
                  </Field>
                </motion.div>

                {!showNameInput && (
                  <motion.button
                    type="button"
                    onClick={() => setShowNameInput(true)}
                    className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors text-left flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Plus className="size-3" />
                    Add your name for personalized experience
                  </motion.button>
                )}

                {showNameInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Field label="Your Name">
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                          <UserRound className="size-4 text-muted-foreground" />
                        </div>
                        <Input
                          className="pl-12 pr-4 h-12 bg-white dark:bg-white/5 border-2 border-transparent rounded-xl focus:border-primary/50 focus:ring-0 focus:shadow-lg focus:shadow-primary/10 dark:bg-white/5"
                          placeholder="Enter your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          aria-label="Your name"
                        />
                      </div>
                    </Field>
                  </motion.div>
                )}

                <motion.div
                  whileFocus={{ scale: 1.005 }}
                  transition={{ duration: 0.15 }}
                  className="relative group"
                >
                  <Field label="Password">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <LockKeyhole className="size-[18px] text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                      </div>
                      <Input
                        className="pl-12 pr-14 h-13 bg-gradient-to-br from-white to-primary/5 dark:from-white/5 dark:to-primary/10 border-2 border-transparent rounded-2xl transition-all duration-300 focus:border-primary/60 focus:ring-0 focus:shadow-xl focus:shadow-primary/15 dark:bg-gradient-to-br dark:from-white/5 dark:to-primary/10"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        aria-label="Password"
                        minLength={1}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-primary transition-all p-1.5 rounded-lg hover:bg-primary/10"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <motion.div
                          animate={{ scale: showPassword ? 1.1 : 1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? (
                            <EyeOff className="size-[18px]" />
                          ) : (
                            <Eye className="size-[18px]" />
                          )}
                        </motion.div>
                      </button>
                    </div>
                  </Field>
                </motion.div>
              </div>

              <div className="flex items-center justify-between mt-4 mb-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <motion.div
                      className={cn(
                        "w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
                        rememberMe
                          ? "bg-gradient-to-br from-primary to-secondary border-primary shadow-lg shadow-primary/30"
                          : "border-muted-foreground/40 group-hover:border-primary/60 bg-white dark:bg-white/5"
                      )}
                      whileTap={{ scale: 0.8 }}
                    >
                      {rememberMe && (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 600, damping: 20 }}
                        >
                          <Check className="size-3.5 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground/80 group-hover:text-foreground transition-colors">
                    Keep me signed in
                  </span>
                </label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="text-xs font-bold text-primary/80 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/5"
                >
                  Forgot?
                </motion.button>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="relative overflow-hidden h-14 w-full bg-gradient-to-r from-primary via-[#0ea571] to-[#0d8570] rounded-2xl font-extrabold text-white shadow-2xl shadow-primary/25 hover:shadow-3xl hover:shadow-primary/40 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                whileHover={{ y: isLoading ? 0 : -3 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={isLoading ? {} : { x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                {isLoading ? (
                  <motion.div
                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <LogIn className="size-5" />
                    </motion.div>
                    <span className="text-base">Sign In</span>
                    <motion.div
                      className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </>
                )}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="relative py-3"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="bg-white/95 dark:bg-[#1a1a2e]/95 px-4 py-1.5 rounded-full shadow-sm border border-border/30"
                >
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-muted-foreground/60">
                    Or continue as
                  </span>
                </motion.div>
              </div>
            </motion.div>

            <motion.button
              type="button"
              onClick={onGuestLogin}
              className="h-12 w-full bg-gradient-to-br from-white to-primary/5 dark:from-white/10 dark:to-primary/5 border-2 border-border/20 dark:border-white/10 rounded-2xl font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all flex items-center justify-center gap-2.5 backdrop-blur-sm"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center"
              >
                <UserRound className="size-4 text-primary" />
              </motion.div>
              <span className="text-sm">Continue as Guest</span>
              <motion.span
                animate={{ x: [0, 3, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs text-muted-foreground"
              >
                →
              </motion.span>
            </motion.button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-auto pb-2 text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm font-medium text-muted-foreground"
        >
          New to SpendsTracks?{" "}
          <button
            type="button"
            className="font-extrabold text-primary hover:text-primary/80 transition-colors"
            onClick={onSignUpClick}
          >
            Create an account
          </button>
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-auto pt-4"
      >
        <p className="text-center text-[10px] text-muted-foreground/60">
          By continuing, you agree to our{' '}
          <button type="button" className="text-primary/70 hover:text-primary underline">
            Terms
          </button>
          {' '}and{' '}
          <button type="button" className="text-primary/70 hover:text-primary underline">
            Privacy Policy
          </button>
        </p>
      </motion.div>
    </PhoneFrame>
  );
}

function SignUpScreen({ onSignUp, onLogin }: { onSignUp: (email: string, name: string) => void; onLogin: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [ageVerified, setAgeVerified] = useState(false);
  const [country, setCountry] = useState("India");
  const [currency, setCurrency] = useState("INR");
  const [monthlyBudget, setMonthlyBudget] = useState("50000");
  const [notifications, setNotifications] = useState(true);
  const [preferredTheme, setPreferredTheme] = useState("system");
  const [language, setLanguage] = useState("English");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (pwd: string): { level: string; color: string; width: string } => {
    if (pwd.length === 0) return { level: "", color: "bg-gray-200", width: "0%" };
    if (pwd.length < 6) return { level: "Weak", color: "bg-red-500", width: "33%" };
    if (pwd.length < 10) return { level: "Medium", color: "bg-yellow-500", width: "66%" };
    return { level: "Strong", color: "bg-green-500", width: "100%" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (!name.trim()) {
      showToast("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      showToast("Please enter a valid 10-digit phone number");
      return;
    }

    if (!ageVerified) {
      showToast("You must be 18 or older to use this app");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError("Password must contain uppercase, lowercase & number");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    if (!agreedToTerms) {
      showToast("Please agree to Terms & Conditions");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onSignUp(email, name);
  };

  const passwordStrength = (pwd: string): { level: string; color: string; width: string; requirements: { minLength: boolean; uppercase: boolean; lowercase: boolean; number: boolean } } => {
    const reqs = {
      minLength: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd)
    };
    const passed = Object.values(reqs).filter(Boolean).length;
    if (pwd.length === 0) return { level: "", color: "bg-gray-200", width: "0%", requirements: reqs };
    if (passed <= 1) return { level: "Weak", color: "bg-red-500", width: "25%", requirements: reqs };
    if (passed === 2) return { level: "Fair", color: "bg-yellow-500", width: "50%", requirements: reqs };
    if (passed === 3) return { level: "Good", color: "bg-blue-500", width: "75%", requirements: reqs };
    return { level: "Strong", color: "bg-green-500", width: "100%", requirements: reqs };
  };

  const pwdStrength = passwordStrength(password);

  return (
    <PhoneFrame label="Sign up screen">
      <div className="flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={onLogin}
          className="p-2.5 rounded-2xl bg-muted/50 hover:bg-muted border border-border/50 dark:border-white/10 transition-all flex items-center gap-1.5"
          aria-label="Go back to login"
        >
          <motion.div whileHover={{ x: -2 }}>
            <ArrowLeft className="size-4" />
          </motion.div>
        </motion.button>

        <div className="text-center flex-1">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[0.65rem] font-black uppercase tracking-[0.15em] text-primary"
          >
            Get Started
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-extrabold leading-tight"
          >
            Create Account
          </motion.h2>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-muted/50 hover:bg-muted border border-border/50 dark:border-white/10 transition-all"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="size-5 text-yellow-500" /> : <Moon className="size-5 text-primary" />}
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="overflow-y-auto no-scrollbar smooth-scroll max-h-[70vh]">
        <Card className="mt-9 border-border/80 bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
          <CardContent className="grid gap-5 p-5 pb-8">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-5">
                <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Field label="Full Name">
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-11 dark:bg-background transition-all focus:ring-2 focus:ring-primary/50"
                        placeholder="Enter your full name"
                        type="text"
                        required
                        autoComplete="name"
                        aria-label="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </Field>
                </motion.div>

                <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Field label="Email">
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className={cn(
                          "pl-11 dark:bg-background transition-all focus:ring-2 focus:ring-primary/50",
                          emailError && "border-red-500 focus:ring-red-500"
                        )}
                        placeholder="you@example.com"
                        type="email"
                        required
                        autoComplete="email"
                        aria-label="Email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                      />
                    </div>
                    {emailError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 mt-1 font-medium"
                      >
                        {emailError}
                      </motion.p>
                    )}
                  </Field>
                </motion.div>

                <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Field label="Phone Number (Optional)">
                    <div className="relative">
                      <Smartphone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-11 dark:bg-background transition-all focus:ring-2 focus:ring-primary/50"
                        placeholder="+91 98765 43210"
                        type="tel"
                        autoComplete="tel"
                        aria-label="Phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </Field>
                </motion.div>

                <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Field label="Password">
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-11 pr-11 dark:bg-background transition-all focus:ring-2 focus:ring-primary/50"
                        placeholder="Create a password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        aria-label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-muted-foreground">Password strength</span>
                          <span className={cn("text-xs font-bold", pwdStrength.level === "Weak" ? "text-red-500" : pwdStrength.level === "Fair" ? "text-yellow-500" : pwdStrength.level === "Good" ? "text-blue-500" : "text-green-500")}>
                            {pwdStrength.level}
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={cn("h-full rounded-full", pwdStrength.color)}
                            initial={{ width: 0 }}
                            animate={{ width: pwdStrength.width }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-[10px] font-medium text-muted-foreground">Password must have:</p>
                          <div className="flex flex-wrap gap-2">
                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full", pwdStrength.requirements.minLength ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground")}>8+ chars</span>
                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full", pwdStrength.requirements.uppercase ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground")}>Uppercase</span>
                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full", pwdStrength.requirements.lowercase ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground")}>Lowercase</span>
                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full", pwdStrength.requirements.number ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground")}>Number</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                </motion.div>

                <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Field label="Confirm Password">
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-11 dark:bg-background transition-all focus:ring-2 focus:ring-primary/50"
                        placeholder="Confirm your password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        aria-label="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </Field>
                </motion.div>

                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 font-medium"
                  >
                    {passwordError}
                  </motion.p>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-4 p-4 bg-muted/30 dark:bg-muted/20 rounded-2xl"
              >
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-sm font-bold">Additional Options</span>
                  <motion.div animate={{ rotate: showAdvanced ? 180 : 0 }}>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </motion.div>
                </button>

                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Country">
                        <Select value={country} onValueChange={setCountry}>
                          <SelectTrigger className="dark:bg-background"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="USA">USA</SelectItem>
                            <SelectItem value="UK">UK</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Currency">
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger className="dark:bg-background"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">₹ INR</SelectItem>
                            <SelectItem value="USD">$ USD</SelectItem>
                            <SelectItem value="EUR">€ EUR</SelectItem>
                            <SelectItem value="GBP">£ GBP</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>

                    <Field label="Initial Monthly Budget">
                      <Input
                        type="number"
                        value={monthlyBudget}
                        onChange={(e) => setMonthlyBudget(e.target.value)}
                        className="dark:bg-background"
                        placeholder="50000"
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Theme">
                        <Select value={preferredTheme} onValueChange={setPreferredTheme}>
                          <SelectTrigger className="dark:bg-background"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system">System</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Language">
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="dark:bg-background"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Hindi">Hindi</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>

                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium">Enable Notifications</span>
                      <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </label>
                  </motion.div>
                )}
              </motion.div>

              <div className="mb-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={ageVerified}
                      onChange={(e) => setAgeVerified(e.target.checked)}
                      className="sr-only"
                    />
                    <motion.div
                      className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                        ageVerified
                          ? "bg-green-500 border-green-500"
                          : "border-muted-foreground group-hover:border-primary"
                      )}
                      whileTap={{ scale: 0.9 }}
                    >
                      {ageVerified && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check className="size-3 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground font-medium">I am 18 years or older</span>
                    <p className="text-muted-foreground/60 text-[10px]">Required for account creation</p>
                  </div>
                </label>
              </div>

              <div className="mt-2 mb-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <motion.div
                      className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                        agreedToTerms
                          ? "bg-primary border-primary"
                          : "border-muted-foreground group-hover:border-primary"
                      )}
                      whileTap={{ scale: 0.9 }}
                    >
                      {agreedToTerms && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check className="size-3 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground font-medium">I agree to the </span>
                    <button
                      type="button"
                      className="text-primary font-extrabold hover:underline"
                      onClick={() => setShowTermsModal(true)}
                    >
                      Terms & Conditions
                    </button>
                    <span className="text-muted-foreground font-medium"> and </span>
                    <button
                      type="button"
                      className="text-primary font-extrabold hover:underline"
                      onClick={() => setShowTermsModal(true)}
                    >
                      Privacy Policy
                    </button>
                  </div>
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="mt-4 h-[52px] w-full bg-gradient-to-br from-primary to-[#10b889] rounded-2xl font-extrabold text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <UserPlus className="size-5" />
                    Create Account
                  </>
                )}
              </motion.button>
            </form>
          </CardContent>
        </Card>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-auto pb-2 text-center"
      >
        <p className="text-sm font-semibold text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            className="font-extrabold text-primary hover:underline"
            onClick={onLogin}
          >
            Sign In
          </button>
        </p>
      </motion.div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg z-50"
        >
          {toast}
        </motion.div>
      )}

      {showTermsModal && (
        <ModalOverlay onClose={() => setShowTermsModal(false)}>
          <ModalContent title="Terms & Privacy Policy" onClose={() => setShowTermsModal(false)}>
            <div className="space-y-4 text-sm text-muted-foreground max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="font-extrabold text-foreground mb-2">Terms of Service</h4>
                <p>By using SpendsTracks, you agree to these terms:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>You must be 18+ to use this app</li>
                  <li>You're responsible for your account security</li>
                  <li>Don't misuse the app for illegal activities</li>
                  <li>We reserve the right to modify these terms</li>
                </ul>
              </div>
              <div>
                <h4 className="font-extrabold text-foreground mb-2">Privacy Policy</h4>
                <p>We value your privacy:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Your financial data is stored locally on your device</li>
                  <li>We don't sell your data to third parties</li>
                  <li>Data is encrypted for your security</li>
                  <li>You can delete your account anytime</li>
                </ul>
              </div>
              <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 rounded-2xl border border-primary/20">
                <h4 className="font-extrabold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  About Developer
                </h4>
                <p className="text-xs mb-3">SpendsTracks - A personal finance tracker built with 💚 by Prathamesh Jadhav</p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://linkedin.com/in/prathamesh-jadhav04"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-primary hover:underline bg-white dark:bg-white/5 p-2 rounded-lg border border-primary/20"
                  >
                    <svg className="size-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/Prathamesh-Jadhav04"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-primary hover:underline bg-white dark:bg-white/5 p-2 rounded-lg border border-primary/20"
                  >
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </div>
                <a
                  href="mailto:prathamesh.jadhav.office@gmail.com"
                  className="flex items-center justify-center gap-2 text-xs font-medium text-primary hover:underline mt-3 bg-white dark:bg-white/5 p-2 rounded-lg border border-primary/20"
                >
                  <Mail className="size-4" />
                  prathamesh.jadhav.office@gmail.com
                </a>
              </div>

              <motion.div
                className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="size-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    ⚠️ Please scroll up and read all terms and privacy policy carefully before agreeing.
                  </p>
                </div>
              </motion.div>

              <div className="mt-4 p-4 bg-muted/30 dark:bg-muted/20 rounded-2xl border-2 border-primary/30">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <motion.div
                      className={cn(
                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                        agreedToTerms
                          ? "bg-gradient-to-br from-primary to-secondary border-primary"
                          : "border-muted-foreground/50 group-hover:border-primary bg-white dark:bg-white/5"
                      )}
                      whileTap={{ scale: 0.85 }}
                    >
                      {agreedToTerms && (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                          <Check className="size-4 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-foreground">I have read and agree to the </span>
                    <span className="text-primary font-bold">Terms of Service</span>
                    <span className="text-muted-foreground"> and </span>
                    <span className="text-primary font-bold">Privacy Policy</span>
                    <span className="text-muted-foreground"> *</span>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      By checking this box, you confirm that you are 18+ years old and accept our policies.
                    </p>
                  </div>
                </label>
              </div>

              <Button
                onClick={() => { if (agreedToTerms) { setShowTermsModal(false); } else { showToast("Please agree to Terms & Conditions"); } }}
                disabled={!agreedToTerms}
                className={cn(
                  "w-full mt-4 h-12 font-extrabold text-base",
                  agreedToTerms
                    ? "bg-gradient-to-br from-primary to-secondary"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {agreedToTerms ? "✓ Accept & Continue" : "☐ I Agree to Terms"}
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </PhoneFrame>
  );
}

function DashboardScreen({ onNavigate, transactions, user, isAdmin, isLoading }: { onNavigate: (screen: Screen) => void; transactions: Transaction[]; user?: User | null; isAdmin?: boolean; isLoading?: boolean }) {
  const recentTransactions = transactions.slice(0, 4);

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
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
  const isNewUser = transactions.length === 0;
  
  return (
    <PhoneFrame label="Dashboard screen" className="pb-28">
      <div className="h-full flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll">
        <ScreenHeader
          eyebrow={greeting.time}
          title={
            <div className="flex items-center gap-2">
              <motion.span
                className="text-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
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
                >✨</motion.span>
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
              <Button size="icon" variant="outline" aria-label="Wallet" className="rounded-2xl" onClick={() => onNavigate("transactions")}>
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
                    {totalBalance >= 0 ? "+" : ""}{totalBalance > 0 ? Math.round((totalBalance / (totalIncome || 1)) * 100) : 0}%
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
              <Button onClick={() => onNavigate("add-expense")} className="flex-1 rounded-2xl h-11 bg-gradient-to-r from-[#ff6b5f] to-[#ff995c] shadow-lg shadow-[#ff6b5f]/20 hover:shadow-xl hover:shadow-[#ff6b5f]/30">
                <TrendingDown className="mr-2 size-4" />
                Expense
              </Button>
              <Button variant="outline" onClick={() => onNavigate("add-income")} className="flex-1 rounded-2xl h-11 border-primary/20 dark:border-white/10 bg-gradient-to-r from-[#dcfce7] to-[#bbf7d0] dark:from-[#0f2920] dark:to-[#0a1210]">
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
                          <Button onClick={() => onNavigate("add-expense")} size="sm" className="rounded-xl bg-gradient-to-r from-[#ff6b5f] to-[#ff995c]">
                            <TrendingDown className="mr-1.5 size-3.5" />
                            Add Expense
                          </Button>
                          <Button variant="outline" onClick={() => onNavigate("add-income")} size="sm" className="rounded-xl">
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

function AddTransactionScreen({ onNavigate, onSave, type }: { onNavigate: (screen: Screen) => void; onSave: (data: { amount: string; category: string; date: string; notes: string; type: "expense" | "income" }) => void; type: "expense" | "income" }) {
  const today = new Date().toISOString().split("T")[0];
  const categories = type === "expense" ? expenseCategories : incomeCategories;
  const title = type === "expense" ? "Add Expense" : "Add Income";
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const amount = formData.get("amount") as string;
    const category = formData.get("category") as string;

    if (!amount || parseFloat(amount) <= 0) {
      onNavigate("dashboard");
      return;
    }

    if (!category) {
      onNavigate("dashboard");
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onSave({
      amount,
      category,
      date: formData.get("date") as string,
      notes: formData.get("notes") as string,
      type
    });
    setIsSaving(false);
    onNavigate("dashboard");
  };

  const categoryItems = categories.map(cat => (
    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
  ));

  return (
    <PhoneFrame label={`Add ${type} screen`} className="pb-28">
      <ScreenHeader eyebrow="New entry" title={title} />

      <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
        <CardContent className="grid gap-4 p-5">
          <form onSubmit={handleSubmit}>
            <Field label="Amount">
              <Input
                name="amount"
                className="h-16 text-3xl font-extrabold dark:bg-background"
                placeholder="₹0.00"
                inputMode="decimal"
                required
                min="1"
                step="1"
                aria-label={`${type} amount`}
              />
            </Field>
            <Field label="Category">
              <Select name="category" required>
                <SelectTrigger aria-label="Select category" className="dark:bg-background">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent className="dark:bg-card">
                  {categoryItems}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Date">
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="date"
                  className="pl-11 dark:bg-background"
                  type="date"
                  defaultValue={today}
                  required
                  max={today}
                  aria-label={`${type} date`}
                />
              </div>
            </Field>
            <Field label="Notes">
              <Textarea
                name="notes"
                placeholder="Optional note"
                maxLength={500}
                aria-label="Optional notes"
                className="dark:bg-background"
              />
            </Field>
            <motion.button
              type="submit"
              disabled={isSaving}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "h-[52px] w-full rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-[#10b889] text-white shadow-lg shadow-primary/25",
                isSaving && "opacity-70 cursor-wait"
              )}
            >
              {isSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="size-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <Check className="size-5" />
                  Save {type === "expense" ? "Expense" : "Income"}
                </>
              )}
            </motion.button>
          </form>
        </CardContent>
      </Card>

      <BottomNav active="Add" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}

function TransactionsScreen({ 
  onNavigate, 
  transactions,
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onTransactionClick
}: { 
  onNavigate: (screen: Screen) => void; 
  transactions: Transaction[];
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onTransactionClick?: (transaction: Transaction) => void;
}) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery, onSearchChange]);

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Expense", value: "expense" },
    { label: "Income", value: "income" }
  ];

  const totalSpent = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);
  const totalEarned = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);

  return (
    <PhoneFrame label="Transactions screen" className="pb-28">
      <div className="h-full flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll">
        <ScreenHeader eyebrow="Activity" title="Transactions" />

        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="bg-white pl-11 shadow-soft dark:bg-card dark:border dark:border-white/10"
            placeholder="Search transactions"
            type="search"
            aria-label="Search transactions"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </div>

        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
          {filters.map((f, index) => (
            <Button
              key={f.value}
              size="sm"
              variant={filter === f.value ? "default" : "secondary"}
              className="shrink-0 rounded-full px-4"
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <StatCard
          icon={<TrendingDown className="size-5" />}
          label="Spent"
          value={`₹${totalSpent.toLocaleString("en-IN")}`}
          tone="expense"
        />
        <StatCard
          icon={<TrendingUp className="size-5" />}
          label="Earned"
          value={`₹${totalEarned.toLocaleString("en-IN")}`}
          tone="income"
        />
      </div>

      <Card className="flex-1 bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
        <CardContent className="grid gap-3 p-4">
          {transactions.length > 0 ? (
            transactions.map((transaction, idx) => (
              <TransactionRow 
                key={`${transaction.title}-${idx}`} 
                transaction={transaction}
                onClick={() => onTransactionClick?.(transaction)}
              />
            ))
          ) : (
            <EmptyState
              icon={<ReceiptText className="size-7 text-primary" />}
              title={searchQuery ? "No results found" : "No transactions yet"}
              message={searchQuery ? `No transactions matching "${searchQuery}"` : "Start tracking your expenses by adding your first transaction!"}
              action={!searchQuery && (
                <div className="flex gap-3">
                  <Button onClick={() => onNavigate("add-expense")} size="sm" className="rounded-xl bg-gradient-to-r from-[#ff6b5f] to-[#ff995c]">
                    <TrendingDown className="mr-1.5 size-3.5" />
                    Add Expense
                  </Button>
                </div>
              )}
            />
          )}
        </CardContent>
      </Card>
      </div>

      <BottomNav active="History" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}

function AnalyticsScreen({ onNavigate, transactions, monthlyBudget = 160000, onExport }: { onNavigate: (screen: Screen) => void; transactions: Transaction[]; monthlyBudget?: number; onExport?: () => void }) {
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);
  const budgetUsed = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;

  return (
    <PhoneFrame label="Analytics screen" className="pb-28">
      <div className="h-full flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll px-1">
        <ScreenHeader 
          eyebrow="Insights" 
          title="Analytics"
          action={onExport ? <Button size="sm" variant="outline" onClick={onExport} className="rounded-full">Export</Button> : undefined}
        />

        <div className="space-y-3 pb-4">
          <div className="grid grid-cols-3 gap-2">
            <motion.div 
              className="rounded-2xl bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] p-3 dark:from-[#0f1a15] dark:to-[#0a1210]"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[10px] font-semibold text-[#16a34a] dark:text-[#16a34a]">Income</p>
              <p className="mt-1 text-lg font-extrabold text-[#16a34a] dark:text-white">₹{totalIncome >= 100000 ? `${(totalIncome/100000).toFixed(1)}L` : totalIncome.toLocaleString("en-IN")}</p>
              <p className="text-[10px] font-medium text-[#16a34a]/70">{transactions.filter(t => t.type === "income").length} transactions</p>
            </motion.div>
            <motion.div 
              className="rounded-2xl bg-gradient-to-br from-[#fee2e2] to-[#fecaca] p-3 dark:from-[#1a0f0e] dark:to-[#100a09]"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[10px] font-semibold text-[#dc2626] dark:text-[#ff6b5f]">Expense</p>
              <p className="mt-1 text-lg font-extrabold text-[#dc2626] dark:text-white">₹{totalExpenses >= 100000 ? `${(totalExpenses/100000).toFixed(1)}L` : totalExpenses.toLocaleString("en-IN")}</p>
              <p className="text-[10px] font-medium text-[#dc2626]/70">{transactions.filter(t => t.type === "expense").length} transactions</p>
            </motion.div>
            <motion.div 
              className="rounded-2xl bg-gradient-to-br from-[#e0e7ff] to-[#c7d2fe] p-3 dark:from-[#1e1b4b] dark:to-[#0f0a2a]"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[10px] font-semibold text-[#4f46e5] dark:text-[#818cf8]">Savings</p>
              <p className="mt-1 text-lg font-extrabold text-[#4f46e5] dark:text-white">₹{(totalIncome - totalExpenses) >= 1000 ? `${((totalIncome - totalExpenses)/1000).toFixed(1)}K` : (totalIncome - totalExpenses).toLocaleString("en-IN")}</p>
              <p className="text-[10px] font-medium text-[#4f46e5]/70">{totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%</p>
            </motion.div>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              icon={<BarChart3 className="size-7 text-primary" />}
              title="No data to analyze"
              message="Add some transactions to see your spending insights and analytics!"
              action={
                <Button onClick={() => onNavigate("add-expense")} size="sm" className="rounded-xl bg-gradient-to-r from-[#ff6b5f] to-[#ff995c]">
                  <TrendingDown className="mr-1.5 size-3.5" />
                  Add Expense
                </Button>
              }
            />
          ) : (
            <>
              {(() => {
            const categoryData = transactions.filter(t => t.type === "expense").reduce((acc, t) => {
              acc[t.category] = (acc[t.category] || 0) + parseInt(t.amount.replace(/[^0-9]/g, ""));
              return acc;
            }, {} as Record<string, number>);
            
            const dynamicChartData = Object.entries(categoryData).map(([name, value]) => {
              const cat = expenseCategories.find(c => c.value === name);
              return { name: cat?.label || name, value, color: cat?.color || "#7766e8" };
            }).sort((a, b) => b.value - a.value).slice(0, 7);
            
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
                      <span className="text-xs font-extrabold text-primary">₹{item.value.toLocaleString("en-IN")}</span>
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
                  <h3 className="mt-1 text-2xl font-extrabold dark:text-white">₹{totalExpenses.toLocaleString("en-IN")}</h3>
                </div>
                <div className="text-right">
                  <span className={`rounded-full bg-primary/20 px-2 py-1 text-xs font-extrabold text-primary ${budgetUsed > 100 ? "bg-red-100 text-red-600" : ""}`}>{budgetUsed.toFixed(0)}%</span>
                  <p className="mt-1 text-[10px] font-semibold text-muted-foreground dark:text-white/50">of ₹{monthlyBudget.toLocaleString("en-IN")} budget</p>
                </div>
              </div>
              <ProgressBar value={Math.min(budgetUsed, 100)} className="mt-3" />
            </CardContent>
          </Card>

          {(() => {
            const categoryData = transactions.filter(t => t.type === "expense").reduce((acc, t) => {
              acc[t.category] = (acc[t.category] || 0) + parseInt(t.amount.replace(/[^0-9]/g, ""));
              return acc;
            }, {} as Record<string, number>);
            
            const categoryBreakdown = Object.entries(categoryData).map(([cat, spent]) => {
              const info = expenseCategories.find(c => c.value === cat);
              return { name: info?.label || cat, spent, progress: monthlyBudget > 0 ? (spent / monthlyBudget) * 100 : 0 };
            }).sort((a, b) => b.spent - a.spent).slice(0, 5);
            
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
                      <span className="text-xs font-extrabold text-muted-foreground dark:text-white/70">₹{budget.spent.toLocaleString("en-IN")}</span>
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
              <Target className="size-4 mr-2" />Goals
            </Button>
            <Button variant="outline" onClick={() => onNavigate("recurring")} className="h-12 dark:bg-white/5">
              <RefreshCcw className="size-4 mr-2" />Recurring
            </Button>
            <Button variant="outline" onClick={() => onNavigate("reports")} className="h-12 dark:bg-white/5">
              <FileBarChart className="size-4 mr-2" />Reports
            </Button>
            <Button variant="outline" onClick={() => onNavigate("categories")} className="h-12 dark:bg-white/5">
              <Tags className="size-4 mr-2" />Categories
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

type ModalType = "personalInfo" | "password" | "language" | "currency" | "budget" | "payment" | "help" | "contact" | "terms" | "privacy" | "delete" | null;

function ProfileScreen({ onNavigate, onLogout, monthlyBudget = 160000, setMonthlyBudget, onExport, user }: { onNavigate: (screen: Screen) => void; onLogout: () => void; monthlyBudget?: number; setMonthlyBudget?: (value: number) => void; onExport?: () => void; user?: User | null }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    phone: "",
    dob: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState({
    notifications: true,
    twoFactorAuth: true,
    language: "English (India)",
    currency: "INR",
    monthlyBudget: "₹1,60,000"
  });
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [paymentMethod, setPaymentMethod] = useState({ type: "card", number: "", name: "", expiry: "", upi: "" });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!profileData.name.trim()) errors.name = "Name is required";
    if (!profileData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) errors.email = "Invalid email format";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = () => {
    if (validateForm()) {
      setIsEditing(false);
      showToast("Profile updated successfully!");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePasswordChange = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      showToast("Please fill all fields");
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      showToast("New passwords don't match");
      return;
    }
    if (passwordData.new.length < 6) {
      showToast("Password must be at least 6 characters");
      return;
    }
    setPasswordData({ current: "", new: "", confirm: "" });
    setActiveModal(null);
    showToast("Password changed successfully!");
  };

  const handleAddPayment = () => {
    if (paymentMethod.type === "card") {
      if (!paymentMethod.number || !paymentMethod.name || !paymentMethod.expiry) {
        showToast("Please fill all card details");
        return;
      }
    } else {
      if (!paymentMethod.upi) {
        showToast("Please enter UPI ID");
        return;
      }
    }
    setPaymentMethod({ type: "card", number: "", name: "", expiry: "", upi: "" });
    setActiveModal(null);
    showToast("Payment method added!");
  };

  const handleDeleteAccount = () => {
    setActiveModal(null);
    showToast("Account deletion initiated. Please confirm via email.");
  };

  const languages = ["English (India)", "Hindi", "Tamil", "Telugu", "Marathi", "Bengali", "Kannada", "Malayalam"];
  const currencies = [
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" }
  ];
  const budgetOptions = ["₹50,000", "₹1,00,000", "₹1,60,000", "₹2,00,000", "₹3,00,000", "₹5,00,000"];

  return (
    <PhoneFrame label="Profile and settings screen" className="pb-28">
      <div className="h-full flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll">
        <ScreenHeader 
          eyebrow="Account" 
          title="Profile" 
          action={
            <Button 
              size="sm" 
              variant={isEditing ? "default" : "outline"}
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              className="rounded-full"
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          }
        />

        {isEditing ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-3xl bg-white p-5 shadow-lg dark:bg-card dark:border dark:border-white/10"
          >
            <div className="flex justify-center mb-4">
              <motion.div 
                className="relative cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="size-20 rounded-full bg-gradient-to-br from-[#7766e8] to-[#4f46e5] flex items-center justify-center">
                  <span className="text-4xl text-white font-bold">
                    {profileData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full">
                  <Settings2 className="size-3" />
                </div>
              </motion.div>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Full Name</Label>
                <Input 
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={cn("mt-1 font-semibold", formErrors.name && "border-red-500")}
                  placeholder="Your name"
                />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Email Address</Label>
                <Input 
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  type="email"
                  className={cn("mt-1 font-semibold", formErrors.email && "border-red-500")}
                  placeholder="your@email.com"
                />
                {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Phone Number</Label>
                <Input 
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-1 font-semibold"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Date of Birth</Label>
                <Input 
                  value={profileData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  className="mt-1 font-semibold"
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="mb-4 flex items-center gap-4 rounded-3xl bg-gradient-to-br from-[#7766e8] via-[#6366f1] to-[#4f46e5] p-5 shadow-lg shadow-purple-500/20"
            whileHover={{ scale: 1.01 }}
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1 }}
            >
<motion.div
              className="size-16 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-2xl font-extrabold text-white">
                {profileData.name.charAt(0).toUpperCase()}
              </span>
            </motion.div>
              <motion.div 
                className="absolute -right-1 -bottom-1 rounded-full bg-green-400 p-1.5"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.div>
            </motion.div>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-extrabold text-white">{profileData.name}</h3>
              <p className="truncate text-sm font-medium text-white/80">
                {profileData.email}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: Infinity }}>⭐</motion.span>
                {user?.role === "admin" ? "Admin" : user?.createdAt ? "Member" : "Guest"}
              </span>
            </div>
          </motion.div>
        )}

        <div className="mb-4 grid grid-cols-3 gap-2">
          {[
            { label: "Total Spent", value: "₹4.2L", emoji: "💰", color: "from-[#fee2e2] to-[#fecaca]" },
            { label: "Transactions", value: "156", emoji: "📊", color: "from-[#e0e7ff] to-[#c7d2fe]" },
            { label: "Categories", value: "12", emoji: "🏷️", color: "from-[#dcfce7] to-[#bbf7d0]" }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-3 dark:from-[#1a1a2e] dark:to-[#0a0a15]`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="absolute -right-2 -top-2 text-2xl"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                {stat.emoji}
              </motion.div>
              <p className="text-[10px] font-semibold text-muted-foreground dark:text-white/60">{stat.label}</p>
              <motion.p 
                className="text-lg font-extrabold dark:text-white"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              >
                {stat.value}
              </motion.p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
            <CardContent className="p-3">
              <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">Account</p>
              <div className="divide-y divide-border/80 dark:divide-white/5">
                <SettingRow
                  icon={<Settings2 className="size-5" />}
                  title="Personal Info"
                  detail="Name, email, phone"
                  action={<ChevronRight className="size-4 text-muted-foreground" />}
                  onClick={() => setActiveModal("personalInfo")}
                />
                <SettingRow
                  icon={<KeyRound className="size-5" />}
                  title="Change Password"
                  detail="Update your password"
                  action={<ChevronRight className="size-4 text-muted-foreground" />}
                  onClick={() => setActiveModal("password")}
                />
                <SettingRow
                  icon={<ShieldCheck className="size-5" />}
                  title="Two-Factor Auth"
                  detail="Extra security layer"
                  action={<Switch 
                    checked={settings.twoFactorAuth} 
                    onCheckedChange={(checked) => {
                      setSettings(s => ({ ...s, twoFactorAuth: checked }));
                      showToast(checked ? "2FA enabled" : "2FA disabled");
                    }} 
                    aria-label="2FA" 
                  />}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
            <CardContent className="p-3">
              <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">Preferences</p>
              <div className="divide-y divide-border/80 dark:divide-white/5">
                <SettingRow
                  icon={<Moon className="size-5" />}
                  title="Dark Mode"
                  detail={isDark ? "On" : "Off"}
                  action={<Switch checked={isDark} onCheckedChange={toggleTheme} aria-label="Dark mode" />}
                />
                <SettingRow
                  icon={<Bell className="size-5" />}
                  title="Notifications"
                  detail="Push & email alerts"
                  action={<Switch 
                    checked={settings.notifications} 
                    onCheckedChange={(checked) => {
                      setSettings(s => ({ ...s, notifications: checked }));
                      showToast(checked ? "Notifications enabled" : "Notifications disabled");
                    }} 
                    aria-label="Notifications" 
                  />}
                />
                <SettingRow
                  icon={<Languages className="size-5" />}
                  title="Language"
                  detail={settings.language}
                  action={<ChevronRight className="size-4 text-muted-foreground" />}
                  onClick={() => setActiveModal("language")}
                />
                <SettingRow
                  icon={<Globe className="size-5" />}
                  title="Currency"
                  detail={`${settings.currency} - ${currencies.find(c => c.code === settings.currency)?.name || "Indian Rupee"}`}
                  action={<ChevronRight className="size-4 text-muted-foreground" />}
                  onClick={() => setActiveModal("currency")}
                />
                <SettingRow
                  icon={<CircleDollarSign className="size-5" />}
                  title="Monthly Budget"
                  detail={`${settings.monthlyBudget} active`}
                  action={<Badge variant="secondary" className="bg-primary/10 text-primary">{settings.monthlyBudget}</Badge>}
                  onClick={() => setActiveModal("budget")}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
            <CardContent className="p-3">
              <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">Payment Methods</p>
              <div className="divide-y divide-border/80 dark:divide-white/5">
                <SettingRow
                  icon={<CreditCard className="size-5" />}
                  title="Saved Cards"
                  detail="2 cards added"
                  action={<Badge variant="outline" className="bg-transparent">2</Badge>}
                />
                <SettingRow
                  icon={<WalletCards className="size-5" />}
                  title="UPI"
                  detail="avery@oksbi"
                  action={<Badge variant="secondary" className="bg-primary/10 text-primary">Active</Badge>}
                />
                <SettingRow
                  icon={<Plus className="size-5" />}
                  title="Add Payment Method"
                  detail="Add new card or UPI"
                  action={<ChevronRight className="size-4 text-muted-foreground" />}
                  onClick={() => setActiveModal("payment")}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
            <CardContent className="p-3">
              <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">Support & Privacy</p>
              <div className="divide-y divide-border/80 dark:divide-white/5">
                <SettingRow
                  icon={<Headphones className="size-5" />}
                  title="Help Center"
                  detail="FAQs and support"
                  action={<ChevronRight className="size-4 text-muted-foreground" />}
                  onClick={() => setActiveModal("help")}
                />
                <SettingRow
                  icon={<HelpCircle className="size-5" />}
                  title="Contact Us"
                  detail="Email & chat support"
                  action={<ChevronRight className="size-4 text-muted-foreground" />}
                  onClick={() => setActiveModal("contact")}
                />
                <SettingRow
                  icon={<FileText className="size-5" />}
                  title="Terms of Service"
                  detail="Legal agreement"
                  action={<ChevronRight className="size-4 text-muted-foreground" />}
                  onClick={() => setActiveModal("terms")}
                />
                <SettingRow
                  icon={<Shield className="size-5" />}
                  title="Privacy Policy"
                  detail="How we handle data"
                  action={<ChevronRight className="size-4 text-muted-foreground" />}
                  onClick={() => setActiveModal("privacy")}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
            <CardContent className="p-3">
              <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">Danger Zone</p>
              <div className="divide-y divide-border/80 dark:divide-white/5">
                <SettingRow
                  icon={<Trash2 className="size-5 text-red-500" />}
                  title="Delete Account"
                  detail="Permanently remove account"
                  action={<ChevronRight className="size-4 text-red-500" />}
                  onClick={() => setActiveModal("delete")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {activeModal && (
          <ModalOverlay onClose={() => setActiveModal(null)}>
            {activeModal === "personalInfo" && (
              <ModalContent title="Personal Information" onClose={() => setActiveModal(null)}>
                <div className="space-y-3">
                  <Field label="Full Name">
                    <Input 
                      value={profileData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your name"
                    />
                  </Field>
                  <Field label="Email Address">
                    <Input 
                      value={profileData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      type="email"
                      placeholder="your@email.com"
                    />
                  </Field>
                  <Field label="Phone Number">
                    <Input 
                      value={profileData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </Field>
                  <Field label="Date of Birth">
                    <Input 
                      value={profileData.dob}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                      placeholder="DD/MM/YYYY"
                    />
                  </Field>
                  <Button onClick={handleSaveProfile} className="w-full mt-2">Save Changes</Button>
                </div>
              </ModalContent>
            )}
            {activeModal === "password" && (
              <ModalContent title="Change Password" onClose={() => setActiveModal(null)}>
                <div className="space-y-3">
                  <Field label="Current Password">
                    <Input 
                      type="password"
                      value={passwordData.current}
                      onChange={(e) => setPasswordData(p => ({ ...p, current: e.target.value }))}
                      placeholder="Enter current password"
                    />
                  </Field>
                  <Field label="New Password">
                    <Input 
                      type="password"
                      value={passwordData.new}
                      onChange={(e) => setPasswordData(p => ({ ...p, new: e.target.value }))}
                      placeholder="Enter new password"
                    />
                  </Field>
                  <Field label="Confirm New Password">
                    <Input 
                      type="password"
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData(p => ({ ...p, confirm: e.target.value }))}
                      placeholder="Confirm new password"
                    />
                  </Field>
                  <Button onClick={handlePasswordChange} className="w-full mt-2">Update Password</Button>
                </div>
              </ModalContent>
            )}
            {activeModal === "language" && (
              <ModalContent title="Select Language" onClose={() => setActiveModal(null)}>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSettings(s => ({ ...s, language: lang }));
                        setActiveModal(null);
                        showToast(`Language changed to ${lang}`);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl font-semibold transition-all",
                        settings.language === lang 
                          ? "bg-primary text-white" 
                          : "bg-muted/50 hover:bg-muted dark:bg-white/5"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </ModalContent>
            )}
            {activeModal === "currency" && (
              <ModalContent title="Select Currency" onClose={() => setActiveModal(null)}>
                <div className="space-y-2">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setSettings(s => ({ ...s, currency: curr.code }));
                        setActiveModal(null);
                        showToast(`Currency changed to ${curr.name}`);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between",
                        settings.currency === curr.code 
                          ? "bg-primary text-white" 
                          : "bg-muted/50 hover:bg-muted dark:bg-white/5"
                      )}
                    >
                      <span>{curr.name}</span>
                      <span className="font-bold">{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              </ModalContent>
            )}
            {activeModal === "budget" && (
              <ModalContent title="Monthly Budget" onClose={() => setActiveModal(null)}>
                <div className="space-y-2">
                  {budgetOptions.map((budget) => {
                    const budgetValue = parseInt(budget.replace(/[^0-9]/g, ""));
                    return (
                    <button
                      key={budget}
                      onClick={() => {
                        setMonthlyBudget?.(budgetValue);
                        setSettings(s => ({ ...s, monthlyBudget: budget }));
                        setActiveModal(null);
                        showToast(`Budget set to ${budget}`);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl font-semibold transition-all",
                        monthlyBudget === budgetValue 
                          ? "bg-primary text-white" 
                          : "bg-muted/50 hover:bg-muted dark:bg-white/5"
                      )}
                    >
                      {budget}
                    </button>
                  );
                  })}
                </div>
              </ModalContent>
            )}
            {activeModal === "payment" && (
              <ModalContent title="Add Payment Method" onClose={() => setActiveModal(null)}>
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant={paymentMethod.type === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod(p => ({ ...p, type: "card" }))}
                    className="flex-1"
                  >
                    <CreditCard className="size-4 mr-2" />Card
                  </Button>
                  <Button 
                    variant={paymentMethod.type === "upi" ? "default" : "outline"}
                    onClick={() => setPaymentMethod(p => ({ ...p, type: "upi" }))}
                    className="flex-1"
                  >
                    <WalletCards className="size-4 mr-2" />UPI
                  </Button>
                </div>
                {paymentMethod.type === "card" ? (
                  <div className="space-y-3">
                    <Field label="Card Number">
                      <Input 
                        value={paymentMethod.number}
                        onChange={(e) => setPaymentMethod(p => ({ ...p, number: e.target.value }))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </Field>
                    <Field label="Cardholder Name">
                      <Input 
                        value={paymentMethod.name}
                        onChange={(e) => setPaymentMethod(p => ({ ...p, name: e.target.value }))}
                        placeholder="Name on card"
                      />
                    </Field>
                    <Field label="Expiry Date">
                      <Input 
                        value={paymentMethod.expiry}
                        onChange={(e) => setPaymentMethod(p => ({ ...p, expiry: e.target.value }))}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </Field>
                  </div>
                ) : (
                  <Field label="UPI ID">
                    <Input 
                      value={paymentMethod.upi}
                      onChange={(e) => setPaymentMethod(p => ({ ...p, upi: e.target.value }))}
                      placeholder="yourname@upi"
                    />
                  </Field>
                )}
                <Button onClick={handleAddPayment} className="w-full mt-4">Add Payment Method</Button>
              </ModalContent>
            )}
            {activeModal === "help" && (
              <ModalContent title="Help Center" onClose={() => setActiveModal(null)}>
                <div className="space-y-3">
                  {[
                    { q: "How do I add an expense?", a: "Go to Add section and fill in the details." },
                    { q: "Can I export my data?", a: "Yes, go to Settings > Export Data." },
                    { q: "Is my data secure?", a: "Yes, we use encryption to protect your data." },
                    { q: "How do I set a budget?", a: "Go to Profile > Monthly Budget to set your limit." }
                  ].map((faq, i) => (
                    <div key={i} className="p-3 bg-muted/50 rounded-xl dark:bg-white/5">
                      <p className="font-bold text-sm">{faq.q}</p>
                      <p className="text-xs text-muted-foreground mt-1">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </ModalContent>
            )}
            {activeModal === "contact" && (
              <ModalContent title="Contact Us" onClose={() => setActiveModal(null)}>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-xl dark:bg-primary/20">
                    <p className="font-bold text-primary">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@spendstracks.com</p>
                    <p className="text-xs text-muted-foreground mt-1">Response within 24 hours</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl dark:bg-white/5">
                    <p className="font-bold">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Available 9 AM - 9 PM</p>
                    <Button className="w-full mt-3">Start Chat</Button>
                  </div>
                </div>
              </ModalContent>
            )}
            {activeModal === "terms" && (
              <ModalContent title="Terms of Service" onClose={() => setActiveModal(null)}>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>By using SpendsTracks, you agree to these terms.</p>
                  <p>1. You must be 18+ to use this app.</p>
                  <p>2. You're responsible for maintaining account security.</p>
                  <p>3. We reserve the right to modify these terms.</p>
                  <p>4. Your data is subject to our Privacy Policy.</p>
                </div>
              </ModalContent>
            )}
            {activeModal === "privacy" && (
              <ModalContent title="Privacy Policy" onClose={() => setActiveModal(null)}>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>We value your privacy. Here's how we handle your data:</p>
                  <p>• We collect only necessary information.</p>
                  <p>• Your financial data is encrypted.</p>
                  <p>• We never sell your data to third parties.</p>
                  <p>• You can delete your account anytime.</p>
                  <p>• Data is stored on secure servers.</p>
                </div>
              </ModalContent>
            )}
            {activeModal === "delete" && (
              <ModalContent title="Delete Account" onClose={() => setActiveModal(null)}>
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 dark:bg-red-900/30">
                    <Trash2 className="size-8 text-red-500" />
                  </div>
                  <p className="font-bold text-lg">Are you sure?</p>
                  <p className="text-sm text-muted-foreground mt-2 mb-4">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setActiveModal(null)} className="flex-1">
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="flex-1 bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </ModalContent>
            )}
          </ModalOverlay>
        )}

        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg z-50"
          >
            {toast}
          </motion.div>
        )}

        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#fee2e2] bg-[#fef2f2] text-sm font-bold text-[#dc2626] transition-colors hover:bg-[#fee2e2] dark:border-[#7f1d1d] dark:bg-[#450a0a] dark:text-[#fca5a5] dark:hover:bg-[#7f1d1d]"
        >
          <LogOut className="size-4" />
          Logout
        </motion.button>
        
        <p className="mt-4 text-center text-xs font-medium text-muted-foreground">
          SpendsTracks v1.0.0 • Made with ❤️
        </p>
      </div>

      <BottomNav active="Profile" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  message,
  action
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="mb-4 grid size-16 place-items-center rounded-full bg-gradient-to-br from-muted to-muted/50">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-extrabold">{title}</h3>
      <p className="mb-6 text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}

function SectionTitle({
  title,
  action,
  onAction
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-base font-extrabold">{title}</h3>
      {action && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:underline"
        >
          {action}
          <ChevronRight className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
  tone
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail?: string;
  tone: "income" | "expense";
}) {
  return (
    <Card
      className={cn(
        "border-border/80 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-fintech",
        tone === "income"
          ? "bg-gradient-to-b from-white to-[#edf9f1] dark:from-[#0f1a15] dark:to-[#0a1210]"
          : "bg-gradient-to-b from-white to-[#fff0ee] dark:from-[#1a0f0e] dark:to-[#100a09]"
      )}
    >
      <CardContent className="p-4">
        <div
          className={cn(
            "mb-3 grid size-10 place-items-center rounded-2xl",
            tone === "income"
              ? "bg-secondary text-primary dark:bg-[#0f2920] dark:text-[#10b889]"
              : "bg-[#fff0ee] text-[#c24940] dark:bg-[#1a0f0e] dark:text-[#ff6b5f]"
          )}
        >
          {icon}
        </div>
        <p className="text-xs font-extrabold text-muted-foreground dark:text-white/50">{label}</p>
        <strong className="mt-1 block text-xl font-extrabold dark:text-white">{value}</strong>
        {detail ? (
          <span className="mt-1 block text-xs font-semibold text-muted-foreground dark:text-white/40">
            {detail}
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}

function TransactionRow({
  transaction,
  onClick
}: {
  transaction: Transaction;
  onClick?: () => void;
}) {
  const isIncome = transaction.amount.startsWith("+");

  return (
    <motion.div 
      className="grid grid-cols-[2.85rem_1fr_auto] items-center gap-3 cursor-pointer"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          "grid size-11 place-items-center rounded-2xl text-sm font-extrabold",
          transaction.tone === "income" && "bg-secondary text-primary",
          transaction.tone === "expense" && "bg-[#fff0ee] text-[#b7473d]",
          transaction.tone === "travel" && "bg-[#edf4ff] text-[#326ab5]",
          transaction.tone === "bills" && "bg-[#fff7df] text-[#986a00]",
          transaction.tone === "food" && "bg-[#fff0ee] text-[#c24940]",
          transaction.tone === "shopping" && "bg-[#fef3c7] text-[#d97706]",
          transaction.tone === "transport" && "bg-[#e0e7ff] text-[#4f46e5]",
          transaction.tone === "entertainment" && "bg-[#f3e8ff] text-[#9333ea]",
          transaction.tone === "health" && "bg-[#dcfce7] text-[#16a34a]",
          transaction.tone === "education" && "bg-[#dbeafe] text-[#2563eb]",
          transaction.tone === "groceries" && "bg-[#fef9c3] text-[#ca8a04]"
        )}
      >
        {transaction.icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-extrabold">{transaction.title}</p>
        <p className="truncate text-xs font-semibold text-muted-foreground">
          {transaction.detail}
        </p>
      </div>
      <p
        className={cn(
          "text-sm font-extrabold",
          isIncome ? "text-primary" : "text-[#c24940]"
        )}
      >
        {transaction.amount}
      </p>
    </motion.div>
  );
}

function ProgressBar({
  value,
  compact,
  className
}: {
  value: number;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-full bg-muted",
        compact ? "h-2" : "h-3",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-[#f4b740]"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function SettingRow({
  icon,
  title,
  detail,
  action,
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  action: React.ReactNode;
  onClick?: () => void;
}) {
  const Wrapper = onClick ? motion.button : "div";
  const wrapperProps = onClick ? { 
    onClick,
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    className: "w-full flex min-h-[4.7rem] items-center justify-between gap-3 px-3 py-3 first:pt-2 last:pb-2"
  } : {};

  return (
    <Wrapper {...wrapperProps}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-10 place-items-center rounded-2xl bg-muted text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold">{title}</p>
          <p className="truncate text-xs font-semibold text-muted-foreground">
            {detail}
          </p>
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </Wrapper>
  );
}

function TransactionDetailScreen({ transaction, onNavigate, onDelete, onEdit }: { transaction: Transaction; onNavigate: (screen: Screen) => void; onDelete: (id: string) => void; onEdit: (id: string, updates: Partial<Transaction>) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState(transaction.amount);
  const [editedTitle, setEditedTitle] = useState(transaction.title);
  const [editedNotes, setEditedNotes] = useState(transaction.detail);

  const handleSave = () => {
    onEdit(transaction.id, { amount: editedAmount, title: editedTitle, detail: editedNotes });
    setIsEditing(false);
  };

  const categoryInfo = expenseCategories.find(c => c.value === transaction.category) || incomeCategories.find(c => c.value === transaction.category);

  return (
    <PhoneFrame label="Transaction detail screen" className="pb-28">
      <ScreenHeader 
        eyebrow="Transaction" 
        title="Details"
        action={<Button size="sm" variant="outline" onClick={() => onNavigate("transactions")}>Back</Button>}
      />

      <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="size-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold"
              style={{ backgroundColor: `${categoryInfo?.color}20`, color: categoryInfo?.color }}
            >
              {transaction.icon}
            </div>
            <div>
              {isEditing ? (
                <Input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="font-extrabold text-lg" />
              ) : (
                <h3 className="text-lg font-extrabold">{transaction.title}</h3>
              )}
              <p className="text-sm text-muted-foreground">{transaction.date}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl dark:bg-white/5">
              <span className="text-sm font-semibold text-muted-foreground">Type</span>
              <Badge variant={transaction.type === "income" ? "secondary" : "outline"} className={transaction.type === "income" ? "bg-primary/10 text-primary" : "text-red-500"}>
                {transaction.type.toUpperCase()}
              </Badge>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl dark:bg-white/5">
              <span className="text-sm font-semibold text-muted-foreground">Category</span>
              <span className="font-bold">{categoryInfo?.label || transaction.category}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl dark:bg-white/5">
              <span className="text-sm font-semibold text-muted-foreground">Amount</span>
              {isEditing ? (
                <Input value={editedAmount} onChange={(e) => setEditedAmount(e.target.value)} className="w-32 text-right font-extrabold" />
              ) : (
                <span className={`font-extrabold text-xl ${transaction.type === "income" ? "text-primary" : "text-red-500"}`}>
                  {transaction.amount}
                </span>
              )}
            </div>

            <div className="p-3 bg-muted/50 rounded-xl dark:bg-white/5">
              <span className="text-sm font-semibold text-muted-foreground block mb-1">Notes</span>
              {isEditing ? (
                <Input value={editedNotes} onChange={(e) => setEditedNotes(e.target.value)} />
              ) : (
                <p className="font-medium">{transaction.detail}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="flex-1">Save</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancel</Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} className="flex-1">Edit</Button>
                <Button variant="destructive" onClick={() => { onDelete(transaction.id); onNavigate("transactions"); }} className="flex-1 bg-red-500 hover:bg-red-600">Delete</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <BottomNav active="History" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}

function GoalsScreen({ onNavigate, goals, onAddGoal, onUpdateProgress, onDeleteGoal }: { onNavigate: (screen: Screen) => void; goals: Goal[]; onAddGoal: (goal: { name: string; target: number; deadline: string; color: string }) => void; onUpdateProgress: (id: string, amount: number) => void; onDeleteGoal: (id: string) => void }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", target: 10000, deadline: "", color: "#7766e8" });
  const colors = ["#7766e8", "#10b889", "#f4b740", "#ff6b5f", "#64a7ff"];

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target > 0 && newGoal.deadline) {
      onAddGoal(newGoal);
      setShowAddModal(false);
      setNewGoal({ name: "", target: 10000, deadline: "", color: "#7766e8" });
    }
  };

  return (
    <PhoneFrame label="Goals screen" className="pb-28">
      <ScreenHeader 
        eyebrow="Savings" 
        title="Goals"
        action={<Button size="sm" onClick={() => setShowAddModal(true)} className="rounded-full">+ Add</Button>}
      />

      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          const remaining = goal.target - goal.current;
          
          return (
            <Card key={goal.id} className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-extrabold text-base">{goal.name}</h4>
                    <p className="text-xs text-muted-foreground">Target: ₹{goal.target.toLocaleString("en-IN")}</p>
                  </div>
                  <button onClick={() => onDeleteGoal(goal.id)} className="p-2 text-muted-foreground hover:text-red-500">
                    <Trash2 className="size-4" />
                  </button>
                </div>
                
                <ProgressBar value={progress} className="mb-2" />
                
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-muted-foreground">₹{goal.current.toLocaleString("en-IN")}</span>
                  <span className="font-bold" style={{ color: goal.color }}>{progress.toFixed(0)}%</span>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">₹{remaining.toLocaleString("en-IN")} remaining</p>
                <p className="text-xs text-muted-foreground">Due: {new Date(goal.deadline).toLocaleDateString("en-IN")}</p>
                
                <Button 
                  size="sm" 
                  className="w-full mt-3" 
                  onClick={() => {
                    const amount = prompt("Enter amount to add:");
                    if (amount && parseInt(amount) > 0) {
                      onUpdateProgress(goal.id, parseInt(amount));
                    }
                  }}
                >
                  Add Funds
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {goals.length === 0 && (
          <EmptyState
            icon={<Target className="size-7 text-primary" />}
            title="No goals yet"
            message="Set a savings target to start achieving your dreams!"
            action={<Button onClick={() => setShowAddModal(true)} className="rounded-xl">+ Create Goal</Button>}
          />
        )}
      </div>

      {showAddModal && (
        <ModalOverlay onClose={() => setShowAddModal(false)}>
          <ModalContent title="Add New Goal" onClose={() => setShowAddModal(false)}>
            <div className="space-y-3">
              <Field label="Goal Name">
                <Input 
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(g => ({ ...g, name: e.target.value }))}
                  placeholder="e.g., Vacation, Phone"
                />
              </Field>
              <Field label="Target Amount">
                <Input 
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal(g => ({ ...g, target: parseInt(e.target.value) || 0 }))}
                />
              </Field>
              <Field label="Deadline">
                <Input 
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(g => ({ ...g, deadline: e.target.value }))}
                />
              </Field>
              <Field label="Color">
                <div className="flex gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewGoal(g => ({ ...g, color }))}
                      className={cn("w-8 h-8 rounded-full border-2", newGoal.color === color ? "border-black dark:border-white" : "border-transparent")}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </Field>
              <Button onClick={handleAddGoal} className="w-full mt-2">Create Goal</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      <BottomNav active="Insights" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}

function RecurringScreen({ onNavigate, recurring, onAddRecurring, onDeleteRecurring }: { onNavigate: (screen: Screen) => void; recurring: Recurring[]; onAddRecurring: (data: { title: string; amount: number; category: string; frequency: "daily" | "weekly" | "monthly"; type: "expense" | "income" }) => void; onDeleteRecurring: (id: string) => void }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecurring, setNewRecurring] = useState({ title: "", amount: 0, category: "food", frequency: "monthly" as "daily" | "weekly" | "monthly", type: "expense" as "expense" | "income" });

  const handleAddRecurring = () => {
    if (newRecurring.title && newRecurring.amount > 0) {
      onAddRecurring(newRecurring);
      setShowAddModal(false);
      setNewRecurring({ title: "", amount: 0, category: "food", frequency: "monthly", type: "expense" });
    }
  };

  return (
    <PhoneFrame label="Recurring screen" className="pb-28">
      <ScreenHeader 
        eyebrow="Automatic" 
        title="Recurring"
        action={<Button size="sm" onClick={() => setShowAddModal(true)} className="rounded-full">+ Add</Button>}
      />

      <div className="space-y-4">
        {recurring.map((item) => (
          <Card key={item.id} className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={cn("size-10 rounded-xl flex items-center justify-center font-bold", item.type === "income" ? "bg-secondary text-primary" : "bg-[#fff0ee] text-red-500")}>
                    {item.type === "income" ? <TrendingUp className="size-5" /> : <TrendingDown className="size-5" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold">{item.title}</h4>
                    <p className="text-xs text-muted-foreground capitalize">{item.frequency} • {item.category}</p>
                  </div>
                </div>
                <button onClick={() => onDeleteRecurring(item.id)} className="p-2 text-muted-foreground hover:text-red-500">
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className={`font-extrabold text-lg ${item.type === "income" ? "text-primary" : "text-red-500"}`}>
                  {item.type === "income" ? "+" : "-"}₹{item.amount.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-muted-foreground">Next: {new Date(item.nextDate).toLocaleDateString("en-IN")}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {recurring.length === 0 && (
          <EmptyState
            icon={<RefreshCcw className="size-7 text-primary" />}
            title="No recurring payments"
            message="Never miss a bill! Set up recurring transactions for subscriptions and bills."
            action={<Button onClick={() => setShowAddModal(true)} className="rounded-xl">+ Add Recurring</Button>}
          />
        )}
      </div>

      {showAddModal && (
        <ModalOverlay onClose={() => setShowAddModal(false)}>
          <ModalContent title="Add Recurring" onClose={() => setShowAddModal(false)}>
            <div className="space-y-3">
              <Field label="Title">
                <Input 
                  value={newRecurring.title}
                  onChange={(e) => setNewRecurring(r => ({ ...r, title: e.target.value }))}
                  placeholder="e.g., Netflix, Rent"
                />
              </Field>
              <Field label="Amount">
                <Input 
                  type="number"
                  value={newRecurring.amount}
                  onChange={(e) => setNewRecurring(r => ({ ...r, amount: parseInt(e.target.value) || 0 }))}
                />
              </Field>
              <Field label="Type">
                <Select value={newRecurring.type} onValueChange={(v: "expense" | "income") => setNewRecurring(r => ({ ...r, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Category">
                <Select value={newRecurring.category} onValueChange={(v) => setNewRecurring(r => ({ ...r, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Frequency">
                <Select value={newRecurring.frequency} onValueChange={(v: "daily" | "weekly" | "monthly") => setNewRecurring(r => ({ ...r, frequency: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Button onClick={handleAddRecurring} className="w-full mt-2">Add Recurring</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      <BottomNav active="Insights" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}

function ReportsScreen({ onNavigate, transactions }: { onNavigate: (screen: Screen) => void; transactions: Transaction[] }) {
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

function CategoriesScreen({ onNavigate, customCategories, onAddCategory, onDeleteCategory }: { onNavigate: (screen: Screen) => void; customCategories: CustomCategory[]; onAddCategory: (cat: { name: string; icon: string; color: string; type: "expense" | "income" }) => void; onDeleteCategory: (id: string) => void }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "⭐", color: "#7766e8", type: "expense" as "expense" | "income" });
  const icons = ["⭐", "🎮", "👗", "🏠", "🚗", "✈️", "💊", "📚", "🛒", "🎁", "💰", "📈"];

  const handleAddCategory = () => {
    if (newCategory.name) {
      onAddCategory(newCategory);
      setShowAddModal(false);
      setNewCategory({ name: "", icon: "⭐", color: "#7766e8", type: "expense" });
    }
  };

  const allCategories = [...expenseCategories.map(c => ({ ...c, type: "expense" as const })), ...incomeCategories.map(c => ({ ...c, type: "income" as const })), ...customCategories];

  return (
    <PhoneFrame label="Categories screen" className="pb-28">
      <ScreenHeader 
        eyebrow="Customize" 
        title="Categories"
        action={<Button size="sm" onClick={() => setShowAddModal(true)} className="rounded-full">+ Add</Button>}
      />

      <div className="space-y-4">
        <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
          <CardContent className="p-3">
            <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">Expense Categories</p>
            <div className="grid grid-cols-4 gap-2">
              {allCategories.filter(c => c.type === "expense").map((cat: any, i: number) => (
                <div key={i} className="flex flex-col items-center p-2 rounded-xl hover:bg-muted/50 cursor-pointer">
                  <div className="size-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                    {cat.icon || cat.value?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <span className="text-xs font-semibold mt-1 truncate w-full text-center">{cat.label || cat.name || cat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
          <CardContent className="p-3">
            <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">Income Categories</p>
            <div className="grid grid-cols-4 gap-2">
              {allCategories.filter(c => c.type === "income").map((cat: any, i: number) => (
                <div key={i} className="flex flex-col items-center p-2 rounded-xl hover:bg-muted/50 cursor-pointer">
                  <div className="size-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                    {cat.icon || cat.value?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <span className="text-xs font-semibold mt-1 truncate w-full text-center">{cat.label || cat.name || cat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {showAddModal && (
        <ModalOverlay onClose={() => setShowAddModal(false)}>
          <ModalContent title="Add Category" onClose={() => setShowAddModal(false)}>
            <div className="space-y-3">
              <Field label="Name">
                <Input 
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(c => ({ ...c, name: e.target.value }))}
                  placeholder="Category name"
                />
              </Field>
              <Field label="Type">
                <Select value={newCategory.type} onValueChange={(v: "expense" | "income") => setNewCategory(c => ({ ...c, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Icon">
                <div className="flex flex-wrap gap-2 mt-2">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewCategory(c => ({ ...c, icon }))}
                      className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg", newCategory.icon === icon ? "bg-primary text-white" : "bg-muted")}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </Field>
              <Button onClick={handleAddCategory} className="w-full mt-2">Add Category</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      <BottomNav active="Insights" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-[480px] rounded-t-3xl bg-white p-5 dark:bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function ModalContent({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-extrabold">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
          ✕
        </button>
      </div>
      {children}
    </div>
  );
}
