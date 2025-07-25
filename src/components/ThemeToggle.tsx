"use client";

import { memo, useCallback } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useIsLowEndDevice } from "@/hooks/useOptimizedAnimation";

export function ThemeToggleComponent() {
  const { theme, toggleTheme, isDarkMode } = useTheme();
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
    <motion.button
      onClick={handleToggle}
      className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm touch-callout-none"
      whileTap={isLowEnd ? undefined : { scale: 0.9 }}
      whileHover={isLowEnd ? undefined : { scale: 1.05 }}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDarkMode ? (
          <motion.div
            key="moon"
            {...animationProps}
            className="text-yellow-400"
          >
            <FaMoon className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
        ) : (
          <motion.div key="sun" {...animationProps} className="text-indigo-600">
            <FaSun className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const ThemeToggle = memo(ThemeToggleComponent);
