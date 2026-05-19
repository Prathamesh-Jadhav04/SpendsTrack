"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { PhoneFrame, ScreenHeader, BottomNav, Field, ModalOverlay, ModalContent, EmptyState } from "@/components/shared";
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
}

type DisplayCategory = CategoryInfo & { type: "expense" | "income" };

export function CategoriesScreen({ onNavigate, customCategories, onAddCategory, onDeleteCategory }: CategoriesScreenProps) {
  const [showAddModal, setShowAddModal] = useState(false);
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
    <PhoneFrame label="Categories screen" className="pb-28">
      <div className="h-full flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll">
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
              <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">Expense Categories</p>
              <div className="grid grid-cols-4 gap-2">
                {allCategories.filter(c => c.type === "expense").map((cat, i) => (
                  <div key={i} className="flex flex-col items-center p-2 rounded-xl hover:bg-muted/50 cursor-pointer">
                    <div className="size-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                      {cat.icon || cat.value?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="text-xs font-semibold mt-1 truncate w-full text-center">{cat.label || cat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
            <CardContent className="p-3">
              <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">Income Categories</p>
              <div className="grid grid-cols-4 gap-2">
                {allCategories.filter(c => c.type === "income").map((cat, i) => (
                  <div key={i} className="flex flex-col items-center p-2 rounded-xl hover:bg-muted/50 cursor-pointer">
                    <div className="size-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                      {cat.icon || cat.value?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="text-xs font-semibold mt-1 truncate w-full text-center">{cat.label || cat.value}</span>
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

      <BottomNav active="Insights" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}
