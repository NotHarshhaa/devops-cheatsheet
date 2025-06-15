import { Metadata } from 'next';
import { getCheatsheetBySlug } from '@/utils/markdown';
import { categoryData, type Category } from '@/utils/categoryData';
import { getAllCheatsheets } from '@/data/cheatsheets';
import { CheatsheetPageClient } from './CheatsheetPageClient';

interface Props {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cheatsheet = await getCheatsheetBySlug(params.category as Category, params.slug);
  if (!cheatsheet) return {};

  return {
    title: `${cheatsheet.title} | DevOps Cheatsheet`,
    description: cheatsheet.description,
  };
}

export async function generateStaticParams() {
  // Get all categories
  const categories = Object.keys(categoryData) as Category[];
  
  // For each category, get all cheatsheets
  const params = await Promise.all(
    categories.map(async (category) => {
      const cheatsheets = await getAllCheatsheets(category);
      // Map each cheatsheet to its params
      return cheatsheets.map((cheatsheet) => ({
        category: category,
        slug: cheatsheet.slug,
      }));
    })
  );
  
  // Flatten the array of arrays into a single array of params and add the 404 route
  return [
    ...params.flat(),
    {
      category: '404',
      slug: '404',
    },
  ];
}

export default function CheatsheetPage({ params }: Props) {
  // If this is the 404 route, return null to trigger the not-found page
  if (params.category === '404' || params.slug === '404') {
    return null;
  }
  
  // Cast the category to Category type since we know it's valid from generateStaticParams
  return <CheatsheetPageClient params={{ ...params, category: params.category as Category }} />;
} 