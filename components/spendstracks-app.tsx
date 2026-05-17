"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Home,
  LockKeyhole,
  LogOut,
  Mail,
  Moon,
  Plus,
  ReceiptText,
  Search,
  Settings2,
  TrendingDown,
  TrendingUp,
  UserRound,
  WalletCards
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
  title: string;
  detail: string;
  amount: string;
  tone: string;
  icon: string;
  date?: string;
};

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

type Screen = "splash" | "login" | "dashboard" | "add-expense" | "transactions" | "analytics" | "profile";
type FilterType = "all" | "expense" | "income";

const initialTransactions: Transaction[] = [
  { title: "Supermart", detail: "Groceries", amount: "-₹4,320", tone: "expense", icon: "S" },
  { title: "Salary", detail: "Income", amount: "+₹1,22,500", tone: "income", icon: "P" },
  { title: "Ride share", detail: "Transport", amount: "-₹940", tone: "travel", icon: "R" }
];

const initialHistory: Transaction[] = [
  { title: "Coffee House", detail: "Today, 8:20 AM", amount: "-₹460", tone: "expense", icon: "C" },
  { title: "Freelance", detail: "Yesterday", amount: "+₹32,000", tone: "income", icon: "F" },
  { title: "Metro Pass", detail: "Transport", amount: "-₹1,700", tone: "travel", icon: "M" },
  { title: "Water Bill", detail: "Utilities", amount: "-₹2,445", tone: "bills", icon: "W" }
];

