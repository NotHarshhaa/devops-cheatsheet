"use client";

import { useState, useEffect, useRef } from "react";
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
  Terminal,
  Zap
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { triggerCommandMenu } from "./CommandMenu";
import { SavedItemsSheet } from "./SavedItemsSheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setDropdownOpen(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(null);
    }, 150);
  };

  return (
    <header className="fixed top-3 inset-x-0 z-50 mx-auto max-w-6xl px-3 sm:px-6">
      <div 
        className={`rounded-2xl transition-all duration-200 border ${
          isScrolled 
            ? "bg-background/90 dark:bg-background/85 backdrop-blur-2xl border-border shadow-xl shadow-black/5 dark:shadow-black/30 py-2 px-3 sm:px-4"
            : "bg-background/75 dark:bg-background/70 backdrop-blur-xl border-border/80 shadow-md py-2.5 px-3 sm:px-4"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-card rounded-xl border border-border/80 shadow-sm group-hover:scale-105 transition-transform duration-200 overflow-hidden">
              <Image
                src="/android-chrome-192x192.png"
                alt="DevOps Hub Logo"
                width={26}
                height={26}
                className="w-6 h-6 object-contain"
                priority
              />
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
              <span className="text-[10px] text-muted-foreground font-mono -mt-1 hidden lg:inline">
                Interactive Engineering Cheatsheets
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (visible on md screens and up) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter("categories")}
              onMouseLeave={handleMouseLeave}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2.5 lg:px-3 rounded-xl gap-1.5 font-medium text-xs text-foreground/80 hover:text-foreground cursor-pointer"
                onClick={() => setDropdownOpen(dropdownOpen === "categories" ? null : "categories")}
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-500" />
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen === "categories" ? "rotate-180" : ""}`} />
              </Button>

              <AnimatePresence>
                {dropdownOpen === "categories" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full left-0 w-80 pt-2 z-50"
                  >
                    <div className="bg-background/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border/80 p-2 overflow-hidden">
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
                              onClick={() => setDropdownOpen(null)}
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
                          onClick={() => setDropdownOpen(null)}
                          className="flex items-center justify-between px-3 py-1.5 text-xs text-primary font-medium hover:bg-primary/10 rounded-xl transition-colors"
                        >
                          <span>Explore all hubs</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter("resources")}
              onMouseLeave={handleMouseLeave}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2.5 lg:px-3 rounded-xl gap-1.5 font-medium text-xs text-foreground/80 hover:text-foreground cursor-pointer"
                onClick={() => setDropdownOpen(dropdownOpen === "resources" ? null : "resources")}
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                <span>Resources</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen === "resources" ? "rotate-180" : ""}`} />
              </Button>

              <AnimatePresence>
                {dropdownOpen === "resources" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full left-0 w-60 pt-2 z-50"
                  >
                    <div className="bg-background/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border/80 p-2 overflow-hidden">
                      <Link
                        href="/getting-started"
                        onClick={() => setDropdownOpen(null)}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/80 rounded-xl transition-all"
                      >
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                          <Star className="w-3.5 h-3.5" />
                        </div>
                        <span>Getting Started</span>
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setDropdownOpen(null)}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/80 rounded-xl transition-all"
                      >
                        <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <span>About Us</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Interactive Generator Link */}
            <Link href="/generator">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2.5 lg:px-3 rounded-xl gap-1.5 font-medium text-xs text-foreground/80 hover:text-foreground cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden xl:inline">CLI Builder</span>
                <span className="xl:hidden">Tools</span>
              </Button>
            </Link>

            {/* Search Pill Trigger (Cmd+K) */}
            <Button
              variant="outline"
              size="sm"
              onClick={triggerCommandMenu}
              className="h-9 px-2.5 lg:px-3 rounded-xl gap-2 border-border/60 bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-mono cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-primary" />
              <span className="hidden lg:inline text-xs font-sans">Search</span>
              <Kbd className="font-mono text-[10px] bg-background/80 px-1 py-0.5">⌘K</Kbd>
            </Button>

            {/* Saved Items Drawer */}
            <SavedItemsSheet />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* GitHub */}
            <a
              href="https://github.com/NotHarshhaa/devops-cheatsheet"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Button
                variant="outline"
                size="icon-sm"
                className="h-9 w-9 rounded-xl border-border/60 bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </Button>
            </a>

            {/* Contribute CTA */}
            <Link href="/contribute">
              <Button
                size="sm"
                className="h-9 px-3 lg:px-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md gap-1.5 text-xs font-semibold border-0 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-red-300 fill-red-300" />
                <span className="hidden lg:inline">Contribute</span>
              </Button>
            </Link>
          </nav>

          {/* Mobile Right Bar (visible on screens < md) */}
          <div className="flex items-center md:hidden gap-1.5">
            <SavedItemsSheet />
            <Button
              variant="outline"
              size="icon-sm"
              onClick={triggerCommandMenu}
              aria-label="Open search command palette"
              className="h-9 w-9 rounded-xl border-border/60 bg-muted/40 text-foreground"
            >
              <Search className="w-4 h-4" />
            </Button>
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="h-9 w-9 rounded-xl border-border/60 bg-muted/40 text-foreground"
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm -z-10"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="md:hidden mt-2 p-4 rounded-3xl bg-background/98 backdrop-blur-2xl border border-border shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto"
            >
              {/* Quick Search Button in Mobile */}
              <Button
                variant="outline"
                onClick={() => {
                  setIsMenuOpen(false);
                  triggerCommandMenu();
                }}
                className="w-full justify-between h-10 px-4 rounded-2xl bg-muted/40 border-border/60 text-muted-foreground font-mono text-xs"
              >
                <div className="flex items-center gap-2 font-sans">
                  <Search className="w-4 h-4 text-primary" />
                  <span>Search cheatsheets...</span>
                </div>
                <Kbd className="text-[10px]">⌘K</Kbd>
              </Button>

              {/* Top Categories */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 px-1">
                  Architecture Hubs
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
                  href="/generator"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Interactive CLI & Config Builder</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
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
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
