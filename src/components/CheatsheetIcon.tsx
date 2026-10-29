'use client';

import {
  Activity,
  Box,
  Cloud,
  Shield,
  GitBranch,
  Server,
  Network,
  BarChart,
  Terminal,
} from 'lucide-react';

const iconMap = {
  '<Activity />': Activity,
  '<Box />': Box,
  '<Cloud />': Cloud,
  '<Shield />': Shield,
  '<GitBranch />': GitBranch,
  '<Server />': Server,
  '<Network />': Network,
  '<BarChart />': BarChart,
} as const;

interface CheatsheetIconProps {
  /** Icon identifier stored with the cheatsheet, e.g. "<Box />" or an emoji */
  icon: string;
  className?: string;
}

/**
 * Renders the lucide icon for a cheatsheet's icon identifier, with a
 * terminal-icon fallback for unknown values (e.g. emoji from frontmatter).
 */
export function CheatsheetIcon({ icon, className = 'w-6 h-6 text-primary' }: CheatsheetIconProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  return <Terminal className={className} />;
}
