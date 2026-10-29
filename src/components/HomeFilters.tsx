'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Shield,
  Building2
} from 'lucide-react';
import { Cheatsheet } from '@/data/cheatsheets';
import { CheatsheetIcon } from '@/components/CheatsheetIcon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type FilterType = 'popular' | 'latest' | 'getting-started' | 'trending' | 'enterprise' | 'security' | null;

interface FilterOption {
  id: FilterType;
  label: string;
  icon: JSX.Element;
  description: string;
}

const filterOptions: FilterOption[] = [
  {
    id: 'popular',
    label: 'Popular Tools',
    icon: <Star className="w-4 h-4" />,
    description: 'Most widely used DevOps tools'
  },
  {
    id: 'latest',
    label: 'Latest Updates',
    icon: <Clock className="w-4 h-4" />,
    description: 'Recently updated tools'
  },
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: <BookOpen className="w-4 h-4" />,
    description: 'Beginner-friendly tools'
  },
  {
    id: 'trending',
    label: 'Trending Now',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Trending DevOps tools'
  },
  {
    id: 'enterprise',
    label: 'Enterprise Ready',
    icon: <Building2 className="w-4 h-4" />,
    description: 'Enterprise-grade tools'
  },
  {
    id: 'security',
    label: 'Security Focus',
    icon: <Shield className="w-4 h-4" />,
    description: 'Security-focused tools'
  }
];

export function HomeFilters() {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [filteredTools, setFilteredTools] = useState<Cheatsheet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const applyFilter = async (filter: FilterType) => {
      if (!filter) {
        setFilteredTools([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/cheatsheets?limit=1000');
        const data = await response.json();
        const cheatsheets = data.cheatsheets || [];

        let filtered = [...cheatsheets];
        switch (filter) {
          case 'popular':
            filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            break;
          case 'latest':
            filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
            break;
          case 'getting-started':
            filtered = filtered.filter(tool => tool.difficulty === 'Beginner');
            break;
          case 'trending':
            filtered = filtered.filter(tool => tool.popularity > 5);
            break;
          case 'enterprise':
            filtered = filtered.filter(tool => tool.difficulty === 'Advanced');
            break;
          case 'security':
            filtered = filtered.filter(tool => tool.category === 'Security');
            break;
          default:
            filtered = [];
        }

        setFilteredTools(filtered.slice(0, 6));
      } catch (error) {
        console.error('Error fetching cheatsheets:', error);
        setFilteredTools([]);
      } finally {
        setIsLoading(false);
      }
    };

    applyFilter(activeFilter);
  }, [activeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-start">
        {filterOptions.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <Button
              key={filter.id}
              variant={isActive ? 'default' : 'secondary'}
              size="default"
              onClick={() => setActiveFilter(isActive ? null : filter.id)}
              className="gap-2 rounded-full font-medium transition-all"
            >
              {filter.icon}
              <span>{filter.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Filtered Results */}
      {activeFilter && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6)
              .fill(null)
              .map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </Card>
              ))
          ) : filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <Card
                key={tool.title}
                className="group hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <CardContent className="p-6 flex flex-col flex-1">
                  {/* Tool Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-base group-hover:scale-105 transition-transform">
                        <CheatsheetIcon icon={tool.icon} className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {tool.title}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tool Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {tool.description}
                  </p>

                  {/* Tool Metadata */}
                  <div className="space-y-3 mb-4 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span>Popularity: {tool.popularity || 'Medium'}</span>
                      </div>
                      <Badge 
                        variant={tool.difficulty === 'Beginner' ? 'secondary' : tool.difficulty === 'Advanced' ? 'destructive' : 'outline'}
                        className="text-[10px]"
                      >
                        {tool.difficulty}
                      </Badge>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {(tool.tags || []).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-[10px] font-normal"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tool Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        tool.status === 'active' ? 'bg-green-500' :
                        tool.status === 'maintenance' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></span>
                      <span className="text-xs text-muted-foreground">{tool.status || 'Active'}</span>
                    </div>
                    <Link
                      href={`/${tool.category}/${tool.slug}`}
                      className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs group/link"
                    >
                      Learn more
                      <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-12">
              No tools found for this filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
}