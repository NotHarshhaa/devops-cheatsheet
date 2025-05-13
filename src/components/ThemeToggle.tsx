'use client';

import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-yellow-400"
          >
            <FaMoon className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-indigo-600"
          >
            <FaSun className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
} 