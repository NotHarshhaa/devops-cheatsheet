'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Cheatsheet } from '@/utils/markdown';
import { useEffect } from 'react';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cheatsheets, setCheatsheets] = useState<Cheatsheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCheatsheets() {
      try {
        const response = await fetch('/api/cheatsheets');
        if (!response.ok) {
          throw new Error('Failed to fetch cheatsheets');
        }
        const data = await response.json();
        setCheatsheets(data);
      } catch (error) {
        console.error('Error fetching cheatsheets:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCheatsheets();
  }, []);

  const filteredCheatsheets = cheatsheets.filter(cheatsheet => {
    const searchContent = `${cheatsheet.title} ${cheatsheet.description} ${cheatsheet.category}`.toLowerCase();
    return searchContent.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Search Cheatsheets
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title, description, or category..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCheatsheets.map((cheatsheet) => (
          <Link
            key={`${cheatsheet.category}/${cheatsheet.slug}`}
            href={`/${cheatsheet.category}/${cheatsheet.slug}`}
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
          >
            <div className="text-2xl mb-2">{cheatsheet.icon}</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {cheatsheet.title}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              {cheatsheet.description}
            </p>
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              {cheatsheet.category}
            </span>
          </Link>
        ))}
      </div>

      {filteredCheatsheets.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No cheatsheets found matching your search.
          </p>
        </div>
      )}
    </div>
  );
} 