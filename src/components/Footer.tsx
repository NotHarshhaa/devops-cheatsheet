"use client";

import Link from "next/link";
import {
  FaGithub,
  FaTelegram,
  FaLinkedin,
  FaRocket,
  FaHeart,
  FaCodeBranch,
  FaSearch,
  FaTools,
  FaBookOpen,
  FaStar,
  FaHandsHelping,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";
import { useState } from "react";
import { motion } from "framer-motion";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // This would connect to your newsletter service in a real app
      setSubscribed(true);
      setEmail("");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-gray-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-black text-gray-800 dark:text-gray-200">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-10 -bottom-20 w-64 h-64 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-72 h-72 rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-24 h-24 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-xl" />
      </div>

      {/* Wave Pattern Top */}
      <div className="relative w-full overflow-hidden">
        <svg
          className="w-full h-auto text-gray-50 dark:text-gray-900 fill-current transform rotate-180"
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,32L60,37.3C120,43,240,53,360,48C480,43,600,21,720,16C840,11,960,21,1080,26.7C1200,32,1320,32,1380,32L1440,32L1440,60L1380,60C1320,60,1200,60,1080,60C960,60,840,60,720,60C600,60,480,60,360,60C240,60,120,60,60,60L0,60Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Brand and Newsletter */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 md:col-span-2 space-y-8"
          >
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative w-12 h-12 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                  <FaRocket className="text-gradient-blue-purple text-xl" />
                </div>
              </div>
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                DevOps Cheatsheet
              </div>
            </Link>

            <p className="text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
              A comprehensive collection of DevOps tools, best practices, and
              resources for modern software development and operations teams.
              Updated regularly with the latest insights.
            </p>

            {/* Newsletter Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transform transition-all duration-300 hover:shadow-xl">
              <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <FaEnvelope className="text-blue-500 dark:text-blue-400" />
                Get DevOps updates
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Stay updated with the latest DevOps tools and best practices
              </p>

              {!subscribed ? (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-grow px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    Subscribe
                    <FaArrowRight className="w-3 h-3" />
                  </button>
                </form>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-lg text-center">
                  Thanks for subscribing! Check your email to confirm.
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FaBookOpen className="text-blue-500 dark:text-blue-400 w-5 h-5" />
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                {
                  icon: <FaTools className="w-4 h-4" />,
                  text: "Categories",
                  href: "/categories",
                },
                {
                  icon: <FaSearch className="w-4 h-4" />,
                  text: "Search",
                  href: "/search",
                },
                {
                  icon: <FaStar className="w-4 h-4" />,
                  text: "Getting Started",
                  href: "/getting-started",
                },
                {
                  icon: <FaHandsHelping className="w-4 h-4" />,
                  text: "Contribute",
                  href: "/contribute",
                },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.text}</span>
                    <HiChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FaCodeBranch className="text-purple-500 dark:text-purple-400 w-5 h-5" />
              Connect With Us
            </h3>
            <ul className="space-y-4">
              {[
                {
                  icon: <FaGithub className="w-4 h-4" />,
                  text: "GitHub",
                  href: "https://github.com/NotHarshhaa",
                },
                {
                  icon: <FaTelegram className="w-4 h-4" />,
                  text: "Telegram",
                  href: "https://t.me/prodevopsguy",
                },
                {
                  icon: <FaLinkedin className="w-4 h-4" />,
                  text: "LinkedIn",
                  href: "https://linkedin.com/in/harshhaa-vardhan-reddy",
                },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.text}</span>
                    <HiChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                  </a>
                </li>
              ))}
            </ul>

            {/* Community Stats */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-3">
                Community Stats
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    5.2K
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    GitHub Stars
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    2.1K
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Community Members
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} DevOps Cheatsheet Hub. All rights
            reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <span>Made with</span>
            <FaHeart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>by</span>
            <a
              href="https://github.com/NotHarshhaa"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              H A R S H H A A
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
