"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, RefreshCcw, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";

import { PhoneFrame, ScreenHeader, Field, ModalOverlay, ModalContent, EmptyState } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { expenseCategories, incomeCategories } from "@/components/constants";
import { cn } from "@/lib/utils";
import type { Recurring, Screen } from "@/components/types";

interface RecurringScreenProps {
  onNavigate: (screen: Screen) => void;
  recurring: Recurring[];
  onAddRecurring: (data: { title: string; amount: number; category: string; frequency: "daily" | "weekly" | "monthly"; type: "expense" | "income" }) => void;
  onDeleteRecurring: (id: string) => void;
}

export function RecurringScreen({ onNavigate, recurring, onAddRecurring, onDeleteRecurring }: RecurringScreenProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecurring, setNewRecurring] = useState({ title: "", amount: 0, category: "food", frequency: "monthly" as "daily" | "weekly" | "monthly", type: "expense" as "expense" | "income" });

  const handleAddRecurring = () => {
    if (newRecurring.title && newRecurring.amount > 0) {
      onAddRecurring(newRecurring);
      setShowAddModal(false);
      setNewRecurring({ title: "", amount: 0, category: "food", frequency: "monthly", type: "expense" });
    }
  };

  const allCategories = [...expenseCategories, ...incomeCategories];

  return (
    <PhoneFrame label="Recurring screen" className="pb-28 lg:pb-0">
      <div className="flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll lg:h-auto lg:overflow-visible">
        <ScreenHeader
          eyebrow="Automatic"
          title="Recurring"
          action={
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onNavigate("analytics")} className="rounded-full">
                <ArrowLeft className="size-4 mr-1" />
                Back
              </Button>
              <Button size="sm" onClick={() => setShowAddModal(true)} className="rounded-full">+ Add</Button>
            </div>
          }
        />

        <div className="space-y-4 pb-4">
          {recurring.map((item) => (
            <Card key={item.id} className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={cn("size-10 rounded-xl flex items-center justify-center font-bold", item.type === "income" ? "bg-income-soft text-income" : "bg-expense-soft text-expense")}>
                      {item.type === "income" ? <TrendingUp className="size-5" /> : <TrendingDown className="size-5" />}
                    </div>
                    <div>
                      <h4 className="font-extrabold">{item.title}</h4>
                      <p className="text-xs text-muted-foreground capitalize">{item.frequency} • {item.category}</p>
                    </div>
                  </div>
                  <button onClick={() => onDeleteRecurring(item.id)} className="p-2 text-muted-foreground hover:text-expense rounded-lg hover:bg-expense-soft/30 transition-colors">
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className={cn("font-extrabold text-lg tabular-money", item.type === "income" ? "text-income" : "text-expense")}>
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
      </div>

      {showAddModal && (
        <ModalOverlay onClose={() => setShowAddModal(false)}>
          <ModalContent title="Add Recurring" onClose={() => setShowAddModal(false)}>
            <div className="space-y-4">
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
                  value={newRecurring.amount || ""}
                  onChange={(e) => setNewRecurring(r => ({ ...r, amount: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter amount"
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
                    {allCategories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
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
    </PhoneFrame>
  );
}
