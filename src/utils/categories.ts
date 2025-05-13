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

export const categoryIcons: Record<Category, { 
  icon: string; 
  description: string; 
  toolCount: number;
  color?: string;
}> = {
  'CI-CD': {
    icon: '🔄',
    description: 'Continuous Integration and Continuous Deployment tools and practices',
    toolCount: 25,
    color: 'blue'
  },
  'Containerization': {
    icon: '📦',
    description: 'Container technologies and orchestration tools',
    toolCount: 18,
    color: 'orange'
  },
  'Cloud': {
    icon: '☁️',
    description: 'Cloud platforms and services',
    toolCount: 30,
    color: 'purple'
  },
  'Infrastructure-Management': {
    icon: '🏗️',
    description: 'Infrastructure as Code and configuration management',
    toolCount: 22,
    color: 'green'
  },
  'Version-Control': {
    icon: '📝',
    description: 'Source code management and version control systems',
    toolCount: 15,
    color: 'indigo'
  },
  'Security': {
    icon: '🔒',
    description: 'Security tools and best practices',
    toolCount: 20,
    color: 'red'
  },
  'Networking': {
    icon: '🌐',
    description: 'Network configuration and management tools',
    toolCount: 16,
    color: 'cyan'
  },
  'Monitoring': {
    icon: '📊',
    description: 'System monitoring and observability tools',
    toolCount: 24,
    color: 'teal'
  }
}; 