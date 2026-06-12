"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  LockKeyhole,
  LogIn,
  UserRound,
  Plus,
  Check,
  AlertCircle,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { BrandMark, Field, ModalOverlay, ModalContent } from "@/components/shared";
import { supabase } from "@/lib/supabase";

interface LoginScreenProps {
  onLogin: (email: string, password: string, name?: string) => void;
  onGuestLogin: () => void;
  onSignUpClick?: () => void;
}

export function LoginScreen({ onLogin, onGuestLogin, onSignUpClick }: LoginScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [modalTab, setModalTab] = useState<"terms" | "privacy">("terms");
  
  // Forgot Password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotIsLoading, setForgotIsLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (!password.trim()) {
      setPasswordError("Please enter your password");
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    onLogin(email, password, name || undefined);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess(false);

    if (!validateEmail(forgotEmail)) {
      setForgotError("Please enter a valid email address");
      return;
    }

    setForgotIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}`,
      });

      if (error) {
        setForgotError(error.message);
      } else {
        setForgotSuccess(true);
        setForgotEmail("");
      }
    } catch (err: any) {
      setForgotError(err.message || "An unexpected error occurred");
    } finally {
      setForgotIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 min-h-screen w-full relative overflow-y-auto lg:overflow-hidden bg-ds-canvas">
      {/* Left Visual Panel (Desktop only) */}
      <div className="lg:col-span-7 xl:col-span-8 hidden lg:flex flex-col justify-between p-12 bg-black text-white relative overflow-hidden">
        {/* Animated Mesh Gradients matching Vercel's blue-violet-pink-amber stops */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,124,240,0.22)_0%,transparent_50%),radial-gradient(circle_at_80%_30%,rgba(121,40,202,0.22)_0%,transparent_50%),radial-gradient(circle_at_40%_70%,rgba(255,0,128,0.15)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(249,203,40,0.15)_0%,transparent_50%)] opacity-80 animate-pulse" style={{ animationDuration: '10s' }} />

        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-white flex items-center justify-center shadow-md border border-white/10">
            <span className="text-black font-extrabold text-base">S</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-[-0.5px] leading-tight">SpendsTracks</h1>
            <p className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">Financial AI Engine</p>
          </div>
        </div>

        {/* Center Visuals: Floating dashboard blocks */}
        <div className="relative z-10 my-auto max-w-xl space-y-8">
          <div className="space-y-3">
            <div className="font-mono text-[10px] font-medium tracking-[1.5px] text-slate-400 uppercase">
              SPENDSTRACKS // CORE
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[40px] xl:text-[48px] font-semibold tracking-[-2.2px] leading-[1.05] text-white"
            >
              Take control of your spends. <br />
              <span className="bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080] bg-clip-text text-transparent">
                Track with AI.
              </span>
            </motion.h2>
            <p className="text-sm xl:text-base text-slate-400 leading-relaxed font-normal">
              Join thousands of users optimizing their budgets, tracking recurring payments, and hitting their savings goals with the power of Supabase and Nemotron AI.
            </p>
          </div>

          {/* Floating cards UI - Vercel-inspired cards */}
          <div className="grid grid-cols-2 gap-4 relative">
            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-5 rounded-lg bg-[#121212]/90 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col justify-between h-[150px] relative overflow-hidden"
              whileHover={{ y: -4 }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#007cf0] to-[#00dfd8]" />
              <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">METRICS // ACTIVE</div>
              <div className="my-auto">
                <div className="text-[28px] font-semibold tracking-[-1px] text-white">₹94,200.00</div>
              </div>
              <div className="font-mono text-[9px] text-green-400 flex items-center gap-1.5 uppercase">
                <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                SAVINGS OPTIMAL (+42%)
              </div>
            </motion.div>

            {/* Savings Goal Card / CLI Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="p-5 rounded-lg bg-[#121212]/90 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col justify-between h-[150px] relative overflow-hidden"
              whileHover={{ y: -4 }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#7928ca] to-[#ff0080]" />
              <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">CLI // DIAGNOSTIC</div>
              <div className="font-mono text-[11px] text-slate-300 bg-black/40 p-2.5 rounded border border-white/5 space-y-0.5 leading-tight flex-grow mt-2">
                <div className="text-slate-500">$ spendstracks --status</div>
                <div className="text-[#50e3c2]">✓ sync: database connected</div>
                <div className="text-amber-400">⚡ goal: vacation trip (72%)</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex justify-between text-[11px] font-mono text-slate-500 border-t border-white/10 pt-4 uppercase tracking-wider">
          <span>SpendsTracks AI © 2026</span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-green-500" />
            OPERATIONAL
          </span>
        </div>
      </div>

      {/* Right Form Panel (Centering form vertically & horizontally) */}
      <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center items-center p-6 bg-[#fafafa] dark:bg-black min-h-screen w-full relative">
        {/* Floating Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2.5 rounded-md bg-white dark:bg-[#0a0a0a] shadow-sm border border-border dark:border-[#333333] hover:bg-[#fafafa] dark:hover:bg-[#121212] transition-all z-20 cursor-pointer text-foreground"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="size-4.5 text-amber-400" /> : <Moon className="size-4.5 text-indigo-500" />}
        </motion.button>

        <div className="w-full max-w-md space-y-6">
          {/* Form Header */}
          <div className="text-center space-y-1.5">
            <div className="flex justify-center mb-1">
              <BrandMark />
            </div>
            <h1 className="text-2xl font-semibold tracking-[-0.6px] text-foreground">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Log in to manage your budget tracker</p>
          </div>

          <Card className="border border-border dark:border-[#222222] bg-white dark:bg-[#0a0a0a] shadow-sm rounded-lg overflow-hidden w-full relative">
            <CardContent className="grid gap-4 p-6 pt-6">
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-4">
                  <div className="relative group">
                    <Field label="Email Address" htmlFor="email" required>
                      <div className="relative mt-1.5">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
                          <Mail className="size-4 text-slate-400 dark:text-slate-500" />
                        </div>
                        <Input
                          id="email"
                          name="email"
                          className={cn(
                            "pl-10 pr-4 h-10 bg-white dark:bg-black border border-border dark:border-[#333333]",
                            "rounded-md text-sm text-foreground transition-colors",
                            "focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none",
                            emailError && "border-red-500 focus:border-red-500"
                          )}
                          placeholder="name@example.com"
                          type="email"
                          required
                          spellCheck={false}
                          autoComplete="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError("");
                          }}
                        />
                        {email && !emailError && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Check className="size-4 text-green-500" />
                          </div>
                        )}
                      </div>
                      {emailError && (
                        <motion.div
                          id="email-error"
                          role="alert"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-1.5 mt-1.5"
                        >
                          <AlertCircle className="size-3 text-red-500" />
                          <span className="text-xs text-red-500">{emailError}</span>
                        </motion.div>
                      )}
                    </Field>
                  </div>

                  {!showNameInput && (
                    <button
                      type="button"
                      onClick={() => setShowNameInput(true)}
                      className="text-xs font-medium text-slate-500 hover:text-black dark:hover:text-white transition-colors text-left flex items-center gap-1 px-1 w-fit cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      Add name for personalization
                    </button>
                  )}

                  {showNameInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.15 }}
                    >
                      <Field label="Your Name" htmlFor="name">
                        <div className="relative mt-1.5">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
                            <UserRound className="size-4 text-slate-400 dark:text-slate-500" />
                          </div>
                          <Input
                            id="name"
                            name="name"
                            className="pl-10 pr-4 h-10 bg-white dark:bg-black border border-border dark:border-[#333333] rounded-md text-sm text-foreground focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none"
                            placeholder="Jane Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </Field>
                    </motion.div>
                  )}

                  <div className="relative group">
                    <Field label="Password" htmlFor="password" required>
                      <div className="relative mt-1.5">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
                          <LockKeyhole className="size-4 text-slate-400 dark:text-slate-500" />
                        </div>
                        <Input
                          id="password"
                          name="password"
                          className="pl-10 pr-10 h-10 bg-white dark:bg-black border border-border dark:border-[#333333] rounded-md text-sm text-foreground transition-colors focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none"
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          required
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-black dark:hover:text-white transition-all p-1 rounded cursor-pointer"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </Field>
                    {passwordError && (
                      <motion.div
                        id="password-error"
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
                </div>

                <div className="flex items-center justify-between my-1">
                  <label htmlFor="rememberMe" className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        id="rememberMe"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all duration-150",
                          rememberMe ? "bg-black border-black dark:bg-white dark:border-white" : "border-slate-300 dark:border-slate-700 bg-white dark:bg-black"
                        )}
                      >
                        {rememberMe && <Check className="size-3 text-white dark:text-black stroke-[3px]" />}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-foreground transition-colors">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail("");
                      setForgotError("");
                      setForgotSuccess(false);
                      setShowForgotModal(true);
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 w-full bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="size-4" />
                      <span>Sign In</span>
                    </>
                  )}
                </Button>
              </form>

              <div className="relative py-0.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-border dark:bg-[#222222]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-[#0a0a0a] px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Or
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={onGuestLogin}
                className="h-10 w-full bg-white dark:bg-black border border-border dark:border-[#333333] hover:bg-slate-50 dark:hover:bg-[#121212] rounded-md font-medium text-sm text-foreground transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserRound className="size-4 text-slate-500" />
                <span>Continue as Guest</span>
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-2 pt-1 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              New to SpendsTracks?{" "}
              <button
                type="button"
                className="font-semibold text-black dark:text-white hover:underline cursor-pointer"
                onClick={onSignUpClick}
              >
                Create an account
              </button>
            </p>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
              By continuing, you agree to our{" "}
              <button
                onClick={() => { setModalTab("terms"); setShowTermsModal(true); }}
                type="button"
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white underline cursor-pointer"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                onClick={() => { setModalTab("privacy"); setShowTermsModal(true); }}
                type="button"
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white underline cursor-pointer"
              >
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Terms & Privacy Modal */}
      {showTermsModal && (
        <ModalOverlay onClose={() => setShowTermsModal(false)}>
          <ModalContent title={modalTab === "terms" ? "Terms of Service" : "Privacy Policy"} onClose={() => setShowTermsModal(false)}>
            <div className="space-y-4 text-sm text-muted-foreground max-h-[60vh] overflow-y-auto">
              {modalTab === "terms" ? (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Shield className="size-4 text-primary" />
                    Terms of Service
                  </h4>
                  <p>By using SpendsTracks, you agree to these terms:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>You must be 18+ to use this app</li>
                    <li>You're responsible for your account security</li>
                    <li>Don't misuse the app for illegal activities</li>
                    <li>We reserve the right to modify these terms</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Zap className="size-4 text-primary" />
                    Privacy Policy
                  </h4>
                  <p>We value your privacy:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Your financial data is stored securely in Supabase or local storage</li>
                    <li>We don't sell your data to third parties</li>
                    <li>Data transmission is encrypted for your security</li>
                    <li>You can request account deletion at any time</li>
                  </ul>
                </div>
              )}
              <div className="p-4 bg-ds-canvas-soft-2/50 dark:bg-ds-canvas-soft-2/20 rounded-md border border-border">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  SpendsTracks AI
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  SpendsTracks - Personal finance tracker built securely with Supabase database and OpenCode AI assistance.
                </p>
              </div>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <ModalOverlay onClose={() => setShowForgotModal(false)}>
          <ModalContent title="Recover Password" onClose={() => setShowForgotModal(false)}>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your email address below, and we will send you a secure link to reset your password.
              </p>

              {forgotSuccess ? (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg flex items-center gap-2 text-xs">
                  <Check className="size-4 shrink-0" />
                  <span>We've sent a password reset link to your email. Please check your inbox and spam folder.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <Field label="Email Address" htmlFor="forgot-email" required>
                    <div className="relative mt-1.5">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
                        <Mail className="size-4 text-slate-400 dark:text-slate-500" />
                      </div>
                      <Input
                        id="forgot-email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(e.target.value);
                          if (forgotError) setForgotError("");
                        }}
                        placeholder="name@example.com"
                        className={cn(
                          "pl-10 pr-4 h-10 bg-white dark:bg-black border border-border dark:border-[#333333] rounded-md text-sm text-foreground focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none",
                          forgotError && "border-red-500 focus:border-red-500"
                        )}
                        required
                      />
                    </div>
                  </Field>

                  {forgotError && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                      <AlertCircle className="size-3 text-red-500" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={forgotIsLoading}
                    className="h-10 w-full bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {forgotIsLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="size-4" />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
}
