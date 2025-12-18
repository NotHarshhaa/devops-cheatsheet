import { getCheatsheetBySlug } from '@/utils/markdown';
import { NextRequest, NextResponse } from 'next/server';
import { categoryData } from '@/utils/categoryData';
import { getAllCheatsheets } from '@/data/cheatsheets';

export async function generateStaticParams() {
  // Get all categories
  const categories = Object.keys(categoryData);
  
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

export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const { category, slug } = context.params;
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