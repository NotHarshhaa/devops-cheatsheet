# 🔥 Prometheus Cheatsheet

![text](https://imgur.com/nthHFQk.png)

**Prometheus** is an open-source, Cloud Native Computing Foundation (CNCF) graduated systems monitoring and alerting toolkit. It powers cloud-native observability by pulling high-dimensional time-series metrics over HTTP via a dimensional data model (metric name and key-value labels) and querying them with **PromQL**.

---

## **1. Core Architecture & Concepts**

```plaintext
+-------------------------------------------------------------------+
|                           Prometheus Server                       |
|  +-------------------+  +-------------------+  +---------------+  |
|  | Service Discovery |->| Retrieval (Pull)  |->| TSDB (Storage)|  |
|  +-------------------+  +-------------------+  +---------------+  |
|                                  |                     |          |
+----------------------------------|---------------------|----------+
         ^                         | (scrape /metrics)   | (PromQL)
         |                         v                     v
   Kubernetes / AWS / File   Target Endpoints     Grafana / Web UI
                             (Node Exporter,
                              App /metrics)
```

### 🔹 The 4 Core Metric Types

| Type | Description | Example |
| --- | --- | --- |
| **Counter** | Cumulative metric that only increases or resets to zero on restart. | `http_requests_total`, `node_network_receive_bytes_total` |
| **Gauge** | Value that can arbitrarily go up or down representing current state. | `node_memory_MemFree_bytes`, `process_resident_memory_bytes` |
| **Histogram** | Samples observations (usually request durations or sizes) into configurable buckets. | `http_request_duration_seconds_bucket` |
| **Summary** | Similar to histogram, but calculates configurable quantiles directly on the client side. | `rpc_duration_seconds{quantile="0.99"}` |

---

## **2. Installation & Quickstart**

### 🔹 Docker Quickstart

```bash
docker run -d \
  --name=prometheus \
  -p 9090:9090 \
  -v ./prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus:latest
```

### 🔹 Kubernetes via Helm (`kube-prometheus-stack`)

The industry standard for deploying Prometheus, Alertmanager, and Grafana on Kubernetes:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

---

## **3. Prometheus Configuration (`prometheus.yml`)**

```yaml
global:
  scrape_interval: 15s     # How frequently to scrape targets
  evaluation_interval: 15s # How frequently to evaluate rules
  scrape_timeout: 10s

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - "rules/*.yml"

scrape_configs:
  # Scrape Prometheus itself
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Scrape Node Exporter (Host metrics)
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  # File-based Service Discovery (dynamic targets without restarts)
  - job_name: 'microservices'
    file_sd_configs:
      - files:
          - '/etc/prometheus/targets/*.json'
        refresh_interval: 1m
```

---

## **4. PromQL Real-World Formula Cheatsheet**

PromQL (Prometheus Query Language) lets you filter, aggregate, and compute time-series data on the fly.

### 🔹 Instant Vectors vs Range Vectors
* Instant vector: `http_requests_total` (evaluates at a single point in time)
* Range vector: `http_requests_total[5m]` (evaluates over a buffer time window)

### 🔹 Requests Per Second (RPS) & Error Rates

```promql
# Total request rate per second per service over the last 5 minutes
sum by (service) (rate(http_requests_total[5m]))

# 5xx HTTP Server Error Rate percentage
(
  sum(rate(http_requests_total{status=~"5.."}[5m]))
  /
  sum(rate(http_requests_total[5m]))
) * 100
```

### 🔹 Calculate P90, P95, and P99 Latency (Histograms)

```promql
# 95th Percentile request duration across all endpoints
histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))

# 99th Percentile request duration grouped by handler
histogram_quantile(0.99, sum by (le, handler) (rate(http_request_duration_seconds_bucket[5m])))
```

### 🔹 CPU Usage Percentage

```promql
# Per-instance CPU utilization percentage
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

### 🔹 Available Memory Percentage

```promql
# Percentage of available memory remaining
(node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100
```

### 🔹 Predict Disk Full (Linear Regression)

```promql
# Predict if disk will fill within the next 4 hours based on the last 1 hour trend
predict_linear(node_filesystem_free_bytes{mountpoint="/"}[1h], 4 * 3600) < 0
```

---

## **5. Recording & Alerting Rules**

### 🔹 Recording Rules (Precompute Expensive Queries)

File: `rules/recording_rules.yml`:

```yaml
groups:
  - name: service_performance
    rules:
      - record: job:http_requests:rate5m
        expr: sum by (job) (rate(http_requests_total[5m]))
```

### 🔹 Alerting Rules

File: `rules/alert_rules.yml`:

```yaml
groups:
  - name: infrastructure_alerts
    rules:
      - alert: HostHighCpuLoad
        expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 85
        for: 5m
        labels:
          severity: warning
          team: devops
        annotations:
          summary: "Host high CPU load on {{ $labels.instance }}"
          description: "CPU load is currently at {{ $value | printf \"%.2f\" }}% for over 5 minutes."

      - alert: TargetDown
        expr: up == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Target {{ $labels.instance }} is down"
          description: "Scrape job {{ $labels.job }} has been unreachable for 2 minutes."
```

---

## **6. Alertmanager Configuration (`alertmanager.yml`)**

Alertmanager handles deduplication, grouping, silencing, and routing of alerts to downstream notification channels.

```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'slack-notifications'

  routes:
    # Critical alerts route to PagerDuty
    - match:
        severity: critical
      receiver: 'pagerduty-high-priority'

receivers:
  - name: 'slack-notifications'
    slack_configs:
      - channel: '#alerts-devops'
        api_url: 'https://hooks.slack.com/services/T000/B000/XXXX'
        send_resolved: true
        text: "{{ .CommonAnnotations.description }}"

  - name: 'pagerduty-high-priority'
    pagerduty_configs:
      - service_key: 'YOUR-PAGERDUTY-SERVICE-KEY'
        send_resolved: true
```

---

## **7. Promtool CLI (Validation & Diagnostics)**

`promtool` is the official CLI utility bundled with Prometheus for testing and verification.

```bash
# Validate prometheus.yml configuration file
promtool check config /etc/prometheus/prometheus.yml

# Validate alerting and recording rules files
promtool check rules /etc/prometheus/rules/*.yml

# Execute an instant PromQL query from CLI
promtool query instant http://localhost:9090 'up'

# Run unit tests on PromQL rules
promtool test rules test_rules.yml
```

---

## **8. Kubernetes Monitoring: ServiceMonitor & PodMonitor**

When using the Prometheus Operator, discover scrape targets declaratively using Custom Resource Definitions (CRDs):

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: api-service-monitor
  namespace: monitoring
  labels:
    release: monitoring
spec:
  selector:
    matchLabels:
      app: my-api
  endpoints:
    - port: http-metrics
      path: /metrics
      interval: 15s
```

---

## **9. High Cardinality & Best Practices**

> [!CAUTION]
> **Cardinality Explosion**: Every unique combination of key-value labels creates a new time-series. Never store unbounded values (such as user IDs, UUIDs, email addresses, or timestamps) in metric labels!

1. **Keep Label Values Bounded**: Use labels with finite sets (e.g., `status_code`, `method`, `environment`, `region`).
2. **Use `rate()` Instead of `irate()` for Alerts**: `rate()` calculates average per-second change over the entire window, smoothing spikes; `irate()` calculates instantaneous rate from the last two data points and is only for fast-moving graphs.
3. **Use Recording Rules for Dashboards**: Precompute heavy aggregations to reduce Grafana query load.
4. **Set Scrape Timeouts**: Always ensure `scrape_timeout <= scrape_interval` (default timeout is usually 10s for a 15s interval).

---

## 📚 **Learning Resources**

* 🔗 [Official Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)
* 🔍 [PromQL Cheat Sheet & Guide](https://prometheus.io/docs/prometheus/latest/querying/basics/)
* 📦 [Prometheus Community Helm Charts](https://github.com/prometheus-community/helm-charts)
* 🎓 [PromLabs PromQL Tutorial](https://promlabs.com/promql-cheat-sheet/)
