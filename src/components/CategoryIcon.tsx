'use client';

import { Activity, Box, Cloud, Shield, GitBranch, Server, Network, BarChart } from 'lucide-react';
import type { Category } from "@/utils/categoryData";

interface CategoryIconProps {
  category: Category;
}

const iconMap = {
  'CI-CD': Activity,
  'Containerization': Box,
  'Cloud': Cloud,
  'Infrastructure-Management': Server,
  'Version-Control': GitBranch,
  'Security': Shield,
  'Networking': Network,
  'Monitoring': BarChart,
};

export function CategoryIcon({ category }: CategoryIconProps) {
  const IconComponent = iconMap[category];
  return IconComponent ? <IconComponent /> : null;
} 