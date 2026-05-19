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
  onLogin: (email: string, name?: string) => void;
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
}
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    onLogin(email, name || undefined);
  };

  return (
    <PhoneFrame label="Login screen">
      <div className="relative overflow-hidden min-h-[180px]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-transparent" />

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * 300,
              y: Math.random() * 150,
              scale: 0,
            }}
            animate={{
              y: [null, Math.random() * -50],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/40 to-transparent rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-secondary/40 to-transparent rounded-full blur-2xl"
          animate={{ scale: [1, 1.3, 1], y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        <div className="relative flex justify-between items-start pt-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <motion.div className="relative mb-4">
              <motion.div
                className="absolute inset-0 bg-primary/40 rounded-3xl blur-2xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative"
              >
                <BrandMark />
                <motion.div
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-3 border-white dark:border-[#1a1a2e]"
                  animate={{
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      "0 0 0 rgba(34,197,94,0)",
                      "0 0 20px rgba(34,197,94,0.5)",
                      "0 0 0 rgba(34,197,94,0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>

            <div className="space-y-1">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary"
              >
                Welcome back
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-[1.75rem] font-extrabold leading-tight"
              >
                <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient">
                  Sign in to continue
                </span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center justify-center gap-1.5"
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-sm"
                >
                  💰
                </motion.span>
                <motion.p className="text-xs font-medium text-muted-foreground/80">
                  Track your finances smarter
                </motion.p>
                <motion.span
                  animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="text-sm"
                >
                  📈
                </motion.span>
              </motion.div>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-3 rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-xl shadow-xl border border-white/30 dark:border-white/10 hover:shadow-2xl transition-all group"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              >
                <Sun className="size-5 text-amber-400" />
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Moon className="size-5 text-indigo-500" />
              </motion.div>
            )}
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
      >
        <Card className="mt-6 border-0 bg-white/95 dark:bg-[#1a1a2e]/95 backdrop-blur-2xl shadow-2xl shadow-primary/10 dark:shadow-black/40 rounded-[1.75rem] overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

          <CardContent className="grid gap-6 p-6 pt-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-center"
            >
              <h3 className="text-xl font-extrabold">Good to see you! 👋</h3>
              <p className="text-xs text-muted-foreground mt-1.5">
                Enter your details to access your account
              </p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-5">
                <motion.div
                  whileFocus={{ scale: 1.005 }}
                  transition={{ duration: 0.15 }}
                  className="relative group"
                >
                  <Field label="Email Address">
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
                        className={cn(
                          "pl-12 pr-4 h-13 bg-gradient-to-br from-white to-primary/5 dark:from-white/5 dark:to-primary/10",
                          "border-2 border-transparent rounded-2xl transition-all duration-300",
                          "focus:border-primary/60 focus:ring-0 focus:shadow-xl focus:shadow-primary/15",
                          "dark:bg-gradient-to-br dark:from-white/5 dark:to-primary/10",
                          emailError &&
                            "border-red-400/50 focus:border-red-500 focus:shadow-red-500/15"
                        )}
                        placeholder="name@example.com"
                        type="email"
                        required
                        autoComplete="email"
                        aria-label="Email address"
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
                    className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors text-left flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Plus className="size-3" />
                    Add your name for personalized experience
                  </motion.button>
                )}

                {showNameInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Field label="Your Name">
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                          <UserRound className="size-4 text-muted-foreground" />
                        </div>
                        <Input
                          className="pl-12 pr-4 h-12 bg-white dark:bg-white/5 border-2 border-transparent rounded-xl focus:border-primary/50 focus:ring-0 focus:shadow-lg focus:shadow-primary/10 dark:bg-white/5"
                          placeholder="Enter your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          aria-label="Your name"
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
                  <Field label="Password">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <LockKeyhole className="size-[18px] text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                      </div>
                      <Input
                        className="pl-12 pr-14 h-13 bg-gradient-to-br from-white to-primary/5 dark:from-white/5 dark:to-primary/10 border-2 border-transparent rounded-2xl transition-all duration-300 focus:border-primary/60 focus:ring-0 focus:shadow-xl focus:shadow-primary/15 dark:bg-gradient-to-br dark:from-white/5 dark:to-primary/10"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        aria-label="Password"
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
                </motion.div>
              </div>

              <div className="flex items-center justify-between mt-4 mb-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <motion.div
                      className={cn(
                        "w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
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
                className="relative overflow-hidden h-14 w-full bg-gradient-to-r from-primary via-[#0ea571] to-[#0d8570] rounded-2xl font-extrabold text-white shadow-2xl shadow-primary/25 hover:shadow-3xl hover:shadow-primary/40 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
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
              className="relative py-3"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="bg-white/95 dark:bg-[#1a1a2e]/95 px-4 py-1.5 rounded-full shadow-sm border border-border/30"
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
              className="h-12 w-full bg-gradient-to-br from-white to-primary/5 dark:from-white/10 dark:to-primary/5 border-2 border-border/20 dark:border-white/10 rounded-2xl font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all flex items-center justify-center gap-2.5 backdrop-blur-sm"
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-auto pb-2 text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm font-medium text-muted-foreground"
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-auto pt-4"
      >
        <p className="text-center text-[10px] text-muted-foreground/60">
          By continuing, you agree to our{" "}
          <button type="button" className="text-primary/70 hover:text-primary underline">
            Terms
          </button>{" "}
          and{" "}
          <button type="button" className="text-primary/70 hover:text-primary underline">
            Privacy Policy
          </button>
        </p>
      </motion.div>
    </PhoneFrame>
  );
}


