export interface ToolConfig {
  name: string;
  color: string;
  svgPath: string;
}

export const toolIcons: Record<string, ToolConfig> = {
  github: {
    name: 'GitHub Actions',
    color: '#2088FF',
    svgPath: '/icons/github-actions.svg'
  },
  gitlab: {
    name: 'GitLab CI',
    color: '#FC6D26',
    svgPath: '/icons/gitlab-ci.svg'
  },
  circleci: {
    name: 'CircleCI',
    color: '#343434',
    svgPath: '/icons/circleci.svg'
  },
  jenkins: {
    name: 'Jenkins',
    color: '#D33833',
    svgPath: '/icons/jenkins.svg'
  },
  kubernetes: {
    name: 'Kubernetes',
    color: '#326CE5',
    svgPath: '/icons/kubernetes.svg'
  },
  docker: {
    name: 'Docker',
    color: '#2496ED',
    svgPath: '/icons/docker.svg'
  },
  terraform: {
    name: 'Terraform',
    color: '#7B42BC',
    svgPath: '/icons/terraform.svg'
  },
  ansible: {
    name: 'Ansible',
    color: '#EE0000',
    svgPath: '/icons/ansible.svg'
  }
}; 