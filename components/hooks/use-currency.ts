"use client";

import { useState, useEffect } from "react";
import { getCurrencySettings, formatAmountVal } from "@/lib/utils";

export function useCurrency() {
  const [currency, setCurrency] = useState({ symbol: "₹", locale: "en-IN", code: "INR" });

  useEffect(() => {
    // Initial load
    setCurrency(getCurrencySettings());

    const handleSettingsChange = () => {
      setCurrency(getCurrencySettings());
    };

    window.addEventListener("spendstracks_settings_changed", handleSettingsChange);
    return () => {
      window.removeEventListener("spendstracks_settings_changed", handleSettingsChange);
    };
  }, []);

  const format = (amount: number) => {
    return `${currency.symbol}${formatAmountVal(amount, currency.code, currency.locale)}`;
  };

  const formatRaw = (amount: number) => {
    return formatAmountVal(amount, currency.code, currency.locale);
  };

  return {
    symbol: currency.symbol,
    locale: currency.locale,
    code: currency.code,
    format,
    formatRaw,
  };
}
