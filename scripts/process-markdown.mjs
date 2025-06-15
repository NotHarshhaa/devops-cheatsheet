import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { categories } from './categoryData.js';

async function processMarkdownFiles() {
  const output = {
    metadata: {},
    content: {}
  };

  for (const category of categories) {
    try {
      const categoryPath = path.join(process.cwd(), category);
      const files = await fs.readdir(categoryPath);
      
      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = path.join(categoryPath, file);
          const fileContent = await fs.readFile(filePath, 'utf-8');
          const { data, content } = matter(fileContent);
          const slug = file.replace('.md', '');
          
          // Store metadata and content separately
          output.metadata[`${category}/${slug}`] = {
            title: data.title || slug,
            description: data.description || '',
            category: category,
            icon: data.icon || '📄',
            slug: slug,
            difficulty: data.difficulty || 'Beginner',
            popularity: data.popularity || 0,
            tags: data.tags || [],
            updatedAt: data.updatedAt || new Date().toISOString()
          };
          
          output.content[`${category}/${slug}`] = content;
        }
      }
    } catch (error) {
      console.error(`Error processing category ${category}:`, error);
    }
  }

  // Create the public directory if it doesn't exist
  const publicDir = path.join(process.cwd(), 'public', 'static');
  await fs.mkdir(publicDir, { recursive: true });

  // Write the processed data
  await fs.writeFile(
    path.join(publicDir, 'cheatsheets-metadata.json'),
    JSON.stringify(output.metadata, null, 2)
  );
  await fs.writeFile(
    path.join(publicDir, 'cheatsheets-content.json'),
    JSON.stringify(output.content, null, 2)
  );

  console.log('Markdown files processed successfully!');
}

processMarkdownFiles().catch(console.error); 