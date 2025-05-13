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

export async function getAllCheatsheets(): Promise<Cheatsheet[]> {
  try {
    const cheatsheets: Cheatsheet[] = [];

    // Process each category
    for (const category of categories) {
      const categoryPath = path.join(process.cwd(), category);
      
      try {
        const files = await fs.readdir(categoryPath);
        
        // Process each markdown file in the category
        for (const file of files) {
          if (file.endsWith('.md')) {
            const filePath = path.join(categoryPath, file);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const { data, content } = matter(fileContent);
            
            cheatsheets.push({
              title: data.title || '',
              description: data.description || '',
              category: category,
              slug: file.replace('.md', ''),
              icon: data.icon || '',
              content: content,
              difficulty: 'Beginner',
              popularity: 0,
              tags: undefined
            });
          }
        }
      } catch (error) {
        console.error(`Error reading category ${category}:`, error);
        // Continue with other categories even if one fails
        continue;
      }
    }

    return cheatsheets;
  } catch (error) {
    console.error('Error getting all cheatsheets:', error);
    return [];
  }
}

export function getCategories(): Category[] {
  return [...categories];
} 