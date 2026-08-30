# 🚀 Envoy Proxy Cheatsheet

![text](https://imgur.com/iw5sG1a.png)

**Envoy** is a high-performance, open-source C++ edge and service proxy designed for cloud-native architectures. Developed by Lyft and graduated under the CNCF, Envoy serves as the primary data plane proxy for leading service meshes (such as Istio, Consul Connect, and AWS App Mesh) and modern API Gateways.

---

## **1. Core Architecture & Concepts**

```plaintext
Downstream Client
      ↓
[Listener: Port 10000]
      ↓
[Filter Chain: HTTP Connection Manager]
      ↓
[Route: /api/v1 -> cluster_backend]
      ↓
[Cluster: Load Balancer (Round Robin)]
      ↓
Upstream Endpoints (IP:Port, IP:Port)
```

| Term | Description |
| --- | --- |
| **Downstream** | The client initiating requests to Envoy. |
| **Upstream** | The backend service instances receiving forwarded requests. |
| **Listener** | Named network location (e.g. port 80, 443) that accepts incoming connections. |
| **Filter / Filter Chain** | Pipeline that inspects and transforms data (HTTP parsing, rate limiting, TLS termination). |
| **Route** | Maps match conditions (paths, headers, methods) to target upstream clusters. |
| **Cluster** | A logical group of upstream endpoints with load balancing and health check rules. |

---

## **2. Complete Working Configuration (`envoy.yaml`)**

The following complete configuration listens on port `10000` and forwards HTTP requests to an upstream cluster with round-robin load balancing and connection timeouts:

```yaml
admin:
  address:
    socket_address:
      address: 0.0.0.0
      port_value: 9901

static_resources:
  listeners:
    - name: listener_http
      address:
        socket_address:
          address: 0.0.0.0
          port_value: 10000
      filter_chains:
        - filters:
            - name: envoy.filters.network.http_connection_manager
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
                stat_prefix: ingress_http
                access_log:
                  - name: envoy.access_loggers.stdout
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.access_loggers.stream.v3.StdoutAccessLog
                route_config:
                  name: local_route
                  virtual_hosts:
                    - name: backend_service
                      domains: ["*"]
                      routes:
                        - match:
                            prefix: "/"
                          route:
                            cluster: service_backend
                            timeout: 15s
                            retry_policy:
                              retry_on: "5xx,connect-failure,reset"
                              num_retries: 3
                http_filters:
                  - name: envoy.filters.http.router
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
    - name: service_backend
      connect_timeout: 0.25s
      type: STRICT_DNS
      lb_policy: ROUND_ROBIN
      load_assignment:
        cluster_name: service_backend
        endpoints:
          - lb_endpoints:
              - endpoint:
                  address:
                    socket_address:
                      address: web-app
                      port_value: 8080
```

---

## **3. Running & Validating Envoy**

### 🔹 Run with Docker

```bash
# Run Envoy container mounting your configuration
docker run -d \
  --name envoy \
  -p 10000:10000 \
  -p 9901:9901 \
  -v $(pwd)/envoy.yaml:/etc/envoy/envoy.yaml \
  envoyproxy/envoy:v1.30-latest
```

### 🔹 CLI Validation

```bash
# Validate configuration file without starting proxy
envoy -c envoy.yaml --mode validate

# Run Envoy with debug logging
envoy -c envoy.yaml -l debug
```

---

## **4. Dynamic Configuration: The xDS APIs**

Instead of static YAML files, modern production meshes configure Envoy dynamically over gRPC using the **xDS** family of APIs:

| API | Name | Purpose |
| --- | --- | --- |
| **LDS** | Listener Discovery Service | Dynamically adds, updates, or deletes listeners and filter chains. |
| **RDS** | Route Discovery Service | Dynamically updates routing tables and virtual hosts. |
| **CDS** | Cluster Discovery Service | Dynamically adds or removes upstream clusters and load balancer settings. |
| **EDS** | Endpoint Discovery Service | Dynamically discovers IP addresses of upstream service pods/instances. |
| **SDS** | Secret Discovery Service | Dynamically delivers and rotates TLS certificates without restarting the proxy. |

---

## **5. Envoy Admin Interface (`:9901`)**

Envoy exposes an HTTP administrative interface for real-time diagnostics:

```bash
# Check all aggregated metrics and counters
curl http://localhost:9901/stats

# Filter metrics for error rates or specific cluster
curl http://localhost:9901/stats?filter=cluster.service_backend

# Dump active merged configuration (static + dynamic xDS)
curl http://localhost:9901/config_dump

# View upstream cluster health and endpoints status
curl http://localhost:9901/clusters

# Change logging verbosity dynamically at runtime
curl -X POST http://localhost:9901/logging?level=debug
```

---

## **6. Resilience: Circuit Breaking & Outlier Detection**

Configure circuit breaking within a cluster definition to prevent cascading failures:

```yaml
clusters:
  - name: service_backend
    connect_timeout: 0.5s
    type: STRICT_DNS
    circuit_breakers:
      thresholds:
        - priority: DEFAULT
          max_connections: 1024
          max_pending_requests: 100
          max_requests: 1024
          max_retries: 3
    outlier_detection:
      consecutive_5xx: 3
      interval: 10s
      base_ejection_time: 30s
      max_ejection_percent: 50
```

---

## **7. Production Best Practices**

1. **Always Set Explicit Timeouts**: Never rely on infinite timeouts; set both per-route request timeouts and cluster connection timeouts.
2. **Enable Outlier Detection**: Automatically eject misbehaving instances from the load-balancing pool.
3. **Use SDS for Certificate Rotation**: Never bake TLS certificates into containers; use SDS to rotate keys automatically.
4. **Secure the Admin Port**: Never expose port `9901` to public traffic; bind it strictly to `127.0.0.1` or protect it behind firewall policies.

---

## 📚 **Learning Resources**

* 🔗 [Official Envoy Documentation](https://www.envoyproxy.io/docs/envoy/latest/)
* 📦 [Envoy GitHub Repository](https://github.com/envoyproxy/envoy)
* 🎓 [Envoy Katacoda & Interactive Tutorials](https://www.envoyproxy.io/community)
