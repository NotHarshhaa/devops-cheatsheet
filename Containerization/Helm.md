# Helm Cheatsheet

![text](https://imgur.com/nDW9BHK.png)

**1. Introduction:**

- **Helm** is a package manager for Kubernetes, helping you define, install, and upgrade even the most complex Kubernetes applications. It uses charts to package Kubernetes resources.

**2. Key Concepts:**

- **Chart:** A collection of files that describe a set of Kubernetes resources.
- **Release:** An instance of a chart running in a Kubernetes cluster.
- **Repository:** A place where charts can be collected and shared.

**3. Installing Helm:**

- **Helm Installation:**

  ```bash
  curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
  ```

- **Add a Helm Repository:**

  ```bash
  helm repo add bitnami https://charts.bitnami.com/bitnami
  helm repo update
  ```

**4. Helm Commands:**

- **Install a Chart:**

  ```bash
  helm install my-release bitnami/nginx
  ```

- **List Releases:**

  ```bash
  helm list
  ```

- **Upgrade a Release:**

  ```bash
  helm upgrade my-release bitnami/nginx
  ```

- **Atomic Upgrade with Automatic Rollback**:

  ```bash
  helm upgrade --install my-release bitnami/nginx --atomic --timeout 5m
  ```

- **Inspect Changes before Deploying (Helm Diff Plugin)**:

  ```bash
  helm plugin install https://github.com/databus23/helm-diff
  helm diff upgrade my-release ./my-chart
  ```

- **Uninstall a Release:**

  ```bash
  helm uninstall my-release
  ```

- **Search for Charts:**

  ```bash
  helm search repo nginx
  ```

**5. Chart Structure:**

- **Basic Chart Structure:**

  ```
  my-chart/
  ├── Chart.yaml
  ├── values.yaml
  ├── charts/
  ├── templates/
  │   ├── deployment.yaml
  │   ├── service.yaml
  │   └── _helpers.tpl
  ```

- **Chart.yaml:**

  ```yaml
  apiVersion: v2
  name: my-chart
  description: A Helm chart for Kubernetes
  version: 0.1.0
  ```

- **values.yaml:**

  ```yaml
  replicaCount: 3
  image:
    repository: nginx
    tag: stable
  ```

- **Template Example (deployment.yaml):**

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: {{ .Release.Name }}-nginx
  spec:
    replicas: {{ .Values.replicaCount }}
    selector:
      matchLabels:
        app: {{ .Release.Name }}-nginx
    template:
      metadata:
        labels:
          app: {{ .Release.Name }}-nginx
      spec:
        containers:
        - name: nginx
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
  ```

**6. Helm Lifecycle:**

- **Creating a New Chart:**

  ```bash
  helm create my-chart
  ```

- **Templating:**
  - **List all template values:**

    ```bash
    helm template my-release my-chart
    ```
  
  - **Lint a Chart:**

    ```bash
    helm lint my-chart
    ```

**7. Helm Repositories:**

- **Creating a Local Helm Repository:**

  ```bash
  helm repo index ./charts --url http://example.com/charts
  ```
  
- **Serving Charts:**

  ```bash
  helm serve --address 0.0.0.0:8879
  ```

**7.1. Modern OCI Registries (Chart Distribution):**

- Helm 3 natively supports Open Container Initiative (OCI) registries (Docker Hub, GitHub Packages, AWS ECR, Harbor).

- **Registry Login**:

  ```bash
  helm registry login ghcr.io -u my-username
  ```

- **Package and Push to OCI**:

  ```bash
  helm package ./my-chart --version 1.0.0
  helm push my-chart-1.0.0.tgz oci://ghcr.io/my-org/charts
  ```

- **Install from OCI Registry**:

  ```bash
  helm install my-release oci://ghcr.io/my-org/charts/my-chart --version 1.0.0
  ```


**8. Helm Hooks:**

- **Example of a Pre-Install Hook:**

  ```yaml
  apiVersion: batch/v1
  kind: Job
  metadata:
    name: "{{ .Release.Name }}-preinstall"
    annotations:
      "helm.sh/hook": pre-install
  spec:
    template:
      spec:
        containers:
        - name: preinstall
          image: busybox
          command: ['sh', '-c', 'echo Hello Helm']
        restartPolicy: Never
  ```

**9. Helm and CI/CD:**

- **Using Helm in Jenkins Pipeline:**

  ```groovy
  pipeline {
    agent any
    stages {
      stage('Deploy') {
        steps {
          script {
            sh "helm upgrade --install my-release ./my-chart"
          }
        }
      }
    }
  }
  ```

**10. Advanced Helm Concepts:**

- **Subcharts:** Use subcharts to package related Kubernetes resources together.
- **Chart Museum:** Helm repository server to store and manage Helm charts.
- **Helmfile:** A declarative spec for deploying Helm charts.

**11. Helm Security:**

- **Chart Signing:**
  - Sign and verify Helm charts to ensure integrity.

  ```bash
  helm package --sign --key <key> --keyring <keyring> my-chart
  helm verify my-chart-0.1.0.tgz
  ```

- **RBAC:** Control access to Helm releases with Kubernetes RBAC.

**12. Troubleshooting Helm:**

- **Debugging a Chart Installation:**

  ```bash
  helm install --debug --dry-run my-release ./my-chart
  ```

- **Checking Helm Release History:**

  ```bash
  helm history my-release
  ```

- **Rollback a Release:**

  ```bash
  helm rollback my-release 1
  ```
