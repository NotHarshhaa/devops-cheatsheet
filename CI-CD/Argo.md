# Argo Cheatsheet

**1. Introduction:**

- Argo CD is a declarative GitOps continuous delivery tool for Kubernetes. It automates application deployment and lifecycle management using Git as the source of truth.

**2. Key Concepts:**

- **Application:** Represents a deployed Kubernetes resource defined in Git.
- **Repository:** Git repository containing Kubernetes manifests or Helm charts.
- **Sync:** Process of applying Git state to the cluster.
- **Health Status:** Indicates if resources are healthy, degraded, or missing.

**3. Basic `.argo/config.yml` Example:**

- **YAML Syntax:**

  ```yaml
    apiVersion: argoproj.io/v1alpha1
    kind: Application
    metadata:
    name: sample-app
    namespace: argocd
    spec:
    project: default

    source:
        repoURL: https://github.com/example/app-config.git
        targetRevision: main
        path: manifests

    destination:
        server: https://kubernetes.default.svc
        namespace: production

    syncPolicy:
        automated:
        prune: true
        selfHeal: true
  ```


**4. Deployment Methods:**

- **Manual Sync:** Click SYNC in UI or run:
                        argocd app sync sample-app
- **Automated Sync:** Enable in manifest:
  ```yaml
    syncPolicy:
    automated:
        prune: true
        selfHeal: true
  ```
