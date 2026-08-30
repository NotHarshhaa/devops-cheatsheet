'use client';

import { ArrowRight } from 'lucide-react';
import { CategoryActions } from '@/components/CategoryActions';
import { Button } from '@/components/ui/button';

interface ExploreButtonProps {
  category: string;
}

export function ExploreButton({ category }: ExploreButtonProps) {
  return (
    <div className="flex items-center justify-between relative z-10">
      <Button
        variant="secondary"
        size="sm"
        className="group gap-2 font-medium"
        onClick={(e) => e.stopPropagation()}
      >
        <span>Explore tools</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
      </Button>

      {/* Quick Actions */}
      <CategoryActions category={category} />
    </div>
  );
}