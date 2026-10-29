import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { getCheatsheetBySlug, getAllCheatsheets } from '@/utils/markdown';
import { categoryData, type Category } from '@/utils/categoryData';
import { CheatsheetPageClient } from './CheatsheetPageClient';

type RouteParams = {
  category: string;
  slug: string;
};

export async function generateMetadata({
  params,
}: {
  params: RouteParams | Promise<RouteParams>;
}): Promise<Metadata> {
  const resolved = await params;
  const cheatsheet = await getCheatsheetBySlug(resolved.category, resolved.slug);
  if (!cheatsheet) return {};

  return {
    title: `${cheatsheet.title} | DevOps Cheatsheet`,
    description: cheatsheet.description,
  };
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const { cheatsheets } = await getAllCheatsheets('', 1, 1000);
  return cheatsheets.map((cheatsheet) => ({
    category: cheatsheet.category,
    slug: cheatsheet.slug,
  }));
}

// Every cheatsheet is prerendered; anything else is a genuine 404.
export const dynamicParams = false;

export default async function CheatsheetPage({
  params,
}: {
  params: RouteParams | Promise<RouteParams>;
}) {
  const resolved = await params;
  const cheatsheet = await getCheatsheetBySlug(resolved.category, resolved.slug);

  if (!cheatsheet || !(cheatsheet.category in categoryData)) {
    notFound();
  }

  const parsedContent = await marked.parse(cheatsheet.content, { async: false });
  const words = cheatsheet.content.trim().split(/\s+/).length;
  const readingTime = `${Math.max(1, Math.round(words / 200))} min read`;

  return (
    <CheatsheetPageClient
      category={cheatsheet.category as Category}
      slug={cheatsheet.slug}
      title={cheatsheet.title}
      icon={cheatsheet.icon}
      description={cheatsheet.description}
      difficulty={cheatsheet.difficulty}
      popularity={cheatsheet.popularity}
      parsedContent={DOMPurify.sanitize(parsedContent)}
      rawMarkdown={cheatsheet.content}
      readingTime={readingTime}
    />
  );
}
