'use client';

import { Search, Terminal, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { triggerCommandMenu } from './CommandMenu';

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      triggerCommandMenu();
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
      
      <div className="relative flex items-center bg-background/90 dark:bg-gray-950/90 backdrop-blur-2xl border border-border/80 group-hover:border-primary/50 rounded-2xl p-1.5 shadow-2xl transition-all">
        <div className="pl-3.5 pr-2 text-primary flex items-center shrink-0">
          <Terminal className="w-5 h-5 text-cyan-500" />
        </div>

        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 200+ DevOps tools, commands, Docker, K8s, Terraform..."
          className="h-12 border-0 shadow-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground/70 bg-transparent text-sm sm:text-base font-medium px-1"
        />

        <div className="flex items-center gap-1.5 pr-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={triggerCommandMenu}
            className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-mono h-8 px-2 rounded-xl"
          >
            <Kbd>⌘K</Kbd>
          </Button>

          <Button
            type="submit"
            size="sm"
            className="h-9 px-4 rounded-xl font-medium gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-md cursor-pointer border-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </div>
    </form>
  );
}