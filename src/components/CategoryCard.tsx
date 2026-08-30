'use client';

import Link from 'next/link';
import { Book, Users } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
import { Category } from '@/utils/categoryData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CategoryCardProps {
  title: string;
  description: string;
  toolCount: number;
  category: Category;
}

export function CategoryCard({ title, description, toolCount, category }: CategoryCardProps) {
  const href = `/${category}`;

  return (
    <Link href={href} className="block group">
      <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/40">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              <CategoryIcon category={category} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-xl font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {title}
                </h2>
                <Badge variant="secondary" className="gap-1 font-medium shrink-0">
                  <Book className="w-3.5 h-3.5" />
                  {toolCount} Tools
                </Badge>
              </div>
              <p className="mt-2 text-muted-foreground line-clamp-2 text-sm">{description}</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                  <Users className="w-3.5 h-3.5" />
                  <span>Active Community</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}