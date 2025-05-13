'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/android-chrome-512x512.png"
              alt="DevOps Cheatsheet Hub"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-xl font-semibold text-gray-900">
              DevOps Cheatsheet Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/categories"
              className="text-gray-600 hover:text-gray-900 transition-colors relative group"
            >
              Categories
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
            <Link 
              href="/about"
              className="text-gray-600 hover:text-gray-900 transition-colors relative group"
            >
              About
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
            <Link
              href="https://github.com/NotHarshhaa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors transform hover:scale-110"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="/contribute"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Contribute
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ backgroundColor: 'rgb(243 244 246)' }}
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
                  <X className="w-6 h-6 text-gray-600" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden py-4 border-t border-gray-100"
            >
              <motion.nav className="flex flex-col gap-4">
                <motion.div variants={menuItemVariants}>
                  <Link 
                    href="/categories" 
                    className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Categories
                  </Link>
                </motion.div>
                <motion.div variants={menuItemVariants}>
                  <Link 
                    href="/about" 
                    className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
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
                    className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    GitHub
                  </a>
                </motion.div>
                <motion.div 
                  variants={menuItemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link
                    href="/contribute"
                    className="block mx-4 text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
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