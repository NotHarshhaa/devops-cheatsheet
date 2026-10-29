import { NextResponse } from 'next/server';
import { cheatsheets } from '@/data/cheatsheets';

// Query params are evaluated per request
export const dynamic = 'force-dynamic';

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