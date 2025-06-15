import { getAllCheatsheets } from '@/utils/markdown';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || '';

    const cheatsheets = await getAllCheatsheets(category, page, limit);
    return NextResponse.json(cheatsheets);
  } catch (error) {
    console.error('Error fetching cheatsheets:', error);
    return NextResponse.json({ error: 'Failed to fetch cheatsheets' }, { status: 500 });
  }
} 