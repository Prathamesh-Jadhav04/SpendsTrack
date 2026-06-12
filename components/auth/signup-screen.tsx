"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Smartphone,
  LockKeyhole,
  Eye,
  EyeOff,
  UserPlus,
  Check,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  Sun,
  Moon,
  Shield,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { PhoneFrame, Field, ModalOverlay, ModalContent, BrandMark } from "@/components/shared";

interface SignUpScreenProps {
  onSignUp: (email: string, name: string, password: string) => void;
  onLogin: () => void;
}

export function SignUpScreen({ onSignUp, onLogin }: SignUpScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [ageVerified, setAgeVerified] = useState(false);
  const [country, setCountry] = useState("India");
  const [currency, setCurrency] = useState("INR");
  const [monthlyBudget, setMonthlyBudget] = useState("50000");
  const [notifications, setNotifications] = useState(true);
  const [preferredTheme, setPreferredTheme] = useState("system");
  const [language, setLanguage] = useState("English");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const passwordStrength = (pwd: string) => {
    const reqs = {
      minLength: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
    };
    const passed = Object.values(reqs).filter(Boolean).length;
    if (pwd.length === 0) return { level: "", color: "bg-gray-200", width: "0%", requirements: reqs };
    if (passed <= 1) return { level: "Weak", color: "bg-red-500", width: "25%", requirements: reqs };
    if (passed === 2) return { level: "Fair", color: "bg-yellow-500", width: "50%", requirements: reqs };
    if (passed === 3) return { level: "Good", color: "bg-blue-500", width: "75%", requirements: reqs };
    return { level: "Strong", color: "bg-green-500", width: "100%", requirements: reqs };
  };

  const pwdStrength = passwordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (!name.trim()) {
      showToast("Please enter your name");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      showToast("Please enter a valid 10-digit phone number");
      return;
    }
    if (!ageVerified) {
      showToast("You must be 18 or older to use this app");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError("Password must contain uppercase, lowercase & number");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    if (!agreedToTerms) {
      showToast("Please agree to Terms & Conditions");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onSignUp(email, name, password);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="w-full flex flex-col justify-center items-center bg-ds-canvas relative py-6">
      {/* Floating Header Actions */}
      <div className="absolute -top-4 right-0 flex items-center gap-3 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogin}
          className="p-3 rounded-2xl bg-white/95 dark:bg-white/5 backdrop-blur-md shadow-lg border border-border/40 hover:shadow-xl transition-all text-xs font-bold flex items-center gap-1.5"
          aria-label="Go to Sign In"
        >
          <ArrowLeft className="size-4" />
          <span>Sign In</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-white/95 dark:bg-white/5 backdrop-blur-md shadow-lg border border-border/40 hover:shadow-xl transition-all"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="size-5 text-amber-400" /> : <Moon className="size-5 text-indigo-500" />}
        </motion.button>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Centered Header */}
        <div className="text-center space-y-3 mb-2">
          <div className="flex justify-center">
            <BrandMark />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-xs font-bold text-muted-foreground">Get started with SpendsTracks</p>
        </div>

        <Card className="border border-border/40 bg-white/90 dark:bg-card/95 backdrop-blur-2xl shadow-2xl rounded-[1.75rem] overflow-hidden w-full relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

          <CardContent className="p-6 pt-8">
            <form onSubmit={handleSubmit} className="grid gap-4">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-4"
                  >
                    <motion.div variants={itemVariants}>
                      <Field label="Full Name" htmlFor="name" required>
                        <div className="relative">
                          <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            className="pl-11 dark:bg-background transition-all focus:ring-2 focus:ring-primary/50 input-glow"
                            placeholder="e.g., John Doe…"
                            type="text"
                            required
                            autoComplete="name"
                            aria-label="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                          />
                        </div>
                      </Field>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Field label="Email Address" htmlFor="email" required>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            className={cn(
                              "pl-11 dark:bg-background transition-all focus:ring-2 focus:ring-primary/50 input-glow",
                              emailError && "border-red-500 focus:ring-red-500"
                            )}
                            placeholder="e.g., name@example.com…"
                            type="email"
                            required
                            spellCheck={false}
                            autoComplete="email"
                            aria-label="Email address"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (emailError) setEmailError("");
                            }}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                          />
                          {email && !emailError && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Check className="size-4 text-green-500" />
                            </div>
                          )}
                        </div>
                        {emailError && (
                          <p className="text-xs text-red-500 mt-1 font-medium">
                            {emailError}
                          </p>
                        )}
                      </Field>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Field label="Phone Number (Optional)" htmlFor="phone">
                        <div className="relative">
                          <Smartphone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            className="pl-11 dark:bg-background transition-all focus:ring-2 focus:ring-primary/50 input-glow"
                            placeholder="e.g., 9876543210…"
                            type="tel"
                            autoComplete="tel"
                            aria-label="Phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onFocus={() => setFocusedField("phone")}
                            onBlur={() => setFocusedField(null)}
                          />
                        </div>
                      </Field>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Field label="Password" htmlFor="password" required>
                        <div className="relative">
                          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="password"
                            name="password"
                            className="pl-11 pr-11 dark:bg-background transition-all focus:ring-2 focus:ring-primary/50 input-glow"
                            placeholder="Create a strong password…"
                            type={showPassword ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            aria-label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedField("password")}
                            onBlur={() => setFocusedField(null)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                        {password && (
                          <div className="mt-2 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-muted-foreground">Password strength</span>
                              <span
                                className={cn(
                                  "text-[10px] font-black",
                                  pwdStrength.level === "Weak"
                                    ? "text-red-500"
                                    : pwdStrength.level === "Fair"
                                    ? "text-yellow-500"
                                    : pwdStrength.level === "Good"
                                    ? "text-blue-500"
                                    : "text-green-500"
                                )}
                              >
                                {pwdStrength.level}
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className={cn("h-full rounded-full", pwdStrength.color)}
                                initial={{ width: 0 }}
                                animate={{ width: pwdStrength.width }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {[
                                { label: "8+ chars", met: pwdStrength.requirements.minLength },
                                { label: "Uppercase", met: pwdStrength.requirements.uppercase },
                                { label: "Lowercase", met: pwdStrength.requirements.lowercase },
                                { label: "Number", met: pwdStrength.requirements.number },
                              ].map((req) => (
                                <span
                                  key={req.label}
                                  className={cn(
                                    "text-[9px] font-bold px-2 py-0.5 rounded-full transition-all",
                                    req.met ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  {req.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </Field>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Field label="Confirm Password" htmlFor="confirmPassword" required>
                        <div className="relative">
                          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            className="pl-11 dark:bg-background transition-all focus:ring-2 focus:ring-primary/50 input-glow"
                            placeholder="Confirm your password…"
                            type={showPassword ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            aria-label="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={() => setFocusedField("confirmPassword")}
                            onBlur={() => setFocusedField(null)}
                          />
                        </div>
                      </Field>
                    </motion.div>

                    {passwordError && (
                      <p className="text-xs text-red-500 font-medium">
                        {passwordError}
                      </p>
                    )}
                  </motion.div>

                  {/* Additional options panel */}
                  <div className="mt-2 p-3 bg-muted/40 dark:bg-muted/15 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Additional Options</span>
                      <motion.div animate={{ rotate: showAdvanced ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="size-4 text-muted-foreground" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-3 space-y-3"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <Field label="Country" htmlFor="country">
                              <Select value={country} onValueChange={setCountry}>
                                <SelectTrigger id="country" className="dark:bg-background h-10 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="India">India</SelectItem>
                                  <SelectItem value="USA">USA</SelectItem>
                                  <SelectItem value="UK">UK</SelectItem>
                                  <SelectItem value="Canada">Canada</SelectItem>
                                  <SelectItem value="Australia">Australia</SelectItem>
                                </SelectContent>
                              </Select>
                            </Field>
                            <Field label="Currency" htmlFor="currency">
                              <Select value={currency} onValueChange={setCurrency}>
                                <SelectTrigger id="currency" className="dark:bg-background h-10 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="INR">₹ INR</SelectItem>
                                  <SelectItem value="USD">$ USD</SelectItem>
                                  <SelectItem value="EUR">€ EUR</SelectItem>
                                  <SelectItem value="GBP">£ GBP</SelectItem>
                                </SelectContent>
                              </Select>
                            </Field>
                          </div>

                          <Field label="Initial Monthly Budget" htmlFor="monthlyBudget">
                            <Input
                              id="monthlyBudget"
                              name="monthlyBudget"
                              type="number"
                              value={monthlyBudget}
                              onChange={(e) => setMonthlyBudget(e.target.value)}
                              className="dark:bg-background h-10 input-glow"
                              placeholder="e.g., 50000…"
                            />
                          </Field>

                          <div className="grid grid-cols-2 gap-3">
                            <Field label="Theme" htmlFor="preferredTheme">
                              <Select value={preferredTheme} onValueChange={setPreferredTheme}>
                                <SelectTrigger id="preferredTheme" className="dark:bg-background h-10 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="system">System</SelectItem>
                                  <SelectItem value="light">Light</SelectItem>
                                  <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>
                              </Select>
                            </Field>
                            <Field label="Language" htmlFor="language">
                              <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger id="language" className="dark:bg-background h-10 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="English">English</SelectItem>
                                  <SelectItem value="Hindi">Hindi</SelectItem>
                                  <SelectItem value="Spanish">Spanish</SelectItem>
                                </SelectContent>
                              </Select>
                            </Field>
                          </div>

                          <label className="flex items-center justify-between cursor-pointer py-1">
                            <span className="text-xs font-semibold text-muted-foreground">Enable Notifications</span>
                            <Switch checked={notifications} onCheckedChange={setNotifications} />
                          </label>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Age verification */}
                  <div className="mt-1">
                    <label htmlFor="ageVerified" className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5">
                        <input
                          id="ageVerified"
                          type="checkbox"
                          checked={ageVerified}
                          onChange={(e) => setAgeVerified(e.target.checked)}
                          className="sr-only"
                        />
                        <motion.div
                          className={cn(
                            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                            "group-focus-within:ring-2 group-focus-within:ring-primary/50 group-focus-within:ring-offset-2 dark:group-focus-within:ring-offset-ds-canvas",
                            ageVerified ? "bg-green-500 border-green-500" : "border-muted-foreground/50 group-hover:border-primary"
                          )}
                          whileTap={{ scale: 0.9 }}
                        >
                          {ageVerified && (
                            <Check className="size-3 text-white" />
                          )}
                        </motion.div>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground font-semibold">I am 18 years or older</span>
                        <p className="text-muted-foreground/60 text-[9px] leading-tight">Required for account creation</p>
                      </div>
                    </label>
                  </div>

                  {/* Terms acceptance checkbox */}
                  <div>
                    <label htmlFor="agreedToTerms" className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5">
                        <input
                          id="agreedToTerms"
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="sr-only"
                        />
                        <motion.div
                          className={cn(
                            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                            "group-focus-within:ring-2 group-focus-within:ring-primary/50 group-focus-within:ring-offset-2 dark:group-focus-within:ring-offset-ds-canvas",
                            agreedToTerms ? "bg-primary border-primary" : "border-muted-foreground/50 group-hover:border-primary"
                          )}
                          whileTap={{ scale: 0.9 }}
                        >
                          {agreedToTerms && (
                            <Check className="size-3 text-white" />
                          )}
                        </motion.div>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground font-semibold">I agree to the </span>
                        <button
                          type="button"
                          className="text-primary font-extrabold hover:underline inline-block"
                          onClick={() => setShowTermsModal(true)}
                        >
                          Terms & Conditions
                        </button>
                        <span className="text-muted-foreground font-semibold"> and </span>
                        <button
                          type="button"
                          className="text-primary font-extrabold hover:underline inline-block"
                          onClick={() => setShowTermsModal(true)}
                        >
                          Privacy Policy
                        </button>
                      </div>
                    </label>
                  </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="mt-3 h-13 w-full bg-primary rounded-2xl font-extrabold text-white shadow-level-2 hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.99 }}
                >
                  {isLoading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      <UserPlus className="size-5" />
                      <span>Create Account</span>
                    </>
                  )}
                </motion.button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4 pt-1">
            <p className="text-sm font-semibold text-center text-muted-foreground">
              Already have an account?{" "}
              <button type="button" className="font-extrabold text-primary hover:underline" onClick={onLogin}>
                Sign In
              </button>
            </p>
          </div>
        </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {showTermsModal && (
        <ModalOverlay onClose={() => setShowTermsModal(false)}>
          <ModalContent title="Terms & Privacy Policy" onClose={() => setShowTermsModal(false)}>
            <div className="space-y-4 text-sm text-muted-foreground max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="font-extrabold text-foreground mb-2 flex items-center gap-2">
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
              <div>
                <h4 className="font-extrabold text-foreground mb-2 flex items-center gap-2">
                  <Zap className="size-4 text-primary" />
                  Privacy Policy
                </h4>
                <p>We value your privacy:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Your financial data is stored locally on your device</li>
                  <li>We don't sell your data to third parties</li>
                  <li>Data is encrypted for your security</li>
                  <li>You can delete your account anytime</li>
                </ul>
              </div>
              <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 rounded-2xl border border-primary/20">
                <h4 className="font-extrabold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  About Developer
                </h4>
                <p className="text-xs mb-3">
                  SpendsTracks - A personal finance tracker built with 💚 by Prathamesh Jadhav
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://linkedin.com/in/prathamesh-jadhav04"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-primary hover:underline bg-white dark:bg-white/5 p-2 rounded-lg border border-primary/20"
                  >
                    <svg className="size-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/Prathamesh-Jadhav04"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-primary hover:underline bg-white dark:bg-white/5 p-2 rounded-lg border border-primary/20"
                  >
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                </div>
                <a
                  href="mailto:prathamesh.jadhav.office@gmail.com"
                  className="flex items-center justify-center gap-2 text-xs font-medium text-primary hover:underline mt-3 bg-white dark:bg-white/5 p-2 rounded-lg border border-primary/20"
                >
                  <Mail className="size-4" />
                  prathamesh.jadhav.office@gmail.com
                </a>
              </div>

              <motion.div
                className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="size-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Please scroll up and read all terms and privacy policy carefully before agreeing.
                  </p>
                </div>
              </motion.div>

              <div className="mt-4 p-4 bg-muted/30 dark:bg-muted/20 rounded-2xl border-2 border-primary/30">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <motion.div
                      className={cn(
                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                        agreedToTerms
                          ? "bg-gradient-to-br from-primary to-secondary border-primary"
                          : "border-muted-foreground/50 group-hover:border-primary bg-white dark:bg-white/5"
                      )}
                      whileTap={{ scale: 0.85 }}
                    >
                      {agreedToTerms && (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                          <Check className="size-4 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-foreground">I have read and agree to the </span>
                    <span className="text-primary font-bold">Terms of Service</span>
                    <span className="text-muted-foreground"> and </span>
                    <span className="text-primary font-bold">Privacy Policy</span>
                    <span className="text-muted-foreground"> *</span>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      By checking this box, you confirm that you are 18+ years old and accept our policies.
                    </p>
                  </div>
                </label>
              </div>

              <Button
                onClick={() => {
                  if (agreedToTerms) {
                    setShowTermsModal(false);
                  } else {
                    showToast("Please agree to Terms & Conditions");
                  }
                }}
                disabled={!agreedToTerms}
                className={cn(
                  "w-full mt-4 h-12 font-extrabold text-base",
                  agreedToTerms
                    ? "bg-gradient-to-br from-primary to-secondary"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {agreedToTerms ? "✓ Accept & Continue" : "☐ I Agree to Terms"}
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
}
