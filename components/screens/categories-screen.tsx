"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { PhoneFrame, ScreenHeader, Field, ModalOverlay, ModalContent, EmptyState } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { expenseCategories, incomeCategories } from "@/components/constants";
import { cn } from "@/lib/utils";
import type { CustomCategory, Screen, CategoryInfo } from "@/components/types";

interface CategoriesScreenProps {
  onNavigate: (screen: Screen) => void;
  customCategories: CustomCategory[];
  onAddCategory: (cat: { name: string; icon: string; color: string; type: "expense" | "income" }) => void;
  onDeleteCategory: (id: string) => void;
  categoryBudgets: Record<string, number>;
  onSetCategoryBudget: (category: string, amount: number) => void;
}

type DisplayCategory = CategoryInfo & { type: "expense" | "income" };

export function CategoriesScreen({ 
  onNavigate, 
  customCategories, 
  onAddCategory, 
  onDeleteCategory,
  categoryBudgets,
  onSetCategoryBudget,
}: CategoriesScreenProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedBudgetCat, setSelectedBudgetCat] = useState<string | null>(null);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [newCategory, setNewCategory] = useState({ name: "", icon: "⭐", color: "#7766e8", type: "expense" as "expense" | "income" });
  const icons = ["⭐", "🎮", "👗", "🏠", "🚗", "✈️", "💊", "📚", "🛒", "🎁", "💰", "📈"];

  const handleAddCategory = () => {
    if (newCategory.name) {
      onAddCategory(newCategory);
      setShowAddModal(false);
      setNewCategory({ name: "", icon: "⭐", color: "#7766e8", type: "expense" });
    }
  };

  const allCategories: DisplayCategory[] = [
    ...expenseCategories.map(c => ({ ...c, type: "expense" as const })),
    ...incomeCategories.map(c => ({ ...c, type: "income" as const })),
    ...customCategories.map(c => ({ value: c.name, label: c.name, icon: c.icon, color: c.color, type: c.type })),
  ];

  return (
    <PhoneFrame label="Categories screen" className="pb-28 lg:pb-0">
      <div className="flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll lg:h-auto lg:overflow-visible">
        <ScreenHeader
          eyebrow="Customize"
          title="Categories"
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
           <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
            <CardContent className="p-3">
              <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">Expense Categories (Tap to Set Budget)</p>
              <div className="grid grid-cols-4 gap-2">
                {allCategories.filter(c => c.type === "expense").map((cat, i) => {
                  const budget = categoryBudgets[cat.value];
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedBudgetCat(cat.value);
                        setBudgetAmount(budget ? String(budget) : "");
                        setShowBudgetModal(true);
                      }}
                      className="flex flex-col items-center p-2 rounded-xl hover:bg-muted/50 cursor-pointer text-center transition-all hover:scale-105"
                    >
                      <div className="size-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                        {cat.icon || cat.value?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <span className="text-[11px] font-semibold mt-1.5 truncate w-full">{cat.label || cat.value}</span>
                      {budget ? (
                        <span className="text-[9px] font-bold text-primary mt-0.5">₹{budget.toLocaleString("en-IN")}</span>
                      ) : (
                        <span className="text-[9px] text-muted-foreground/50 mt-0.5 italic">No budget</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
 
          <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
            <CardContent className="p-3">
              <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">Income Categories</p>
              <div className="grid grid-cols-4 gap-2">
                {allCategories.filter(c => c.type === "income").map((cat, i) => (
                  <div key={i} className="flex flex-col items-center p-2 rounded-xl hover:bg-muted/50 cursor-pointer text-center">
                    <div className="size-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                      {cat.icon || cat.value?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="text-[11px] font-semibold mt-1.5 truncate w-full">{cat.label || cat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
 
      {showAddModal && (
        <ModalOverlay onClose={() => setShowAddModal(false)}>
          <ModalContent title="Add Category" onClose={() => setShowAddModal(false)}>
            <div className="space-y-3">
              <Field label="Name">
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(c => ({ ...c, name: e.target.value }))}
                  placeholder="Category name"
                />
              </Field>
              <Field label="Type">
                <Select value={newCategory.type} onValueChange={(v: "expense" | "income") => setNewCategory(c => ({ ...c, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Icon">
                <div className="flex flex-wrap gap-2 mt-2">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewCategory(c => ({ ...c, icon }))}
                      className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg", newCategory.icon === icon ? "bg-primary text-white" : "bg-muted")}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </Field>
              <Button onClick={handleAddCategory} className="w-full mt-2">Add Category</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {showBudgetModal && selectedBudgetCat && (
        <ModalOverlay onClose={() => setShowBudgetModal(false)}>
          <ModalContent title={`Set Budget for ${selectedBudgetCat.charAt(0).toUpperCase() + selectedBudgetCat.slice(1)}`} onClose={() => setShowBudgetModal(false)}>
            <div className="space-y-4">
              <Field label="Monthly Budget Limit (₹)">
                <Input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  placeholder="Enter budget limit in ₹"
                  autoFocus
                />
              </Field>
              <div className="flex gap-3 mt-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    onSetCategoryBudget(selectedBudgetCat, 0);
                    setShowBudgetModal(false);
                  }}
                >
                  Clear Budget
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-primary hover:bg-primary/95 text-white"
                  onClick={() => {
                    const amt = parseInt(budgetAmount);
                    if (!isNaN(amt) && amt >= 0) {
                      onSetCategoryBudget(selectedBudgetCat, amt);
                      setShowBudgetModal(false);
                    }
                  }}
                >
                  Save Budget
                </Button>
              </div>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </PhoneFrame>
  );
}
