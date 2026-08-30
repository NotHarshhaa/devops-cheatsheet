'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative flex items-center">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tools, practices, or resources..."
        className="h-14 pl-6 pr-14 rounded-full bg-white/10 dark:bg-black/20 border-white/20 text-white placeholder:text-blue-100 dark:placeholder:text-blue-200 focus-visible:ring-white/50 dark:focus-visible:ring-blue-400/50 backdrop-blur-md text-base"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="absolute right-2 text-white hover:bg-white/20 hover:text-white rounded-full size-10"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </Button>
    </form>
  );
}