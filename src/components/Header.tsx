"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaGithub,
  FaStar,
  FaCompass,
  FaInfoCircle,
  FaHandsHelping,
} from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  // Handle scroll events for header visibility and styling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if user has scrolled down
      if (currentScrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide/show header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: [0.04, 0.62, 0.23, 0.98],
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.2 },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  // Dynamic classes based on scroll position
  const headerClasses = `fixed w-full z-50 transition-all duration-300 ${
    scrolled
      ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md"
      : "bg-transparent dark:bg-transparent"
  } ${visible ? "top-0" : "-top-24"}`;

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-10 h-10 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/android-chrome-512x512.png"
                  alt="DevOps Cheatsheet Hub"
                  width={28}
                  height={28}
                  className="w-6 h-6"
                />
              </div>
            </div>
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
              >
                DevOps Cheatsheet Hub
              </motion.span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/categories"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group py-2 px-3"
            >
              <FaCompass className="opacity-70 group-hover:opacity-100 transform group-hover:rotate-45 transition-all duration-300" />
              <span>Categories</span>
              <span className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
            </Link>

            <Link
              href="/getting-started"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors relative group py-2 px-3"
            >
              <FaStar className="opacity-70 group-hover:opacity-100 transform group-hover:rotate-45 transition-all duration-300" />
              <span>Get Started</span>
              <span className="absolute inset-0 bg-green-50 dark:bg-green-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
            </Link>

            <Link
              href="/about"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative group py-2 px-3"
            >
              <FaInfoCircle className="opacity-70 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300" />
              <span>About</span>
              <span className="absolute inset-0 bg-purple-50 dark:bg-purple-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
            </Link>

            <Link
              href="https://github.com/NotHarshhaa"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
              aria-label="GitHub"
            >
              <span className="absolute -inset-2 bg-gray-100 dark:bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300"></span>
              <FaGithub className="w-5 h-5 text-gray-700 dark:text-gray-300 relative" />
            </Link>

            <div className="mx-1">
              <ThemeToggle />
            </div>

            <Link
              href="/contribute"
              className="relative group px-5 py-2.5 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2 text-white font-medium">
                <FaHandsHelping className="w-4 h-4 group-hover:animate-pulse" />
                Contribute
              </span>
            </Link>
          </nav>

          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            {/* Mobile Menu Button */}
            <motion.button
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
            >
              <motion.nav className="flex flex-col gap-2 py-6">
                <motion.div variants={menuItemVariants}>
                  <Link
                    href="/categories"
                    className="flex items-center gap-3 px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaCompass className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    <span className="font-medium">Categories</span>
                  </Link>
                </motion.div>

                <motion.div variants={menuItemVariants}>
                  <Link
                    href="/getting-started"
                    className="flex items-center gap-3 px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaStar className="w-5 h-5 text-green-500 dark:text-green-400" />
                    <span className="font-medium">Get Started</span>
                  </Link>
                </motion.div>

                <motion.div variants={menuItemVariants}>
                  <Link
                    href="/about"
                    className="flex items-center gap-3 px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaInfoCircle className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    <span className="font-medium">About</span>
                  </Link>
                </motion.div>

                <motion.div variants={menuItemVariants}>
                  <a
                    href="https://github.com/NotHarshhaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <FaGithub className="w-5 h-5" />
                    <span className="font-medium">GitHub</span>
                  </a>
                </motion.div>

                <motion.div variants={menuItemVariants} className="px-4 pt-2">
                  <Link
                    href="/contribute"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaHandsHelping className="w-4 h-4" />
                    Contribute
                  </Link>
                </motion.div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
