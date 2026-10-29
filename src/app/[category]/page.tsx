import { notFound } from 'next/navigation';
import { CategoryPageClient } from './CategoryPageClient';
import { categories, categoryData, type Category } from '@/utils/categoryData';
import { getAllCheatsheets } from '@/utils/markdown';

export function generateStaticParams() {
  return categories.map((category) => ({
    category: category,
  }));
}

// All valid categories are prerendered; anything else is a genuine 404.
export const dynamicParams = false;

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryInfo = categoryData[category as keyof typeof categoryData];

  if (!categoryInfo) {
    notFound();
  }

  const { cheatsheets } = await getAllCheatsheets(category, 1, 1000);

  return (
    <CategoryPageClient
      category={category as Category}
      description={categoryInfo.description}
      cheatsheets={cheatsheets.map(({ content: _content, ...meta }) => meta)}
    />
  );
}
