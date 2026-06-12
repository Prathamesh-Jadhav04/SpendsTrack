"use client";

import { useState, useEffect, useRef } from "react";
import {
  Settings2,
  KeyRound,
  ShieldCheck,
  Moon,
  Bell,
  Languages,
  Globe,
  CircleDollarSign,
  CreditCard,
  WalletCards,
  Plus,
  ChevronRight,
  Headphones,
  HelpCircle,
  FileText,
  Shield,
  Trash2,
  LogOut,
  User,
  Camera,
  TrendingDown,
  ReceiptText,
  Tags,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { expenseCategories, incomeCategories, APP_VERSION } from "@/components/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  PhoneFrame,
  ScreenHeader,
  Field,
  ModalOverlay,
  ModalContent,
  SettingRow,
} from "@/components/shared";
import { cn, generateId } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { sound } from "@/lib/sound";
import type { Screen, User as UserType, ModalType, Transaction } from "@/components/types";
import { useCurrency, useTranslation } from "@/components/hooks";
import { supabase } from "@/lib/supabase";

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  monthlyBudget?: number;
  setMonthlyBudget?: (value: number) => void;
  onExport?: () => void;
  showToast?: (message: string, duration?: number, type?: "success" | "error" | "info" | "coming") => void;
  user?: UserType | null;
  transactions?: Transaction[];
  transactionHistory?: Transaction[];
  customCategories?: { type: string }[];
  onUpdateProfile?: (data: { name: string; phone?: string; dob?: string }) => void;
}

