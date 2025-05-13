'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  TrendingUp,
  Award,
  Shield,
  Building2,
  Code
} from 'lucide-react';
import { Cheatsheet, getAllCheatsheets } from '@/data/cheatsheets';

type FilterType = 'popular' | 'latest' | 'getting-started' | 'trending' | 'enterprise' | 'security' | null;

interface FilterOption {
  id: FilterType;
  label: string;
  icon: JSX.Element;
  bgColor: string;
  activeColor: string;
  textColor: string;
  description: string;
}

const filterOptions: FilterOption[] = [
  {
    id: 'popular',
    label: 'Popular Tools',
    icon: <Star className="w-5 h-5" />,
    bgColor: 'bg-blue-50',
    activeColor: 'bg-blue-600',
    textColor: 'text-blue-600',
    description: 'Most widely used DevOps tools'
  },
  {
    id: 'latest',
    label: 'Latest Updates',
    icon: <Clock className="w-5 h-5" />,
    bgColor: 'bg-purple-50',
    activeColor: 'bg-purple-600',
    textColor: 'text-purple-600',
    description: 'Recently updated tools'
  },
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: <BookOpen className="w-5 h-5" />,
    bgColor: 'bg-green-50',
    activeColor: 'bg-green-600',
    textColor: 'text-green-600',
    description: 'Beginner-friendly tools'
  },
  {
    id: 'trending',
    label: 'Trending Now',
    icon: <TrendingUp className="w-5 h-5" />,
    bgColor: 'bg-orange-50',
    activeColor: 'bg-orange-600',
    textColor: 'text-orange-600',
    description: 'Trending DevOps tools'
  },
  {
    id: 'enterprise',
    label: 'Enterprise Ready',
    icon: <Building2 className="w-5 h-5" />,
    bgColor: 'bg-indigo-50',
    activeColor: 'bg-indigo-600',
    textColor: 'text-indigo-600',
    description: 'Enterprise-grade tools'
  },
  {
    id: 'security',
    label: 'Security Focus',
    icon: <Shield className="w-5 h-5" />,
    bgColor: 'bg-red-50',
    activeColor: 'bg-red-600',
    textColor: 'text-red-600',
    description: 'Security-focused tools'
  }
];

export function HomeFilters() {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [filteredTools, setFilteredTools] = useState<Cheatsheet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterClick = async (filter: FilterType) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
      setFilteredTools([]);
      return;
    }

    setIsLoading(true);
    setActiveFilter(filter);
    const cheatsheets = await getAllCheatsheets();
    
    switch (filter) {
      case 'popular':
        setFilteredTools(cheatsheets.sort((a, b) => b.popularity - a.popularity).slice(0, 6));
        break;
      case 'latest':
        setFilteredTools(cheatsheets.slice(0, 6));
        break;
      case 'getting-started':
        setFilteredTools(cheatsheets.filter(tool => tool.difficulty === 'Beginner').slice(0, 6));
        break;
      case 'trending':
        setFilteredTools(cheatsheets.sort(() => Math.random() - 0.5).slice(0, 6));
        break;
      case 'enterprise':
        setFilteredTools(cheatsheets.filter(tool => tool.difficulty === 'Advanced').slice(0, 6));
        break;
      case 'security':
        setFilteredTools(cheatsheets.filter(tool => tool.category === 'Security').slice(0, 6));
        break;
      default:
        setFilteredTools([]);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filter Buttons - Mobile Friendly */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:flex-wrap sm:space-y-0 sm:gap-3">
        {filterOptions.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`
              flex items-center gap-2 px-4 py-3 sm:py-2 rounded-full
              transition-all duration-200 ease-in-out
              ${filter.bgColor} ${filter.textColor}
              ${activeFilter === filter.id ? `${filter.activeColor} text-white` : ''}
              text-sm font-medium
              hover:opacity-90 active:scale-95
              w-full sm:w-auto
              justify-start
            `}
          >
            <span className="flex items-center justify-center w-8 h-8 sm:w-5 sm:h-5">
              {filter.icon}
            </span>
            <span className="flex-1 sm:flex-initial">{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Updated Filtered Results */}
      {isLoading ? (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : filteredTools.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.title}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              {/* Tool Header with Icon and Category */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                    {tool.icon || <Code className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {tool.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {tool.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tool Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {tool.description}
              </p>

              {/* Tool Metadata */}
              <div className="space-y-3 mb-4">
                {/* Popularity and Difficulty */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      Popularity: {tool.popularity || 'Medium'}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tool.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    tool.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tool.difficulty}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {(tool.tags || []).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tool Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    tool.status === 'active' ? 'bg-green-500' :
                    tool.status === 'maintenance' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}></span>
                  <span className="text-sm text-gray-500">{tool.status || 'Active'}</span>
                </div>
                <Link
                  href={`/${tool.category.toLowerCase()}/${tool.slug}`}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm group"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
} 