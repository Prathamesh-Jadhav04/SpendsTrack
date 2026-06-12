"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, AlertCircle, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast, useNavigation, useAuth, useAppData } from "@/components/hooks";
import { BottomNav, CustomCursor } from "@/components/shared";
import { LoginScreen, SignUpScreen, ResetPasswordScreen } from "@/components/auth";
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
  AskAIScreen,
} from "@/components/screens";
import type { Screen } from "@/components/types";

export function SpendsTracksApp() {
  const { toast, toastType, showToast } = useToast();
  const {
    currentScreen,
    setCurrentScreen,
    prevScreen,
    handleScreenChange,
    handleNavigation,
    getDirection,
  } = useNavigation();

  const {
    user,
    isLoggedIn,
    isLoadingSession,
    handleLogin,
    handleGuestLogin,
    handleSignUp,
    handleLogout,
    handleUpdateProfile,
  } = useAuth({
    showToast,
    setCurrentScreen,
  });

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
    categoryBudgets,
    setCategoryBudgets,
    handleSetCategoryBudget,
    monthlyBudget,
    setMonthlyBudget,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    selectedTransaction,
    setSelectedTransaction,
    isLoading: isLoadingData,
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
  } = useAppData({ isLoggedIn, user, showToast });

  const isLoading = isLoadingSession || isLoadingData;

  useEffect(() => {
    if (currentScreen === "splash" && !isLoadingSession) {
      if (isLoggedIn) {
        setCurrentScreen("dashboard");
      } else {
        const timer = setTimeout(() => {
          setCurrentScreen("login");
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentScreen, setCurrentScreen, isLoadingSession, isLoggedIn]);

  const isAuthScreen = currentScreen === "splash" || currentScreen === "login" || currentScreen === "signup" || currentScreen === "reset-password";

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
            categoryBudgets={categoryBudgets}
            monthlyBudget={monthlyBudget}
            onTransactionClick={(t) => {
              setSelectedTransaction(t);
              handleScreenChange("transaction-detail");
            }}
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
            transactions={transactions}
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
              onBack={() => {
                if (prevScreen && prevScreen !== "splash" && prevScreen !== "transaction-detail") {
                  handleScreenChange(prevScreen);
                } else {
                  handleScreenChange("dashboard");
                }
              }}
            />
          );
        }
        return (
          <TransactionsScreen
            onNavigate={handleNavigation}
            transactions={transactions}
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
            transactions={transactions}
            monthlyBudget={monthlyBudget}
            categoryBudgets={categoryBudgets}
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
            transactions={transactions}
          />
        );
      case "categories":
        return (
          <CategoriesScreen
            onNavigate={handleNavigation}
            customCategories={customCategories}
            onAddCategory={handleAddCustomCategory}
            onDeleteCategory={handleDeleteCategory}
            categoryBudgets={categoryBudgets}
            onSetCategoryBudget={handleSetCategoryBudget}
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
            showToast={showToast}
            user={user}
            transactions={transactions}
            transactionHistory={transactionHistory}
            customCategories={customCategories}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case "ask-ai":
        return (
          <AskAIScreen
            onNavigate={handleNavigation}
            transactions={transactions}
            goals={goals}
            recurring={recurring}
            monthlyBudget={monthlyBudget}
            categoryBudgets={categoryBudgets}
          />
        );
      case "reset-password":
        return (
          <ResetPasswordScreen
            onResetComplete={() => setCurrentScreen("dashboard")}
            showToast={showToast}
          />
        );
      default:
        return <SplashScreen />;
    }
  };

  const getActiveNav = () => {
    switch (currentScreen) {
      case "dashboard": return "Home";
      case "transactions":
      case "transaction-detail": return "History";
      case "add-expense":
      case "add-income": return "Add";
      case "analytics":
      case "goals":
      case "recurring":
      case "reports":
      case "categories": return "Insights";
      case "ask-ai": return "Ask AI";
      case "profile": return "Profile";
      default: return "Home";
    }
  };

  return (
    <main className="soft-page-bg min-h-dvh">
      <CustomCursor />
      {/* Skip to content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-xl focus:font-bold"
      >
        Skip to main content
      </a>
      {!isAuthScreen && <BottomNav active={getActiveNav()} onNavigate={handleNavigation} />}

      <div
        id="main-content"
        tabIndex={-1}
        className={cn(
          "flex flex-col items-center w-full min-h-screen",
          isAuthScreen ? "p-0" : "justify-center p-0 pt-0 lg:ml-64 lg:w-[calc(100%-16rem)] lg:p-8 lg:pt-10"
        )}
      >
        <div className={cn(
          "w-full",
          isAuthScreen ? "max-w-full" : "max-w-full lg:max-w-6xl"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: isAuthScreen ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: isAuthScreen ? 0 : -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full"
            >
              {getScreenComponent(currentScreen)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={cn(
              "fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl font-bold text-sm shadow-xl z-[60] max-w-[90%] text-center border",
              "lg:bottom-8 lg:left-auto lg:right-8 lg:translate-x-0 lg:max-w-sm",
              toastType === "success" && "bg-gradient-to-r from-primary to-secondary text-white border-white/20",
              toastType === "error" && "bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-400",
              toastType === "info" && "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400",
              toastType === "coming" && "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400"
            )}
          >
            {toastType === "success" && <Check className="inline size-4 mr-1.5 mb-0.5" aria-hidden="true" />}
            {toastType === "error" && <AlertCircle className="inline size-4 mr-1.5 mb-0.5" aria-hidden="true" />}
            {toastType === "info" && <Zap className="inline size-4 mr-1.5 mb-0.5" aria-hidden="true" />}
            {toastType === "coming" && <Sparkles className="inline size-4 mr-1.5 mb-0.5" aria-hidden="true" />}
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
