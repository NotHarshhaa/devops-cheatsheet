import { SearchBar } from "@/components/SearchBar";
import { HomeFilters } from "@/components/HomeFilters";
import Link from "next/link";
import { categories, categoryData } from "@/utils/categoryData";
import { 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Server, 
  GitBranch, 
  Box, 
  Cloud, 
  Shield, 
  Network, 
  BarChart2, 
  Github, 
  Layers,
  CheckCircle2,
  Copy
} from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CategoryActions } from "@/components/CategoryActions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export const dynamic = 'force-static';
export const revalidate = false;

// Sample preview tools per category for the bento tags
const CATEGORY_TAGS: Record<string, string[]> = {
  'CI-CD': ['GitHub Actions', 'GitLab CI', 'Jenkins', 'ArgoCD'],
  'Containerization': ['Docker', 'Kubernetes', 'Helm', 'Podman'],
  'Cloud': ['AWS', 'Google Cloud', 'Azure', 'Cloudflare'],
  'Infrastructure-Management': ['Terraform', 'Ansible', 'Pulumi', 'Vagrant'],
  'Version-Control': ['Git Flow', 'Branching', 'Rebase', 'Hooks'],
  'Security': ['Vault', 'Trivy', 'Falco', 'OWASP'],
  'Networking': ['Nginx', 'Envoy', 'DNS', 'Cilium'],
  'Monitoring': ['Prometheus', 'Grafana', 'ELK Stack', 'OpenTelemetry'],
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-150px] left-1/4 w-[500px] h-[500px] bg-cyan-500/15 dark:bg-cyan-500/20 rounded-full blur-[140px]" />
        <div className="absolute top-[-100px] right-1/4 w-[550px] h-[550px] bg-purple-500/15 dark:bg-purple-600/20 rounded-full blur-[160px]" />
        <div className="absolute top-[250px] left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[130px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 bg-cyber-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Status telemetry pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 dark:bg-muted/60 border border-border/80 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-xs font-medium text-foreground tracking-wide">
                DEVOPS COMMAND CENTER // 200+ PRODUCTION CHEATSHEETS
              </span>
              <Badge variant="outline" className="hidden sm:inline-flex text-[10px] py-0 px-1 font-mono text-primary border-primary/30">
                ACTIVE
              </Badge>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.08] mb-6">
              Production DevOps <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 font-mono">
                Command Cheatsheets
              </span>
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Instant syntax, cloud architecture templates, container commands, and automation scripts curated for engineers who build fast.
            </p>

            {/* Elevated Search Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <Suspense fallback={<div className="h-14 bg-muted animate-pulse rounded-2xl" />}>
                <SearchBar />
              </Suspense>
            </div>

            {/* Quick Filter Tag Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-14 text-xs">
              <span className="text-muted-foreground font-mono text-[11px] mr-1">Trending:</span>
              {[
                { label: 'kubernetes', path: '/containerization/kubernetes' },
                { label: 'docker', path: '/containerization/docker' },
                { label: 'terraform', path: '/infrastructure-management/terraform' },
                { label: 'github-actions', path: '/ci-cd/github-actions' },
                { label: 'prometheus', path: '/monitoring/prometheus' },
                { label: 'security', path: '/security' },
              ].map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.path}
                  className="font-mono text-xs px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-primary/10 hover:text-primary border border-border/60 transition-colors"
                >
                  #{tag.label}
                </Link>
              ))}
            </div>

            {/* Live Interactive Terminal Mockup */}
            <div className="max-w-3xl mx-auto text-left relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-80 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm text-zinc-300">
                {/* Terminal top header bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs text-zinc-400 font-sans font-medium">
                      bash — devops-cli v1.1.0
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>connected: hub-cluster-prod</span>
                  </div>
                </div>

                {/* Terminal Content Body */}
                <div className="p-4 sm:p-5 space-y-3 leading-relaxed overflow-x-auto">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <span className="text-zinc-500">$</span>
                    <span>devops-hub query --category=all --verified</span>
                  </div>
                  <div className="text-zinc-400 pl-4 border-l border-zinc-800 space-y-1">
                    <p className="text-emerald-400 font-semibold">✓ 8 Core Engineering Hubs synchronized</p>
                    <p className="text-zinc-300">✓ 200+ Production Reference Cheatsheets ready</p>
                    <p className="text-zinc-500 text-xs">CI/CD · Containers · Cloud · IaC · Security · Networking · Observability</p>
                  </div>

                  <div className="flex items-center gap-2 text-cyan-400 pt-1">
                    <span className="text-zinc-500">$</span>
                    <span>kubectl get cheatsheet --output=ready</span>
                  </div>
                  <div className="text-zinc-400 text-xs pl-4 border-l border-zinc-800 space-y-0.5">
                    <p><span className="text-purple-400">NAME</span>                             <span className="text-cyan-400">STATUS</span>    <span className="text-amber-400">CATEGORY</span></p>
                    <p>docker-engine-reference          Ready     Containerization</p>
                    <p>k8s-pod-networking-guide        Ready     Containerization</p>
                    <p>terraform-state-locking-iac     Ready     Infrastructure</p>
                    <p>github-actions-ci-matrix        Ready     CI/CD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* High-Tech Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto mt-16">
            {[
              { value: "200+", label: "Curated Guides", icon: Zap, color: "text-amber-500" },
              { value: "8 Domains", label: "Core Hubs", icon: Layers, color: "text-cyan-500" },
              { value: "100%", label: "Free & Open Source", icon: ShieldCheck, color: "text-emerald-500" },
              { value: "Active", label: "Community Maintained", icon: Cpu, color: "text-purple-500" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="relative group p-4 sm:p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider">
                      {stat.label}
                    </span>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
                    {stat.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filter / Explore Section */}
      <section className="py-14 border-t border-b border-border/60 bg-muted/20">
        <HomeFilters />
      </section>

      {/* Bento Grid Categories Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wider mb-2">
                <Terminal className="w-4 h-4" />
                <span>Architectural Domains</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                Explore DevOps Categories
              </h2>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md">
              Specialized cheatsheets, command tables, and best practices organized by infrastructure pillar.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const data = categoryData[category];
              const tags = CATEGORY_TAGS[category] || [];
              const isFeatured = index === 1 || index === 3; // Containerization and Infrastructure

              return (
                <Link
                  key={category}
                  href={`/${category}`}
                  className={`block group ${isFeatured ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  <Card className="h-full rounded-2xl border-border/80 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col justify-between overflow-hidden relative group/card">
                    {/* Glowing background gradient on hover */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover/card:bg-primary/15 transition-all duration-500 pointer-events-none" />

                    <CardContent className="p-6 sm:p-7 flex flex-col h-full z-10">
                      {/* Top bar with icon and count */}
                      <div className="flex items-start justify-between gap-2 mb-5">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover/card:scale-110 group-hover/card:bg-primary group-hover/card:text-primary-foreground transition-all duration-300 shadow-sm">
                          <CategoryIcon category={category} />
                        </div>
                        <Badge variant="secondary" className="font-mono text-xs font-medium gap-1">
                          {data.toolCount}+ Cheatsheets
                        </Badge>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover/card:text-primary transition-colors capitalize">
                        {category.replace(/-/g, " ")}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                        {data.description}
                      </p>

                      {/* Tool Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-secondary/80 text-secondary-foreground border border-border/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Bottom action bar */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/60 mt-auto">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover/card:translate-x-0.5 transition-transform">
                          <span>Browse Hub</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>

                        <CategoryActions category={category} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cyber Contribute Section */}
      <section className="py-16 sm:py-24 border-t border-border/60 bg-muted/10 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-card border border-border/80 p-8 sm:p-12 shadow-2xl overflow-hidden">
            {/* Glow orb */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono uppercase mb-4 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Source Initiative</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-foreground mb-4">
                  Contribute New Tools & Command Cheatsheets
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  DevOps Cheatsheet Hub is built by engineers for engineers. Add new tools, enhance existing commands, or share your production workflows with the global DevOps community.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto shrink-0">
                <Link href="/contribute">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl shadow-lg border-0 cursor-pointer font-semibold gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Submit a Cheatsheet</span>
                  </Button>
                </Link>
                <a
                  href="https://github.com/NotHarshhaa/devops-cheatsheet"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-xl border-border/80 hover:bg-accent gap-2 cursor-pointer font-mono text-xs"
                  >
                    <Github className="w-4 h-4" />
                    <span>Star on GitHub</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
