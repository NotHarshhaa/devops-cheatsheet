'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Settings,
  Box,
  Cloud,
  Server,
  GitBranch,
  Shield,
  Network,
  BarChart2,
  ArrowRight,
  Sparkles,
  Command as CommandIcon,
  Code
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Kbd } from '@/components/ui/kbd';

const QUICK_CATEGORIES = [
  { name: 'CI/CD', path: '/CI-CD', icon: Settings, count: '30+' },
  { name: 'Containerization', path: '/Containerization', icon: Box, count: '25+' },
  { name: 'Cloud Computing', path: '/Cloud', icon: Cloud, count: '40+' },
  { name: 'Infrastructure Management', path: '/Infrastructure-Management', icon: Server, count: '35+' },
  { name: 'Version Control', path: '/Version-Control', icon: GitBranch, count: '20+' },
  { name: 'Security & Compliance', path: '/Security', icon: Shield, count: '25+' },
  { name: 'Networking', path: '/Networking', icon: Network, count: '20+' },
  { name: 'Monitoring & Observability', path: '/Monitoring', icon: BarChart2, count: '30+' },
];

// Paths must match the on-disk category folders and markdown file names
// exactly (routing is case-sensitive outside Windows).
const POPULAR_TOOLS = [
  { name: 'Docker Cheatsheet', category: 'Containerization', path: '/Containerization/Docker' },
  { name: 'Kubernetes (K8s)', category: 'Containerization', path: '/Containerization/Kubernetes' },
  { name: 'Terraform IaC', category: 'Infrastructure-Management', path: '/Infrastructure-Management/Terraform' },
  { name: 'GitHub Actions', category: 'CI-CD', path: '/CI-CD/GitHub-Actions' },
  { name: 'GitHub', category: 'Version-Control', path: '/Version-Control/GitHub' },
  { name: 'Prometheus & Grafana', category: 'Monitoring', path: '/Monitoring/Prometheus' },
  { name: 'AWS CLI Reference', category: 'Cloud', path: '/Cloud/AWS' },
  { name: 'Istio Service Mesh', category: 'Networking', path: '/Networking/Istio' },
];

interface CommandMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandMenu({ open: externalOpen, onOpenChange }: CommandMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalOpen(open);
    }
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);
    window.addEventListener('open-command-menu', handleCustomOpen);
    document.addEventListener('keydown', down);

    return () => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('open-command-menu', handleCustomOpen);
    };
  }, [isOpen]);

  const handleSelect = (path: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(path);
  };

  const filteredCategories = React.useMemo(() => {
    if (!query) return QUICK_CATEGORIES;
    return QUICK_CATEGORIES.filter(cat =>
      cat.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const filteredTools = React.useMemo(() => {
    if (!query) return POPULAR_TOOLS;
    return POPULAR_TOOLS.filter(tool =>
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  // Flat list combining both sections, used for keyboard navigation
  const flatItems = React.useMemo(
    () => [
      ...filteredCategories.map(cat => ({ kind: 'category' as const, path: cat.path })),
      ...filteredTools.map(tool => ({ kind: 'tool' as const, path: tool.path })),
    ],
    [filteredCategories, filteredTools]
  );

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  React.useEffect(() => {
    if (!isOpen) return;
    const el = listRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (flatItems.length ? (i + 1) % flatItems.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (flatItems.length ? (i - 1 + flatItems.length) % flatItems.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = flatItems[activeIndex];
      if (item) {
        handleSelect(item.path);
      } else if (query.trim()) {
        handleSelect(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const categoryIndexFor = (idx: number) => idx;
  const toolIndexFor = (idx: number) => filteredCategories.length + idx;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden border-border/80 bg-background/95 backdrop-blur-2xl shadow-2xl rounded-3xl">
        <DialogHeader className="p-4 border-b border-border/50">
          <DialogTitle className="sr-only">Quick Command Search</DialogTitle>
          <div className="flex items-center gap-3 px-2">
            <Search className="w-5 h-5 text-primary shrink-0" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search DevOps commands, tools, cheat sheets..."
              className="border-0 shadow-none focus-visible:ring-0 text-base h-10 px-0 bg-transparent placeholder:text-muted-foreground/70"
              autoFocus
            />
            <Badge variant="outline" className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
              <Kbd>ESC</Kbd> to close
            </Badge>
          </div>
        </DialogHeader>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {/* Quick Categories */}
          {filteredCategories.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2 font-mono">
                <span>Categories</span>
                <span className="text-[10px] lowercase text-primary font-sans">Jump to hub</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredCategories.map((cat, idx) => {
                  const Icon = cat.icon;
                  const flatIdx = categoryIndexFor(idx);
                  const isActive = flatIdx === activeIndex;
                  return (
                    <button
                      key={cat.name}
                      data-active={isActive}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      onClick={() => handleSelect(cat.path)}
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all text-left group border cursor-pointer ${
                        isActive
                          ? 'bg-accent/60 border-border/60'
                          : 'hover:bg-accent/60 border-transparent hover:border-border/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {cat.name}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] shrink-0 font-mono">
                        {cat.count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Popular Tools / Cheatsheets */}
          {filteredTools.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2 font-mono">
                <span>Popular Cheatsheets</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              </div>
              <div className="space-y-1">
                {filteredTools.map((tool, idx) => {
                  const flatIdx = toolIndexFor(idx);
                  const isActive = flatIdx === activeIndex;
                  return (
                    <button
                      key={tool.name}
                      data-active={isActive}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      onClick={() => handleSelect(tool.path)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left group border cursor-pointer ${
                        isActive
                          ? 'bg-accent/60 border-border/60'
                          : 'hover:bg-accent/60 border-transparent hover:border-border/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
                          <Code className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {tool.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {tool.category}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {flatItems.length === 0 && (
            <div className="text-center py-10 text-sm text-muted-foreground">
              No matches for &ldquo;{query}&rdquo;. Press <Kbd>↵</Kbd> to run a full search.
            </div>
          )}
        </div>

        <div className="p-3 bg-muted/40 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground px-5">
          <div className="flex items-center gap-2">
            <CommandIcon className="w-3.5 h-3.5 text-primary" />
            <span>DevOps Command Terminal</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 font-mono text-[10px]">
            <span>Navigate: <Kbd>↑</Kbd> <Kbd>↓</Kbd></span>
            <span>Select: <Kbd>↵</Kbd></span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function triggerCommandMenu() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-command-menu'));
  }
}
