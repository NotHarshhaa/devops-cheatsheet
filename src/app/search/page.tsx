'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, Loader2, Tag, Star, BarChart2 } from 'lucide-react';
import { Cheatsheet, getAllCheatsheets } from '@/data/cheatsheets';

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase() ? 
      <span key={index} className="bg-yellow-200 dark:bg-yellow-800 text-gray-900 dark:text-white rounded px-0.5">{part}</span> : 
      part
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Cheatsheet['difficulty'] }) {
  const colors = {
    Beginner: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[difficulty]}`}>
      {difficulty}
    </span>
  );
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cheatsheets, setCheatsheets] = useState<Cheatsheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadCheatsheets = async () => {
      try {
        const data = await getAllCheatsheets();
        setCheatsheets(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading cheatsheets:', error);
        setCheatsheets([]);
        setIsLoading(false);
      }
    };

    loadCheatsheets();
  }, []);

  const categories = useMemo(() => 
    Array.from(new Set(cheatsheets.map(sheet => sheet.category))),
    [cheatsheets]
  );

  const filteredCheatsheets = useMemo(() => {
    return cheatsheets.filter(cheatsheet => {
      const matchesSearch = searchTerm.trim() === '' || 
        `${cheatsheet.title} ${cheatsheet.description} ${cheatsheet.category}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(cheatsheet.category);

      return matchesSearch && matchesCategory;
    });
  }, [cheatsheets, searchTerm, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Search DevOps Tools
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find the tools and resources you need from our comprehensive collection.
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for tools, categories, or keywords..."
              className="w-full px-6 py-4 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-14 bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:placeholder-gray-400"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <SearchIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedCategories.includes(category)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {category.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 dark:text-blue-400 animate-spin mx-auto" />
              <p className="text-gray-600 dark:text-gray-400 mt-4">Loading results...</p>
            </div>
          ) : filteredCheatsheets.length > 0 ? (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Found {filteredCheatsheets.length} results
                {searchTerm && ` for "${searchTerm}"`}
              </p>
              {filteredCheatsheets.map((cheatsheet) => (
                <Link
                  key={`${cheatsheet.category}-${cheatsheet.slug}`}
                  href={`/${cheatsheet.category}/${cheatsheet.slug}`}
                  className="block bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-2xl">
                      {cheatsheet.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {highlightText(cheatsheet.title, searchTerm)}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {highlightText(cheatsheet.description, searchTerm)}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Tag className="w-4 h-4" />
                          {cheatsheet.category.replace(/-/g, ' ')}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Star className="w-4 h-4" />
                          {cheatsheet.popularity}% Popular
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <DifficultyBadge difficulty={cheatsheet.difficulty} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No results found for "{searchTerm}"</p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">Try different keywords or browse our categories</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 