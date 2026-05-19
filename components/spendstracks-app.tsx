"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, AlertCircle, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast, useNavigation, useAuth, useAppData } from "@/components/hooks";
import { LoginScreen, SignUpScreen } from "@/components/auth";
import {
  SplashScreen,
  DashboardScreen,
  AddTransactionScreen,
  TransactionsScreen,
  AnalyticsScreen,
  ProfileScreen,
  TransactionDetailScreen,
  GoalsScreen,
  RecurringScreen,
  ReportsScreen,
  CategoriesScreen,
} from "@/components/screens";
import type { Screen } from "@/components/types";

export function SpendsTracksApp() {
  const { toast, toastType, showToast } = useToast();
  const {
    currentScreen,
    setCurrentScreen,
    handleScreenChange,
    handleNavigation,
    getDirection,
  } = useNavigation();

  const {
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
  } = useAppData({ isLoggedIn: false, user: null, showToast });

  const {
    user,
    isLoggedIn,
    handleLogin,
    handleGuestLogin,
    handleSignUp,
    handleLogout,
  } = useAuth({
    showToast,
    setCurrentScreen,
    setTransactions,
    setTransactionHistory,
    setGoals,
    setRecurring,
    setCustomCategories,
    setMonthlyBudget,
  });

  // Re-initialize useAppData with actual auth state
  useEffect(() => {
    const saved = localStorage.getItem("spendstracks_data");
    if (saved) {
      const data = JSON.parse(saved);
      if (isLoggedIn) {
        setTransactions(data.transactions || []);
        setTransactionHistory(data.transactionHistory || []);
        setGoals(data.goals || []);
        setRecurring(data.recurring || []);
        setCustomCategories(data.customCategories || []);
        setMonthlyBudget(data.monthlyBudget || 160000);
      }
    }
  }, [isLoggedIn]);

  // Splash screen auto-redirect
  useEffect(() => {
    if (currentScreen === "splash") {
      const timer = setTimeout(() => {
        setCurrentScreen("login");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, setCurrentScreen]);

  const getScreenComponent = (screen: Screen) => {
    switch (screen) {
      case "splash":
        return <SplashScreen />;
      case "login":
        return (
          <LoginScreen
            onLogin={handleLogin}
            onGuestLogin={handleGuestLogin}
            onSignUpClick={() => handleScreenChange("signup")}
          />
        );
      case "signup":
        return <SignUpScreen onSignUp={handleSignUp} onLogin={() => handleScreenChange("login")} />;
      case "dashboard":
        return (
          <DashboardScreen
            onNavigate={handleNavigation}
            transactions={transactions}
            user={user}
            isAdmin={user?.role === "admin"}
            isLoading={isLoading}
          />
        );
      case "add-expense":
        return (
          <AddTransactionScreen
            onNavigate={handleNavigation}
            onSave={handleAddTransaction}
            type="expense"
          />
        );
      case "add-income":
        return (
          <AddTransactionScreen
            onNavigate={handleNavigation}
            onSave={handleAddTransaction}
            type="income"
          />
        );
      case "transactions":
        return (
          <TransactionsScreen
            onNavigate={handleNavigation}
            transactions={getFilteredTransactions()}
            filter={filter}
            onFilterChange={setFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onTransactionClick={(t) => {
              setSelectedTransaction(t);
              handleScreenChange("transaction-detail");
            }}
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
            onFilterChange={setFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onTransactionClick={() => {}}
          />
        );
      case "analytics":
        return (
          <AnalyticsScreen
            onNavigate={handleNavigation}
            transactions={[...transactions, ...transactionHistory]}
            monthlyBudget={monthlyBudget}
            onExport={exportToCSV}
          />
        );
      case "goals":
        return (
          <GoalsScreen
            onNavigate={handleNavigation}
            goals={goals}
            onAddGoal={handleAddGoal}
            onUpdateProgress={handleUpdateGoalProgress}
            onDeleteGoal={handleDeleteGoal}
          />
        );
      case "recurring":
        return (
          <RecurringScreen
            onNavigate={handleNavigation}
            recurring={recurring}
            onAddRecurring={handleAddRecurring}
            onDeleteRecurring={handleDeleteRecurring}
          />
        );
      case "reports":
        return (
          <ReportsScreen
            onNavigate={handleNavigation}
            transactions={transactionHistory}
          />
        );
      case "categories":
        return (
          <CategoriesScreen
            onNavigate={handleNavigation}
            customCategories={customCategories}
            onAddCategory={handleAddCustomCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );
      case "profile":
        return (
          <ProfileScreen
            onNavigate={handleNavigation}
            onLogout={handleLogout}
            monthlyBudget={monthlyBudget}
            setMonthlyBudget={setMonthlyBudget}
            onExport={exportToCSV}
            user={user}
          />
        );
      default:
        return <SplashScreen />;
    }
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
