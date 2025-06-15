'use client';

import { useRouter } from 'next/navigation';
import { CheatsheetTemplate } from '@/components/CheatsheetTemplate';
import { marked } from 'marked';
import { type Cheatsheet } from '@/data/cheatsheets';
import { useEffect, useState } from 'react';
import { type Category } from '@/utils/categoryData';

interface Props {
  params: {
    category: string;
    slug: string;
  };
}

type CheatsheetContent = {
  title: string;
  category: Category;
  icon: string;
  description: string;
  difficulty: Cheatsheet['difficulty'];
  popularity: number;
  parsedContent: string;
};

export function CheatsheetPageClient({ params }: Props) {
  const [content, setContent] = useState<CheatsheetContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = typeof window === 'undefined' ? 'localhost:3000' : window.location.host;
        const baseUrl = `${protocol}://${host}`;
        
        const response = await fetch(`${baseUrl}/api/cheatsheets/${params.category}/${params.slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch cheatsheet');
        }
        
        const cheatsheet = await response.json();
        
        if (!cheatsheet || !cheatsheet.content) {
          setError(true);
          return;
        }

        const parsedContent = await marked(cheatsheet.content);
        
        setContent({
          title: cheatsheet.title,
          category: cheatsheet.category as Category,
          icon: cheatsheet.icon,
          description: cheatsheet.description,
          difficulty: cheatsheet.difficulty,
          popularity: cheatsheet.popularity,
          parsedContent,
        });
      } catch (error) {
        console.error('Error fetching cheatsheet:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [params.category, params.slug]);

  useEffect(() => {
    if (error) {
      router.push('/404');
    }
  }, [error, router]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  const sections = [
    {
      id: 'content',
      title: 'Content',
      type: 'text' as const,
      content: [
        {
          type: 'text' as const,
          value: content.parsedContent
        }
      ]
    }
  ];

  return (
    <CheatsheetTemplate
      title={content.title}
      category={content.category}
      icon={content.icon}
      description={content.description}
      difficulty={content.difficulty}
      readingTime="5 min read"
      popularity={content.popularity}
      sections={sections}
    />
  );
} 