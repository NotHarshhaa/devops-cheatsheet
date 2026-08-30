# ⚡ Linkerd Cheatsheet

![text](https://imgur.com/xyQcgGf.png)

**Linkerd** is an ultralight, security-first service mesh for Kubernetes. Built in Rust and Go, Linkerd is known for its simplicity, minimal resource footprint, and zero-configuration automatic mutual TLS (mTLS). It is a graduated project under the CNCF.

---

## **1. Core Concepts & Architecture**

| Component | Description |
| --- | --- |
| **Control Plane** | Lightweight Go daemons (`destination`, `identity`, `proxy-injector`) managing policies and mTLS certificates. |
| **Data Plane** | Ultra-fast `linkerd2-proxy` written in Rust, injected transparently into Kubernetes pods as a sidecar. |
| **Automatic mTLS** | Encrypts and authenticates all TCP and HTTP traffic between meshed pods by default without manual CA configuration. |
| **Extensions** | Modular features installed separately (e.g. `viz` for observability, `smi` for traffic splitting, `multicluster`). |

---

## **2. `linkerd` CLI Quick Reference**

### 🔹 Installation & Verification

```bash
# Validate Kubernetes cluster readiness
linkerd check --pre

# Install Linkerd Custom Resource Definitions (CRDs)
linkerd install --crds | kubectl apply -f -

# Install Linkerd control plane
linkerd install | kubectl apply -f -

# Verify control plane health
linkerd check
```

### 🔹 Installing Observability Extension (`viz`)

```bash
# Install the visualization & metrics extension
linkerd viz install | kubectl apply -f -

# Check viz component health
linkerd viz check

# Launch the Linkerd web dashboard in your browser
linkerd viz dashboard
```

---

## **3. Meshing Applications & Sidecar Injection**

Linkerd injects the micro-proxy via Kubernetes annotations.

### 🔹 Mesh a Namespace

```bash
# Label a namespace for automatic proxy injection
kubectl annotate namespace default linkerd.io/inject=enabled
```

### 🔹 Mesh an Existing Deployment via CLI

```bash
kubectl get deploy my-app -o yaml | linkerd inject - | kubectl apply -f -
```

---

## **4. Real-Time Telemetry & Diagnostics**

Linkerd provides live, production-safe diagnostic commands directly from the terminal.

```bash
# View real-time request rates, success rates, and latency percentiles
linkerd viz stat deploy

# Stat specific service in a namespace
linkerd viz stat svc -n default

# Real-time top requests by path (similar to Unix top)
linkerd viz top deploy/web

# Inspect live HTTP requests and headers in real time (Tap API)
linkerd viz tap deploy/web --namespace default

# Filter live tap traffic by route and status code
linkerd viz tap deploy/web --path /api/v1 --status 500
```

---

## **5. Policy & Zero-Trust Security (Linkerd 2.12+)**

Linkerd uses `Server` and `AuthorizationPolicy` CRDs to enforce zero-trust inbound access control.

### 🔹 Define a Protected Server (`Server`)

```yaml
apiVersion: policy.linkerd.io/v1beta1
kind: Server
metadata:
  name: admin-http
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: web
  port: 8080
  proxyProtocol: HTTP/1
```

### 🔹 Authorize Client Access (`AuthorizationPolicy`)

Allow only the `ingress-controller` service account to access the `admin-http` server:

```yaml
apiVersion: policy.linkerd.io/v1alpha1
kind: AuthorizationPolicy
metadata:
  name: allow-ingress-to-admin
  namespace: default
spec:
  targetRef:
    group: policy.linkerd.io
    kind: Server
    name: admin-http
  requiredAuthenticationRefs:
    - group: policy.linkerd.io
      kind: MeshTLSAuthentication
      name: ingress-controller-auth
---
apiVersion: policy.linkerd.io/v1alpha1
kind: MeshTLSAuthentication
metadata:
  name: ingress-controller-auth
  namespace: default
spec:
  identities:
    - "ingress-controller.ingress-nginx.serviceaccount.identity.linkerd.cluster.local"
```

---

## **6. Canary Releases & Traffic Splitting (`TrafficSplit`)**

Split traffic between stable and canary versions using the Service Mesh Interface (SMI):

```yaml
apiVersion: split.smi-spec.io/v1alpha2
kind: TrafficSplit
metadata:
  name: web-traffic-split
  namespace: default
spec:
  service: web-svc
  backends:
    - service: web-svc-v1
      weight: 900m   # 90%
    - service: web-svc-v2
      weight: 100m   # 10%
```

---

## 📚 **Learning Resources**

* 🔗 [Official Linkerd Documentation](https://linkerd.io/2/overview/)
* 📦 [Linkerd GitHub Repository](https://github.com/linkerd/linkerd2)
* 🛡️ [Linkerd Policy Reference](https://linkerd.io/2/features/server-policy/)
* 🎓 [Service Mesh Academy](https://buoyant.io/service-mesh-academy)
