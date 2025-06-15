'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Activity, Box, Cloud, Shield, GitBranch, Server, Network, BarChart } from 'lucide-react';
import { categoryData } from '@/utils/categoryData';
import { CategoryIcon } from '@/components/CategoryIcon';
import { getAllCheatsheets, type Cheatsheet } from '@/data/cheatsheets';
import { useEffect, useState } from 'react';

// Helper function to get the icon component
const getIconComponent = (iconString: string) => {
  const iconMap = {
    '<Activity />': Activity,
    '<Box />': Box,
    '<Cloud />': Cloud,
    '<Shield />': Shield,
    '<GitBranch />': GitBranch,
    '<Server />': Server,
    '<Network />': Network,
    '<BarChart />': BarChart,
  };
  
  const IconComponent = iconMap[iconString as keyof typeof iconMap];
  return IconComponent ? <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" /> : null;
};

interface Props {
  params: {
    category: string;
  };
}

function formatCategoryName(category: string): string {
  // Special case for CI-CD
  if (category === 'CI-CD') {
    return 'CI/CD';
  }
  
  // Replace hyphens with spaces and ensure proper capitalization
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function CategoryPageClient({ params }: Props) {
  const [categoryCheatsheets, setCategoryCheatsheets] = useState<Cheatsheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheatsheets = async () => {
      try {
        const cheatsheets = await getAllCheatsheets(params.category);
        setCategoryCheatsheets(cheatsheets);
      } catch (error) {
        console.error('Error fetching cheatsheets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheatsheets();
  }, [params.category]);

  const categoryInfo = categoryData[params.category as keyof typeof categoryData];
  
  if (!categoryInfo) {
    notFound();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/20">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="mb-8 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
              <div>
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex-1">
                      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
                      <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!loading && categoryCheatsheets.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/70 flex items-center justify-center shadow-sm border border-blue-200 dark:border-blue-800">
            <CategoryIcon category={params.category as keyof typeof categoryData} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCategoryName(params.category)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {categoryInfo.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categoryCheatsheets.map((cheatsheet: Cheatsheet) => (
            <Link
              key={cheatsheet.slug}
              href={`/${params.category}/${cheatsheet.slug}`}
              className="group block"
            >
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    {getIconComponent(cheatsheet.icon)}
                  </div>

                  {/* Tool Content */}
                  <div className="flex-1 min-w-0 w-full">
                    {/* Title and Difficulty */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {cheatsheet.title}
                      </h2>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium w-fit ${
                        cheatsheet.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
                        cheatsheet.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                        'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                      }`}>
                        {cheatsheet.difficulty}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {cheatsheet.description}
                    </p>

                    {/* Tags and Action */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {cheatsheet.tags?.slice(0, 2).map((tag: string, index: number) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-xs whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 whitespace-nowrap">
                        View cheatsheet
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
} 