import type { CategoryInfo } from "@/components/types";

export const expenseCategories: CategoryInfo[] = [
  { value: "food", label: "Food & Dining", icon: "F", color: "#ff6b5f" },
  { value: "shopping", label: "Shopping", icon: "S", color: "#f4b740" },
  { value: "transport", label: "Transport", icon: "T", color: "#64a7ff" },
  { value: "bills", label: "Bills", icon: "B", color: "#ff6b5f" },
  { value: "entertainment", label: "Entertainment", icon: "E", color: "#7766e8" },
  { value: "health", label: "Health & Fitness", icon: "H", color: "#10b889" },
  { value: "education", label: "Education", icon: "U", color: "#0f8f72" },
  { value: "groceries", label: "Groceries", icon: "G", color: "#f97316" },
  { value: "travel", label: "Travel", icon: "T", color: "#64a7ff" },
  { value: "other", label: "Other", icon: "O", color: "#7766e8" },
];

export const incomeCategories: CategoryInfo[] = [
  { value: "salary", label: "Salary", icon: "S", color: "#10b889" },
  { value: "freelance", label: "Freelance", icon: "F", color: "#0f8f72" },
  { value: "investment", label: "Investment", icon: "I", color: "#64a7ff" },
  { value: "gift", label: "Gift", icon: "G", color: "#f4b740" },
  { value: "refund", label: "Refund", icon: "R", color: "#7766e8" },
  { value: "other", label: "Other", icon: "O", color: "#10b889" },
];

export const navItems = [
  { label: "Home", icon: "Home" },
  { label: "History", icon: "ReceiptText" },
  { label: "Add", icon: "Plus" },
  { label: "Insights", icon: "BarChart3" },
  { label: "Profile", icon: "UserRound" },
];

export const chartData = [
  { name: "Food & Dining", value: 28, color: "#0f8f72" },
  { name: "Shopping", value: 18, color: "#f4b740" },
  { name: "Transport", value: 15, color: "#64a7ff" },
  { name: "Bills", value: 14, color: "#ff6b5f" },
  { name: "Entertainment", value: 10, color: "#7766e8" },
  { name: "Health & Fitness", value: 8, color: "#10b889" },
  { name: "Groceries", value: 7, color: "#f97316" },
];

export const screenAnimation = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export const categoryIcons: Record<string, string> = {
  food: "F",
  shopping: "S",
  transport: "T",
  bills: "B",
  entertainment: "E",
  health: "H",
  education: "U",
  groceries: "G",
  travel: "T",
  salary: "S",
  investment: "I",
  gift: "G",
  refund: "R",
  other: "O",
};

export const categoryTitles: Record<string, string> = {
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
  gift: "Gift",
  refund: "Refund",
  other: "Other",
};
