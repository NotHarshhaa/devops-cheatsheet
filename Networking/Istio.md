# ⛵ Istio Cheatsheet

![text](https://imgur.com/QLlMSCp.png)

**Istio** is an open-source, CNCF-graduated service mesh that provides an advanced networking and security layer across distributed Kubernetes microservices. It delivers transparent traffic management, zero-trust security (mTLS), and rich telemetry without requiring code changes to applications.

---

## **1. Modern Architecture: Istiod & Ambient Mesh**

### 🔹 Consolidated Control Plane (`istiod`)

> [!IMPORTANT]
> **Modern Architecture Update**: Legacy Istio microservices (Pilot, Citadel, Galley, and Mixer) were consolidated. **Mixer was completely removed**, and remaining control plane functions run inside a single unified binary: **`istiod`**.

* **`istiod`**: Translates high-level routing rules and security policies into Envoy xDS configuration and serves as the Certificate Authority (CA) issuing mTLS identities.
* **Data Plane**:
  * **Sidecar Mode**: Envoy proxy deployed in each application pod (`istio-proxy`).
  * **Ambient Mode (Sidecar-less)**: A shared node-level Layer 4 secure transport proxy (**ztunnel**) paired with optional Layer 7 **waypoint proxies**, eliminating per-pod proxy overhead.

---

## **2. `istioctl` CLI Quick Reference**

### 🔹 Installation & Pre-Flight Checks

```bash
# Verify Kubernetes cluster compatibility before installation
istioctl x precheck

# Install Istio with the default profile
istioctl install --set profile=default -y

# Verify control plane installation
istioctl verify-install

# Upgrade Istio control plane
istioctl upgrade
```

### 🔹 Namespace Injection & Troubleshooting

```bash
# Enable automatic sidecar injection on a namespace
kubectl label namespace default istio-injection=enabled

# Analyze cluster configurations for errors and misconfigurations
istioctl analyze

# Check synchronization status of all Envoy data plane proxies
istioctl proxy-status

# Retrieve detailed cluster configuration from a specific pod
istioctl proxy-config clusters <pod-name>.default

# View Envoy routes inside a pod
istioctl proxy-config routes <pod-name>.default

# Open Kiali observability dashboard
istioctl dashboard kiali

# Open Jaeger distributed tracing dashboard
istioctl dashboard jaeger
```

---

## **3. Traffic Management Manifests**

### 🔹 Ingress Gateway (`Gateway`)

Exposes mesh services to external traffic:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: my-gateway
  namespace: default
spec:
  selector:
    istio: ingressgateway
  servers:
    - port:
        number: 80
        name: http
        protocol: HTTP
      hosts:
        - "api.example.com"
```

---

### 🔹 Routing & Canary Traffic Splitting (`VirtualService`)

Splits traffic between two versions (`v1` 90%, `v2` 10%) and sets route timeouts:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-service-routing
  namespace: default
spec:
  hosts:
    - "api.example.com"
  gateways:
    - my-gateway
    - mesh
  http:
    - match:
        - uri:
            prefix: "/api/v1"
      route:
        - destination:
            host: my-service
            subset: v1
          weight: 90
        - destination:
            host: my-service
            subset: v2
          weight: 10
      timeout: 5s
      retries:
        attempts: 3
        perTryTimeout: 1s
        retryOn: "5xx,connect-failure,refused-stream"
```

---

### 🔹 Subsets & Circuit Breaking (`DestinationRule`)

Defines version subsets, load balancing algorithms, and connection pool thresholds:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: my-service-destrules
  namespace: default
spec:
  host: my-service
  trafficPolicy:
    loadBalancer:
      simple: ROUND_ROBIN
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 10
        maxRequestsPerConnection: 10
    outlierDetection:
      consecutive5xxErrors: 3
      interval: 10s
      baseEjectionTime: 30s
      maxEjectionPercent: 100
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

---

## **4. Zero-Trust Security & Policies**

### 🔹 Enforce Mutual TLS (`PeerAuthentication`)

Enforce strict mTLS across all services in a namespace:

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: default
spec:
  mtls:
    mode: STRICT  # STRICT (all mTLS) or PERMISSIVE (accepts both plaintext and mTLS)
```

---

### 🔹 Role-Based Access Control (`AuthorizationPolicy`)

Allow only the `frontend` service account to access the `backend` service via HTTP GET:

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: backend-rbac
  namespace: default
spec:
  selector:
    matchLabels:
      app: backend
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/default/sa/frontend-service-account"]
      to:
        - operation:
            methods: ["GET"]
            paths: ["/api/v1/*"]
```

---

## **5. Observability & Telemetry Integration**

Install standard telemetry add-ons from the official Istio distribution samples:

```bash
kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/addons/prometheus.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/addons/grafana.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/addons/kiali.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/addons/jaeger.yaml
```

---

## 📚 **Learning Resources**

* 🔗 [Official Istio Documentation](https://istio.io/latest/docs/)
* 📦 [Istio GitHub Repository](https://github.com/istio/istio)
* 🛡️ [Istio Ambient Mesh Overview](https://istio.io/latest/docs/ambient/overview/)
* 🔍 [Istioctl Command Reference](https://istio.io/latest/docs/reference/commands/istioctl/)
