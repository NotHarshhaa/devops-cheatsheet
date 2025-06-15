import { getCheatsheetBySlug } from '@/utils/markdown';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; slug: string } }
) {
  try {
    const { category, slug } = params;
    const cheatsheet = await getCheatsheetBySlug(category, slug);

    if (!cheatsheet) {
      return NextResponse.json(
        { error: 'Cheatsheet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(cheatsheet);
  } catch (error) {
    console.error('Error fetching cheatsheet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cheatsheet' },
      { status: 500 }
    );
  }
} 