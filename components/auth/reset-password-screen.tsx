"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { BrandMark, Field } from "@/components/shared";
import { supabase } from "@/lib/supabase";

interface ResetPasswordScreenProps {
  onResetComplete: () => void;
  showToast: (message: string, duration?: number, type?: "success" | "error" | "info" | "coming") => void;
}

export function ResetPasswordScreen({ onResetComplete, showToast }: ResetPasswordScreenProps) {
  const { theme } = useTheme();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmError("");

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        showToast(error.message, 3000, "error");
      } else {
        showToast("Password reset successfully!", 3000, "success");
        onResetComplete();
      }
    } catch (err: any) {
      showToast(err.message || "An error occurred", 3000, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 min-h-screen w-full relative overflow-hidden bg-ds-canvas">
      {/* Left Visual Panel (Desktop only) */}
      <div className="lg:col-span-7 xl:col-span-8 hidden lg:flex flex-col justify-between p-12 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(121,40,202,0.22)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,0,128,0.15)_0%,transparent_50%)] opacity-80" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-white flex items-center justify-center shadow-md border border-white/10">
            <span className="text-black font-extrabold text-base">S</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-[-0.5px] leading-tight">SpendsTracks</h1>
            <p className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">Financial AI Engine</p>
          </div>
        </div>

        <div className="relative z-10 my-auto max-w-xl space-y-6">
          <div className="space-y-3">
            <div className="font-mono text-[10px] font-medium tracking-[1.5px] text-slate-400 uppercase">
              SECURITY // PORTAL
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[40px] xl:text-[48px] font-semibold tracking-[-2.2px] leading-[1.05] text-white"
            >
              Reset your password. <br />
              <span className="bg-gradient-to-r from-[#7928ca] to-[#ff0080] bg-clip-text text-transparent">
                Secure your profile.
              </span>
            </motion.h2>
            <p className="text-sm xl:text-base text-slate-400 leading-relaxed font-normal">
              Enter your new password below. Ensure it is at least 6 characters long and contains a mix of letters, numbers, and symbols.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex justify-between text-[11px] font-mono text-slate-500 border-t border-white/10 pt-4 uppercase tracking-wider">
          <span>SpendsTracks AI © 2026</span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-green-500" />
            SECURED
          </span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center items-center p-6 bg-[#fafafa] dark:bg-black min-h-screen w-full relative">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-1.5">
            <div className="flex justify-center mb-1">
              <BrandMark />
            </div>
            <h1 className="text-2xl font-semibold tracking-[-0.6px] text-foreground">
              Reset Password
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Choose a secure new password for your account</p>
          </div>

          <Card className="border border-border dark:border-[#222222] bg-white dark:bg-[#0a0a0a] shadow-sm rounded-lg overflow-hidden w-full relative">
            <CardContent className="grid gap-4 p-6 pt-6">
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-4">
                  {/* New Password */}
                  <div className="relative group">
                    <Field label="New Password" htmlFor="new-password" required>
                      <div className="relative mt-1.5">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
                          <LockKeyhole className="size-4 text-slate-400 dark:text-slate-500" />
                        </div>
                        <Input
                          id="new-password"
                          name="new-password"
                          className={cn(
                            "pl-10 pr-10 h-10 bg-white dark:bg-black border border-border dark:border-[#333333] rounded-md text-sm text-foreground transition-colors focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none",
                            passwordError && "border-red-500 focus:border-red-500"
                          )}
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (passwordError) setPasswordError("");
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-black dark:hover:text-white transition-all p-1 rounded cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </Field>
                    {passwordError && (
                      <motion.div
                        role="alert"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1.5 mt-1.5"
                      >
                        <AlertCircle className="size-3 text-red-500" />
                        <span className="text-xs text-red-500">{passwordError}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative group">
                    <Field label="Confirm New Password" htmlFor="confirm-password" required>
                      <div className="relative mt-1.5">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
                          <LockKeyhole className="size-4 text-slate-400 dark:text-slate-500" />
                        </div>
                        <Input
                          id="confirm-password"
                          name="confirm-password"
                          className={cn(
                            "pl-10 pr-4 h-10 bg-white dark:bg-black border border-border dark:border-[#333333] rounded-md text-sm text-foreground transition-colors focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none",
                            confirmError && "border-red-500 focus:border-red-500"
                          )}
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (confirmError) setConfirmError("");
                          }}
                        />
                      </div>
                    </Field>
                    {confirmError && (
                      <motion.div
                        role="alert"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1.5 mt-1.5"
                      >
                        <AlertCircle className="size-3 text-red-500" />
                        <span className="text-xs text-red-500">{confirmError}</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 w-full mt-2 bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {isLoading ? (
                    <div className="size-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="size-4" />
                      Save Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
