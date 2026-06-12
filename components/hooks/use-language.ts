"use client";

import { useState, useEffect } from "react";
import { translations } from "@/lib/translations";

export function useLanguage() {
  const [language, setLanguage] = useState("English (India)");

  useEffect(() => {
    const getSavedLanguage = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("spendstracks_settings");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            return parsed.language || "English (India)";
          } catch (e) {
            console.error("Failed to parse settings:", e);
          }
        }
      }
      return "English (India)";
    };

    setLanguage(getSavedLanguage());

    const handleSettingsChange = () => {
      setLanguage(getSavedLanguage());
    };

    window.addEventListener("spendstracks_settings_changed", handleSettingsChange);
    return () => {
      window.removeEventListener("spendstracks_settings_changed", handleSettingsChange);
    };
  }, []);

  return language;
}

export function useTranslation() {
  const language = useLanguage();
  
  const t = (key: string): string => {
    const langDict = translations[language] || translations["English (India)"];
    return langDict[key] || translations["English (India)"][key] || key;
  };

  return { t, language };
}
