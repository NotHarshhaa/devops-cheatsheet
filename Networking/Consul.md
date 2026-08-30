# 🌐 Consul Cheatsheet

![text](https://imgur.com/RWncIhL.png)

**HashiCorp Consul** is a full-featured service networking and service mesh platform. It provides automated service discovery, health monitoring, a distributed key/value store, and secure service-to-service communication with mutual TLS (mTLS) and fine-grained access intentions.

---

## **1. Architecture & Core Concepts**

| Concept | Description |
| --- | --- |
| **Agent** | The core Consul daemon running on every cluster node in either **Server** or **Client** mode. |
| **Server Mode** | Maintains cluster state via Raft consensus, handles queries, and preserves catalog data (3 or 5 per DC recommended). |
| **Client Mode** | Lightweight process forwarding RPCs to servers and running local health checks. |
| **Service Discovery** | Automated registration and discovery via HTTP API or DNS interface (`.service.consul`). |
| **Consul Connect** | The service mesh feature providing encrypted mTLS and proxy-based traffic authorization. |
| **Intentions** | Declarative L4/L7 authorization rules defining which services can talk to each other. |

---

## **2. CLI Quick Reference**

### 🔹 Starting & Inspecting Clusters

```bash
# Start a local development server
consul agent -dev -client=0.0.0.0

# Start an agent using a configuration file
consul agent -config-file=/etc/consul.d/consul.hcl

# List all known cluster members and their gossip states
consul members

# Check Raft cluster leader and peers
consul operator raft list-peers

# Reload agent configuration without restarting
consul reload
```

---

## **3. Service Registration & Health Checks**

Services can be registered via configuration files located in `/etc/consul.d/` or via the HTTP API.

### Service Definition (`/etc/consul.d/web.hcl`)

```hcl
service {
  name = "web"
  id   = "web-1"
  port = 8080
  tags = ["primary", "v1"]

  # Service health check
  check {
    id       = "web-check"
    name     = "HTTP Health Check"
    http     = "http://localhost:8080/healthz"
    method   = "GET"
    interval = "10s"
    timeout  = "2s"
  }

  # Service Mesh Connect Sidecar definition
  connect {
    sidecar_service {
      proxy {
        upstreams = [
          {
            destination_name = "payment"
            local_bind_port  = 9001
          }
        ]
      }
    }
  }
}
```

Register and query:

```bash
# Register services defined in config directory
consul services register /etc/consul.d/web.hcl

# List all registered services
consul catalog services

# List healthy nodes running the "web" service
consul catalog nodes -service=web
```

---

## **4. DNS Interface Queries**

Consul runs a built-in DNS server (default port `8600`). Query service records directly using `dig`:

```bash
# Discover IP addresses of a service
dig @127.0.0.1 -p 8600 web.service.consul

# Query SRV records (includes port and target hostname)
dig @127.0.0.1 -p 8600 web.service.consul SRV

# Query services in a specific datacenter
dig @127.0.0.1 -p 8600 web.service.dc2.consul
```

---

## **5. Distributed Key/Value (KV) Store**

The KV store provides dynamic configuration management without service restarts.

```bash
# Set a key-value pair
consul kv put config/web/db_host "192.168.1.100"
consul kv put config/web/db_port "5432"

# Retrieve a value
consul kv get config/web/db_host

# List all keys recursively
consul kv get -recurse config/

# Delete a key
consul kv delete config/web/db_host

# Delete an entire path recursively
consul kv delete -recurse config/web/
```

---

## **6. Service Mesh: Connect & Intentions**

Consul Connect injects Envoy sidecars to provide mutual TLS (mTLS) and traffic segmentation.

### 🔹 Starting Envoy Sidecar Proxy

```bash
consul connect envoy -sidecar-for=web-1
```

### 🔹 Traffic Authorization (Intentions)

Intentions control which services are allowed to establish connections:

```bash
# Deny all traffic by default (Zero-Trust)
consul intention create -deny "* " "* "

# Allow the web service to talk to the payment service
consul intention create -allow web payment

# Check if web is allowed to connect to payment
consul intention check web payment

# List all defined intentions
consul intention list

# Delete an intention
consul intention delete web payment
```

---

## **7. Access Control Lists (ACLs)**

Consul uses tokens and policies to secure cluster APIs, KV data, and service registration.

```bash
# Bootstrap the ACL system (creates initial management token)
consul acl bootstrap

# Create a policy from HCL file
consul acl policy create -name "web-policy" -rules @web-rules.hcl

# Generate a token linked to a policy
consul acl token create -description "Web Service Token" -policy-name "web-policy"
```

Example Policy (`web-rules.hcl`):

```hcl
service "web" {
  policy = "write"
}

key_prefix "config/web/" {
  policy = "read"
}
```

---

## **8. Consul on Kubernetes**

Deploy Consul using the official Helm chart:

```bash
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
helm install consul hashicorp/consul --create-namespace -n consul --values values.yaml
```

Example `values.yaml`:

```yaml
global:
  name: consul
  datacenter: dc1
connectInject:
  enabled: true
syncCatalog:
  enabled: true
```

### 🔹 Automatic Sidecar Injection in Pods

Add annotations to your Kubernetes deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  template:
    metadata:
      annotations:
        consul.hashicorp.com/connect-inject: "true"
        consul.hashicorp.com/connect-service-upstreams: "payment:9001"
    spec:
      containers:
        - name: web
          image: my-app:v1
          env:
            - name: PAYMENT_SERVICE_URL
              value: "http://localhost:9001"
```

---

## 📚 **Learning Resources**

* 🔗 [Official Consul Documentation](https://developer.hashicorp.com/consul/docs)
* 🎓 [HashiCorp Developer Tutorials](https://developer.hashicorp.com/consul/tutorials)
* 📦 [Consul Helm Chart Reference](https://developer.hashicorp.com/consul/docs/k8s/helm)
