# 📊 Grafana Cheatsheet

![text](https://imgur.com/j07r4L6.png)

**Grafana** is the leading open-source visualization, observability, and metrics dashboard platform. It enables teams to query, visualize, alert on, and understand metrics, logs, and traces regardless of where they are stored.

---

## **1. Core Architecture & Concepts**

| Concept | Description |
| --- | --- |
| **Data Sources** | Connectors that fetch telemetry from backends (Prometheus, Loki, Tempo, OpenSearch, CloudWatch, PostgreSQL). |
| **Panels** | Individual visualization widgets (Time Series, Bar Chart, Stat, Gauge, Table, Pie Chart, Heatmap, Node Graph). |
| **Dashboards** | Cohesive grid layouts of organized panels, variables, and annotations. |
| **Unified Alerting** | Centralized alert evaluation engine with notification policies, contact points, and mute timings. |
| **Transformations** | Client-side math, joins, filtering, and aggregations applied to raw query outputs before rendering. |

---

## **2. Installation & Quickstart**

### 🔹 Run with Docker

```bash
docker run -d \
  --name=grafana \
  -p 3000:3000 \
  -v grafana-storage:/var/lib/grafana \
  grafana/grafana:latest
```

Default credentials: `admin` / `admin`.

### 🔹 Linux Package Installation (Ubuntu / Debian)

```bash
sudo apt-get install -y apt-transport-https software-properties-common wget
sudo mkdir -p /etc/apt/keyrings/
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list

sudo apt-get update
sudo apt-get install -y grafana
sudo systemctl enable --now grafana-server
```

### 🔹 Kubernetes via Helm

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm install my-grafana grafana/grafana --namespace monitoring --create-namespace
```

---

## **3. Declarative Provisioning as Code (IaC)**

Instead of configuring data sources and dashboards manually via the UI, Grafana supports automated file-based provisioning.

### 🔹 Data Source Provisioning (`/etc/grafana/provisioning/datasources/datasources.yaml`)

```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus-server:9090
    isDefault: true
    jsonData:
      httpMethod: POST
      timeInterval: 15s

  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    jsonData:
      maxLines: 1000
```

### 🔹 Dashboard Provisioning (`/etc/grafana/provisioning/dashboards/dashboards.yaml`)

```yaml
apiVersion: 1

providers:
  - name: 'Default Provider'
    orgId: 1
    folder: 'Production'
    type: file
    disableDeletion: false
    editable: true
    options:
      path: /var/lib/grafana/dashboards
```

---

## **4. Dynamic Variables & Templating**

Variables create interactive drop-downs at the top of dashboards that update queries across all panels.

| Variable Type | Purpose | Example |
| --- | --- | --- |
| **Query** | Dynamically populate choices from a data source | `label_values(node_uname_info, instance)` |
| **Custom** | Comma-separated hardcoded list | `production,staging,development` |
| **Interval** | Auto-calculated time aggregation window | `auto, 1m, 5m, 1h` |
| **Datasource** | Let users switch the underlying backend dynamically | Type: `prometheus` |

### Using Variables in Queries

```promql
# Single selection
node_cpu_seconds_total{instance="$instance"}

# Multi-selection (regex match)
node_cpu_seconds_total{instance=~"^($instance)$"}
```

---

## **5. Modern Unified Alerting (Grafana 9 - 11+)**

Grafana's Unified Alerting system manages alerts across both Grafana-managed and Prometheus/Loki data sources.

### Key Components

```plaintext
Alert Rule (Query & Condition)
       ↓
Evaluation Interval & For Duration (Pending → Firing)
       ↓
Labels Matching Routing Tree (Notification Policy)
       ↓
Contact Point (Slack, PagerDuty, Discord, Webhook)
```

### Alert Rule Example (YAML Provisioning)

```yaml
apiVersion: 1
groups:
  - orgId: 1
    name: host_alerts
    folder: Infrastructure
    interval: 1m
    rules:
      - uid: high_cpu_usage
        title: High CPU Usage (> 85%)
        condition: B
        data:
          - refId: A
            queryType: ''
            relativeTimeRange:
              from: 300
              to: 0
            datasourceUid: prometheus
            model:
              expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
          - refId: B
            queryType: ''
            model:
              type: threshold
              expression: A
              conditions:
                - evaluator:
                    type: gt
                    params: [85]
        noDataState: NoData
        execErrState: Error
        for: 5m
        labels:
          severity: critical
          team: ops
        annotations:
          summary: "Instance {{ $labels.instance }} CPU is {{ $values.B.Value }}%"
```

### 🔹 Contact Points & Mute Timings

* **Contact Points**: Define notification destinations (e.g., Slack webhook URL, PagerDuty integration key, Microsoft Teams).
* **Mute Timings**: Suppress alerts during planned maintenance windows or non-working hours.

---

## **6. LogQL Cheatsheet (Grafana Loki)**

Loki integrates seamlessly into Grafana for log exploration.

```logql
# Stream selector: Filter logs from specific application
{app="api-gateway", env="production"}

# Line filter: Find lines containing "error" (case insensitive: (?i))
{app="api-gateway"} |= "error"

# Negative filter: Exclude health checks
{app="api-gateway"} != "GET /healthz"

# JSON Parser: Extract fields and filter by numeric status code
{app="api-gateway"} | json | status_code >= 500

# Regex Parser: Extract IP and path
{app="api-gateway"} | regexp "(?P<ip>\\d+\\.\\d+\\.\\d+\\.\\d+) - - \\[(?P<time>.*?)\\] \"(?P<method>\\w+) (?P<path>.*?)\""

# Metric Query: Log rate per second over 5 minutes
rate({app="api-gateway"} |= "error" [5m])

# Quantile calculation on parsed latency
quantile_over_time(0.99, {app="api-gateway"} | json | unwrap duration_ms [5m]) by (endpoint)
```

---

## **7. Modern Visualization Panels**

> [!TIP]
> Modern Grafana (v8+) includes built-in core panels for **Pie Charts**, **Bar Charts**, and **Time Series**. External legacy plugins (e.g. `grafana-piechart-panel`) are obsolete and should not be installed.

* **Time Series**: The standard panel for metrics over time with threshold lines, area gradients, and multiple Y-axes.
* **Stat Panel**: Displays single prominent values or summary counters with sparkline backgrounds.
* **Gauge**: Circular or bar-style meters showing thresholds (e.g., Disk utilization %).
* **Table**: Tabular data supporting column filtering, cell coloring, and value mappings.
* **State Timeline / Status History**: Visualizes state changes over time (e.g., HTTP status, service up/down).
* **Canvas**: Freeform drag-and-drop layout builder for server architecture diagrams and IoT floorplans.

---

## **8. Security & User Management**

### 🔹 Enforce HTTPS (`/etc/grafana/grafana.ini`)

```ini
[server]
protocol = https
http_port = 3000
cert_file = /etc/ssl/certs/grafana.crt
cert_key = /etc/ssl/private/grafana.key

[security]
admin_user = admin
disable_gravatar = true
cookie_secure = true
```

### 🔹 Role-Based Access Control (RBAC)

* **Viewer**: Read-only access to dashboards.
* **Editor**: Create and edit dashboards and alerts (cannot modify data sources).
* **Admin**: Full control over org data sources, users, and provisioning.

---

## **9. Troubleshooting & Performance Tips**

1. **Query Inspector**: Open Panel Menu → **Inspect** → **Data / Query** to view raw queries, latency, and response payloads.
2. **Optimize Dashboard Auto-Refresh**: Set refresh rates to **1m or 5m** instead of 5s on large public NOC dashboards to reduce database load.
3. **Use Recording Rules in Prometheus**: Precompute expensive aggregations in Prometheus so Grafana panels query instant pre-calculated series.
4. **Log Inspection**: Check `/var/log/grafana/grafana.log` for data source connection timeouts and authentication errors.

---

## 📚 **Learning Resources**

* 🔗 [Official Grafana Documentation](https://grafana.com/docs/grafana/latest/)
* 📦 [Grafana Community Dashboards](https://grafana.com/grafana/dashboards/)
* 📜 [LogQL Official Guide](https://grafana.com/docs/loki/latest/query/)
* 🎓 [Grafana Fundamentals Tutorials](https://grafana.com/tutorials/)
