export const categories = [
  'CI-CD',
  'Containerization',
  'Cloud',
  'Infrastructure-Management',
  'Version-Control',
  'Security',
  'Networking',
  'Monitoring',
] as const;

export type Category = typeof categories[number];

export const TOTAL_CATEGORIES = categories.length;

export const categoryData: Record<Category, {
  description: string;
  toolCount: number;
  color: string;
}> = {
  'CI-CD': {
    description: 'Continuous Integration and Continuous Deployment tools and practices',
    toolCount: 25,
    color: 'blue'
  },
  'Containerization': {
    description: 'Container technologies and orchestration tools',
    toolCount: 18,
    color: 'orange'
  },
  'Cloud': {
    description: 'Cloud platforms and services',
    toolCount: 30,
    color: 'purple'
  },
  'Infrastructure-Management': {
    description: 'Infrastructure as Code and configuration management',
    toolCount: 22,
    color: 'green'
  },
  'Version-Control': {
    description: 'Source code management and version control systems',
    toolCount: 15,
    color: 'indigo'
  },
  'Security': {
    description: 'Security tools and best practices',
    toolCount: 20,
    color: 'red'
  },
  'Networking': {
    description: 'Network configuration and management tools',
    toolCount: 16,
    color: 'cyan'
  },
  'Monitoring': {
    description: 'System monitoring and observability tools',
    toolCount: 24,
    color: 'teal'
  }
}; 