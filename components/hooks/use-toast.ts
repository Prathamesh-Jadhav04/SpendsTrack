import { useState, useCallback } from "react";
import type { ToastType } from "@/components/types";

export function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<ToastType>("success");

  const showToast = useCallback(
    (
      message: string,
      duration = 3000,
      type: ToastType = "success"
    ) => {
      setToast(message);
      setToastType(type);
      setTimeout(() => setToast(null), duration);
    },
    []
  );

  return { toast, toastType, showToast };
}
