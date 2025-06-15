import matter from 'gray-matter';
import path from 'path';
import fs from 'fs/promises';
import { Category, categories } from './categoryData';

export interface CheatsheetMeta {
  title: string;
  description: string;
  category: Category;
  icon: string;
  slug: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  popularity: number;
  tags: string[];
  updatedAt: string;
}

export interface Cheatsheet extends CheatsheetMeta {
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
    // If the category is '404', return null to trigger the not-found page
    if (category === '404' || slug === '404') {
      return null;
    }

    const fullPath = path.join(process.cwd(), category, `${slug}.md`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    
    // Parse frontmatter if it exists, otherwise use the whole content
    const { data = {}, content } = matter(fileContents);

    // If there's no frontmatter, assume the first line is the title
    const firstLine = content.split('\n')[0].replace(/^#\s*/, '');

    return {
      title: data.title || firstLine || slug,
      description: data.description || 'A comprehensive guide and cheatsheet',
      category: category as Category,
      icon: data.icon || '📄',
      slug: slug,
      content: content,
      difficulty: data.difficulty || 'Beginner',
      popularity: data.popularity || 95,
      tags: data.tags || [category],
      updatedAt: data.updatedAt || new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error reading cheatsheet ${category}/${slug}:`, error);
    return null;
  }
}

export async function getAllCheatsheets(category: string | '' = '', page = 1, limit = 10): Promise<PaginatedResponse> {
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
            const { data = {}, content } = matter(fileContent);
            
            // If there's no frontmatter, assume the first line is the title
            const firstLine = content.split('\n')[0].replace(/^#\s*/, '');
            
            cheatsheets.push({
              title: data.title || firstLine || file.replace('.md', ''),
              description: data.description || 'A comprehensive guide and cheatsheet',
              category: cat as Category,
              slug: file.replace('.md', ''),
              icon: data.icon || '📄',
              content: content,
              difficulty: data.difficulty || 'Beginner',
              popularity: data.popularity || 95,
              tags: data.tags || [cat],
              updatedAt: data.updatedAt || new Date().toISOString()
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