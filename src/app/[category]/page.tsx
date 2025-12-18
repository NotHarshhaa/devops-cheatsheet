import { CategoryPageClient } from './CategoryPageClient';
import { categories } from "@/utils/categoryData";

export function generateStaticParams(): Promise<any> | any {
  return categories.map((category) => ({
    category: category,
  }));
}

export default async function CategoryPage({ params }: any) {
  const resolvedParams = await params;

  // If the category is 404, show the NotFound component
  if (resolvedParams.category === '404') {
    return null; // This will trigger the not-found.tsx page
  }
  return <CategoryPageClient params={resolvedParams} />;
}