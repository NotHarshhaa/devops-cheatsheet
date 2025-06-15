import matter from 'gray-matter';
import path from 'path';
import fs from 'fs/promises';
import { Category, categories } from './categories';

export interface CheatsheetMeta {
  title: string;
  description: string;
  category: string;
  icon: string;
  slug: string;
}

export interface Cheatsheet extends CheatsheetMeta {
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  popularity: number;
  tags: any;
  content: string;
}

export interface PaginatedResponse {
  cheatsheets: Cheatsheet[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getCheatsheetBySlug(category: string, slug: string): Promise<Cheatsheet | null> {
  try {
    const fullPath = path.join(process.cwd(), category, `${slug}.md`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      title: data.title || slug,
      description: data.description || '',
      category: category,
      icon: data.icon || '📄',
      slug: slug,
      content,
      difficulty: data.difficulty || 'Beginner',
      popularity: data.popularity || 0,
      tags: data.tags || []
    };
  } catch (error) {
    console.error(`Error reading cheatsheet ${category}/${slug}:`, error);
    return null;
  }
}

export async function getAllCheatsheets(category = '', page = 1, limit = 10): Promise<PaginatedResponse> {
  try {
    const cheatsheets: Cheatsheet[] = [];
    const categoriesToProcess = category ? [category] : categories;

    // Process each category
    for (const cat of categoriesToProcess) {
      const categoryPath = path.join(process.cwd(), cat);
      
      try {
        const files = await fs.readdir(categoryPath);
        
        // Process each markdown file in the category
        for (const file of files) {
          if (file.endsWith('.md')) {
            const filePath = path.join(categoryPath, file);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const { data } = matter(fileContent);
            
            // Only load metadata initially, not the full content
            cheatsheets.push({
              title: data.title || '',
              description: data.description || '',
              category: cat,
              slug: file.replace('.md', ''),
              icon: data.icon || '',
              content: '', // Don't load content initially
              difficulty: data.difficulty || 'Beginner',
              popularity: data.popularity || 0,
              tags: data.tags || []
            });
          }
        }
      } catch (error) {
        console.error(`Error reading category ${cat}:`, error);
        continue;
      }
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const total = cheatsheets.length;
    const totalPages = Math.ceil(total / limit);

    return {
      cheatsheets: cheatsheets.slice(startIndex, endIndex),
      total,
      page,
      totalPages
    };
  } catch (error) {
    console.error('Error getting all cheatsheets:', error);
    return {
      cheatsheets: [],
      total: 0,
      page: 1,
      totalPages: 0
    };
  }
}

export function getCategories(): Category[] {
  return [...categories];
} 