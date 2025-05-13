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

export const categoryIcons: Record<Category, { icon: string; description: string }> = {
  'CI-CD': {
    icon: '🔄',
    description: 'Continuous Integration and Continuous Deployment tools and practices'
  },
  'Containerization': {
    icon: '📦',
    description: 'Container technologies and orchestration tools'
  },
  'Cloud': {
    icon: '☁️',
    description: 'Cloud platforms and services'
  },
  'Infrastructure-Management': {
    icon: '🏗️',
    description: 'Infrastructure as Code and configuration management'
  },
  'Version-Control': {
    icon: '📝',
    description: 'Source code management and version control systems'
  },
  'Security': {
    icon: '🔒',
    description: 'Security tools and best practices'
  },
  'Networking': {
    icon: '🌐',
    description: 'Network configuration and management tools'
  },
  'Monitoring': {
    icon: '📊',
    description: 'System monitoring and observability tools'
  }
}; 