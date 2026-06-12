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
    <div className="grid lg:grid-cols-12 min-h-screen w-full relative overflow-hidden bg-ds-canvas">
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
              SPENDSTRACKS // REGISTER
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[40px] xl:text-[48px] font-semibold tracking-[-2.2px] leading-[1.05] text-white"
            >
              Start your journey to <br />
              <span className="bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080] bg-clip-text text-transparent">
                Financial Freedom.
              </span>
            </motion.h2>
            <p className="text-sm xl:text-base text-slate-400 leading-relaxed font-normal">
              Create an account in less than a minute. Gain instant insights into your cash flow, automate recurring bills, track custom categories, and get personalized tips from our AI Advisor.
            </p>
          </div>

          {/* Floating cards UI - Vercel-inspired cards */}
          <div className="grid grid-cols-2 gap-4 relative">
            {/* Category breakdown card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-5 rounded-lg bg-[#121212]/90 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col justify-between h-[150px] relative overflow-hidden"
              whileHover={{ y: -4 }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#007cf0] to-[#00dfd8]" />
              <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-1">DISTRIBUTION // SPENDS</div>
              <div className="font-mono text-[10px] text-slate-300 divide-y divide-white/5 space-y-1">
                <div className="flex justify-between py-0.5">
                  <span>🍔 FOOD & DINING</span>
                  <span className="text-[#00dfd8]">40%</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>🚗 TRANSPORT</span>
                  <span className="text-[#007cf0]">25%</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>🛍️ SHOPPING</span>
                  <span className="text-[#ff0080]">35%</span>
                </div>
              </div>
            </motion.div>

            {/* AI Advisor Config JSON Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="p-5 rounded-lg bg-[#121212]/90 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col justify-between h-[150px] relative overflow-hidden"
              whileHover={{ y: -4 }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#7928ca] to-[#ff0080]" />
              <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">CONFIG // DATABASE</div>
              <div className="font-mono text-[11px] text-[#50e3c2] bg-black/40 p-2.5 rounded border border-white/5 space-y-0.5 leading-tight flex-grow mt-2 overflow-hidden">
                <div>{"{"}</div>
                <div className="pl-3 text-slate-300">"provider": "supabase",</div>
                <div className="pl-3 text-slate-300">"encryption": "aes-256",</div>
                <div className="pl-3 text-slate-300">"ai_model": "nemotron"</div>
                <div>{"}"}</div>
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
      <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center items-center p-6 bg-[#fafafa] dark:bg-black min-h-screen w-full relative overflow-y-auto">
        {/* Floating Header Actions */}
        <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogin}
            className="px-3 py-2 rounded-md bg-white dark:bg-[#0a0a0a] shadow-sm border border-border dark:border-[#333333] hover:bg-[#fafafa] dark:hover:bg-[#121212] transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer text-foreground"
            aria-label="Go to Sign In"
          >
            <ArrowLeft className="size-3.5 text-slate-500" />
            <span>Sign In</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-md bg-white dark:bg-[#0a0a0a] shadow-sm border border-border dark:border-[#333333] hover:bg-[#fafafa] dark:hover:bg-[#121212] transition-all cursor-pointer text-foreground"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="size-4.5 text-amber-400" /> : <Moon className="size-4.5 text-indigo-500" />}
          </motion.button>
        </div>

        <div className="w-full max-w-md space-y-6 py-12">
          {/* Centered Header */}
          <div className="text-center space-y-1.5">
            <div className="flex justify-center mb-1">
              <BrandMark />
            </div>
            <h1 className="text-2xl font-semibold tracking-[-0.6px] text-foreground">
              Create account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Get started with SpendsTracks</p>
          </div>

          <Card className="border border-border dark:border-[#222222] bg-white dark:bg-[#0a0a0a] shadow-sm rounded-lg overflow-hidden w-full relative">
            <CardContent className="p-6 pt-6">
              <form onSubmit={handleSubmit} className="grid gap-4">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4"
                >
                  <motion.div variants={itemVariants}>
                    <Field label="Full Name" htmlFor="name" required>
                      <div className="relative mt-1.5">
                        <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                        <Input
                          id="name"
                          name="name"
                          className="pl-10 pr-4 h-10 bg-white dark:bg-black border border-border dark:border-[#333333] rounded-md text-sm text-foreground focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none transition-colors"
                          placeholder="John Doe"
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
                      <div className="relative mt-1.5">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                        <Input
                          id="email"
                          name="email"
                          className={cn(
                            "pl-10 pr-4 h-10 bg-white dark:bg-black border border-border dark:border-[#333333] rounded-md text-sm text-foreground focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none transition-colors",
                            emailError && "border-red-500 focus:ring-red-500"
                          )}
                          placeholder="name@example.com"
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
                        <p className="text-xs text-red-500 mt-1.5 font-medium">
                          {emailError}
                        </p>
                      )}
                    </Field>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Field label="Phone Number (Optional)" htmlFor="phone">
                      <div className="relative mt-1.5">
                        <Smartphone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                        <Input
                          id="phone"
                          name="phone"
                          className="pl-10 pr-4 h-10 bg-white dark:bg-black border border-border dark:border-[#333333] rounded-md text-sm text-foreground focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none transition-colors"
                          placeholder="9876543210"
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
                      <div className="relative mt-1.5">
                        <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                        <Input
                          id="password"
                          name="password"
                          className="pl-10 pr-10 h-10 bg-white dark:bg-black border border-border dark:border-[#333333] rounded-md text-sm text-foreground focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none transition-colors"
                          placeholder="Password"
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                      {password && (
                        <div className="mt-2 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-slate-500">Password strength</span>
                            <span
                              className={cn(
                                "text-[10px] font-bold",
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
                          <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
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
                                  "text-[9px] font-medium px-2 py-0.5 rounded transition-all",
                                  req.met ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500"
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
                      <div className="relative mt-1.5">
                        <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          className="pl-10 pr-4 h-10 bg-white dark:bg-black border border-border dark:border-[#333333] rounded-md text-sm text-foreground focus:border-black dark:focus:border-white focus:ring-0 focus:outline-none transition-colors"
                          placeholder="Confirm Password"
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
                <div className="mt-2 p-3 bg-white dark:bg-black border border-border dark:border-[#333333] rounded-md">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-left cursor-pointer"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Additional Options</span>
                    <motion.div animate={{ rotate: showAdvanced ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="size-4 text-slate-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Country" htmlFor="country">
                            <Select value={country} onValueChange={setCountry}>
                              <SelectTrigger id="country" className="bg-white dark:bg-black border border-border dark:border-[#333333] h-10 text-xs rounded-md">
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
                              <SelectTrigger id="currency" className="bg-white dark:bg-black border border-border dark:border-[#333333] h-10 text-xs rounded-md">
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
                            className="bg-white dark:bg-black border border-border dark:border-[#333333] h-10 rounded-md text-sm"
                            placeholder="50000"
                          />
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Theme" htmlFor="preferredTheme">
                            <Select value={preferredTheme} onValueChange={setPreferredTheme}>
                              <SelectTrigger id="preferredTheme" className="bg-white dark:bg-black border border-border dark:border-[#333333] h-10 text-xs rounded-md">
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
                              <SelectTrigger id="language" className="bg-white dark:bg-black border border-border dark:border-[#333333] h-10 text-xs rounded-md">
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
                          <span className="text-xs font-semibold text-slate-500">Enable Notifications</span>
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
                      <div
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all duration-150",
                          ageVerified ? "bg-black border-black dark:bg-white dark:border-white" : "border-slate-300 dark:border-slate-700 bg-white dark:bg-black"
                        )}
                      >
                        {ageVerified && <Check className="size-3 text-white dark:text-black stroke-[3px]" />}
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">I am 18 years or older</span>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] leading-tight">Required for account creation</p>
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
                      <div
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all duration-150",
                          agreedToTerms ? "bg-black border-black dark:bg-white dark:border-white" : "border-slate-300 dark:border-slate-700 bg-white dark:bg-black"
                        )}
                      >
                        {agreedToTerms && <Check className="size-3 text-white dark:text-black stroke-[3px]" />}
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">I agree to the </span>
                      <button
                        type="button"
                        className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white font-semibold underline inline-block cursor-pointer"
                        onClick={() => setShowTermsModal(true)}
                      >
                        Terms & Conditions
                      </button>
                      <span className="text-slate-400 dark:text-slate-500"> and </span>
                      <button
                        type="button"
                        className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white font-semibold underline inline-block cursor-pointer"
                        onClick={() => setShowTermsModal(true)}
                      >
                        Privacy Policy
                      </button>
                    </div>
                  </label>
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
                      <UserPlus className="size-4" />
                      <span>Create Account</span>
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4 pt-1">
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <button type="button" className="font-semibold text-black dark:text-white hover:underline cursor-pointer" onClick={onLogin}>
                Sign In
              </button>
            </p>
          </div>
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
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
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
              <div className="p-4 bg-ds-canvas-soft-2/50 dark:bg-ds-canvas-soft-2/20 rounded-md border border-border">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  About Developer
                </h4>
                <p className="text-xs mb-3 text-slate-500 dark:text-slate-400">
                  SpendsTracks - A personal finance tracker built with 💚 by Prathamesh Jadhav
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://linkedin.com/in/prathamesh-jadhav04"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-foreground hover:bg-[#fafafa] dark:hover:bg-[#121212] p-2 rounded border border-border transition-colors"
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
                    className="flex items-center gap-2 text-xs font-medium text-foreground hover:bg-[#fafafa] dark:hover:bg-[#121212] p-2 rounded border border-border transition-colors"
                  >
                    <svg className="size-4 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                </div>
                <a
                  href="mailto:prathamesh.jadhav.office@gmail.com"
                  className="flex items-center justify-center gap-2 text-xs font-medium text-foreground hover:bg-[#fafafa] dark:hover:bg-[#121212] mt-2 p-2 rounded border border-border transition-colors"
                >
                  <Mail className="size-4 text-slate-500" />
                  prathamesh.jadhav.office@gmail.com
                </a>
              </div>
 
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="size-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Please scroll up and read all terms and privacy policy carefully before agreeing.
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-ds-canvas-soft-2/50 dark:bg-ds-canvas-soft-2/20 rounded-md border border-border">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all duration-150",
                        agreedToTerms
                          ? "bg-black border-black dark:bg-white dark:border-white"
                          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-black"
                      )}
                    >
                      {agreedToTerms && <Check className="size-3 text-white dark:text-black stroke-[3px]" />}
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-foreground">I have read and agree to the </span>
                    <span className="font-semibold text-black dark:text-white underline">Terms of Service</span>
                    <span className="text-muted-foreground"> and </span>
                    <span className="font-semibold text-black dark:text-white underline">Privacy Policy</span>
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
                  "w-full mt-4 h-10 font-semibold text-sm rounded-md transition-colors",
                  agreedToTerms
                    ? "bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black cursor-pointer"
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
