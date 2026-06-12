import { useState, useCallback } from "react";
import type { ToastType } from "@/components/types";
import { sound } from "@/lib/sound";

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
      if (type === "success") {
        sound.playSuccess();
      }
      setTimeout(() => setToast(null), duration);
    },
    []
  );

  return { toast, toastType, showToast };
}
