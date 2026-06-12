"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Check, TrendingDown, TrendingUp, IndianRupee, Tag, FileText } from "lucide-react";
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
import { PhoneFrame, ScreenHeader, Field } from "@/components/shared";
import type { Screen } from "@/components/types";
import { expenseCategories, incomeCategories } from "@/components/constants";

interface AddTransactionScreenProps {
  onNavigate: (screen: Screen) => void;
  onSave: (data: { amount: string; category: string; date: string; notes: string; type: "expense" | "income" }) => void;
  type: "expense" | "income";
}

export function AddTransactionScreen({ onNavigate, onSave, type: initialType }: AddTransactionScreenProps) {
  const today = new Date().toISOString().split("T")[0];
  const [transactionType, setTransactionType] = useState<"expense" | "income">(initialType);
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const categories = transactionType === "expense" ? expenseCategories : incomeCategories;
  const title = transactionType === "expense" ? "Add Expense" : "Add Income";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount greater than 0");
      document.getElementById("amount")?.focus();
      return;
    }
    if (!category) {
      setError("Please select a category");
      const categoryTrigger = document.querySelector('button[aria-label="Select category"]') as HTMLButtonElement | null;
      categoryTrigger?.focus();
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onSave({
      amount,
      category,
      date,
      notes,
      type: transactionType,
    });

    setAmount("");
    setCategory("");
    setDate(today);
    setNotes("");
    setError("");
    setIsSaving(false);
    onNavigate("dashboard");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <PhoneFrame label={`Add ${transactionType} screen`} className="pb-28 lg:pb-0">
      <ScreenHeader eyebrow="New entry" title={title} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex gap-2 mb-4"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTransactionType("expense")}
          className={cn(
            "flex-1 h-11 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
            transactionType === "expense"
              ? "bg-expense text-white shadow-level-2"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <TrendingDown className="size-4" />
          Expense
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTransactionType("income")}
          className={cn(
            "flex-1 h-11 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
            transactionType === "income"
              ? "bg-income text-white shadow-level-2"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <TrendingUp className="size-4" />
          Income
        </motion.button>
      </motion.div>

      <Card className="w-full bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
        <CardContent className="grid gap-4 p-5">
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="grid gap-5"
          >
            <motion.div variants={itemVariants}>
              <Field label="Amount" required>
                <div className="relative">
                  <IndianRupee className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="amount"
                    className="h-16 pl-11 text-2xl font-extrabold dark:bg-background input-glow transition-all tabular-money"
                    placeholder="e.g. 500.00…"
                    inputMode="decimal"
                    required
                    min="1"
                    step="1"
                    autoComplete="off"
                    aria-label={`${transactionType} amount in rupees`}
                    aria-describedby={error ? "form-error" : undefined}
                    aria-invalid={!!error}
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (error) setError("");
                    }}
                    onFocus={() => setFocusedField("amount")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <AnimatePresence>
                    {focusedField === "amount" && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                         className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left ${
                           transactionType === "expense" ? "bg-expense" : "bg-income"
                         }`}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </Field>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Field label="Category">
                <div className="relative">
                  <Tag className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground z-10" />
                  <Select value={category} onValueChange={(v) => { setCategory(v); if (error) setError(""); }}>
                    <SelectTrigger aria-label="Select category" className="dark:bg-background pl-11 input-glow transition-all">
                      <SelectValue placeholder="Select category…" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-card">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Field>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Field label="Date">
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-11 dark:bg-background input-glow transition-all"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    max={today}
                    aria-label={`${transactionType} date`}
                    onFocus={() => setFocusedField("date")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </Field>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Field label="Notes">
                <div className="relative">
                  <FileText className="pointer-events-none absolute left-4 top-3 size-4 text-muted-foreground" />
                  <Textarea
                    placeholder="e.g. Dinner with friends…"
                    maxLength={500}
                    aria-label="Optional notes"
                    className="dark:bg-background pl-11 input-glow transition-all"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onFocus={() => setFocusedField("notes")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </Field>
            </motion.div>

            {error && (
              <motion.p
                id="form-error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 font-medium text-center"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </motion.p>
            )}

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isSaving}
                whileTap={{ scale: isSaving ? 1 : 0.98 }}
                className={cn(
                  "h-[52px] w-full rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 text-white shadow-lg transition-all cursor-pointer",
                   transactionType === "expense"
                     ? "bg-expense hover:bg-expense/90 shadow-level-2"
                     : "bg-income hover:bg-income/90 shadow-level-2",
                  isSaving && "opacity-70 cursor-wait"
                )}
                aria-disabled={isSaving}
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
                    Save {transactionType === "expense" ? "Expense" : "Income"}
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </CardContent>
      </Card>

      
    </PhoneFrame>
  );
}
