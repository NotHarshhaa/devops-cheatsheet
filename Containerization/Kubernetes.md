# ☸️ Kubernetes Cheatsheet

![text](https://imgur.com/aYuSIvY.png)

## Checkout detailed article on [Dev.to](https://dev.to/prodevopsguytech/kubernetes-commands-for-devops-engineers-124o)

**Kubernetes** (K8s) is an open-source container orchestration engine that automates the deployment, scaling, and operational lifecycle of containerized workloads.

---

## **1. Core Concepts & Architecture**

```plaintext
                   Control Plane
  [ API Server ] <-> [ etcd ] <-> [ Controller Manager ]
         ^
         |                    [ Scheduler ]
         v
     Worker Nodes
  [ Kubelet ] <-> [ Container Runtime (CRI-O / containerd) ]
  [ Kube-Proxy ]
  [ Pods: Container A, Container B ]
```

| Component | Role | Description |
| --- | --- | --- |
| **API Server** | Control Plane | Central gateway exposing the REST API. |
| **etcd** | Control Plane | Consistent, highly available key-value store holding cluster state. |
| **Scheduler** | Control Plane | Assigns unscheduled pods to eligible worker nodes based on resource requests. |
| **Controller Manager** | Control Plane | Runs reconciliation loops (Node, Deployment, ReplicaSet controllers). |
| **Kubelet** | Worker Node | Node agent ensuring containers declared in PodSpecs are running and healthy. |
| **Kube-Proxy** | Worker Node | Manages host network packet forwarding and load-balances Service traffic. |

---

## **2. Everyday `kubectl` Quick Reference**

### 🔹 Cluster & Node Management

```bash
# Cluster health and API endpoint
kubectl cluster-info

# List all nodes with IP, status, and Kubernetes version
kubectl get nodes -o wide

# Drain a node safely before maintenance (cordons and evicts pods)
kubectl drain node-1 --ignore-daemonsets --delete-emptydir-data

# Uncordon node after maintenance
kubectl uncordon node-1

# View node CPU and Memory consumption (requires metrics-server)
kubectl top nodes
kubectl top pods -A --sort-by=cpu
```

### 🔹 Pod & Workload Operations

```bash
# Run a quick disposable test pod
kubectl run test-pod --image=busybox -it --rm -- sh

# Server-Side Apply (declarative, detects conflicts)
kubectl apply --server-side -f deployment.yaml

# Rollout status and history
kubectl rollout status deployment/web-app
kubectl rollout history deployment/web-app
kubectl rollout undo deployment/web-app --to-revision=2

# Restart all pods in a deployment gracefully
kubectl rollout restart deployment/web-app

# Stream logs with timestamps
kubectl logs -f deployment/web-app --all-containers=true --tail=50
```

---

## **3. Ephemeral Debugging (`kubectl debug`)**

Attach an interactive troubleshooting container into an existing, running pod without restarting it:

```bash
# Attach network troubleshooting container (netshoot) into an active pod
kubectl debug -it my-pod --image=nicolaka/netshoot --target=app-container

# Debug a broken node by spawning a privileged pod on the host namespace
kubectl debug node/worker-1 -it --image=busybox
```

---

## **4. Workload Manifests**

### 🔹 Production Deployment Manifest

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
        - name: app
          image: nginx:alpine
          ports:
            - containerPort: 80
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          readinessProbe:
            httpGet:
              path: /healthz
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /healthz
              port: 80
            initialDelaySeconds: 15
            periodSeconds: 20
```

---

## **5. Services & The Modern Gateway API**

### 🔹 ClusterIP & Headless Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: ClusterIP
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 80
```

### 🔹 Kubernetes Gateway API (Official Evolution of Ingress)

The Gateway API provides expressive, role-oriented routing:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: prod-gateway
  namespace: default
spec:
  gatewayClassName: eg
  listeners:
    - name: http
      protocol: HTTP
      port: 80
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: web-route
  namespace: default
spec:
  parentRefs:
    - name: prod-gateway
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /api
      backendRefs:
        - name: web-service
          port: 80
```

---

## **6. Pod Security Standards (PSA/PSS)**

Enforce built-in Pod Security Admission by labeling namespaces:

```bash
# Enforce restricted profile (drops all root privileges, requires seccomp)
kubectl label --overwrite ns production \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/enforce-version=latest \
  pod-security.kubernetes.io/warn=restricted
```

---

## **7. ConfigMaps, Secrets & RBAC**

```bash
# Create ConfigMap from literal or file
kubectl create configmap app-config --from-literal=ENVIRONMENT=production

# Create Secret
kubectl create secret generic app-secrets --from-literal=DB_PASSWORD="SuperSecretPassword!"

# Check authorization permissions (can I create deployments in default?)
kubectl auth can-i create deployments --namespace default
```

---

## 📚 **Learning Resources**

* 🔗 [Official Kubernetes Documentation](https://kubernetes.io/docs/)
* 📦 [Kubernetes Gateway API Specification](https://gateway-api.sigs.k8s.io/)
* 🛡️ [Pod Security Standards Guide](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
* 💻 [Kubectl Command Reference](https://kubernetes.io/docs/reference/kubectl/)
