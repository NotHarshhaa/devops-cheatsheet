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
    };
  } catch (error) {
    console.error(`Error reading cheatsheet ${category}/${slug}:`, error);
    return null;
  }
}

export async function getAllCheatsheets(): Promise<Cheatsheet[]> {
  const cheatsheets: Cheatsheet[] = [];

  for (const category of categories) {
    try {
      const categoryPath = path.join(process.cwd(), category);
      const files = await fs.readdir(categoryPath);
      const mdFiles = files.filter(file => file.endsWith('.md'));

      for (const file of mdFiles) {
        const slug = file.replace(/\.md$/, '');
        const cheatsheet = await getCheatsheetBySlug(category, slug);
        if (cheatsheet) {
          cheatsheets.push(cheatsheet);
        }
      }
    } catch (error) {
      console.error(`Error processing category ${category}:`, error);
    }
  }

  return cheatsheets;
}

export function getCategories(): Category[] {
  return [...categories];
} 