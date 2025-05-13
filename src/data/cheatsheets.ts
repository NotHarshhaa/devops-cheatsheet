export interface Cheatsheet {
  status: string;
  title: string;
  description: string;
  category: string;
  slug: string;
  icon: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  popularity: number;
  tags: string[];
}

export const cheatsheets: Cheatsheet[] = [
  // CI-CD
  {
    title: "Jenkins",
    description: "Comprehensive guide to Jenkins CI/CD automation server",
    category: "CI-CD",
    slug: "Jenkins",
    icon: "🔧",
    difficulty: "Beginner",
    popularity: 95,
    tags: ["CI/CD", "Automation", "Pipeline"],
    status: ""
  },
  {
    title: "GitHub Actions",
    description: "GitHub's built-in CI/CD solution",
    category: "CI-CD",
    slug: "GitHub-Actions",
    icon: "⚡",
    difficulty: "Beginner",
    popularity: 90,
    tags: ["CI/CD", "GitHub", "Automation"],
    status: ""
  },
  {
    title: "GitLab CI",
    description: "GitLab's integrated CI/CD platform",
    category: "CI-CD",
    slug: "GitLab-CI",
    icon: "🦊",
    difficulty: "Intermediate",
    popularity: 85,
    tags: ["CI/CD", "GitLab", "Pipeline"],
    status: ""
  },
  {
    title: "CircleCI",
    description: "Cloud-native CI/CD platform",
    category: "CI-CD",
    slug: "CircleCI",
    icon: "⭕",
    difficulty: "Intermediate",
    popularity: 80,
    tags: ["CI/CD", "Cloud", "Automation"],
    status: ""
  },

  // Containerization
  {
    title: "Docker",
    description: "Container platform for building and shipping apps",
    category: "Containerization",
    slug: "docker",
    icon: "🐳",
    difficulty: "Beginner",
    popularity: 98,
    tags: ["Containers", "DevOps", "Microservices"],
    status: ""
  },
  {
    title: "Kubernetes",
    description: "Container orchestration platform",
    category: "Containerization",
    slug: "Kubernetes",
    icon: "☸️",
    difficulty: "Advanced",
    popularity: 95,
    tags: ["Containers", "Orchestration", "Cloud-Native"],
    status: ""
  },
  {
    title: "CRI-O",
    description: "Open Container Initiative-based container runtime",
    category: "Containerization",
    slug: "CRI-O",
    icon: "🐳",
    difficulty: "Beginner",
    popularity: 90,
    tags: ["Containers", "Orchestration", "Cloud-Native"],
    status: ""
  },
  {
    title: "Podman",
    description: "Open-source container engine",
    category: "Containerization",
    slug: "Podman",
    icon: "🐳",
    difficulty: "Beginner",
    popularity: 90,
    tags: ["Containers", "Orchestration", "Cloud-Native"],
    status: ""
  },
  {
    title: "OpenShift",
    description: "Container platform for building and shipping apps",
    category: "Containerization",
    slug: "OpenShift",
    icon: "🐳",
    difficulty: "Beginner",
    popularity: 90,
    tags: ["Containers", "Orchestration", "Cloud-Native"],
    status: ""
  },
  {
    title: "Helm",
    description: "Package manager for Kubernetes",
    category: "Containerization",
    slug: "Helm",
    icon: "🐳",
    difficulty: "Beginner",
    popularity: 90,
    tags: ["Containers", "Orchestration", "Cloud-Native"],
    status: ""
  },

  // Infrastructure Management
  {
    title: "Ansible",
    description: "Agentless automation platform",
    category: "Infrastructure-Management",
    slug: "Ansible",
    icon: "🔄",
    difficulty: "Intermediate",
    popularity: 90,
    tags: ["Automation", "Configuration Management", "IaC"],
    status: ""
  },
  {
    title: "Terraform",
    description: "Infrastructure as Code tool",
    category: "Infrastructure-Management",
    slug: "Terraform",
    icon: "🏗️",
    difficulty: "Intermediate",
    popularity: 92,
    tags: ["IaC", "Cloud", "Automation"],
    status: ""
  },
  {
    title: "Chef",
    description: "Infrastructure as Code tool",
    category: "Infrastructure-Management",
    slug: "Chef",
    icon: "🏗️",
    difficulty: "Intermediate",
    popularity: 90,
    tags: ["IaC", "Cloud", "Automation"],
    status: ""
  },
  {
    title: "Puppet",
    description: "Infrastructure as Code tool",
    category: "Infrastructure-Management",
    slug: "Puppet",
    icon: "🏗️",
    difficulty: "Intermediate",
    popularity: 90,
    tags: ["IaC", "Cloud", "Automation"],
    status: ""
  },

  // Monitoring
  {
    title: "Prometheus",
    description: "Monitoring and alerting toolkit",
    category: "Monitoring",
    slug: "Prometheus",
    icon: "📊",
    difficulty: "Intermediate",
    popularity: 88,
    tags: ["Monitoring", "Metrics", "Alerting"],
    status: ""
  },
  {
    title: "Grafana",
    description: "Analytics and monitoring platform",
    category: "Monitoring",
    slug: "Grafana",
    icon: "📈",
    difficulty: "Intermediate",
    popularity: 87,
    tags: ["Monitoring", "Visualization", "Dashboards"],
    status: ""
  },
  {
    title: "ELK Stack",
    description: "Elasticsearch, Logstash, and Kibana",
    category: "Monitoring",
    slug: "ELK-Stack",
    icon: "📈",
    difficulty: "Intermediate",
    popularity: 87,
    tags: ["Monitoring", "Visualization", "Dashboards"],
    status: ""
  },
  {
    title: "CloudWatch",
    description: "Monitoring and alerting tool",
    category: "Monitoring",
    slug: "CloudWatch",
    icon: "📈",
    difficulty: "Intermediate",
    popularity: 87,
    tags: ["Monitoring", "Visualization", "Dashboards"],
    status: ""
  },
  {
    title: "Nagios",
    description: "Monitoring and alerting tool",
    category: "Monitoring",
    slug: "Nagios",
    icon: "📈",
    difficulty: "Intermediate",
    popularity: 87,
    tags: ["Monitoring", "Visualization", "Dashboards"],
    status: ""
  },

  // Security
  {
    title: "SonarQube",
    description: "Code quality and security scanner",
    category: "Security",
    slug: "SonarQube",
    icon: "🔒",
    difficulty: "Intermediate",
    popularity: 85,
    tags: ["Security", "Code Quality", "Static Analysis"],
    status: ""
  },
  {
    title: "HashiCorp Vault",
    description: "Secrets management tool",
    category: "Security",
    slug: "HashiCorp-Vault",
    icon: "🔐",
    difficulty: "Advanced",
    popularity: 83,
    tags: ["Security", "Secrets Management", "Authentication"],
    status: ""
  },
  {
    title: "Aqua Security",
    description: "Security tool for Kubernetes",
    category: "Security",
    slug: "AquaSec",
    icon: "🔐",
    difficulty: "Advanced",
    popularity: 83,
    tags: ["Security", "Secrets Management", "Authentication"],
    status: ""
  },
  {
    title: "Trivy",
    description: "Security tool for Kubernetes",
    category: "Security",
    slug: "Trivy",
    icon: "🔐",
    difficulty: "Advanced",
    popularity: 83,
    tags: ["Security", "Secrets Management", "Authentication"],
    status: ""
  },

  // Version Control
  {
    title: "GitLab",
    description: "Complete DevOps platform",
    category: "Version-Control",
    slug: "GitLab",
    icon: "🦊",
    difficulty: "Beginner",
    popularity: 88,
    tags: ["Version Control", "CI/CD", "DevOps Platform"],
    status: ""
  },
  {
    title: "GitHub",
    description: "Software development platform",
    category: "Version-Control",
    slug: "GitHub",
    icon: "🐱",
    difficulty: "Beginner",
    popularity: 95,
    tags: ["Version Control", "Collaboration", "Open Source"],
    status: ""
  },
  {
    title: "Bitbucket",
    description: "Software development platform",
    category: "Version-Control",
    slug: "Bitbucket",
    icon: "🐱",
    difficulty: "Beginner",
    popularity: 95,
    tags: ["Version Control", "Collaboration", "Open Source"],
    status: ""
  },

  // Cloud
  {
    title: "AWS",
    description: "Amazon Web Services cloud platform",
    category: "Cloud",
    slug: "AWS",
    icon: "☁️",
    difficulty: "Advanced",
    popularity: 96,
    tags: ["Cloud", "AWS", "Infrastructure"],
    status: ""
  },
  {
    title: "Azure",
    description: "Microsoft's cloud platform",
    category: "Cloud",
    slug: "Azure",
    icon: "☁️",
    difficulty: "Advanced",
    popularity: 90,
    tags: ["Cloud", "Microsoft", "Infrastructure"],
    status: ""
  },
  {
    title: "Google Cloud",
    description: "Google's cloud platform",
    category: "Cloud",
    slug: "GCP",
    icon: "☁️",
    difficulty: "Advanced",
    popularity: 90,
    tags: ["Cloud", "Google", "Infrastructure"],
    status: ""
  },
  {
    title: "Kubernetes On AWS",
    description: "Kubernetes on AWS",
    category: "Cloud",
    slug: "Kubernetes-on-AWS",
    icon: "☁️",
    difficulty: "Advanced",
    popularity: 90,
    tags: ["Cloud", "Kubernetes", "AWS", "Infrastructure"],
    status: ""
  },
  {
    title: "Terraform On AWS",
    description: "Terraform on AWS",
    category: "Cloud",
    slug: "Terraform-on-AWS",
    icon: "☁️",
    difficulty: "Advanced",
    popularity: 90,
    tags: ["Cloud", "Terraform", "AWS", "Infrastructure"],
    status: ""
  },

  // Networking
  {
    title: "Istio",
    description: "Service mesh for Kubernetes",
    category: "Networking",
    slug: "Istio",
    icon: "🌐",
    difficulty: "Advanced",
    popularity: 82,
    tags: ["Service Mesh", "Kubernetes", "Networking"],
    status: ""
  },
  {
    title: "Consul",
    description: "Service networking platform",
    category: "Networking",
    slug: "Consul",
    icon: "🔗",
    difficulty: "Advanced",
    popularity: 80,
    tags: ["Service Discovery", "Networking", "HashiCorp"],
    status: ""
  },
  {
    title: "Envoy",
    description: "Service mesh for Kubernetes",
    category: "Networking",
    slug: "Envoy",
    icon: "🌐",
    difficulty: "Advanced",
    popularity: 80,
    tags: ["Service Mesh", "Kubernetes", "Networking"],
    status: ""
  },
  {
    title: "Linkerd",
    description: "Service mesh for Kubernetes",
    category: "Networking",
    slug: "Linkerd",
    icon: "🌐",
    difficulty: "Advanced",
    popularity: 80,
    tags: ["Service Mesh", "Kubernetes", "Networking"],
    status: ""
  }, 
];

export async function getAllCheatsheets(): Promise<Cheatsheet[]> {
  return cheatsheets;
}

export async function getCheatsheetBySlug(category: string, slug: string): Promise<Cheatsheet | null> {
  const cheatsheet = cheatsheets.find(
    c => c.category.toLowerCase() === category.toLowerCase() && 
         c.slug.toLowerCase() === slug.toLowerCase()
  );
  return cheatsheet || null;
} 