'use client';


import { CheatsheetTemplate } from '@/components/CheatsheetTemplate';
import { marked } from 'marked';
import { type Cheatsheet } from '@/data/cheatsheets';
import { useEffect, useState } from 'react';
import { type Category } from '@/utils/categoryData';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = typeof window === 'undefined' ? 'localhost:3000' : window.location.host;
        const baseUrl = `${protocol}://${host}`;
        
        const response = await fetch(`${baseUrl}/api/cheatsheets/${params.category}/${params.slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Cheatsheet not found');
          }
          throw new Error('Failed to fetch cheatsheet');
        }
        
        const cheatsheet = await response.json();
        
        if (!cheatsheet || !cheatsheet.content) {
          throw new Error('Invalid cheatsheet data');
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
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [params.category, params.slug]);

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

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {error === 'Cheatsheet not found' ? 'Cheatsheet not found!' : 'Something went wrong!'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {error === 'Cheatsheet not found'
              ? "We couldn&apos;t find the cheatsheet you&apos;re looking for. It might have been moved or deleted."
              : "We couldn&apos;t load the cheatsheet you requested. Please try again later."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Go back home
            </Link>
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