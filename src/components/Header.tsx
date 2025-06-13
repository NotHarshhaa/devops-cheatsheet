"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Github,
  ChevronDown,
  Search,
  Code,
  BarChart2,
  Settings,
  BookOpen,
  Heart,
  Star,
  Users,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState("");

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const headerVariants = {
    initial: { y: -100 },
    animate: {
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const menuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
        when: "afterChildren",
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.4 },
        opacity: { duration: 0.3 },
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, y: -5 },
    open: { opacity: 1, y: 0 },
  };

  const dropdownVariants = {
    closed: {
      opacity: 0,
      y: -5,
      height: 0,
      transition: {
        y: { duration: 0.1 },
        opacity: { duration: 0.1 },
        height: { duration: 0.2 },
      },
    },
    open: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        y: { duration: 0.1 },
        opacity: { duration: 0.1 },
        height: { duration: 0.3 },
      },
    },
  };

  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.header
      initial="initial"
      animate="animate"
      variants={headerVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md py-3"
          : "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div variants={logoVariants} className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-[10px] opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative flex items-center justify-center w-11 h-11 bg-white dark:bg-gray-900 rounded-full shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/android-chrome-512x512.png"
                    alt="DevOps Cheatsheet"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  DevOps Hub
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1">
                  Your Ultimate Cheatsheet
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Dropdown for Categories */}
            <div className="relative">
              <button
                onClick={() =>
                  setDropdownOpen(
                    dropdownOpen === "categories" ? "" : "categories",
                  )
                }
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onMouseEnter={() => setDropdownOpen("categories")}
                onMouseLeave={() => setDropdownOpen("")}
              >
                <Code className="w-4 h-4" />
                <span>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    dropdownOpen === "categories" ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen === "categories" && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={dropdownVariants}
                    className="absolute top-full left-0 w-56 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    onMouseEnter={() => setDropdownOpen("categories")}
                    onMouseLeave={() => setDropdownOpen("")}
                  >
                    <div className="p-2">
                      {[
                        {
                          name: "CI/CD",
                          icon: <Settings className="w-4 h-4" />,
                        },
                        {
                          name: "Containers",
                          icon: <Code className="w-4 h-4" />,
                        },
                        {
                          name: "Monitoring",
                          icon: <BarChart2 className="w-4 h-4" />,
                        },
                      ].map((category) => (
                        <Link
                          key={category.name}
                          href={`/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                          className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <span className="text-blue-500 dark:text-blue-400">
                            {category.icon}
                          </span>
                          <span>{category.name}</span>
                        </Link>
                      ))}
                      <div className="mt-1 pt-1 border-t border-gray-100 dark:border-gray-700">
                        <Link
                          href="/categories"
                          className="flex items-center gap-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <span>View All Categories</span>
                          <ChevronDown className="w-4 h-4 rotate-270" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setDropdownOpen(
                    dropdownOpen === "resources" ? "" : "resources",
                  )
                }
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onMouseEnter={() => setDropdownOpen("resources")}
                onMouseLeave={() => setDropdownOpen("")}
              >
                <BookOpen className="w-4 h-4" />
                <span>Resources</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    dropdownOpen === "resources" ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen === "resources" && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={dropdownVariants}
                    className="absolute top-full left-0 w-56 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    onMouseEnter={() => setDropdownOpen("resources")}
                    onMouseLeave={() => setDropdownOpen("")}
                  >
                    <div className="p-2">
                      <Link
                        href="/getting-started"
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <span className="text-green-500 dark:text-green-400">
                          <Star className="w-4 h-4" />
                        </span>
                        <span>Getting Started</span>
                      </Link>
                      <Link
                        href="/about"
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <span className="text-purple-500 dark:text-purple-400">
                          <Users className="w-4 h-4" />
                        </span>
                        <span>About Us</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/search"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>

            <a
              href="https://github.com/NotHarshhaa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            <div className="pl-2">
              <ThemeToggle />
            </div>

            <Link href="/contribute" className="relative group ml-3">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative flex items-center gap-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="font-medium">Contribute</span>
              </div>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
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
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
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
            className="lg:hidden overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Search Box */}
              <motion.div variants={menuItemVariants} className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search tools..."
                    className="block w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </motion.div>

              {/* Mobile Menu Items */}
              <div className="space-y-6">
                <motion.div
                  variants={menuItemVariants}
                  className="border-b border-gray-100 dark:border-gray-800 pb-6"
                >
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Categories
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: "CI/CD", icon: <Settings className="w-4 h-4" /> },
                      {
                        name: "Containers",
                        icon: <Code className="w-4 h-4" />,
                      },
                      {
                        name: "Monitoring",
                        icon: <BarChart2 className="w-4 h-4" />,
                      },
                      {
                        name: "All Categories",
                        icon: <ChevronDown className="w-4 h-4" />,
                      },
                    ].map((category) => (
                      <Link
                        key={category.name}
                        href={
                          category.name === "All Categories"
                            ? "/categories"
                            : `/${category.name.toLowerCase().replace(/\s+/g, "-")}`
                        }
                        className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-blue-500 dark:text-blue-400">
                          {category.icon}
                        </span>
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  variants={menuItemVariants}
                  className="border-b border-gray-100 dark:border-gray-800 pb-6"
                >
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Resources
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/getting-started"
                      className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-green-500 dark:text-green-400">
                        <Star className="w-4 h-4" />
                      </span>
                      <span>Getting Started</span>
                    </Link>
                    <Link
                      href="/about"
                      className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-purple-500 dark:text-purple-400">
                        <Users className="w-4 h-4" />
                      </span>
                      <span>About Us</span>
                    </Link>
                    <a
                      href="https://github.com/NotHarshhaa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-gray-500 dark:text-gray-400">
                        <Github className="w-4 h-4" />
                      </span>
                      <span>GitHub</span>
                    </a>
                  </div>
                </motion.div>

                <motion.div variants={menuItemVariants}>
                  <Link
                    href="/contribute"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 py-3 rounded-lg shadow-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Contribute</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
