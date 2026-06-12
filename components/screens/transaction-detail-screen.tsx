"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { PhoneFrame, ScreenHeader, Field } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { expenseCategories, incomeCategories } from "@/components/constants";
import { cn } from "@/lib/utils";
import type { Transaction, Screen } from "@/components/types";

interface TransactionDetailScreenProps {
  transaction: Transaction;
  onNavigate: (screen: Screen) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Transaction>) => void;
}

export function TransactionDetailScreen({ transaction, onNavigate, onDelete, onEdit }: TransactionDetailScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState(transaction.amount.toString());
  const [editedTitle, setEditedTitle] = useState(transaction.title);
  const [editedNotes, setEditedNotes] = useState(transaction.detail);

  const handleSave = () => {
    const numericAmount = Math.round(parseFloat(editedAmount));
    if (isNaN(numericAmount) || numericAmount <= 0) return;
    onEdit(transaction.id, {
      amount: numericAmount,
      title: editedTitle,
      detail: editedNotes,
    });
    setIsEditing(false);
  };

  const categoryInfo = expenseCategories.find(c => c.value === transaction.category) || incomeCategories.find(c => c.value === transaction.category);

  return (
    <PhoneFrame label="Transaction detail screen" className="pb-28 lg:pb-0">
      <ScreenHeader
        eyebrow="Transaction"
        title="Details"
        action={<Button size="sm" variant="outline" onClick={() => onNavigate("transactions")}>Back</Button>}
      />

      <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="size-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold"
              style={{ backgroundColor: `${categoryInfo?.color}20`, color: categoryInfo?.color }}
            >
              {transaction.icon}
            </div>
            <div>
              {isEditing ? (
                <Input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="font-extrabold text-lg" />
              ) : (
                <h3 className="text-lg font-extrabold">{transaction.title}</h3>
              )}
              <p className="text-sm text-muted-foreground">{transaction.date || "No date"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl dark:bg-white/5">
              <span className="text-sm font-semibold text-muted-foreground">Type</span>
              <Badge variant="outline" className={transaction.type === "income" ? "bg-income-soft text-income border-income/20" : "bg-expense-soft text-expense border-expense/20"}>
                {transaction.type.toUpperCase()}
              </Badge>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl dark:bg-white/5">
              <span className="text-sm font-semibold text-muted-foreground">Category</span>
              <span className="font-bold">{categoryInfo?.label || transaction.category}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl dark:bg-white/5">
              <span className="text-sm font-semibold text-muted-foreground">Amount</span>
              {isEditing ? (
                <Input value={editedAmount} onChange={(e) => setEditedAmount(e.target.value)} className="w-32 text-right font-extrabold" />
              ) : (
                <span className={cn("font-extrabold text-xl tabular-money", transaction.type === "income" ? "text-income" : "text-expense")}>
                  {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <div className="p-3 bg-muted/50 rounded-xl dark:bg-white/5">
              <span className="text-sm font-semibold text-muted-foreground block mb-1">Notes</span>
              {isEditing ? (
                <Input value={editedNotes} onChange={(e) => setEditedNotes(e.target.value)} />
              ) : (
                <p className="font-medium">{transaction.detail}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="flex-1">Save</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancel</Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} className="flex-1">Edit</Button>
                <Button variant="destructive" onClick={() => { onDelete(transaction.id); onNavigate("transactions"); }} className="flex-1 bg-expense hover:bg-expense/90">Delete</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </PhoneFrame>
  );
}
