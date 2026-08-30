'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, 
  Activity, 
  Box, 
  Cloud, 
  Shield, 
  GitBranch, 
  Server, 
  Network, 
  BarChart, 
  Terminal, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { categoryData } from '@/utils/categoryData';
import { CategoryIcon } from '@/components/CategoryIcon';
import { getAllCheatsheets, type Cheatsheet } from '@/data/cheatsheets';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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
  return IconComponent ? <IconComponent className="w-6 h-6 text-primary" /> : <Terminal className="w-6 h-6 text-primary" />;
};

interface Props {
  params: {
    category: string;
  };
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
      <div className="min-h-screen bg-background text-foreground py-12">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-60 rounded-lg" />
                <Skeleton className="h-4 w-96 rounded-md" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-40 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-2/3 rounded" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!loading && categoryCheatsheets.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 sm:py-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* High-Tech Category Hero HUD */}
        <Card className="rounded-3xl border-border/80 shadow-xl overflow-hidden mb-12 bg-card/70 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <CardContent className="p-6 sm:p-10 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                <CategoryIcon category={params.category as keyof typeof categoryData} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-primary font-semibold">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>ARCHITECTURE HUB</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-mono mb-2">
                  {formatCategoryName(params.category)}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {categoryInfo.description}
                </p>
              </div>
              <Badge variant="secondary" className="font-mono text-xs font-semibold px-3 py-1.5 shrink-0 self-start sm:self-center">
                {categoryCheatsheets.length} Verified Cheatsheets
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cheatsheets List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categoryCheatsheets.map((cheatsheet: Cheatsheet) => (
            <Link
              key={cheatsheet.slug}
              href={`/${params.category}/${cheatsheet.slug}`}
              className="group block"
            >
              <Card className="h-full rounded-2xl border-border/80 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden">
                <CardContent className="p-6 sm:p-7 flex flex-col justify-between h-full">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Tool Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                      {getIconComponent(cheatsheet.icon)}
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