export function SpendsTracksApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(initialHistory);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (currentScreen === "splash") {
      const timer = setTimeout(() => {
        setCurrentScreen("login");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setCurrentScreen("dashboard");
  };

  const handleGuestLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen("login");
  };

  const handleNavigation = (screen: Screen) => {
    if (screen !== "login" && screen !== "splash") {
      setCurrentScreen(screen);
    }
  };

  const handleAddExpense = (expense: { amount: string; category: string; date: string; notes: string }) => {
    const categoryIcons: Record<string, string> = {
      food: "F",
      shopping: "S",
      transport: "T",
      bills: "B",
      entertainment: "E",
      health: "H",
      education: "U",
      groceries: "G",
      travel: "T",
      salary: "P",
      investment: "I",
      other: "O"
    };
    const getCategoryTitle = (cat: string) => {
      const titles: Record<string, string> = {
        food: "Food & Dining",
        shopping: "Shopping",
        transport: "Transport",
        bills: "Bills",
        entertainment: "Entertainment",
        health: "Health & Fitness",
        education: "Education",
        groceries: "Groceries",
        travel: "Travel",
        salary: "Salary",
        investment: "Investment",
        other: "Other"
      };
      return titles[cat] || cat;
    };
    const newExpense: Transaction = {
      title: getCategoryTitle(expense.category),
      detail: expense.notes || expense.category,
      amount: `-₹${Number(expense.amount).toLocaleString("en-IN")}`,
      tone: "expense",
      icon: categoryIcons[expense.category] || "E",
      date: expense.date
    };
    setTransactions([newExpense, ...transactions]);
    setTransactionHistory([newExpense, ...transactionHistory]);
    setCurrentScreen("dashboard");
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

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen />;
      case "login":
        return <LoginScreen onLogin={handleLogin} onGuestLogin={handleGuestLogin} />;
      case "dashboard":
        return <DashboardScreen onNavigate={handleNavigation} transactions={transactions} />;
      case "add-expense":
        return <AddExpenseScreen onNavigate={handleNavigation} onSaveExpense={handleAddExpense} />;
      case "transactions":
        return (
          <TransactionsScreen 
            onNavigate={handleNavigation} 
            transactions={getFilteredTransactions()}
            filter={filter}
            onFilterChange={handleFilterClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );
      case "analytics":
        return <AnalyticsScreen onNavigate={handleNavigation} transactions={[...transactions, ...transactionHistory]} />;
      case "profile":
        return <ProfileScreen onNavigate={handleNavigation} onLogout={handleLogout} />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <main className="soft-page-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[500px]">
        {renderScreen()}
      </div>
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
          "relative flex min-h-[850px] flex-col overflow-hidden rounded-[1.9rem] bg-gradient-to-b from-white to-[#f8faf4] p-6 dark:from-[#0a0a0a] dark:to-[#050505]",
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
  title: string;
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
        className="grid justify-items-center gap-4"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <BrandMark />
        <div>
          <h1 className="text-3xl font-extrabold tracking-normal">
            SpendsTracks
          </h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Money clarity, made simple.
          </p>
        </div>
      </motion.div>
    </PhoneFrame>
  );
}

function LoginScreen({ onLogin, onGuestLogin }: { onLogin: (e: React.FormEvent) => void; onGuestLogin: () => void }) {
  return (
    <PhoneFrame label="Login screen">
      <div className="mt-6 flex items-start gap-3">
        <BrandMark compact />
        <div>
          <p className="mb-1 text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-primary">
            Welcome back
          </p>
          <h2 className="text-2xl font-extrabold leading-tight">
            Sign in to SpendsTracks
          </h2>
        </div>
      </div>

      <Card className="mt-9 border-border/80 bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
        <CardContent className="grid gap-4 p-5">
          <form onSubmit={onLogin}>
            <Field label="Email">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-11 dark:bg-background"
                  placeholder="you@example.com"
                  type="email"
                  required
                  autoComplete="email"
                  aria-label="Email address"
                />
              </div>
            </Field>
            <Field label="Password">
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-11 dark:bg-background"
                  placeholder="Enter password"
                  type="password"
                  required
                  autoComplete="current-password"
                  aria-label="Password"
                  minLength={1}
                />
              </div>
            </Field>
            <Button
              type="submit"
              className="mt-1 h-[52px] w-full bg-gradient-to-br from-primary to-[#10b889]"
            >
              Login
            </Button>
          </form>
          <Button variant="secondary" className="h-[52px] w-full" type="button" onClick={onGuestLogin}>
            Continue as Guest
          </Button>
        </CardContent>
      </Card>

      <p className="mt-auto pb-2 text-center text-sm font-semibold text-muted-foreground">
        New here?{" "}
        <button type="button" className="font-extrabold text-primary hover:underline" onClick={onGuestLogin}>
          Create an account
        </button>
      </p>
    </PhoneFrame>
  );
}

function DashboardScreen({ onNavigate, transactions }: { onNavigate: (screen: Screen) => void; transactions: Transaction[] }) {
  const recentTransactions = transactions.slice(0, 3);
  
  return (
    <PhoneFrame label="Dashboard screen" className="pb-28">
      <ScreenHeader
        eyebrow="Good morning"
        title="Dashboard"
        action={
          <Button size="icon" variant="outline" aria-label="Wallet">
            <WalletCards className="size-5 text-primary" />
          </Button>
        }
      />

      <Card className="mb-4 overflow-hidden border-0 bg-gradient-to-br from-primary to-[#0b6c59] text-white shadow-fintech dark:from-[#10b889] dark:to-[#085544]">
        <CardContent className="p-5">
          <p className="text-sm font-semibold text-white/75 dark:text-white/60">Total Balance</p>
          <h3 className="mt-2 text-[2.1rem] font-extrabold leading-none">
            ₹4,27,145
          </h3>
          <Badge className="mt-4 bg-white/15 text-white hover:bg-white/15">
            +12.4% from last month
          </Badge>
        </CardContent>
      </Card>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <StatCard
          icon={<TrendingUp className="size-5" />}
          label="Income"
          value="₹2,71,000"
          detail="This month"
          tone="income"
        />
        <StatCard
          icon={<TrendingDown className="size-5" />}
          label="Expense"
          value="₹1,09,300"
          detail="This month"
          tone="expense"
        />
      </div>

      <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
        <CardContent className="p-4">
          <SectionTitle 
            title="Recent transactions" 
            action="View all"
            onAction={() => onNavigate("transactions")}
          />
          <div className="grid gap-3">
            {recentTransactions.map((transaction, idx) => (
              <TransactionRow key={`${transaction.title}-${idx}`} transaction={transaction} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Button
        size="icon"
        aria-label="Quick add expense"
        onClick={() => onNavigate("add-expense")}
        className="absolute bottom-[5.8rem] right-6 size-14 rounded-[1.25rem] bg-gradient-to-br from-[#ff6b5f] to-[#ff995c] shadow-[0_18px_28px_rgb(255_107_95_/_0.32)]"
      >
        <Plus className="size-6" />
      </Button>
      <BottomNav active="Home" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}

function AddExpenseScreen({ onNavigate, onSaveExpense }: { onNavigate: (screen: Screen) => void; onSaveExpense: (expense: { amount: string; category: string; date: string; notes: string }) => void }) {
  const today = new Date().toISOString().split("T")[0];

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    onSaveExpense({
      amount: formData.get("amount") as string,
      category: formData.get("category") as string,
      date: formData.get("date") as string,
      notes: formData.get("notes") as string
    });
  };

  return (
    <PhoneFrame label="Add expense screen" className="pb-28">
      <ScreenHeader eyebrow="New entry" title="Add Expense" />

      <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
        <CardContent className="grid gap-4 p-5">
          <form onSubmit={handleAddExpense}>
            <Field label="Amount">
              <Input
                name="amount"
                className="h-16 text-3xl font-extrabold dark:bg-background"
                placeholder="₹0.00"
                inputMode="decimal"
                required
                min="1"
                step="1"
                aria-label="Expense amount"
              />
            </Field>
            <Field label="Category">
              <Select name="category" required>
                <SelectTrigger aria-label="Select category" className="dark:bg-background">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent className="dark:bg-card">
                  <SelectItem value="food">Food & Dining</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="bills">Bills</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="health">Health & Fitness</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
                  aria-label="Expense date"
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
            <Button
              type="submit"
              className="h-[52px] w-full bg-gradient-to-br from-primary to-[#10b889]"
            >
              Save Expense
            </Button>
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
  onSearchChange
}: { 
  onNavigate: (screen: Screen) => void; 
  transactions: Transaction[];
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Expense", value: "expense" },
    { label: "Income", value: "income" }
  ];

  return (
    <PhoneFrame label="Transactions screen" className="pb-28">
      <ScreenHeader eyebrow="Activity" title="Transactions" />

      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="bg-white pl-11 shadow-soft dark:bg-card dark:border dark:border-white/10"
          placeholder="Search transactions"
          type="search"
          aria-label="Search transactions"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
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
          value="₹62,000"
          tone="expense"
        />
        <StatCard
          icon={<TrendingUp className="size-5" />}
          label="Earned"
          value="₹1,90,000"
          tone="income"
        />
      </div>

      <Card className="flex-1 bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
        <CardContent className="grid gap-3 p-4">
          {transactions.length > 0 ? (
            transactions.map((transaction, idx) => (
              <TransactionRow key={`${transaction.title}-${idx}`} transaction={transaction} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No transactions found</p>
          )}
        </CardContent>
      </Card>

      <BottomNav active="History" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}

function AnalyticsScreen({ onNavigate, transactions }: { onNavigate: (screen: Screen) => void; transactions: Transaction[] }) {
  const totalExpenses = transactions.filter(t => t.amount.startsWith("-")).length;
  const totalIncome = transactions.filter(t => t.amount.startsWith("+")).length;

  return (
    <PhoneFrame label="Analytics screen" className="pb-28">
      <div className="h-full overflow-y-auto -mx-2 px-2">
        <ScreenHeader eyebrow="Insights" title="Analytics" />

        <div className="space-y-3 pb-4">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/10 to-secondary/20 dark:from-primary/5 dark:to-secondary/10 shadow-soft">
            <CardContent className="p-4">
              <p className="text-xs font-extrabold text-primary dark:text-primary">Spending by Category</p>
              <div className="mt-2 flex items-center gap-4">
                <div className="h-28 w-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
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
                  {chartData.slice(0, 4).map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-semibold dark:text-white/80">{item.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-primary">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary bg-gradient-to-r from-white to-primary/5 dark:from-card dark:to-primary/10 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-muted-foreground dark:text-white/60">Total Spent</p>
                  <h3 className="mt-1 text-2xl font-extrabold dark:text-white">₹1,09,320</h3>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-primary/20 px-2 py-1 text-xs font-extrabold text-primary">68%</span>
                  <p className="mt-1 text-[10px] font-semibold text-muted-foreground dark:text-white/50">of ₹1.6L budget</p>
                </div>
              </div>
              <ProgressBar value={68} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
            <CardContent className="p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-extrabold text-muted-foreground">Budget Breakdown</p>
                <span className="text-[10px] font-semibold text-primary">This month</span>
              </div>
              <div className="space-y-2.5">
                {budgets.slice(0, 4).map((budget) => (
                  <div key={budget.name}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold dark:text-white">{budget.name}</span>
                      <span className="text-xs font-extrabold text-muted-foreground dark:text-white/70">{budget.spent}</span>
                    </div>
                    <ProgressBar value={budget.progress} compact className="mt-1" />
                  </div>
                ))}
              </div>
            </CardContent>
        </Card>
        </div>
      </div>

      <BottomNav active="Insights" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}

function ProfileScreen({ onNavigate, onLogout }: { onNavigate: (screen: Screen) => void; onLogout: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <PhoneFrame label="Profile and settings screen" className="pb-28">
      <ScreenHeader eyebrow="Account" title="Profile" />

      <Card className="mb-4 bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="grid size-16 place-items-center rounded-[1.35rem] bg-gradient-to-br from-[#7766e8] to-[#64a7ff] text-lg font-extrabold text-white shadow-soft">
            AP
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-extrabold">Avery Parker</h3>
            <p className="truncate text-sm font-semibold text-muted-foreground">
              avery@example.com
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
        <CardContent className="divide-y divide-border/80 dark:divide-white/5 p-2">
          <SettingRow
            icon={<Moon className="size-5" />}
            title="Dark mode"
            detail="Adjust app appearance"
            action={<Switch checked={isDark} onCheckedChange={toggleTheme} aria-label="Dark mode" />}
          />
          <SettingRow
            icon={<CircleDollarSign className="size-5" />}
            title="Monthly budget"
            detail="₹1,60,000 active limit"
            action={<Badge variant="secondary">₹1.6L</Badge>}
          />
          <SettingRow
            icon={<Settings2 className="size-5" />}
            title="Currency"
            detail="Indian Rupee"
            action={<Badge variant="muted">INR</Badge>}
          />
        </CardContent>
      </Card>

      <Button
        variant="destructive"
        onClick={onLogout}
        className="mt-5 h-[52px] w-full bg-[#fff0ee] text-[#b7473d] hover:bg-[#ffe2dd] dark:bg-destructive/20 dark:text-destructive-foreground dark:hover:bg-destructive/30"
      >
        <LogOut className="size-4" />
        Logout
      </Button>

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
  transaction
}: {
  transaction: {
    title: string;
    detail: string;
    amount: string;
    tone: string;
    icon: string;
  };
}) {
  const isIncome = transaction.amount.startsWith("+");

  return (
    <div className="grid grid-cols-[2.85rem_1fr_auto] items-center gap-3">
      <div
        className={cn(
          "grid size-11 place-items-center rounded-2xl text-sm font-extrabold",
          transaction.tone === "income" && "bg-secondary text-primary",
          transaction.tone === "expense" && "bg-[#fff0ee] text-[#b7473d]",
          transaction.tone === "travel" && "bg-[#edf4ff] text-[#326ab5]",
          transaction.tone === "bills" && "bg-[#fff7df] text-[#986a00]"
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
    </div>
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
  action
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[4.7rem] items-center justify-between gap-3 px-3 py-3 first:pt-2 last:pb-2">
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
    </div>
  );
}
