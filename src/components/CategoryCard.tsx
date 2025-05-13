'use client';

import Link from 'next/link';
import { Book, Users } from 'lucide-react';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  toolCount: number;
  category: string;
}

export function CategoryCard({ icon, title, description, toolCount, category }: CategoryCardProps) {
  const href = `/${category}`;

  return (
    <Link href={href} className="block">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 dark:border-gray-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-2xl">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                {title}
              </h2>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                <Book className="w-4 h-4" />
                {toolCount} Tools
              </div>
            </div>
            <p className="mt-1 text-gray-600 dark:text-gray-400 line-clamp-2">{description}</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span className="text-sm">Active Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 