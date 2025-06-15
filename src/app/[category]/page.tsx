import { categoryData } from '@/utils/categoryData';
import { CategoryPageClient } from './CategoryPageClient';

interface Props {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  // Include both the category paths and the 404 path
  const paths = [
    ...Object.keys(categoryData).map((category) => ({
      category: category,
    })),
    {
      category: '404',
    },
  ];
  return paths;
}

export default function CategoryPage({ params }: Props) {
  // If the category is 404, show the NotFound component
  if (params.category === '404') {
    return null; // This will trigger the not-found.tsx page
  }
  return <CategoryPageClient params={params} />;
}