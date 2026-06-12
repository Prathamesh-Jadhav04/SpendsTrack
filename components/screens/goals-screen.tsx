"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Target, ArrowLeft, AlertTriangle } from "lucide-react";

import { PhoneFrame, ScreenHeader, Field, ModalOverlay, ModalContent, ProgressBar, EmptyState } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, parseAmount } from "@/lib/utils";
import type { Goal, Screen } from "@/components/types";
import { useCurrency, useTranslation } from "@/components/hooks";

interface GoalsScreenProps {
  onNavigate: (screen: Screen) => void;
  goals: Goal[];
  onAddGoal: (goal: { name: string; target: number; deadline: string; color: string }) => void;
  onUpdateProgress: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
}

export function GoalsScreen({ onNavigate, goals, onAddGoal, onUpdateProgress, onDeleteGoal }: GoalsScreenProps) {
  const { symbol, formatRaw } = useCurrency();
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fundGoalId, setFundGoalId] = useState<string | null>(null);
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [newGoal, setNewGoal] = useState({ name: "", target: 10000, deadline: "", color: "#7766e8" });
  const colors = ["#7766e8", "#10b889", "#f4b740", "#ff6b5f", "#64a7ff"];

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target > 0 && newGoal.deadline) {
      onAddGoal(newGoal);
      setShowAddModal(false);
      setNewGoal({ name: "", target: 10000, deadline: "", color: "#7766e8" });
    }
  };

  const handleAddFunds = () => {
    const parsedAmt = parseAmount(fundAmount);
    if (fundGoalId && fundAmount && parsedAmt > 0) {
      onUpdateProgress(fundGoalId, parsedAmt);
      setShowFundModal(false);
      setFundGoalId(null);
      setFundAmount("");
    }
  };

  const handleDeleteGoal = () => {
    if (deleteGoalId) {
      onDeleteGoal(deleteGoalId);
      setShowDeleteModal(false);
      setDeleteGoalId(null);
    }
  };

  return (
    <PhoneFrame label="Goals screen" className="pb-28 lg:pb-0">
      <div className="flex flex-col overflow-y-visible no-scrollbar smooth-scroll momentum-scroll lg:h-auto lg:overflow-visible">
        <ScreenHeader
          eyebrow="Savings"
          title="Goals"
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
          {goals.map((goal) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const remaining = goal.target - goal.current;

            return (
              <Card key={goal.id} className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-extrabold text-base">{goal.name}</h4>
                      <p className="text-xs text-muted-foreground">Target: {symbol}{formatRaw(goal.target)}</p>
                    </div>
                    <button
                      onClick={() => { setDeleteGoalId(goal.id); setShowDeleteModal(true); }}
                      className="p-2 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <ProgressBar value={progress} className="mb-2" />

                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-muted-foreground">{symbol}{formatRaw(goal.current)}</span>
                    <span className="font-bold" style={{ color: goal.color }}>{progress.toFixed(0)}%</span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">{symbol}{formatRaw(remaining)} remaining</p>
                  <p className="text-xs text-muted-foreground">Due: {new Date(goal.deadline).toLocaleDateString("en-IN")}</p>

                  <Button
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => {
                      setFundGoalId(goal.id);
                      setShowFundModal(true);
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
      </div>

      {showAddModal && (
        <ModalOverlay onClose={() => setShowAddModal(false)}>
          <ModalContent title="Add New Goal" onClose={() => setShowAddModal(false)}>
            <div className="space-y-4">
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
                  onChange={(e) => setNewGoal(g => ({ ...g, target: parseAmount(e.target.value) }))}
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
                      className={cn("w-8 h-8 rounded-full border-2 transition-transform", newGoal.color === color ? "border-black dark:border-white scale-110" : "border-transparent")}
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

      {showFundModal && (
        <ModalOverlay onClose={() => setShowFundModal(false)}>
          <ModalContent title="Add Funds" onClose={() => setShowFundModal(false)}>
            <div className="space-y-4">
              <Field label="Amount">
                <Input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="Enter amount"
                  autoFocus
                />
              </Field>
              <Button onClick={handleAddFunds} className="w-full mt-2">Add Funds</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {showDeleteModal && (
        <ModalOverlay onClose={() => setShowDeleteModal(false)}>
          <ModalContent title="Delete Goal" onClose={() => setShowDeleteModal(false)}>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 dark:bg-red-900/30">
                <AlertTriangle className="size-8 text-red-500" />
              </div>
              <p className="font-bold text-lg">Delete this goal?</p>
              <p className="text-sm text-muted-foreground mt-2 mb-6">
                This action cannot be undone. All progress will be lost.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteGoal}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </PhoneFrame>
  );
}
