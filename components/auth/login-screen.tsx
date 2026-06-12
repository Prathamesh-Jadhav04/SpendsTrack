"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { PhoneFrame, BrandMark, Field } from "@/components/shared";

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
      document.getElementById("email")?.focus();
      return;
    }
    if (!password.trim()) {
      setPasswordError("Please enter your password");
      document.getElementById("password")?.focus();
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    onLogin(email, password, name || undefined);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center bg-ds-canvas relative py-3">
      {/* Floating Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="absolute -top-4 right-0 p-3 rounded-2xl bg-white/95 dark:bg-white/5 backdrop-blur-md shadow-lg border border-border/40 hover:shadow-xl transition-all z-20"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="size-5 text-amber-400" /> : <Moon className="size-5 text-indigo-500" />}
      </motion.button>

      <div className="w-full max-w-md space-y-4">
        {/* Centered Header */}
        <div className="text-center space-y-1.5 mb-1">
          <div className="flex justify-center">
            <BrandMark />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            SpendsTracks
          </h1>
          <p className="text-xs font-bold text-muted-foreground">Track your finances smarter</p>
        </div>

        <Card className="border border-border/40 bg-white/90 dark:bg-card/95 backdrop-blur-2xl shadow-2xl rounded-[1.75rem] overflow-hidden w-full relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

          <CardContent className="grid gap-4 p-5 pt-6">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4">
                <motion.div
                  whileFocus={{ scale: 1.005 }}
                  transition={{ duration: 0.15 }}
                  className="relative group"
                >
                  <Field label="Email Address" htmlFor="email" required>
                    <div className="relative">
                      <motion.div
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-all duration-300"
                        animate={{ scale: email ? 1 : 1 }}
                      >
                        <Mail
                          className={cn(
                            "size-[18px] transition-all duration-300",
                            email
                              ? "text-primary"
                              : "text-muted-foreground/60 group-focus-within:text-primary"
                          )}
                        />
                      </motion.div>
                      <Input
                        id="email"
                        name="email"
                        className={cn(
                          "pl-12 pr-4 h-13 bg-gradient-to-br from-white to-primary/5 dark:from-white/5 dark:to-primary/10",
                          "border-2 border-transparent rounded-2xl transition-all duration-300",
                          "focus:border-primary/60 focus:ring-0 focus:shadow-xl focus:shadow-primary/15",
                          "dark:bg-gradient-to-br dark:from-white/5 dark:to-primary/10",
                          emailError &&
                            "border-red-400/50 focus:border-red-500 focus:shadow-red-500/15"
                        )}
                        placeholder="e.g., name@example.com…"
                        type="email"
                        required
                        spellCheck={false}
                        autoComplete="email"
                        aria-label="Email address"
                        aria-describedby={emailError ? "email-error" : undefined}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                      />
                      {email && !emailError && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <Check className="size-5 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    {emailError && (
                      <motion.div
                        id="email-error"
                        role="alert"
                        aria-live="polite"
                        initial={{ opacity: 0, y: -8, x: -10 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        className="flex items-center gap-1.5 mt-2"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          <AlertCircle className="size-3.5 text-red-500" />
                        </motion.div>
                        <span className="text-xs text-red-500 font-medium">
                          {emailError}
                        </span>
                      </motion.div>
                    )}
                  </Field>
                </motion.div>

                {!showNameInput && (
                  <motion.button
                    type="button"
                    onClick={() => setShowNameInput(true)}
                    className="text-xs font-bold text-primary hover:text-primary/80 transition-colors text-left flex items-center gap-1.5 px-1 w-fit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Plus className="size-3.5" />
                    Add name for a personalized experience
                  </motion.button>
                )}

                {showNameInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Field label="Your Name" htmlFor="name">
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                          <UserRound className="size-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="name"
                          name="name"
                          className="pl-12 pr-4 h-12 bg-white dark:bg-white/5 border-2 border-transparent rounded-xl focus:border-primary/50 focus:ring-0 focus:shadow-lg focus:shadow-primary/10 dark:bg-white/5"
                          placeholder="e.g., Jane Doe…"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          aria-label="Your name"
                          autoComplete="off"
                        />
                      </div>
                    </Field>
                  </motion.div>
                )}

                <motion.div
                  whileFocus={{ scale: 1.005 }}
                  transition={{ duration: 0.15 }}
                  className="relative group"
                >
                  <Field label="Password" htmlFor="password" required>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <LockKeyhole className="size-[18px] text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        className="pl-12 pr-14 h-13 bg-gradient-to-br from-white to-primary/5 dark:from-white/5 dark:to-primary/10 border-2 border-transparent rounded-2xl transition-all duration-300 focus:border-primary/60 focus:ring-0 focus:shadow-xl focus:shadow-primary/15 dark:bg-gradient-to-br dark:from-white/5 dark:to-primary/10"
                        placeholder="••••••••…"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        aria-label="Password"
                        aria-describedby={passwordError ? "password-error" : undefined}
                        minLength={1}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-primary transition-all p-1.5 rounded-lg hover:bg-primary/10"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <motion.div animate={{ scale: showPassword ? 1.1 : 1 }} whileTap={{ scale: 0.9 }}>
                          {showPassword ? (
                            <EyeOff className="size-[18px]" />
                          ) : (
                            <Eye className="size-[18px]" />
                          )}
                        </motion.div>
                      </button>
                    </div>
                  </Field>
                  {passwordError && (
                    <motion.div
                      id="password-error"
                      role="alert"
                      aria-live="polite"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 mt-2"
                    >
                      <AlertCircle className="size-3.5 text-red-500" />
                      <span className="text-xs text-red-500 font-medium">{passwordError}</span>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              <div className="flex items-center justify-between my-2">
                <label htmlFor="rememberMe" className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <motion.div
                      className={cn(
                        "w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
                        "group-focus-within:ring-2 group-focus-within:ring-primary/50 group-focus-within:ring-offset-2 dark:group-focus-within:ring-offset-ds-canvas",
                        rememberMe
                          ? "bg-gradient-to-br from-primary to-secondary border-primary shadow-lg shadow-primary/30"
                          : "border-muted-foreground/40 group-hover:border-primary/60 bg-white dark:bg-white/5"
                      )}
                      whileTap={{ scale: 0.8 }}
                    >
                      {rememberMe && (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 600, damping: 20 }}
                        >
                          <Check className="size-3.5 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground/80 group-hover:text-foreground transition-colors">
                    Keep me signed in
                  </span>
                </label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="text-xs font-bold text-primary/80 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/5"
                >
                  Forgot?
                </motion.button>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="relative overflow-hidden h-12 w-full bg-primary rounded-2xl font-extrabold text-white shadow-level-2 hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                whileHover={{ y: isLoading ? 0 : -3 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={isLoading ? {} : { x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                {isLoading ? (
                  <motion.div
                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <LogIn className="size-5" />
                    </motion.div>
                    <span className="text-base">Sign In</span>
                    <motion.div
                      className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </>
                )}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="relative py-1"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="bg-white dark:bg-card px-4 py-1.5 rounded-full shadow-sm border border-border/30"
                >
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-muted-foreground/60">
                    Or continue as
                  </span>
                </motion.div>
              </div>
            </motion.div>

            <motion.button
              type="button"
              onClick={onGuestLogin}
              className="h-11 w-full bg-gradient-to-br from-white to-primary/5 dark:from-white/10 dark:to-primary/5 border-2 border-border/20 dark:border-white/10 rounded-2xl font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all flex items-center justify-center gap-2.5 backdrop-blur-sm"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center"
              >
                <UserRound className="size-4 text-primary" />
              </motion.div>
              <span className="text-sm">Continue as Guest</span>
              <motion.span
                animate={{ x: [0, 3, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs text-muted-foreground"
              >
                →
              </motion.span>
            </motion.button>
          </CardContent>
        </Card>

        <div className="space-y-2 pt-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm font-semibold text-center text-muted-foreground"
          >
            New to SpendsTracks?{" "}
            <button
              type="button"
              className="font-extrabold text-primary hover:text-primary/80 transition-colors"
              onClick={onSignUpClick}
            >
              Create an account
            </button>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-[10px] text-muted-foreground/60"
          >
            By continuing, you agree to our{" "}
            <button type="button" className="text-primary/70 hover:text-primary underline">
              Terms
            </button>{" "}
            and{" "}
            <button type="button" className="text-primary/70 hover:text-primary underline">
              Privacy Policy
            </button>
          </motion.p>
        </div>
      </div>
    </div>
  );
}


