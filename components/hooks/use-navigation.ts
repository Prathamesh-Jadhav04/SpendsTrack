import { useState, useCallback, useRef } from "react";
import type { Screen } from "@/components/types";

const screenOrder: Screen[] = [
  "splash",
  "login",
  "signup",
  "dashboard",
  "transactions",
  "analytics",
  "goals",
  "recurring",
  "reports",
  "categories",
  "profile",
  "add-expense",
  "add-income",
  "transaction-detail",
];

export function useNavigation() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [prevScreen, setPrevScreen] = useState<Screen | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const currentScreenRef = useRef(currentScreen);
  currentScreenRef.current = currentScreen;

  const handleScreenChange = useCallback((screen: Screen) => {
    setIsNavigating(true);
    setPrevScreen(currentScreenRef.current);
    setTimeout(() => {
      setCurrentScreen(screen);
      setTimeout(() => setIsNavigating(false), 100);
    }, 50);
  }, []);

  const handleNavigation = useCallback((screen: Screen) => {
    if (screen !== "login" && screen !== "splash") {
      setIsNavigating(true);
      setPrevScreen(currentScreenRef.current);
      setTimeout(() => {
        setCurrentScreen(screen);
        setTimeout(() => setIsNavigating(false), 100);
      }, 50);
    }
  }, []);

  const getDirection = useCallback(() => {
    const currentIdx = screenOrder.indexOf(currentScreen);
    const prevIdx = prevScreen ? screenOrder.indexOf(prevScreen) : -1;
    if (prevIdx === -1 || currentIdx === -1) return 0;
    return currentIdx > prevIdx ? 1 : -1;
  }, [currentScreen, prevScreen]);

  return {
    currentScreen,
    prevScreen,
    isNavigating,
    setCurrentScreen,
    setPrevScreen,
    handleScreenChange,
    handleNavigation,
    getDirection,
  };
}
