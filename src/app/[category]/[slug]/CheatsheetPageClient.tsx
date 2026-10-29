'use client';

import { CheatsheetTemplate } from '@/components/CheatsheetTemplate';
import { type Category } from '@/utils/categoryData';

interface CheatsheetPageClientProps {
  category: Category;
  slug: string;
  title: string;
  icon: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  popularity: number;
  /** Content already rendered to sanitized HTML on the server */
  parsedContent: string;
  /** Raw markdown, used for the "Download .md" action */
  rawMarkdown: string;
  readingTime: string;
}

export function CheatsheetPageClient({
  category,
  slug,
  title,
  icon,
  description,
  difficulty,
  popularity,
  parsedContent,
  rawMarkdown,
  readingTime,
}: CheatsheetPageClientProps) {
  const sections = [
    {
      id: 'content',
      title: 'Content',
      type: 'text' as const,
      content: [
        {
          type: 'text' as const,
          value: parsedContent,
        },
      ],
    },
  ];

  return (
    <CheatsheetTemplate
      title={title}
      category={category}
      slug={slug}
      icon={icon}
      description={description}
      difficulty={difficulty}
      readingTime={readingTime}
      popularity={popularity}
      rawMarkdown={rawMarkdown}
      sections={sections}
    />
  );
}
