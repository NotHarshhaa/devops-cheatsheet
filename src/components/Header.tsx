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
  Settings,
  BookOpen,
  Heart,
  Star,
  Users,
  Box,
  Cloud,
  Server,
  GitBranch,
  Shield,
  Network,
  BarChart2,
  ChevronRight,
  Sparkles,
  Terminal
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { triggerCommandMenu } from "./CommandMenu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-3 inset-x-0 z-50 mx-auto max-w-6xl px-3 sm:px-6">
      <div 
        className={`rounded-2xl transition-all duration-300 border ${
          isScrolled 
            ? "bg-background/85 dark:bg-background/80 backdrop-blur-2xl border-primary/20 shadow-2xl shadow-primary/5 py-2 px-3 sm:px-4"
            : "bg-background/70 dark:bg-background/60 backdrop-blur-xl border-border/70 shadow-lg py-2.5 px-3 sm:px-4"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-background rounded-xl border border-border/80 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/android-chrome-192x192.png"
                  alt="DevOps Hub Logo"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 font-mono">
                  DEVOPS<span className="text-foreground">//</span>HUB
                </span>
                <Badge variant="outline" className="hidden sm:inline-flex text-[9px] px-1 py-0 font-mono text-cyan-600 dark:text-cyan-400 border-cyan-500/30">
                  v1.1
                </Badge>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono -mt-1 hidden sm:inline">
                Interactive Engineering Cheatsheets
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setDropdownOpen("categories")}
              onMouseLeave={() => setDropdownOpen("")}
            >
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 font-medium text-xs sm:text-sm text-foreground/80 hover:text-foreground"
                onClick={() => setDropdownOpen(dropdownOpen === "categories" ? "" : "categories")}
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-500" />
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen === "categories" ? "rotate-180" : ""}`} />
              </Button>

              <AnimatePresence>
                {dropdownOpen === "categories" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-80 mt-1 bg-background/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border/80 overflow-hidden z-50 p-2"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border/40 mb-1">
                      DevOps Domains
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {[
                        { name: "CI/CD Pipelines", path: "CI-CD", icon: Settings, color: "text-amber-500" },
                        { name: "Containerization", path: "Containerization", icon: Box, color: "text-cyan-500" },
                        { name: "Cloud Computing", path: "Cloud", icon: Cloud, color: "text-blue-500" },
                        { name: "Infrastructure as Code", path: "Infrastructure-Management", icon: Server, color: "text-purple-500" },
                        { name: "Version Control", path: "Version-Control", icon: GitBranch, color: "text-emerald-500" },
                        { name: "Security & Hardening", path: "Security", icon: Shield, color: "text-red-500" },
                        { name: "Networking", path: "Networking", icon: Network, color: "text-indigo-500" },
                        { name: "Monitoring & Logs", path: "Monitoring", icon: BarChart2, color: "text-pink-500" },
                      ].map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <Link
                            key={cat.name}
                            href={`/${cat.path}`}
                            className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/80 rounded-xl transition-all group"
                          >
                            <div className={`w-6 h-6 rounded-lg bg-accent flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="flex-1">{cat.name}</span>
                            <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        );
                      })}
                    </div>
                    <div className="mt-1 pt-1.5 border-t border-border/50">
                      <Link
                        href="/categories"
                        className="flex items-center justify-between px-3 py-1.5 text-xs text-primary font-medium hover:bg-primary/10 rounded-xl transition-colors"
                      >
                        <span>Explore all hubs</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setDropdownOpen("resources")}
              onMouseLeave={() => setDropdownOpen("")}
            >
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 font-medium text-xs sm:text-sm text-foreground/80 hover:text-foreground"
                onClick={() => setDropdownOpen(dropdownOpen === "resources" ? "" : "resources")}
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                <span>Resources</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen === "resources" ? "rotate-180" : ""}`} />
              </Button>

              <AnimatePresence>
                {dropdownOpen === "resources" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-60 mt-1 bg-background/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border/80 overflow-hidden z-50 p-2"
                  >
                    <Link
                      href="/getting-started"
                      className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/80 rounded-xl transition-all"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Star className="w-3.5 h-3.5" />
                      </div>
                      <span>Getting Started</span>
                    </Link>
                    <Link
                      href="/about"
                      className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/80 rounded-xl transition-all"
                    >
                      <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span>About Us</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Command Palette Trigger (Cmd+K) */}
            <Button
              variant="outline"
              size="sm"
              onClick={triggerCommandMenu}
              className="gap-2 px-3 h-8 bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground border-border/60 rounded-xl text-xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-primary" />
              <span className="hidden xl:inline">Search Cheatsheets...</span>
              <span className="xl:hidden">Search...</span>
              <Kbd className="font-mono text-[10px] bg-background/80 px-1 py-0.5">⌘K</Kbd>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* GitHub */}
            <a
              href="https://github.com/NotHarshhaa/devops-cheatsheet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs text-foreground/80 hover:text-foreground cursor-pointer"
              >
                <Github className="w-4 h-4" />
                <span className="hidden xl:inline">GitHub</span>
              </Button>
            </a>

            {/* Contribute CTA */}
            <Link href="/contribute">
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-md gap-1.5 text-xs font-semibold px-3.5 border-0 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-red-300 fill-red-300" />
                <span>Contribute</span>
              </Button>
            </Link>
          </nav>

          {/* Mobile Right Bar */}
          <div className="flex items-center lg:hidden gap-1.5">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={triggerCommandMenu}
              aria-label="Open search command palette"
              className="text-foreground"
            >
              <Search className="w-4 h-4" />
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="text-foreground"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden mt-2 p-4 rounded-3xl bg-background/95 backdrop-blur-2xl border border-border/80 shadow-2xl space-y-4"
          >
            {/* Quick Command Trigger in Mobile */}
            <Button
              variant="outline"
              onClick={() => {
                setIsMenuOpen(false);
                triggerCommandMenu();
              }}
              className="w-full justify-between h-11 px-4 rounded-2xl bg-muted/40 border-border/60 text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                <span>Search cheatsheets & tools...</span>
              </div>
              <Kbd className="text-[10px]">⌘K</Kbd>
            </Button>

            {/* Quick Categories */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Top Categories
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "CI/CD", path: "CI-CD", icon: Settings },
                  { name: "Containers", path: "Containerization", icon: Box },
                  { name: "Cloud", path: "Cloud", icon: Cloud },
                  { name: "IaC & Terraform", path: "Infrastructure-Management", icon: Server },
                  { name: "Security", path: "Security", icon: Shield },
                  { name: "Monitoring", path: "Monitoring", icon: BarChart2 },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <Link
                      key={c.name}
                      href={`/${c.path}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl bg-accent/50 hover:bg-accent text-xs font-medium text-foreground transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <span className="truncate">{c.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Extra links */}
            <div className="pt-2 border-t border-border/50 flex flex-col gap-2">
              <Link
                href="/categories"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium hover:bg-accent text-foreground"
              >
                <span>View All Categories</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              </Link>
              <Link
                href="/getting-started"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium hover:bg-accent text-foreground"
              >
                <span>Getting Started Guide</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              </Link>
              <Link
                href="/contribute"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-md mt-1"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Contribute to DevOps Hub</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
