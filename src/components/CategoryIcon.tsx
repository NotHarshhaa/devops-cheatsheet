'use client';

import { categoryIcons } from "@/utils/categories";
import type { Category } from "@/utils/categoryData";

interface CategoryIconProps {
  category: Category;
}

export function CategoryIcon({ category }: CategoryIconProps) {
  return categoryIcons[category];
} 