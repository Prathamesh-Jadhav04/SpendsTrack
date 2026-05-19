"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Check, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PhoneFrame, ScreenHeader, BottomNav, Field } from "@/components/shared";
import type { Screen } from "@/components/types";
import { expenseCategories, incomeCategories } from "@/components/constants";

interface AddTransactionScreenProps {
  onNavigate: (screen: Screen) => void;
  onSave: (data: { amount: string; category: string; date: string; notes: string; type: "expense" | "income" }) => void;
  type: "expense" | "income";
}

export function AddTransactionScreen({ onNavigate, onSave, type }: AddTransactionScreenProps) {
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
    await new Promise((resolve) => setTimeout(resolve, 300));
    onSave({
      amount,
      category,
      date: formData.get("date") as string,
      notes: formData.get("notes") as string,
      type,
    });
    setIsSaving(false);
    onNavigate("dashboard");
  };

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
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
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
