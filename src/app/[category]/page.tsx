import { categoryData } from '@/utils/categoryData';
import { CategoryPageClient } from './CategoryPageClient';
import { categories } from "@/utils/categoryData";

interface Props {
  params: {
    category: string;
  };
}

export function generateStaticParams() {
  return categories.map((category) => ({
    category: category,
  }));
}

export default function CategoryPage({ params }: Props) {
  // If the category is 404, show the NotFound component
  if (params.category === '404') {
    return null; // This will trigger the not-found.tsx page
  }
  return <CategoryPageClient params={params} />;
}