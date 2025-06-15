import { NextResponse } from 'next/server';
import { cheatsheets } from '@/data/cheatsheets';
import { categoryData } from '@/utils/categoryData';

// For static export, we need to generate all possible combinations of query parameters
export async function generateStaticParams() {
  const categories = ['', ...Object.keys(categoryData)];
  const limits = [10, 20, 50, 100, 1000]; // Common page size limits
  const pages = [1, 2, 3, 4, 5]; // First 5 pages

  const params = [];
  for (const category of categories) {
    for (const limit of limits) {
      for (const page of pages) {
        params.push({
          searchParams: new URLSearchParams({
            ...(category && { category }),
            limit: limit.toString(),
            page: page.toString(),
          }).toString(),
        });
      }
    }
  }

  return params;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const page = parseInt(searchParams.get('page') || '1');
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  let filteredCheatsheets = [...cheatsheets];

  // Apply category filter if category exists
  if (category) {
    filteredCheatsheets = filteredCheatsheets.filter(cheatsheet => 
      cheatsheet.category === category
    );
  }

  // Apply search filter if query exists
  if (query) {
    filteredCheatsheets = filteredCheatsheets.filter(cheatsheet => 
      cheatsheet.title.toLowerCase().includes(query.toLowerCase()) ||
      cheatsheet.description.toLowerCase().includes(query.toLowerCase()) ||
      cheatsheet.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Calculate pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedCheatsheets = filteredCheatsheets.slice(start, end);

  return NextResponse.json({
    cheatsheets: paginatedCheatsheets,
    total: filteredCheatsheets.length,
    page,
    limit,
    totalPages: Math.ceil(filteredCheatsheets.length / limit)
  });
} 