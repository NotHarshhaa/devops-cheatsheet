'use client';

import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';
import { CategoryIcon } from '@/components/CategoryIcon';
import { CheatsheetIcon } from '@/components/CheatsheetIcon';
import { type Category } from '@/utils/categoryData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CheatsheetListItem {
  title: string;
  description: string;
  category: string;
  icon: string;
  slug: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  popularity: number;
  tags: string[];
}

interface Props {
  category: Category;
  description: string;
  cheatsheets: CheatsheetListItem[];
}

function formatCategoryName(category: string): string {
  if (category === 'CI-CD') {
    return 'CI/CD';
  }
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function CategoryPageClient({ category, description, cheatsheets }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground py-10 sm:py-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* High-Tech Category Hero HUD */}
        <Card className="rounded-3xl border-border/80 shadow-xl overflow-hidden mb-12 bg-card/70 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <CardContent className="p-6 sm:p-10 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                <CategoryIcon category={category} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-primary font-semibold">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>ARCHITECTURE HUB</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-mono mb-2">
                  {formatCategoryName(category)}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {description}
                </p>
              </div>
              <Badge variant="secondary" className="font-mono text-xs font-semibold px-3 py-1.5 shrink-0 self-start sm:self-center">
                {cheatsheets.length} Verified Cheatsheets
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cheatsheets List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cheatsheets.map((cheatsheet) => (
            <Link
              key={cheatsheet.slug}
              href={`/${category}/${cheatsheet.slug}`}
              className="group block"
            >
              <Card className="h-full rounded-2xl border-border/80 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden">
                <CardContent className="p-6 sm:p-7 flex flex-col justify-between h-full">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Tool Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                      <CheatsheetIcon icon={cheatsheet.icon} className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h2 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {cheatsheet.title}
                        </h2>
                        <Badge
                          variant={
                            cheatsheet.difficulty === 'Beginner'
                              ? 'secondary'
                              : cheatsheet.difficulty === 'Advanced'
                              ? 'destructive'
                              : 'outline'
                          }
                          className="font-mono text-[10px] shrink-0"
                        >
                          {cheatsheet.difficulty}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                        {cheatsheet.description}
                      </p>
                    </div>
                  </div>

                  {/* Tags and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/60 mt-auto">
                    <div className="flex flex-wrap gap-1.5">
                      {cheatsheet.tags?.slice(0, 3).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-secondary/80 text-secondary-foreground rounded-md text-[11px] font-mono border border-border/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-primary text-xs font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0">
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
