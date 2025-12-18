import { Metadata } from 'next';
import { getCheatsheetBySlug } from '@/utils/markdown';
import { categoryData, type Category } from '@/utils/categoryData';
import { getAllCheatsheets } from '@/data/cheatsheets';
import { CheatsheetPageClient } from './CheatsheetPageClient';

type RouteParams = {
  category: string;
  slug: string;
};

async function resolveParams(
  paramsOrPromise: RouteParams | Promise<RouteParams>
): Promise<RouteParams> {
  return await paramsOrPromise;
}

export async function generateMetadata({
  params,
}: {
  params: RouteParams | Promise<RouteParams>;
}): Promise<Metadata> {
  const resolved = await resolveParams(params);
  const cheatsheet = await getCheatsheetBySlug(
    resolved.category as Category,
    resolved.slug
  );
  if (!cheatsheet) return {};

  return {
    title: `${cheatsheet.title} | DevOps Cheatsheet`,
    description: cheatsheet.description,
  };
}

export async function generateStaticParams(): Promise<RouteParams[]> {
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
  
  // Flatten the array of arrays into a single array of params
  return params.flat();
}

export default async function CheatsheetPage({
  params,
}: {
  params: RouteParams | Promise<RouteParams>;
}) {
  const resolved = await resolveParams(params);

  // Cast the category to Category type since we know it's valid from generateStaticParams
  const safeParams: RouteParams & { category: Category } = {
    ...resolved,
    category: resolved.category as Category,
  };

  return <CheatsheetPageClient params={safeParams} />;
} 