"use client";

import Link from "next/link";
import {
  Github,
  Terminal,
  ShieldCheck,
  Zap,
  Heart,
  ArrowRight,
  Sparkles,
  Command as CommandIcon,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";
import { triggerCommandMenu } from "./CommandMenu";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative border-t border-border/80 bg-background text-foreground overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -left-20 bottom-0 w-80 h-80 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -right-20 bottom-0 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Telemetry Status Ribbon */}
      <div className="border-b border-border/60 bg-muted/30 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-foreground">STATUS: ALL HUBS OPERATIONAL</span>
            <span className="hidden sm:inline text-muted-foreground/60">//</span>
            <span className="hidden sm:inline text-muted-foreground">200+ CHEATSHEETS SYNCED</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={triggerCommandMenu}
            className="h-7 text-xs font-mono gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer px-2"
          >
            <span>Command Palette:</span>
            <Kbd>⌘K</Kbd>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand & Mission */}
          <div className="md:col-span-2 lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="text-xl font-black font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600">
                DEVOPS<span className="text-foreground">//</span>HUB
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The modern open-source command reference for DevOps engineers, cloud architects, and SREs. Clean syntax, real production patterns, and verified terminal snippets.
            </p>

            {/* Newsletter Dock */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm max-w-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-foreground mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>DevOps Dispatch Weekly</span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-3">
                New tool guides and architecture patterns delivered to your inbox.
              </p>

              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-1.5">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineer@domain.com"
                    className="h-9 text-xs rounded-xl bg-background font-mono"
                    required
                  />
                  <Button type="submit" size="sm" className="h-9 px-3 rounded-xl font-mono text-xs shrink-0 cursor-pointer">
                    Join
                  </Button>
                </form>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-500 font-mono py-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed! Check your inbox.</span>
                </div>
              )}
            </div>
          </div>

          {/* Architecture Hubs */}
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              Architecture Hubs
            </div>
            <ul className="space-y-2.5 text-xs">
              {[
                { name: "Containerization", path: "/Containerization" },
                { name: "CI/CD Automation", path: "/CI-CD" },
                { name: "Cloud Architecture", path: "/Cloud" },
                { name: "Infrastructure as Code", path: "/Infrastructure-Management" },
                { name: "Security & Vault", path: "/Security" },
                { name: "Observability", path: "/Monitoring" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Reference */}
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              Popular Cheatsheets
            </div>
            <ul className="space-y-2.5 text-xs">
              {[
                { name: "Docker Reference", path: "/containerization/docker" },
                { name: "Kubernetes Commands", path: "/containerization/kubernetes" },
                { name: "Terraform IaC Syntax", path: "/infrastructure-management/terraform" },
                { name: "GitHub Actions Workflows", path: "/ci-cd/github-actions" },
                { name: "Prometheus Monitoring", path: "/monitoring/prometheus" },
                { name: "Linux Networking", path: "/networking/linux-networking" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors inline-block font-mono text-[11px]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & GitHub */}
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              Community & Project
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/getting-started" className="text-muted-foreground hover:text-primary transition-colors">
                  Getting Started Guide
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About DevOps Hub
                </Link>
              </li>
              <li>
                <Link href="/contribute" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 text-primary font-medium">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>Submit Cheatsheet</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/NotHarshhaa/devops-cheatsheet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 font-mono"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <div>
            © {new Date().getFullYear()} DevOps Cheatsheet Hub. Built for open-source engineers.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Production Tested</span>
            </span>
            <span>·</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
