"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { sound } from "@/lib/sound";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 35, stiffness: 350, mass: 0.35 };
  const cursorRingX = useSpring(cursorX, springConfig);
  const cursorRingY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (isVisible) {
      document.documentElement.classList.add("custom-cursor-active");
    } else {
      document.documentElement.classList.remove("custom-cursor-active");
    }
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [isVisible]);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Check if fine pointer device (like a mouse) is being used
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      if (!isFinePointer) return;

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") || 
        target.closest("[role='button']") ||
        target.closest(".cursor-pointer");
      
      setIsHovering(!!isInteractive);
    };

    // Global click listener for audio click feedback
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") || 
        target.closest("[role='button']") ||
        target.closest(".cursor-pointer") ||
        target.closest(".input-glow");

      if (isInteractive) {
        sound.playClick();
      }
    };

    // Global hover event listener for audio hover feedback
    let lastHoveredElement: HTMLElement | null = null;
    const handleGlobalHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = 
        target.closest("button") || 
        target.closest("a") || 
        target.closest("[role='button']") ||
        target.closest(".cursor-pointer");

      if (interactiveEl) {
        if (lastHoveredElement !== interactiveEl) {
          sound.playHover();
          lastHoveredElement = interactiveEl as HTMLElement;
        }
      } else {
        lastHoveredElement = null;
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("mouseover", handleGlobalHover);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("mouseover", handleGlobalHover);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer follow ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-black/50 dark:border-white/50 shadow-[0_0_0_1px_rgba(255,255,255,0.4)] dark:shadow-[0_0_0_1px_rgba(0,0,0,0.4)] pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 hidden lg:block"
        style={{
          x: cursorRingX,
          y: cursorRingY,
          scale: isHovering ? 1.45 : 1,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
      />
      {/* Inner solid dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-black dark:bg-white border border-white/80 dark:border-black/80 shadow-[0_1px_2px_rgba(0,0,0,0.2)] pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 hidden lg:block"
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovering ? 0.6 : 1,
        }}
      />
    </>
  );
}
