'use client';

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tools, practices, or resources..."
        className="w-full px-6 py-4 rounded-full bg-white/10 dark:bg-black/20 border border-white/20 text-white placeholder-blue-100 dark:placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-blue-400/50"
      />
      <button 
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 dark:hover:bg-blue-400/10 rounded-full transition-colors"
      >
        <Search className="w-6 h-6 text-white" />
      </button>
    </form>
  )
} 