export function ProfileScreen({
  onNavigate,
  onLogout,
  monthlyBudget = 160000,
  setMonthlyBudget,
  onExport,
  showToast: globalShowToast,
  user,
  transactions = [],
  transactionHistory = [],
  customCategories = [],
  onUpdateProfile,
}: ProfileScreenProps) {
  const { symbol, formatRaw } = useCurrency();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    sound.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (globalShowToast) {
      globalShowToast(nextMuted ? "Sound muted" : "Sound unmuted", 2000, "info");
    }
  };
  const [profileData, setProfileData] = useState({
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    phone: user?.phone || "",
    dob: user?.dob || "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "User",
        email: user.email || "user@example.com",
        phone: user.phone || "",
        dob: user.dob || "",
      });
    }
  }, [user]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState({
    notifications: true,
    twoFactorAuth: true,
    language: "English (India)",
    currency: "INR",
  });

  // Load settings on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("spendstracks_settings");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSettings((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Failed to parse settings:", e);
        }
      }
    }
  }, []);

  // Save settings when they change
  const isSettingsMounted = useRef(false);
  useEffect(() => {
    if (isSettingsMounted.current) {
      if (typeof window !== "undefined") {
        localStorage.setItem("spendstracks_settings", JSON.stringify(settings));
        window.dispatchEvent(new Event("spendstracks_settings_changed"));
      }
    } else {
      isSettingsMounted.current = true;
    }
  }, [settings]);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [paymentMethod, setPaymentMethod] = useState({
    type: "card",
    number: "",
    name: "",
    expiry: "",
    upi: "",
  });
  const [savedCards, setSavedCards] = useState([
    { id: "1", type: "debit", brand: "VISA", number: "•••• •••• •••• 4291", expiry: "12/28" },
    { id: "2", type: "credit", brand: "MASTERCARD", number: "•••• •••• •••• 8812", expiry: "06/29" },
  ]);
  const [upiHandles, setUpiHandles] = useState([
    { id: "1", address: "avery@oksbi", status: "Active", isPrimary: true },
    { id: "2", address: `${(user?.name || "user").toLowerCase().replace(/\s+/g, "")}@okicici`, status: "Linked", isPrimary: false },
  ]);

  const showToast = (message: string) => {
    if (globalShowToast) {
      globalShowToast(message);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!profileData.name.trim()) errors.name = "Name is required";
    if (!profileData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email))
      errors.email = "Invalid email format";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = () => {
    if (validateForm()) {
      setIsEditing(false);
      if (onUpdateProfile) {
        onUpdateProfile({
          name: profileData.name,
          phone: profileData.phone,
          dob: profileData.dob,
        });
      } else {
        showToast("Profile updated successfully!");
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      showToast("Please fill all fields");
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      showToast("New passwords don't match");
      return;
    }
    if (passwordData.new.length < 6) {
      showToast("Password must be at least 6 characters");
      return;
    }

    if (user?.email === "guest@spendstracks.com" || user?.id === "admin-id") {
      setPasswordData({ current: "", new: "", confirm: "" });
      setActiveModal(null);
      if (globalShowToast) {
        globalShowToast("Password updated locally (simulated for guest/demo)", 3000, "success");
      } else {
        showToast("Password updated locally (simulated for guest/demo)");
      }
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: passwordData.new });
      if (error) {
        if (globalShowToast) {
          globalShowToast("Failed to update password: " + error.message, 3000, "error");
        } else {
          showToast("Failed to update password: " + error.message);
        }
        return;
      }
      setPasswordData({ current: "", new: "", confirm: "" });
      setActiveModal(null);
      if (globalShowToast) {
        globalShowToast("Password changed successfully!", 3000, "success");
      } else {
        showToast("Password changed successfully!");
      }
    } catch (err: any) {
      if (globalShowToast) {
        globalShowToast(err.message || "An unexpected error occurred", 3000, "error");
      } else {
        showToast("An unexpected error occurred");
      }
    }
  };

  const handleAddPayment = () => {
    if (paymentMethod.type === "card") {
      if (!paymentMethod.number || !paymentMethod.name || !paymentMethod.expiry) {
        showToast("Please fill all card details");
        return;
      }
      const cleanNumber = paymentMethod.number.replace(/\s+/g, "");
      if (cleanNumber.length < 12) {
        showToast("Please enter a valid card number");
        return;
      }
      const last4 = cleanNumber.slice(-4);
      const brand = cleanNumber.startsWith("4") ? "VISA" : "MASTERCARD";
      
      const newCard = {
        id: generateId(),
        type: "credit",
        brand,
        number: `•••• •••• •••• ${last4}`,
        expiry: paymentMethod.expiry,
      };
      
      setSavedCards([...savedCards, newCard]);
      showToast("Card added successfully!");
      setPaymentMethod({ type: "card", number: "", name: "", expiry: "", upi: "" });
      setActiveModal("savedCards");
    } else {
      if (!paymentMethod.upi) {
        showToast("Please enter UPI ID");
        return;
      }
      if (!paymentMethod.upi.includes("@")) {
        showToast("Please enter a valid UPI ID (e.g. name@upi)");
        return;
      }
      
      const newUpi = {
        id: generateId(),
        address: paymentMethod.upi.trim(),
        status: "Linked",
        isPrimary: false,
      };
      
      setUpiHandles([...upiHandles, newUpi]);
      showToast("UPI Handle added successfully!");
      setPaymentMethod({ type: "card", number: "", name: "", expiry: "", upi: "" });
      setActiveModal("upiDetails");
    }
  };

  const handleDeleteCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedCards(savedCards.filter((c) => c.id !== id));
    showToast("Card deleted");
  };

  const handleDeleteUpi = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUpiHandles(upiHandles.filter((u) => u.id !== id));
    showToast("UPI ID deleted");
  };

  const handleSetPrimaryUpi = (id: string) => {
    setUpiHandles(
      upiHandles.map((u) => ({
        ...u,
        isPrimary: u.id === id,
        status: u.id === id ? "Active" : "Linked",
      }))
    );
    showToast("Primary UPI ID updated");
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem("spendstracks_data");
    localStorage.removeItem("spendstracks_users");
    setActiveModal(null);
    showToast("Account and all data deleted permanently");
    setTimeout(() => onLogout(), 1000);
  };

  const languages = [
    "English (India)",
    "Hindi",
    "Tamil",
    "Telugu",
    "Marathi",
    "Bengali",
    "Kannada",
    "Malayalam",
  ];
  const currencies = [
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  ];
  const budgetOptions = [50000, 100000, 160000, 200000, 300000, 500000];

  const totalExpense = transactionHistory
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalTransactions = transactionHistory.length;
  const totalCategories = new Set(transactionHistory.map((t) => t.category)).size + customCategories.length;

  const formatLargeNumber = (num: number) => {
    if (num >= 100000 && symbol === "₹") return `${symbol}${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${symbol}${(num / 1000).toFixed(1)}K`;
    return `${symbol}${formatRaw(num)}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <PhoneFrame label="Profile and settings screen" className="pb-28 lg:pb-0">
      <div className="flex flex-col overflow-y-visible no-scrollbar smooth-scroll momentum-scroll lg:h-auto lg:overflow-visible">
        <ScreenHeader
          eyebrow="Account"
          title="Profile"
          action={
            <Button
              size="sm"
              variant={isEditing ? "default" : "outline"}
              onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
              className="rounded-full"
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          }
        />

        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-3xl bg-white p-5 shadow-lg dark:bg-card dark:border dark:border-white/10"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                className="relative cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="size-20 rounded-full bg-gradient-to-br from-savings to-savings-soft flex items-center justify-center">
                  <span className="text-4xl text-white font-bold">
                    {profileData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <motion.div
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full"
                  whileHover={{ scale: 1.1 }}
                >
                  <Camera className="size-3" />
                </motion.div>
              </motion.div>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">
                  Full Name
                </Label>
                <Input
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={cn("mt-1 font-semibold input-glow", formErrors.name && "border-red-500")}
                  placeholder="Your name"
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">
                  Email Address
                </Label>
                <Input
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  type="email"
                  className={cn("mt-1 font-semibold input-glow", formErrors.email && "border-red-500")}
                  placeholder="your@email.com"
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">
                  Phone Number
                </Label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-1 font-semibold input-glow"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">
                  Date of Birth
                </Label>
                <Input
                  value={profileData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  className="mt-1 font-semibold input-glow"
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-savings to-indigo-600 p-5 shadow-xl shadow-savings/20 border border-savings/25"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div className="relative" whileHover={{ scale: 1.05 }}>
              <motion.div
                className="size-16 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md flex items-center justify-center border border-white/20"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-2xl font-extrabold text-white">
                  {profileData.name.charAt(0).toUpperCase()}
                </span>
              </motion.div>
              <motion.div
                className="absolute -right-1 -bottom-1 rounded-full bg-green-400 p-1.5 border border-white/20"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ✨
              </motion.div>
            </motion.div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-extrabold text-white leading-tight">
                {profileData.name}
              </h3>
              <p className="truncate text-xs font-semibold text-white/75 mt-0.5">
                {profileData.email}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5 text-[9px] font-extrabold text-white tracking-wide uppercase">
                <motion.span
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  ⭐
                </motion.span>
                {user?.role === "admin" ? "Admin" : user?.createdAt ? "Member" : "Guest"}
              </span>
            </div>
            <div className="shrink-0 z-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="size-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-md transition-all duration-200"
                aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
              >
                {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
              </motion.button>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 lg:gap-4">
            {[
              {
                label: "Total Spent",
                value: formatLargeNumber(totalExpense),
                icon: TrendingDown,
                iconColor: "text-expense",
                color: "from-ds-canvas to-expense-soft/10 dark:from-ds-canvas-soft-2 dark:to-expense-soft/5",
                hoverClass: "hover:border-expense/40 hover:shadow-[0_0_20px_rgba(238,0,0,0.12)]",
              },
              {
                label: "Transactions",
                value: totalTransactions.toString(),
                icon: ReceiptText,
                iconColor: "text-savings",
                color: "from-ds-canvas to-savings-soft/10 dark:from-ds-canvas-soft-2 dark:to-savings-soft/5",
                hoverClass: "hover:border-savings/40 hover:shadow-[0_0_20px_rgba(121,40,202,0.12)]",
              },
              {
                label: "Categories",
                value: totalCategories.toString(),
                icon: Tags,
                iconColor: "text-income",
                color: "from-ds-canvas to-income-soft/10 dark:from-ds-canvas-soft-2 dark:to-income-soft/5",
                hoverClass: "hover:border-income/40 hover:shadow-[0_0_20px_rgba(0,112,243,0.12)]",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className={cn(
                  "relative overflow-hidden rounded-2xl bg-gradient-to-br border border-border/50 dark:border-white/5 p-3 card-hover transition-all duration-300",
                  stat.color,
                  stat.hoverClass
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute right-2 top-2 opacity-30">
                  <stat.icon className={cn("size-5", stat.iconColor)} />
                </div>
                <p className="text-[10px] font-semibold text-muted-foreground dark:text-white/60">
                  {stat.label}
                </p>
                <motion.p
                  className="text-lg font-extrabold dark:text-white"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  {stat.value}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 dark:bg-[#111111]/90 border border-border/50 dark:border-white/5 shadow-soft dark:shadow-xl dark:shadow-black/35 backdrop-blur-md rounded-2xl hover:shadow-[0_0_30px_rgba(0,112,243,0.02)] transition-all duration-300">
              <CardContent className="p-3">
                <p className="mb-2 text-[10px] font-extrabold text-muted-foreground/80 dark:text-muted-foreground/60 uppercase tracking-wider px-2">
                  Account
                </p>
                <div className="divide-y divide-border/80 dark:divide-white/5">
                  <SettingRow
                    icon={<Settings2 className="size-5" />}
                    title="Personal Info"
                    detail="Name, email, phone"
                    action={<ChevronRight className="size-4 text-muted-foreground" />}
                    onClick={() => setActiveModal("personalInfo")}
                  />
                  <SettingRow
                    icon={<KeyRound className="size-5" />}
                    title="Change Password"
                    detail="Update your password"
                    action={<ChevronRight className="size-4 text-muted-foreground" />}
                    onClick={() => setActiveModal("password")}
                  />
                  <SettingRow
                    icon={<ShieldCheck className="size-5" />}
                    title="Two-Factor Auth"
                    detail="Extra security layer"
                    action={
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) => {
                          setSettings((s) => ({ ...s, twoFactorAuth: checked }));
                          showToast(checked ? "2FA enabled" : "2FA disabled");
                        }}
                        aria-label="2FA"
                      />
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 dark:bg-[#111111]/90 border border-border/50 dark:border-white/5 shadow-soft dark:shadow-xl dark:shadow-black/35 backdrop-blur-md rounded-2xl hover:shadow-[0_0_30px_rgba(0,112,243,0.02)] transition-all duration-300">
              <CardContent className="p-3">
                <p className="mb-2 text-[10px] font-extrabold text-muted-foreground/80 dark:text-muted-foreground/60 uppercase tracking-wider px-2">
                  Preferences
                </p>
                <div className="divide-y divide-border/80 dark:divide-white/5">
                  <SettingRow
                    icon={<Moon className="size-5" />}
                    title="Dark Mode"
                    detail={isDark ? "On" : "Off"}
                    action={
                      <Switch checked={isDark} onCheckedChange={toggleTheme} aria-label="Dark mode" />
                    }
                  />
                  <SettingRow
                    icon={<Bell className="size-5" />}
                    title="Notifications"
                    detail="Push & email alerts"
                    action={
                      <Switch
                        checked={settings.notifications}
                        onCheckedChange={(checked) => {
                          setSettings((s) => ({ ...s, notifications: checked }));
                          showToast(
                            checked ? "Notifications enabled" : "Notifications disabled"
                          );
                        }}
                        aria-label="Notifications"
                      />
                    }
                  />
                  <SettingRow
                    icon={<Languages className="size-5" />}
                    title="Language"
                    detail={settings.language}
                    action={<ChevronRight className="size-4 text-muted-foreground" />}
                    onClick={() => setActiveModal("language")}
                  />
                  <SettingRow
                    icon={<Globe className="size-5" />}
                    title="Currency"
                    detail={`${settings.currency} - ${currencies.find((c) => c.code === settings.currency)?.name || "Indian Rupee"}`}
                    action={<ChevronRight className="size-4 text-muted-foreground" />}
                    onClick={() => setActiveModal("currency")}
                  />
                  <SettingRow
                    icon={<CircleDollarSign className="size-5" />}
                    title="Monthly Budget"
                    detail={`${symbol}${formatRaw(monthlyBudget)} active`}
                    action={
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {symbol}{formatRaw(monthlyBudget)}
                      </Badge>
                    }
                    onClick={() => setActiveModal("budget")}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 dark:bg-[#111111]/90 border border-border/50 dark:border-white/5 shadow-soft dark:shadow-xl dark:shadow-black/35 backdrop-blur-md rounded-2xl hover:shadow-[0_0_30px_rgba(0,112,243,0.02)] transition-all duration-300">
              <CardContent className="p-3">
                <p className="mb-2 text-[10px] font-extrabold text-muted-foreground/80 dark:text-muted-foreground/60 uppercase tracking-wider px-2">
                  Payment Methods
                </p>
                <div className="divide-y divide-border/80 dark:divide-white/5">
                  <SettingRow
                    icon={<CreditCard className="size-5" />}
                    title="Saved Cards"
                    detail="2 cards added"
                    action={<Badge variant="outline" className="bg-transparent">2</Badge>}
                    onClick={() => setActiveModal("savedCards")}
                  />
                  <SettingRow
                    icon={<WalletCards className="size-5" />}
                    title="UPI"
                    detail="avery@oksbi"
                    action={
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Active
                      </Badge>
                    }
                    onClick={() => setActiveModal("upiDetails")}
                  />
                  <SettingRow
                    icon={<Plus className="size-5" />}
                    title="Add Payment Method"
                    detail="Add new card or UPI"
                    action={<ChevronRight className="size-4 text-muted-foreground" />}
                    onClick={() => setActiveModal("payment")}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 dark:bg-[#111111]/90 border border-border/50 dark:border-white/5 shadow-soft dark:shadow-xl dark:shadow-black/35 backdrop-blur-md rounded-2xl hover:shadow-[0_0_30px_rgba(0,112,243,0.02)] transition-all duration-300">
              <CardContent className="p-3">
                <p className="mb-2 text-[10px] font-extrabold text-muted-foreground/80 dark:text-muted-foreground/60 uppercase tracking-wider px-2">
                  Support & Privacy
                </p>
                <div className="divide-y divide-border/80 dark:divide-white/5">
                  <SettingRow
                    icon={<Headphones className="size-5" />}
                    title="Help Center"
                    detail="FAQs and support"
                    action={<ChevronRight className="size-4 text-muted-foreground" />}
                    onClick={() => setActiveModal("help")}
                  />
                  <SettingRow
                    icon={<HelpCircle className="size-5" />}
                    title="Contact Us"
                    detail="Email & chat support"
                    action={<ChevronRight className="size-4 text-muted-foreground" />}
                    onClick={() => setActiveModal("contact")}
                  />
                  <SettingRow
                    icon={<FileText className="size-5" />}
                    title="Terms of Service"
                    detail="Legal agreement"
                    action={<ChevronRight className="size-4 text-muted-foreground" />}
                    onClick={() => setActiveModal("terms")}
                  />
                  <SettingRow
                    icon={<Shield className="size-5" />}
                    title="Privacy Policy"
                    detail="How we handle data"
                    action={<ChevronRight className="size-4 text-muted-foreground" />}
                    onClick={() => setActiveModal("privacy")}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 dark:bg-[#111111]/90 border border-border/50 dark:border-white/5 shadow-soft dark:shadow-xl dark:shadow-black/35 backdrop-blur-md rounded-2xl hover:shadow-[0_0_30px_rgba(238,0,0,0.05)] hover:border-red-500/25 transition-all duration-300">
              <CardContent className="p-3">
                <p className="mb-2 text-[10px] font-extrabold text-red-500/80 dark:text-red-400/60 uppercase tracking-wider px-2">
                  Danger Zone
                </p>
                <div className="divide-y divide-border/80 dark:divide-white/5">
                  <SettingRow
                    icon={<Trash2 className="size-5 text-red-500" />}
                    title="Delete Account"
                    detail="Permanently remove account"
                    action={<ChevronRight className="size-4 text-red-500" />}
                    onClick={() => setActiveModal("delete")}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {activeModal && (
          <ModalOverlay onClose={() => setActiveModal(null)}>
            {activeModal === "personalInfo" && (
              <ModalContent title="Personal Information" onClose={() => setActiveModal(null)}>
                <div className="space-y-3">
                  <Field label="Full Name">
                    <Input
                      value={profileData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your name"
                      className="input-glow"
                    />
                  </Field>
                  <Field label="Email Address">
                    <Input
                      value={profileData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      type="email"
                      placeholder="your@email.com"
                      className="input-glow"
                    />
                  </Field>
                  <Field label="Phone Number">
                    <Input
                      value={profileData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="input-glow"
                    />
                  </Field>
                  <Field label="Date of Birth">
                    <Input
                      value={profileData.dob}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="input-glow"
                    />
                  </Field>
                  <Button onClick={handleSaveProfile} className="w-full mt-2">
                    Save Changes
                  </Button>
                </div>
              </ModalContent>
            )}
            {activeModal === "password" && (
              <ModalContent title="Change Password" onClose={() => setActiveModal(null)}>
                <div className="space-y-3">
                  <Field label="Current Password">
                    <Input
                      type="password"
                      value={passwordData.current}
                      onChange={(e) =>
                        setPasswordData((p) => ({ ...p, current: e.target.value }))
                      }
                      placeholder="Enter current password"
                      className="input-glow"
                    />
                  </Field>
                  <Field label="New Password">
                    <Input
                      type="password"
                      value={passwordData.new}
                      onChange={(e) =>
                        setPasswordData((p) => ({ ...p, new: e.target.value }))
                      }
                      placeholder="Enter new password"
                      className="input-glow"
                    />
                  </Field>
                  <Field label="Confirm New Password">
                    <Input
                      type="password"
                      value={passwordData.confirm}
                      onChange={(e) =>
                        setPasswordData((p) => ({ ...p, confirm: e.target.value }))
                      }
                      placeholder="Confirm new password"
                      className="input-glow"
                    />
                  </Field>
                  <Button onClick={handlePasswordChange} className="w-full mt-2">
                    Update Password
                  </Button>
                </div>
              </ModalContent>
            )}
            {activeModal === "language" && (
              <ModalContent title="Select Language" onClose={() => setActiveModal(null)}>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <motion.button
                      key={lang}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSettings((s) => ({ ...s, language: lang }));
                        setActiveModal(null);
                        showToast(`Language changed to ${lang}`);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl font-semibold transition-all",
                        settings.language === lang
                          ? "bg-primary text-white"
                          : "bg-muted/50 hover:bg-muted dark:bg-white/5"
                      )}
                    >
                      {lang}
                    </motion.button>
                  ))}
                </div>
              </ModalContent>
            )}
            {activeModal === "currency" && (
              <ModalContent title="Select Currency" onClose={() => setActiveModal(null)}>
                <div className="space-y-2">
                  {currencies.map((curr) => (
                    <motion.button
                      key={curr.code}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSettings((s) => ({ ...s, currency: curr.code }));
                        setActiveModal(null);
                        showToast(`Currency changed to ${curr.name}`);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between",
                        settings.currency === curr.code
                          ? "bg-primary text-white"
                          : "bg-muted/50 hover:bg-muted dark:bg-white/5"
                      )}
                    >
                      <span>{curr.name}</span>
                      <span className="font-bold">{curr.symbol}</span>
                    </motion.button>
                  ))}
                </div>
              </ModalContent>
            )}
            {activeModal === "budget" && (
              <ModalContent title="Monthly Budget" onClose={() => setActiveModal(null)}>
                <div className="space-y-2">
                  {budgetOptions.map((budgetValue) => {
                    const displayBudget = `${symbol}${formatRaw(budgetValue)}`;
                    return (
                      <motion.button
                        key={budgetValue}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setMonthlyBudget?.(budgetValue);
                          setActiveModal(null);
                          showToast(`Budget set to ${displayBudget}`);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl font-semibold transition-all",
                          monthlyBudget === budgetValue
                            ? "bg-primary text-white"
                            : "bg-muted/50 hover:bg-muted dark:bg-white/5"
                        )}
                      >
                        {displayBudget}
                      </motion.button>
                    );
                  })}
                </div>
              </ModalContent>
            )}
            {activeModal === "payment" && (
              <ModalContent title="Add Payment Method" onClose={() => setActiveModal(null)}>
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={paymentMethod.type === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod((p) => ({ ...p, type: "card" }))}
                    className="flex-1"
                  >
                    <CreditCard className="size-4 mr-2" />
                    Card
                  </Button>
                  <Button
                    variant={paymentMethod.type === "upi" ? "default" : "outline"}
                    onClick={() => setPaymentMethod((p) => ({ ...p, type: "upi" }))}
                    className="flex-1"
                  >
                    <WalletCards className="size-4 mr-2" />
                    UPI
                  </Button>
                </div>
                {paymentMethod.type === "card" ? (
                  <div className="space-y-3">
                    <Field label="Card Number">
                      <Input
                        value={paymentMethod.number}
                        onChange={(e) =>
                          setPaymentMethod((p) => ({ ...p, number: e.target.value }))
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="input-glow"
                      />
                    </Field>
                    <Field label="Cardholder Name">
                      <Input
                        value={paymentMethod.name}
                        onChange={(e) =>
                          setPaymentMethod((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Name on card"
                        className="input-glow"
                      />
                    </Field>
                    <Field label="Expiry Date">
                      <Input
                        value={paymentMethod.expiry}
                        onChange={(e) =>
                          setPaymentMethod((p) => ({ ...p, expiry: e.target.value }))
                        }
                        placeholder="MM/YY"
                        maxLength={5}
                        className="input-glow"
                      />
                    </Field>
                  </div>
                ) : (
                  <Field label="UPI ID">
                    <Input
                      value={paymentMethod.upi}
                      onChange={(e) =>
                        setPaymentMethod((p) => ({ ...p, upi: e.target.value }))
                      }
                      placeholder="yourname@upi"
                      className="input-glow"
                    />
                  </Field>
                )}
                <Button onClick={handleAddPayment} className="w-full mt-4">
                  Add Payment Method
                </Button>
              </ModalContent>
            )}
            {activeModal === "help" && (
              <ModalContent title="Help Center" onClose={() => setActiveModal(null)}>
                <div className="space-y-3">
                  {[
                    {
                      q: "How do I add an expense?",
                      a: "Go to Add section and fill in the details.",
                    },
                    {
                      q: "Can I export my data?",
                      a: "Yes, go to Settings > Export Data.",
                    },
                    {
                      q: "Is my data secure?",
                      a: "Yes, we use encryption to protect your data.",
                    },
                    {
                      q: "How do I set a budget?",
                      a: "Go to Profile > Monthly Budget to set your limit.",
                    },
                  ].map((faq, i) => (
                    <div key={i} className="p-3 bg-muted/50 rounded-xl dark:bg-white/5">
                      <p className="font-bold text-sm">{faq.q}</p>
                      <p className="text-xs text-muted-foreground mt-1">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </ModalContent>
            )}
            {activeModal === "contact" && (
              <ModalContent title="Contact Us" onClose={() => setActiveModal(null)}>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-xl dark:bg-primary/20">
                    <p className="font-bold text-primary">Email Support</p>
                    <p className="text-sm text-muted-foreground">
                      support@spendstracks.com
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Response within 24 hours
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl dark:bg-white/5 border border-dashed border-border dark:border-[#333333] relative overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-sm">Live Chat</p>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20">
                        Maintenance
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      Our live chat service is temporarily down for scheduled maintenance. Please connect with us via email or try again later.
                    </p>
                    <Button disabled className="w-full mt-3 h-9 text-xs font-semibold bg-muted dark:bg-[#222222] text-muted-foreground border border-border dark:border-[#333333] cursor-not-allowed">
                      Offline for Maintenance
                    </Button>
                  </div>
                </div>
              </ModalContent>
            )}
            {activeModal === "terms" && (
              <ModalContent title="Terms of Service" onClose={() => setActiveModal(null)}>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>By using SpendsTracks, you agree to these terms.</p>
                  <p>1. You must be 18+ to use this app.</p>
                  <p>2. You're responsible for maintaining account security.</p>
                  <p>3. We reserve the right to modify these terms.</p>
                  <p>4. Your data is subject to our Privacy Policy.</p>
                </div>
              </ModalContent>
            )}
            {activeModal === "privacy" && (
              <ModalContent title="Privacy Policy" onClose={() => setActiveModal(null)}>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>We value your privacy. Here's how we handle your data:</p>
                  <p>• We collect only necessary information.</p>
                  <p>• Your financial data is encrypted.</p>
                  <p>• We never sell your data to third parties.</p>
                  <p>• You can delete your account anytime.</p>
                  <p>• Data is stored on secure servers.</p>
                </div>
              </ModalContent>
            )}
            {activeModal === "delete" && (
              <ModalContent title="Delete Account" onClose={() => setActiveModal(null)}>
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 dark:bg-red-900/30">
                    <Trash2 className="size-8 text-red-500" />
                  </div>
                  <p className="font-bold text-lg">Are you sure?</p>
                  <p className="text-sm text-muted-foreground mt-2 mb-4">
                    This action cannot be undone. All your data will be permanently
                    deleted.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setActiveModal(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="flex-1 bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </ModalContent>
            )}
            {activeModal === "savedCards" && (
              <ModalContent title="Saved Cards" onClose={() => setActiveModal(null)}>
                <div className="space-y-4">
                  {savedCards.length > 0 ? (
                    savedCards.map((card) => (
                      <div
                        key={card.id}
                        className={cn(
                          "rounded-xl p-4 text-white shadow-level-3 relative overflow-hidden group border border-white/10",
                          card.brand === "VISA"
                            ? "bg-gradient-to-r from-slate-950 to-slate-900"
                            : "bg-gradient-to-r from-indigo-950 to-indigo-900"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/60">
                              {card.type === "debit" ? "Debit Card" : "Credit Card"}
                            </p>
                            <p className="text-xs font-bold text-white/50 mt-0.5">{card.brand}</p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteCard(card.id, e)}
                            className="p-1 rounded-md text-white/60 hover:text-red-400 hover:bg-white/10 transition-all z-10 cursor-pointer"
                            aria-label={`Delete ${card.brand} card ending in ${card.number.slice(-4)}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <p className="mt-4 text-lg font-bold tracking-widest font-mono">{card.number}</p>
                        <div className="mt-4 flex justify-between items-end">
                          <div>
                            <p className="text-[8px] uppercase text-white/50">Card Holder</p>
                            <p className="text-xs font-bold">{profileData.name}</p>
                          </div>
                          <div>
                            <p className="text-[8px] uppercase text-white/50">Expires</p>
                            <p className="text-xs font-bold">{card.expiry}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-sm text-slate-500">No saved cards.</div>
                  )}
                  <Button
                    onClick={() => setActiveModal("payment")}
                    className="w-full mt-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
                  >
                    + Add New Card
                  </Button>
                </div>
              </ModalContent>
            )}
            {activeModal === "upiDetails" && (
              <ModalContent title="UPI Handles" onClose={() => setActiveModal(null)}>
                <div className="space-y-3">
                  {upiHandles.length > 0 ? (
                    upiHandles.map((upi) => (
                      <div
                        key={upi.id}
                        onClick={() => handleSetPrimaryUpi(upi.id)}
                        className={cn(
                          "p-4 rounded-xl flex items-center justify-between border transition-all cursor-pointer",
                          upi.isPrimary
                            ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-level-2"
                            : "bg-[#fafafa] dark:bg-[#121212] border-border dark:border-[#333333] hover:border-slate-400 dark:hover:border-slate-600 text-foreground"
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm">
                            {upi.isPrimary ? "Primary UPI ID" : "Secondary UPI ID"}
                          </p>
                          <p
                            className={cn(
                              "text-xs mt-0.5 font-mono truncate",
                              upi.isPrimary ? "text-white/80 dark:text-black/80" : "text-slate-500 dark:text-slate-400"
                            )}
                          >
                            {upi.address}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={cn(
                              "text-[9px] font-bold px-2 py-0.5 rounded-full",
                              upi.isPrimary
                                ? "bg-white/20 text-white dark:bg-black/10 dark:text-black"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            )}
                          >
                            {upi.status}
                          </span>
                          <button
                            onClick={(e) => handleDeleteUpi(upi.id, e)}
                            className={cn(
                              "p-1 rounded transition-colors cursor-pointer",
                              upi.isPrimary
                                ? "text-white/60 hover:text-red-300 hover:bg-white/10 dark:text-black/60 dark:hover:text-red-600 dark:hover:bg-black/5"
                                : "text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-white/5"
                            )}
                            aria-label={`Delete UPI ID ${upi.address}`}
                          >
                            <Trash2 className="size-4.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-sm text-slate-500">No UPI handles configured.</div>
                  )}
                  <Button
                    onClick={() => setActiveModal("payment")}
                    className="w-full mt-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
                  >
                    + Add New UPI Handle
                  </Button>
                </div>
              </ModalContent>
            )}
          </ModalOverlay>
        )}

        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-expense-soft bg-expense-soft/30 text-sm font-bold text-expense transition-colors hover:bg-expense-soft/50 dark:border-red-950/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          <LogOut className="size-4" />
          Logout
        </motion.button>

        <p className="mb-4 text-center text-xs font-medium text-muted-foreground">
          SpendsTracks v{APP_VERSION}
        </p>
      </div>
    </PhoneFrame>
  );
}
