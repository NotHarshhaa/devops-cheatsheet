"use client";

import { memo, useCallback } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useIsLowEndDevice } from "@/hooks/useOptimizedAnimation";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function ThemeToggleComponent() {
  const { toggleTheme, isDarkMode } = useTheme();
  const isLowEnd = useIsLowEndDevice();

  const handleToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  // Simpler animations for low-end devices
  const animationProps = isLowEnd
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { rotateY: isDarkMode ? 90 : -90, opacity: 0 },
        animate: { rotateY: 0, opacity: 1 },
        exit: { rotateY: isDarkMode ? -90 : 90, opacity: 0 },
        transition: { duration: 0.2 },
      };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <motion.button
            onClick={handleToggle}
            className="relative flex items-center justify-center h-9 w-9 rounded-xl border border-border/60 bg-muted/40 hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
            whileTap={isLowEnd ? undefined : { scale: 0.9 }}
            whileHover={isLowEnd ? undefined : { scale: 1.05 }}
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          />
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDarkMode ? (
            <motion.div
              key="moon"
              {...animationProps}
              className="text-yellow-400"
            >
              <FaMoon className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div key="sun" {...animationProps} className="text-primary">
              <FaSun className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </TooltipTrigger>
      <TooltipContent>
        <p>Switch to {isDarkMode ? "light" : "dark"} mode</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const ThemeToggle = memo(ThemeToggleComponent);
