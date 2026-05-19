"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Target } from "lucide-react";

import { PhoneFrame, ScreenHeader, BottomNav, Field, ModalOverlay, ModalContent, ProgressBar, EmptyState } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Goal, Screen } from "@/components/types";

interface GoalsScreenProps {
  onNavigate: (screen: Screen) => void;
  goals: Goal[];
  onAddGoal: (goal: { name: string; target: number; deadline: string; color: string }) => void;
  onUpdateProgress: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
}

export function GoalsScreen({ onNavigate, goals, onAddGoal, onUpdateProgress, onDeleteGoal }: GoalsScreenProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", target: 10000, deadline: "", color: "#7766e8" });
  const colors = ["#7766e8", "#10b889", "#f4b740", "#ff6b5f", "#64a7ff"];

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target > 0 && newGoal.deadline) {
      onAddGoal(newGoal);
      setShowAddModal(false);
      setNewGoal({ name: "", target: 10000, deadline: "", color: "#7766e8" });
    }
  };

  return (
    <PhoneFrame label="Goals screen" className="pb-28">
      <ScreenHeader
        eyebrow="Savings"
        title="Goals"
        action={<Button size="sm" onClick={() => setShowAddModal(true)} className="rounded-full">+ Add</Button>}
      />

      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          const remaining = goal.target - goal.current;

          return (
            <Card key={goal.id} className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-extrabold text-base">{goal.name}</h4>
                    <p className="text-xs text-muted-foreground">Target: ₹{goal.target.toLocaleString("en-IN")}</p>
                  </div>
                  <button onClick={() => onDeleteGoal(goal.id)} className="p-2 text-muted-foreground hover:text-red-500">
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <ProgressBar value={progress} className="mb-2" />

                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-muted-foreground">₹{goal.current.toLocaleString("en-IN")}</span>
                  <span className="font-bold" style={{ color: goal.color }}>{progress.toFixed(0)}%</span>
                </div>

                <p className="text-xs text-muted-foreground mt-2">₹{remaining.toLocaleString("en-IN")} remaining</p>
                <p className="text-xs text-muted-foreground">Due: {new Date(goal.deadline).toLocaleDateString("en-IN")}</p>

                <Button
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => {
                    const amount = prompt("Enter amount to add:");
                    if (amount && parseInt(amount) > 0) {
                      onUpdateProgress(goal.id, parseInt(amount));
                    }
                  }}
                >
                  Add Funds
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {goals.length === 0 && (
          <EmptyState
            icon={<Target className="size-7 text-primary" />}
            title="No goals yet"
            message="Set a savings target to start achieving your dreams!"
            action={<Button onClick={() => setShowAddModal(true)} className="rounded-xl">+ Create Goal</Button>}
          />
        )}
      </div>

      {showAddModal && (
        <ModalOverlay onClose={() => setShowAddModal(false)}>
          <ModalContent title="Add New Goal" onClose={() => setShowAddModal(false)}>
            <div className="space-y-3">
              <Field label="Goal Name">
                <Input
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(g => ({ ...g, name: e.target.value }))}
                  placeholder="e.g., Vacation, Phone"
                />
              </Field>
              <Field label="Target Amount">
                <Input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal(g => ({ ...g, target: parseInt(e.target.value) || 0 }))}
                />
              </Field>
              <Field label="Deadline">
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(g => ({ ...g, deadline: e.target.value }))}
                />
              </Field>
              <Field label="Color">
                <div className="flex gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewGoal(g => ({ ...g, color }))}
                      className={cn("w-8 h-8 rounded-full border-2", newGoal.color === color ? "border-black dark:border-white" : "border-transparent")}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </Field>
              <Button onClick={handleAddGoal} className="w-full mt-2">Create Goal</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      <BottomNav active="Insights" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}
