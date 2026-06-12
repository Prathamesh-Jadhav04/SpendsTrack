import { useState, useEffect, useCallback } from "react";
import type { User, Screen } from "@/components/types";
import { generateId, sanitizeInput } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface UseAuthProps {
  showToast: (message: string, duration?: number, type?: "success" | "error" | "info" | "coming") => void;
  setCurrentScreen: (screen: Screen) => void;
}

export function useAuth({
  showToast,
  setCurrentScreen,
}: UseAuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const sbUser = session.user;
          // Fetch profile details if they exist
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", sbUser.id)
            .single();

          setUser({
            id: sbUser.id,
            name: profile?.name || sbUser.user_metadata?.name || sbUser.email?.split("@")[0] || "User",
            email: sbUser.email || "",
            role: (profile?.role as "user" | "admin") || "user",
            createdAt: sbUser.created_at,
          });
          setIsLoggedIn(true);
          setCurrentScreen("dashboard");
        } else {
          // Check for guest mode
          const saved = localStorage.getItem("spendstracks_data");
          if (saved) {
            try {
              const data = JSON.parse(saved);
              if (data.user && data.user.email === "guest@spendstracks.com") {
                setUser(data.user);
                setIsLoggedIn(true);
                setCurrentScreen("dashboard");
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        setIsLoadingSession(false);
      }
    };

    checkSession();

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const sbUser = session.user;
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", sbUser.id)
          .single();

        setUser({
          id: sbUser.id,
          name: profile?.name || sbUser.user_metadata?.name || sbUser.email?.split("@")[0] || "User",
          email: sbUser.email || "",
          role: (profile?.role as "user" | "admin") || "user",
          createdAt: sbUser.created_at,
        });
        setIsLoggedIn(true);
      } else {
        // Only clear if not guest
        setUser(prev => {
          if (prev?.email === "guest@spendstracks.com") return prev;
          return null;
        });
        setIsLoggedIn(prev => {
          const saved = localStorage.getItem("spendstracks_data");
          if (saved) {
            try {
              const data = JSON.parse(saved);
              if (data.user && data.user.email === "guest@spendstracks.com") return true;
            } catch {}
          }
          return false;
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setCurrentScreen]);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const cleanEmail = sanitizeInput(email.toLowerCase().trim());

      // Admin testing mode local bypass
      if (cleanEmail === "admin@spendstracks.com" && password === "admin123") {
        const adminUser: User = {
          id: "admin-id",
          name: "Admin Tester",
          email: cleanEmail,
          role: "admin",
          createdAt: new Date().toISOString(),
        };
        setUser(adminUser);
        setIsLoggedIn(true);
        setCurrentScreen("dashboard");
        showToast("Welcome Admin! Testing mode enabled");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        showToast(error.message, 3000, "error");
        return;
      }

      showToast("Signed in successfully!");
      setCurrentScreen("dashboard");
    },
    [showToast, setCurrentScreen]
  );

  const handleGuestLogin = useCallback(() => {
    const guestUser: User = {
      id: generateId(),
      name: "Guest",
      email: "guest@spendstracks.com",
      role: "user",
      createdAt: new Date().toISOString(),
    };
    setUser(guestUser);
    setIsLoggedIn(true);
    setCurrentScreen("dashboard");
    showToast("Welcome! Your data will be saved locally");
  }, [showToast, setCurrentScreen]);

  const handleSignUp = useCallback(
    async (email: string, name: string, password: string) => {
      const cleanEmail = sanitizeInput(email.toLowerCase().trim());
      const cleanName = sanitizeInput(name.trim());

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: cleanName,
          },
        },
      });

      if (error) {
        showToast(error.message, 3000, "error");
        return;
      }

      if (data.session) {
        showToast(`Welcome, ${cleanName}! Your account is created.`);
        setCurrentScreen("dashboard");
      } else {
        showToast("Verification link sent! Check your email to confirm.", 5000, "info");
        setCurrentScreen("login");
      }
    },
    [showToast, setCurrentScreen]
  );

  const handleLogout = useCallback(async () => {
    // If guest, clear local storage
    const saved = localStorage.getItem("spendstracks_data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.user?.email === "guest@spendstracks.com") {
          localStorage.removeItem("spendstracks_data");
        }
      } catch {}
    }

    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
    setCurrentScreen("login");
    showToast("Signed out successfully");
  }, [setCurrentScreen, showToast]);

  const handleUpdateProfile = useCallback(
    async (data: { name: string }) => {
      if (isLoggedIn && user && user.email !== "guest@spendstracks.com" && user.id !== "admin-id") {
        const { error } = await supabase
          .from("profiles")
          .update({ name: data.name })
          .eq("id", user.id);

        if (error) {
          showToast("Failed to update profile: " + error.message, 3000, "error");
          return;
        }
      }

      setUser((prev) => (prev ? { ...prev, name: data.name } : null));
      showToast("Profile name updated successfully!");
    },
    [isLoggedIn, user, showToast]
  );

  return {
    user,
    isLoggedIn,
    isLoadingSession,
    setUser,
    handleLogin,
    handleGuestLogin,
    handleSignUp,
    handleLogout,
    handleUpdateProfile,
  };
}

