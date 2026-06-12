export type Transaction = {
  id: string;
  title: string;
  detail: string;
  amount: number;
  tone: string;
  icon: string;
  date?: string;
  type: "expense" | "income";
  category: string;
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
};

export type Recurring = {
  id: string;
  title: string;
  amount: number;
  category: string;
  frequency: "daily" | "weekly" | "monthly";
  nextDate: string;
  type: "expense" | "income";
};

export type CustomCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "expense" | "income";
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
};

export type Screen =
  | "splash"
  | "login"
  | "signup"
  | "dashboard"
  | "add-expense"
  | "add-income"
  | "transactions"
  | "analytics"
  | "profile"
  | "transaction-detail"
  | "goals"
  | "recurring"
  | "reports"
  | "categories"
  | "ask-ai";

export type FilterType = "all" | "expense" | "income";

export type ToastType = "success" | "error" | "info" | "coming";

export type ModalType =
  | "personalInfo"
  | "password"
  | "language"
  | "currency"
  | "budget"
  | "payment"
  | "help"
  | "contact"
  | "terms"
  | "privacy"
  | "delete"
  | null;

export type CategoryInfo = {
  value: string;
  label: string;
  icon: string;
  color: string;
};

export interface AppData {
  transactions: Transaction[];
  transactionHistory: Transaction[];
  goals: Goal[];
  recurring: Recurring[];
  customCategories: CustomCategory[];
  categoryBudgets: Record<string, number>;
  monthlyBudget: number;
  user: User | null;
}
