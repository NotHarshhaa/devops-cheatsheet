'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: -20
    },
    open: {
      opacity: 1,
      x: 0
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl from-blue-500 to-purple-600 flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/android-chrome-512x512.png"
                alt="DevOps Cheatsheet Hub"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              DevOps Cheatsheet Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/categories"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors relative group px-2 py-1"
            >
              Categories
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </Link>
            <Link 
              href="/about"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors relative group px-2 py-1"
            >
              About
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </Link>
            <Link
              href="https://github.com/NotHarshhaa"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FaGithub className="w-5 h-5" />
            </Link>
            <ThemeToggle />
            <Link
              href="/contribute"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Contribute
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
              className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <motion.nav className="flex flex-col gap-4">
                <motion.div variants={menuItemVariants}>
                  <Link 
                    href="/categories" 
                    className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Categories
                  </Link>
                </motion.div>
                <motion.div variants={menuItemVariants}>
                  <Link 
                    href="/about" 
                    className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                </motion.div>
                <motion.div variants={menuItemVariants}>
                  <a 
                    href="https://github.com/NotHarshhaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <FaGithub className="w-5 h-5" />
                    GitHub
                  </a>
                </motion.div>
                <motion.div 
                  variants={menuItemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link
                    href="/contribute"
                    className="block mx-4 my-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
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