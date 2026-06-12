import type { CategoryInfo, Transaction, Goal, Recurring } from "@/components/types";

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
  freelance: "F",
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
  freelance: "Freelance",
  investment: "Investment",
  gift: "Gift",
  refund: "Refund",
  other: "Other",
};

export const seedTransactions: Transaction[] = [
  { id: "seed-1", title: "Zomato", detail: "Food & Dining", amount: 1250, tone: "food", icon: "Z", date: new Date().toISOString().split("T")[0], type: "expense", category: "food" },
  { id: "seed-2", title: "Salary", detail: "Monthly Salary", amount: 85000, tone: "income", icon: "S", date: new Date().toISOString().split("T")[0], type: "income", category: "salary" },
  { id: "seed-3", title: "Metro Card", detail: "Transport", amount: 500, tone: "transport", icon: "M", date: new Date().toISOString().split("T")[0], type: "expense", category: "transport" },
  { id: "seed-4", title: "Shopping", detail: "Clothes", amount: 3200, tone: "shopping", icon: "S", date: new Date(Date.now() - 86400000).toISOString().split("T")[0], type: "expense", category: "shopping" },
  { id: "seed-5", title: "Electricity", detail: "Bills", amount: 2800, tone: "bills", icon: "E", date: new Date(Date.now() - 86400000).toISOString().split("T")[0], type: "expense", category: "bills" },
  { id: "seed-6", title: "Netflix", detail: "Entertainment", amount: 649, tone: "entertainment", icon: "N", date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0], type: "expense", category: "entertainment" },
];

export const seedHistory: Transaction[] = [
  { id: "seed-7", title: "Swiggy", detail: "Food delivery", amount: 420, tone: "food", icon: "S", date: new Date().toISOString().split("T")[0], type: "expense", category: "food" },
  { id: "seed-8", title: "Freelance Payment", detail: "Project payment", amount: 25000, tone: "income", icon: "F", date: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0], type: "income", category: "freelance" },
  { id: "seed-9", title: "Uber", detail: "Ride", amount: 380, tone: "transport", icon: "U", date: new Date(Date.now() - 86400000 * 4).toISOString().split("T")[0], type: "expense", category: "transport" },
  { id: "seed-10", title: "Myntra", detail: "Clothing", amount: 2100, tone: "shopping", icon: "M", date: new Date(Date.now() - 86400000 * 5).toISOString().split("T")[0], type: "expense", category: "shopping" },
  { id: "seed-11", title: "Gas Bill", detail: "Utilities", amount: 1450, tone: "bills", icon: "G", date: new Date(Date.now() - 86400000 * 6).toISOString().split("T")[0], type: "expense", category: "bills" },
  { id: "seed-12", title: "Gym", detail: "Membership", amount: 2000, tone: "health", icon: "G", date: new Date(Date.now() - 86400000 * 7).toISOString().split("T")[0], type: "expense", category: "health" },
  { id: "seed-13", title: "Amazon", detail: "Electronics", amount: 1890, tone: "shopping", icon: "A", date: new Date(Date.now() - 86400000 * 8).toISOString().split("T")[0], type: "expense", category: "shopping" },
  { id: "seed-14", title: "Movie", detail: "Weekend outing", amount: 450, tone: "entertainment", icon: "M", date: new Date(Date.now() - 86400000 * 9).toISOString().split("T")[0], type: "expense", category: "entertainment" },
  { id: "seed-15", title: "Grocery", detail: "Monthly supplies", amount: 3500, tone: "groceries", icon: "G", date: new Date(Date.now() - 86400000 * 10).toISOString().split("T")[0], type: "expense", category: "groceries" },
  { id: "seed-16", title: "Flight", detail: "Business trip", amount: 8500, tone: "travel", icon: "F", date: new Date(Date.now() - 86400000 * 11).toISOString().split("T")[0], type: "expense", category: "travel" },
  { id: "seed-17", title: "Course", detail: "Online learning", amount: 5000, tone: "education", icon: "C", date: new Date(Date.now() - 86400000 * 14).toISOString().split("T")[0], type: "expense", category: "education" },
];

export const seedGoals: Goal[] = [
  { id: "seed-g1", name: "Vacation", target: 50000, current: 32500, deadline: "2026-12-31", color: "#7766e8" },
  { id: "seed-g2", name: "Emergency Fund", target: 100000, current: 45000, deadline: "2026-06-30", color: "#10b889" },
  { id: "seed-g3", name: "New Phone", target: 80000, current: 65000, deadline: "2026-09-15", color: "#f4b740" },
];

export const seedRecurring: Recurring[] = [
  { id: "seed-r1", title: "Netflix", amount: 649, category: "entertainment", frequency: "monthly", nextDate: "2026-06-15", type: "expense" },
  { id: "seed-r2", title: "Gym", amount: 2000, category: "health", frequency: "monthly", nextDate: "2026-06-01", type: "expense" },
  { id: "seed-r3", title: "Rent", amount: 25000, category: "bills", frequency: "monthly", nextDate: "2026-06-01", type: "expense" },
];

export const APP_VERSION = "1.1.1";
