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

const POPULAR_TOOLS = [
  { name: 'Docker Cheatsheet', category: 'Containerization', path: '/containerization/docker' },
  { name: 'Kubernetes (K8s)', category: 'Containerization', path: '/containerization/kubernetes' },
  { name: 'Terraform IaC', category: 'Infrastructure-Management', path: '/infrastructure-management/terraform' },
  { name: 'GitHub Actions', category: 'CI-CD', path: '/ci-cd/github-actions' },
  { name: 'Git Workflow', category: 'Version-Control', path: '/version-control/git' },
  { name: 'Prometheus & Grafana', category: 'Monitoring', path: '/monitoring/prometheus' },
  { name: 'AWS CLI Reference', category: 'Cloud', path: '/cloud/aws' },
  { name: 'Linux Networking', category: 'Networking', path: '/networking/linux-networking' },
];

interface CommandMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandMenu({ open: externalOpen, onOpenChange }: CommandMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden border-border/80 bg-background/95 backdrop-blur-2xl shadow-2xl rounded-3xl">
        <DialogHeader className="p-4 border-b border-border/50">
          <DialogTitle className="sr-only">Quick Command Search</DialogTitle>
          <div className="flex items-center gap-3 px-2">
            <Search className="w-5 h-5 text-primary shrink-0 animate-pulse" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search DevOps commands, tools, cheat sheets..."
              className="border-0 shadow-none focus-visible:ring-0 text-base h-10 px-0 bg-transparent placeholder:text-muted-foreground/70"
              autoFocus
            />
            <Badge variant="outline" className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
              <Kbd>ESC</Kbd> to close
            </Badge>
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {/* Quick Categories */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2 font-mono">
              <span>Categories</span>
              <span className="text-[10px] lowercase text-primary font-sans">Jump to hub</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleSelect(cat.path)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-accent/60 transition-all text-left group border border-transparent hover:border-border/60 cursor-pointer"
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

          {/* Popular Tools / Cheatsheets */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2 font-mono">
              <span>Popular Cheatsheets</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            </div>
            <div className="space-y-1">
              {filteredTools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => handleSelect(tool.path)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-accent/60 transition-all text-left group border border-transparent hover:border-border/60 cursor-pointer"
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
              ))}
            </div>
          </div>
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
