# ⎈ Helm Cheatsheet

![text](https://imgur.com/nDW9BHK.png)

**Helm** is the package manager for Kubernetes. It simplifies the definition, installation, versioning, and upgrading of complex Kubernetes applications through templated packages called **Charts**.

---

## **1. Core Concepts & Architecture**

| Concept | Description |
| --- | --- |
| **Chart** | A bundle of templated YAML manifests and default values describing Kubernetes resources. |
| **Release** | A named, running instance of a chart deployed into a Kubernetes cluster. |
| **Values** | Configuration parameters (`values.yaml` or `--set`) that customize template rendering. |
| **OCI Registry** | Modern storage specification allowing Helm charts to be pushed and pulled from container registries (GHCR, ECR, Harbor). |

---

## **2. Installation & Quickstart**

```bash
# Install Helm 3 CLI (macOS)
brew install helm

# Install Helm 3 CLI (Linux)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify version
helm version
```

---

## **3. Repository & Release Operations**

```bash
# Add an official Helm repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search for charts
helm search repo nginx

# Install a chart release
helm install my-nginx bitnami/nginx --set service.type=ClusterIP

# List all releases across all namespaces
helm list -A

# Upgrade a release with custom values file
helm upgrade my-nginx bitnami/nginx -f custom-values.yaml

# Atomic upgrade: rolls back automatically if any resource fails health checks
helm upgrade --install my-nginx bitnami/nginx \
  --atomic \
  --timeout 5m

# Roll back to previous revision
helm rollback my-nginx 1

# View revision history
helm history my-nginx

# Uninstall a release
helm uninstall my-nginx
```

---

## **4. OCI Registry Integration (Modern Standard)**

Helm 3.8+ natively packages and pushes charts as OCI artifacts directly to container registries without requiring external servers like ChartMuseum:

```bash
# 1. Package a local chart
helm package ./my-chart

# 2. Authenticate to GitHub Container Registry (or AWS ECR / Docker Hub)
echo $GITHUB_TOKEN | helm registry login ghcr.io -u $USERNAME --password-stdin

# 3. Push the packaged chart to OCI registry
helm push my-chart-0.1.0.tgz oci://ghcr.io/myorg/charts

# 4. Install chart directly from OCI registry
helm install my-app oci://ghcr.io/myorg/charts/my-chart --version 0.1.0
```

---

## **5. Template Rendering & Local Debugging**

```bash
# Render Kubernetes YAML locally without contacting cluster
helm template my-release ./my-chart

# Render with specific override values
helm template my-release ./my-chart -f prod-values.yaml

# Lint chart for syntax and best practices
helm lint ./my-chart

# Perform a dry-run against the cluster with server-side validation
helm install my-release ./my-chart --dry-run --debug
```

### 🔹 Inspect Changes before Upgrading (`helm-diff` Plugin)

```bash
# Install helm-diff plugin
helm plugin install https://github.com/databus23/helm-diff

# Show a colored unified diff between deployed release and local changes
helm diff upgrade my-release ./my-chart
```

---

## **6. Chart Structure & Helpers**

```plaintext
my-chart/
├── Chart.yaml          # Metadata (name, version, dependencies)
├── values.yaml         # Default configuration values
├── values.schema.json  # JSON Schema for validating user inputs
├── charts/             # Dependent subcharts
└── templates/          # Jinja-like Go templates
    ├── deployment.yaml
    ├── service.yaml
    ├── NOTES.txt       # Post-installation instructions displayed to user
    └── _helpers.tpl    # Reusable template snippets and definitions
```

### 🔹 Example `Chart.yaml`

```yaml
apiVersion: v2
name: my-service
description: Production microservice Helm chart
type: application
version: 1.2.0
appVersion: "2.1.0"
dependencies:
  - name: redis
    version: "~> 18.0"
    repository: "https://charts.bitnami.com/bitnami"
    condition: redis.enabled
```

---

## **7. Production Best Practices**

1. **Always Use `--atomic` in CI/CD**: Ensures deployments fail fast and roll back cleanly without leaving orphan resources.
2. **Enforce `values.schema.json`**: Catch invalid variable types, missing required keys, and out-of-range ports before deployment.
3. **Pin Subchart Versions**: Always define explicit semantic versions in `dependencies` of `Chart.yaml`.
4. **Prefer OCI Registries**: Store container images and Helm charts together in the same secure, audited registry.

---

## 📚 **Learning Resources**

* 🔗 [Official Helm Documentation](https://helm.sh/docs/)
* 📦 [Artifact Hub (Public Charts Search)](https://artifacthub.io/)
* 📜 [Helm Chart Template Guide](https://helm.sh/docs/chart_template_guide/)
