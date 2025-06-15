'use client';

import { ArrowRight } from 'lucide-react';
import { CategoryActions } from '@/components/CategoryActions';

interface ExploreButtonProps {
  category: string;
}

export function ExploreButton({ category }: ExploreButtonProps) {
  return (
    <div className="flex items-center justify-between relative z-10">
      <div
        className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/70 transition-all duration-300 border border-blue-200 dark:border-blue-800"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-medium">Explore tools</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>

      {/* Quick Actions */}
      <CategoryActions category={category} />
    </div>
  );
} 