export interface Cheatsheet {
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
    tags: ["CI/CD", "Automation", "Pipeline"]
  },
  {
    title: "GitHub Actions",
    description: "GitHub's built-in CI/CD solution",
    category: "CI-CD",
    slug: "GitHub-Actions",
    icon: "⚡",
    difficulty: "Beginner",
    popularity: 90,
    tags: ["CI/CD", "GitHub", "Automation"]
  },
  {
    title: "GitLab CI",
    description: "GitLab's integrated CI/CD platform",
    category: "CI-CD",
    slug: "GitLab-CI",
    icon: "🦊",
    difficulty: "Intermediate",
    popularity: 85,
    tags: ["CI/CD", "GitLab", "Pipeline"]
  },
  {
    title: "CircleCI",
    description: "Cloud-native CI/CD platform",
    category: "CI-CD",
    slug: "CircleCI",
    icon: "⭕",
    difficulty: "Intermediate",
    popularity: 80,
    tags: ["CI/CD", "Cloud", "Automation"]
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
    tags: ["Containers", "DevOps", "Microservices"]
  },
  {
    title: "Kubernetes",
    description: "Container orchestration platform",
    category: "Containerization",
    slug: "Kubernetes",
    icon: "☸️",
    difficulty: "Advanced",
    popularity: 95,
    tags: ["Containers", "Orchestration", "Cloud-Native"]
  },
  { title: "CRI-O",
    description: "Open Container Initiative-based container runtime",
    category: "Containerization",
    slug: "CRI-O",
    icon: "🐳",
    difficulty: "Beginner",
    popularity: 90,
    tags: ["Containers", "Orchestration", "Cloud-Native"]
  },
  { title: "Podman",
    description: "Open-source container engine",
    category: "Containerization",
    slug: "Podman",
    icon: "🐳",
    difficulty: "Beginner",
    popularity: 90,
    tags: ["Containers", "Orchestration", "Cloud-Native"]
  },
  { title: "OpenShift",
    description: "Container platform for building and shipping apps",
    category: "Containerization",
    slug: "OpenShift",
    icon: "🐳",
    difficulty: "Beginner",
    popularity: 90,
    tags: ["Containers", "Orchestration", "Cloud-Native"]
  },
  { title: "Helm",
    description: "Package manager for Kubernetes",
    category: "Containerization",
    slug: "Helm",
    icon: "🐳",
    difficulty: "Beginner",
    popularity: 90,
    tags: ["Containers", "Orchestration", "Cloud-Native"]
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
    tags: ["Automation", "Configuration Management", "IaC"]
  },
  {
    title: "Terraform",
    description: "Infrastructure as Code tool",
    category: "Infrastructure-Management",
    slug: "Terraform",
    icon: "🏗️",
    difficulty: "Intermediate",
    popularity: 92,
    tags: ["IaC", "Cloud", "Automation"]
  },
  { title: "Chef",
    description: "Infrastructure as Code tool",
    category: "Infrastructure-Management",
    slug: "Chef",
    icon: "🏗️",
    difficulty: "Intermediate",
    popularity: 90,
    tags: ["IaC", "Cloud", "Automation"]
  },
  { title: "Puppet",
    description: "Infrastructure as Code tool",
    category: "Infrastructure-Management",
    slug: "Puppet",
    icon: "🏗️",
    difficulty: "Intermediate",
    popularity: 90,
    tags: ["IaC", "Cloud", "Automation"]
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
    tags: ["Monitoring", "Metrics", "Alerting"]
  },
  {
    title: "Grafana",
    description: "Analytics and monitoring platform",
    category: "Monitoring",
    slug: "Grafana",
    icon: "📈",
    difficulty: "Intermediate",
    popularity: 87,
    tags: ["Monitoring", "Visualization", "Dashboards"]
  },
  { title: "ELK Stack",
    description: "Elasticsearch, Logstash, and Kibana",
    category: "Monitoring",
    slug: "ELK-Stack",
    icon: "📈",
    difficulty: "Intermediate",
    popularity: 87,
    tags: ["Monitoring", "Visualization", "Dashboards"]
  },
  { title: "CloudWatch",
    description: "Monitoring and alerting tool",
    category: "Monitoring",
    slug: "CloudWatch",
    icon: "📈",
    difficulty: "Intermediate",
    popularity: 87,
    tags: ["Monitoring", "Visualization", "Dashboards"]
  },
  { title: "Nagios",
    description: "Monitoring and alerting tool",
    category: "Monitoring",
    slug: "Nagios",
    icon: "📈",
    difficulty: "Intermediate",
    popularity: 87,
    tags: ["Monitoring", "Visualization", "Dashboards"]
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
    tags: ["Security", "Code Quality", "Static Analysis"]
  },
  {
    title: "HashiCorp Vault",
    description: "Secrets management tool",
    category: "Security",
    slug: "HashiCorp-Vault",
    icon: "🔐",
    difficulty: "Advanced",
    popularity: 83,
    tags: ["Security", "Secrets Management", "Authentication"]
  },
  { title: "Aqua Security",
    description: "Security tool for Kubernetes",
    category: "Security",
    slug: "AquaSec",
    icon: "🔐",
    difficulty: "Advanced",
    popularity: 83,
    tags: ["Security", "Secrets Management", "Authentication"]
  },
  { title: "Trivy",
    description: "Security tool for Kubernetes",
    category: "Security",
    slug: "Trivy",
    icon: "🔐",
    difficulty: "Advanced",
    popularity: 83,
    tags: ["Security", "Secrets Management", "Authentication"]
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
    tags: ["Version Control", "CI/CD", "DevOps Platform"]
  },
  {
    title: "GitHub",
    description: "Software development platform",
    category: "Version-Control",
    slug: "GitHub",
    icon: "🐱",
    difficulty: "Beginner",
    popularity: 95,
    tags: ["Version Control", "Collaboration", "Open Source"]
  },
  { title: "Bitbucket",
    description: "Software development platform",
    category: "Version-Control",
    slug: "Bitbucket",
    icon: "🐱",
    difficulty: "Beginner",
    popularity: 95,
    tags: ["Version Control", "Collaboration", "Open Source"]
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
    tags: ["Cloud", "AWS", "Infrastructure"]
  },
  {
    title: "Azure",
    description: "Microsoft's cloud platform",
    category: "Cloud",
    slug: "Azure",
    icon: "☁️",
    difficulty: "Advanced",
    popularity: 90,
    tags: ["Cloud", "Microsoft", "Infrastructure"]
  },
  { title: "Google Cloud",
    description: "Google's cloud platform",
    category: "Cloud",
    slug: "GCP",
    icon: "☁️",
    difficulty: "Advanced",
    popularity: 90,
    tags: ["Cloud", "Google", "Infrastructure"]
  },
  { title: "Kubernetes On AWS",
    description: "Kubernetes on AWS",
    category: "Cloud",
    slug: "Kubernetes-on-AWS",
    icon: "☁️",
    difficulty: "Advanced",
    popularity: 90,
    tags: ["Cloud", "Kubernetes", "AWS", "Infrastructure"]
  },
  { title: "Terraform On AWS",
    description: "Terraform on AWS",
    category: "Cloud",
    slug: "Terraform-on-AWS",
    icon: "☁️",
    difficulty: "Advanced",
    popularity: 90,
    tags: ["Cloud", "Terraform", "AWS", "Infrastructure"]
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
    tags: ["Service Mesh", "Kubernetes", "Networking"]
  },
  {
    title: "Consul",
    description: "Service networking platform",
    category: "Networking",
    slug: "Consul",
    icon: "🔗",
    difficulty: "Advanced",
    popularity: 80,
    tags: ["Service Discovery", "Networking", "HashiCorp"]
  },
  { title: "Envoy",
    description: "Service mesh for Kubernetes",
    category: "Networking",
    slug: "Envoy",
    icon: "🌐",
    difficulty: "Advanced",
    popularity: 80,
    tags: ["Service Mesh", "Kubernetes", "Networking"]
  },
  { title: "Linkerd",
    description: "Service mesh for Kubernetes",
    category: "Networking",
    slug: "Linkerd",
    icon: "🌐",
    difficulty: "Advanced",
    popularity: 80,
    tags: ["Service Mesh", "Kubernetes", "Networking"]
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