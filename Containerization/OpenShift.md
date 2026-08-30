# 🔴 OpenShift Cheatsheet

![text](https://imgur.com/2HuS6vE.png)

## Table of Contents

1. **Introduction to OpenShift**
2. **OpenShift CLI (`oc`) Quickstart**
3. **Projects, Deployments & Routes**
4. **Networking: OVN-Kubernetes (Default)**
5. **Security Context Constraints (SCCs)**
6. **OpenShift Pipelines (Tekton) & GitOps (Argo CD)**
7. **Cluster Administration (`oc adm`)**
8. **Best Practices & Troubleshooting**
9. **References**

---

## 1. Introduction to OpenShift

**Red Hat OpenShift** is an enterprise Kubernetes platform that delivers a complete application lifecycle foundation across hybrid cloud environments. It integrates certified Kubernetes with enterprise developer tools, automated GitOps pipelines, built-in monitoring, and hardened Linux security (Red Hat Enterprise Linux CoreOS).

### Key Features

* **Enterprise Kubernetes**: Validated, self-healing Kubernetes clusters with automated updates.
* **Developer Ergonomics**: Source-to-Image (S2I), Web Console developer perspective, and integrated container registry.
* **Declarative GitOps**: Native integrations with Argo CD (OpenShift GitOps) and Tekton (OpenShift Pipelines).
* **Hardened Security**: Default SELinux labeling, Security Context Constraints (SCCs), and FIPS compliance.

---

## 2. OpenShift CLI (`oc`) Quickstart

The `oc` CLI extends standard `kubectl` with OpenShift-specific project management and build workflows.

```bash
# Log in to OpenShift cluster
oc login https://api.cluster.example.com:6443 -u admin

# Check current user, project, and server details
oc whoami
oc project

# Create and switch to a new project (namespaced wrapper)
oc new-project my-app-prod

# List all projects
oc get projects

# Switch between active projects
oc project other-project
```

---

## 3. Projects, Deployments & Routes

### 🔹 Kubernetes `Deployment` vs Legacy `DeploymentConfig`

> [!IMPORTANT]
> **Deprecation Notice**: OpenShift `DeploymentConfig` (`dc`) has been officially deprecated. Always use standard Kubernetes **`Deployment`** resources for application workloads.

### 🔹 Exposing Services with Routes

OpenShift Routes provide built-in Ingress with automatic DNS hostname generation and TLS termination.

```bash
# Deploy an application from a container image
oc new-app --image=quay.io/myorg/api-service:v1 --name=api-service

# Expose service with an edge-terminated TLS Route
oc create route edge api-route \
  --service=api-service \
  --port=8080 \
  --hostname=api.apps.cluster.example.com
```

Example Route Manifest (`route.yaml`):

```yaml
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: api-route
  namespace: my-app-prod
spec:
  to:
    kind: Service
    name: api-service
  port:
    targetPort: 8080
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect
```

---

## 4. Networking: OVN-Kubernetes (Default)

> [!NOTE]
> **OVN-Kubernetes**: OpenShift 4.x uses **OVN-Kubernetes** as the default network provider. Legacy OpenShift SDN is deprecated and removed in recent releases.

OVN-Kubernetes supports:
* Native egress IP assignment for external firewalls.
* Full Kubernetes `NetworkPolicy` and OpenShift `AdminNetworkPolicy` enforcement.
* Dual-stack IPv4/IPv6 networking and internal multicast.

### 🔹 Restricting Traffic with NetworkPolicy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-from-same-namespace
  namespace: my-app-prod
spec:
  podSelector: {}
  ingress:
    - from:
        - podSelector: {}
```

---

## 5. Security Context Constraints (SCCs)

OpenShift uses SCCs to govern pod capabilities and user IDs, providing granular control over pod security settings.

### 🔹 Common Default SCCs

| SCC Name | Description |
| --- | --- |
| **`restricted-v2`** | Default for standard applications; enforces non-root UID allocation and drops all root capabilities. |
| **`nonroot`** | Allows containers to run as any pre-defined non-root UID. |
| **`anyuid`** | Permits containers to execute as UID 0 (root). |
| **`privileged`** | Full host access (reserved for storage plugins, node daemons). |

Granting an SCC to a Service Account:

```bash
oc adm policy add-scc-to-user anyuid -z my-service-account -n my-app-prod
```

---

## 6. OpenShift Pipelines (Tekton) & GitOps (Argo CD)

### 🔹 OpenShift Pipelines (Cloud-Native CI)

Powered by Tekton, OpenShift Pipelines run isolated CI tasks inside standard Kubernetes containers.

```bash
# Start a pipeline run using the Tekton CLI
tkn pipeline start build-and-deploy \
  -w name=shared-workspace,claimName=source-pvc \
  -p git-url=https://github.com/myorg/app.git \
  -p image-tag=prod-v1 \
  --showlog
```

### 🔹 OpenShift GitOps (Declarative Continuous Delivery)

Powered by Argo CD, OpenShift GitOps synchronizes cluster state directly from Git repositories:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: production-workloads
  namespace: openshift-gitops
spec:
  project: default
  source:
    repoURL: 'https://github.com/myorg/gitops-manifests.git'
    targetRevision: HEAD
    path: environments/production
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: my-app-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

---

## 7. Cluster Administration (`oc adm`)

```bash
# View cluster node status and resource consumption
oc adm top nodes
oc adm top pods -A

# Safely cordon and drain a node before maintenance
oc adm cordon node-1.cluster.example.com
oc adm drain node-1.cluster.example.com --ignore-daemonsets --delete-emptydir-data

# Check cluster version and upgrade path
oc adm upgrade

# Initiate an automated cluster upgrade to target release
oc adm upgrade --to=4.16.2
```

---

## 8. Best Practices & Troubleshooting

1. **Avoid Running as Root**: Build container images compliant with the `restricted-v2` SCC rather than granting `anyuid`.
2. **Use GitOps for Multi-Cluster Management**: Manage configurations and tenant namespaces through OpenShift GitOps repositories.
3. **Use MachineConfig Operator**: Manage core node operating system settings (sysctl, kernel args, SSH keys) declaratively via `MachineConfig` CRDs.

---

## 📚 **Learning Resources**

* 🔗 [Red Hat OpenShift Documentation](https://docs.openshift.com/)
* 📦 [Red Hat Developer Portal](https://developers.redhat.com/products/openshift/overview)
* 🛡️ [OpenShift Security and Compliance Center](https://docs.openshift.com/container-platform/latest/security/index.html)
