import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCurrencySettings = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("spendstracks_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.currency) {
          const map: Record<string, { symbol: string; locale: string; code: string }> = {
            INR: { symbol: "₹", locale: "en-IN", code: "INR" },
            USD: { symbol: "$", locale: "en-US", code: "USD" },
            EUR: { symbol: "€", locale: "de-DE", code: "EUR" },
            GBP: { symbol: "£", locale: "en-GB", code: "GBP" },
          };
          return map[parsed.currency] || { symbol: "₹", locale: "en-IN", code: "INR" };
        }
      } catch (e) {
        console.error("Failed to parse settings:", e);
      }
    }
  }
  return { symbol: "₹", locale: "en-IN", code: "INR" };
};

export const formatAmountVal = (amount: number, code: string, locale: string): string => {
  if (code === "INR") {
    const hasFraction = amount % 1 !== 0;
    return amount.toLocaleString(locale, {
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: 2,
    });
  } else {
    return amount.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
};

export const formatAmount = (amount: number, type: "expense" | "income"): string => {
  const prefix = type === "expense" ? "-" : "+";
  const { symbol, locale, code } = getCurrencySettings();
  return `${prefix}${symbol}${formatAmountVal(amount, code, locale)}`;
};

export const parseAmount = (value: string | number): number => {
  if (value === null || value === undefined) return 0;
  const strVal = String(value);
  const cleaned = strVal.replace(/[\s$₹€£]/g, "").replace(/,/g, "");
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100) / 100;
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
};

export const generateId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const csvEscape = (val: string): string => {
  return `"${String(val).replace(/"/g, '""')}"`;
};

export const hashPassword = async (pwd: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(pwd);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};
