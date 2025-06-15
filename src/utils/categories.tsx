'use client';

import { Activity, Box, Cloud, Shield, GitBranch, Server, Network, BarChart } from 'lucide-react';
import { ReactNode } from 'react';
import { Category } from './categoryData';

export const categoryIcons: Record<Category, ReactNode> = {
  'CI-CD': <Activity className="w-8 h-8 text-blue-500" />,
  'Containerization': <Box className="w-8 h-8 text-orange-500" />,
  'Cloud': <Cloud className="w-8 h-8 text-purple-500" />,
  'Infrastructure-Management': <Server className="w-8 h-8 text-green-500" />,
  'Version-Control': <GitBranch className="w-8 h-8 text-indigo-500" />,
  'Security': <Shield className="w-8 h-8 text-red-500" />,
  'Networking': <Network className="w-8 h-8 text-cyan-500" />,
  'Monitoring': <BarChart className="w-8 h-8 text-teal-500" />
}; 