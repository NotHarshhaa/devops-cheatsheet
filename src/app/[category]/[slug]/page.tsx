import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCheatsheetBySlug } from '@/utils/markdown';
import { CheatsheetTemplate } from '@/components/CheatsheetTemplate';
import { marked } from 'marked';

interface Props {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cheatsheet = await getCheatsheetBySlug(params.category, params.slug);
  if (!cheatsheet) return {};

  return {
    title: `${cheatsheet.title} | DevOps Cheatsheet`,
    description: cheatsheet.description,
  };
}

export default async function CheatsheetPage({ params }: Props) {
  const cheatsheet = await getCheatsheetBySlug(params.category, params.slug);
  
  if (!cheatsheet) {
    notFound();
  }

  const parsedContent = await marked(cheatsheet.content);

  const sections = [
    {
      id: 'content',
      title: 'Content',
      type: 'text' as const,
      content: [
        {
          type: 'text' as const,
          value: parsedContent
        }
      ]
    }
  ];

  return (
    <CheatsheetTemplate
      title={cheatsheet.title}
      category={cheatsheet.category}
      icon={cheatsheet.icon}
      description={cheatsheet.description}
      difficulty={cheatsheet.difficulty}
      readingTime="5 min read"
      popularity={cheatsheet.popularity}
      sections={sections}
    />
  );
} 