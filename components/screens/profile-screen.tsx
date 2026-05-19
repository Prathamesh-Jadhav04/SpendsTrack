"use client";

import { useState } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  PhoneFrame,
  ScreenHeader,
  BottomNav,
  Field,
  ModalOverlay,
  ModalContent,
  SettingRow,
} from "@/components/shared";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import type { Screen, User as UserType, ModalType, Transaction } from "@/components/types";

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  monthlyBudget?: number;
  setMonthlyBudget?: (value: number) => void;
  onExport?: () => void;
  user?: UserType | null;
  transactions?: Transaction[];
  transactionHistory?: Transaction[];
  customCategories?: { type: string }[];
}

export function ProfileScreen({
  onNavigate,
  onLogout,
  monthlyBudget = 160000,
  setMonthlyBudget,
  onExport,
  user,
  transactions = [],
  transactionHistory = [],
  customCategories = [],
}: ProfileScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    phone: "",
    dob: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState({
    notifications: true,
    twoFactorAuth: true,
    language: "English (India)",
    currency: "INR",
  });
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
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
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
      showToast("Profile updated successfully!");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePasswordChange = () => {
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
    setPasswordData({ current: "", new: "", confirm: "" });
    setActiveModal(null);
    showToast("Password changed successfully!");
  };

  const handleAddPayment = () => {
    if (paymentMethod.type === "card") {
      if (!paymentMethod.number || !paymentMethod.name || !paymentMethod.expiry) {
        showToast("Please fill all card details");
        return;
      }
    } else {
      if (!paymentMethod.upi) {
        showToast("Please enter UPI ID");
        return;
      }
    }
    setPaymentMethod({ type: "card", number: "", name: "", expiry: "", upi: "" });
    setActiveModal(null);
    showToast("Payment method added!");
  };

  const handleDeleteAccount = () => {
    setActiveModal(null);
    showToast("Account deletion initiated. Please confirm via email.");
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
  const budgetOptions = [
    "₹50,000",
    "₹1,00,000",
    "₹1,60,000",
    "₹2,00,000",
    "₹3,00,000",
    "₹5,00,000",
  ];

  const totalExpense = transactionHistory
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0);
  const totalTransactions = transactionHistory.length;
  const totalCategories = new Set(transactionHistory.map((t) => t.category)).size + customCategories.length;

  const formatLargeNumber = (num: number) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num.toLocaleString("en-IN")}`;
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
    <PhoneFrame label="Profile and settings screen" className="pb-28">
      <div className="h-full flex flex-col overflow-y-auto no-scrollbar smooth-scroll momentum-scroll">
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
            className="mb-4 rounded-3xl bg-white p-5 shadow-lg dark:bg-card dark:border dark:border-white/10"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                className="relative cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="size-20 rounded-full bg-gradient-to-br from-[#7766e8] to-[#4f46e5] flex items-center justify-center">
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
            className="mb-4 flex items-center gap-4 rounded-3xl bg-gradient-to-br from-[#7766e8] via-[#6366f1] to-[#4f46e5] p-5 shadow-lg shadow-purple-500/20"
            whileHover={{ scale: 1.01 }}
          >
            <motion.div className="relative" whileHover={{ scale: 1.1 }}>
              <motion.div
                className="size-16 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center"
                animate={{
                  scale: [1, 1.03, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-2xl font-extrabold text-white">
                  {profileData.name.charAt(0).toUpperCase()}
                </span>
              </motion.div>
              <motion.div
                className="absolute -right-1 -bottom-1 rounded-full bg-green-400 p-1.5"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.div>
            </motion.div>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-extrabold text-white">
                {profileData.name}
              </h3>
              <p className="truncate text-sm font-medium text-white/80">
                {profileData.email}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⭐
                </motion.span>
                {user?.role === "admin" ? "Admin" : user?.createdAt ? "Member" : "Guest"}
              </span>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2">
            {[
              {
                label: "Total Spent",
                value: formatLargeNumber(totalExpense),
                emoji: "💰",
                color: "from-[#fee2e2] to-[#fecaca]",
              },
              {
                label: "Transactions",
                value: totalTransactions.toString(),
                emoji: "📊",
                color: "from-[#e0e7ff] to-[#c7d2fe]",
              },
              {
                label: "Categories",
                value: totalCategories.toString(),
                emoji: "🏷️",
                color: "from-[#dcfce7] to-[#bbf7d0]",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-3 dark:from-[#1a1a2e] dark:to-[#0a0a15] card-hover`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute -right-2 -top-2 text-2xl"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  {stat.emoji}
                </motion.div>
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
            <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
              <CardContent className="p-3">
                <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">
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
            <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
              <CardContent className="p-3">
                <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">
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
                    detail={`₹${monthlyBudget.toLocaleString("en-IN")} active`}
                    action={
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        ₹{monthlyBudget.toLocaleString("en-IN")}
                      </Badge>
                    }
                    onClick={() => setActiveModal("budget")}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
              <CardContent className="p-3">
                <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">
                  Payment Methods
                </p>
                <div className="divide-y divide-border/80 dark:divide-white/5">
                  <SettingRow
                    icon={<CreditCard className="size-5" />}
                    title="Saved Cards"
                    detail="2 cards added"
                    action={<Badge variant="outline" className="bg-transparent">2</Badge>}
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
            <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
              <CardContent className="p-3">
                <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">
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
            <Card className="bg-white/85 shadow-soft dark:bg-card dark:border dark:border-white/5 dark:shadow-xl dark:shadow-black/30">
              <CardContent className="p-3">
                <p className="mb-2 text-xs font-extrabold text-muted-foreground px-2">
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
                  {budgetOptions.map((budget) => {
                    const budgetValue = parseInt(budget.replace(/[^0-9]/g, ""));
                    return (
                      <motion.button
                        key={budget}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setMonthlyBudget?.(budgetValue);
                          setActiveModal(null);
                          showToast(`Budget set to ${budget}`);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl font-semibold transition-all",
                          monthlyBudget === budgetValue
                            ? "bg-primary text-white"
                            : "bg-muted/50 hover:bg-muted dark:bg-white/5"
                        )}
                      >
                        {budget}
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
                  <div className="p-4 bg-muted/50 rounded-xl dark:bg-white/5">
                    <p className="font-bold">Live Chat</p>
                    <p className="text-sm text-muted-foreground">
                      Available 9 AM - 9 PM
                    </p>
                    <Button className="w-full mt-3">Start Chat</Button>
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
          </ModalOverlay>
        )}

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

        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#fee2e2] bg-[#fef2f2] text-sm font-bold text-[#dc2626] transition-colors hover:bg-[#fee2e2] dark:border-[#7f1d1d] dark:bg-[#450a0a] dark:text-[#fca5a5] dark:hover:bg-[#7f1d1d]"
        >
          <LogOut className="size-4" />
          Logout
        </motion.button>

        <p className="mt-4 text-center text-xs font-medium text-muted-foreground">
          SpendsTracks v1.1.1 • Made with ❤️
        </p>
      </div>

      <BottomNav active="Profile" onNavigate={onNavigate} />
    </PhoneFrame>
  );
}
