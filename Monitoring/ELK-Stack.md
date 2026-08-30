# 🔍 ELK Stack Cheatsheet

![text](https://imgur.com/wLayBA4.png)

The **ELK Stack** (Elasticsearch, Logstash, Kibana) is the industry-standard open-source platform for search, centralized log management, and real-time operational analytics. Modern architectures also leverage **Beats** (lightweight data shippers), **Fleet & Elastic Agent** (unified host management), or **OpenSearch** (the Linux Foundation open-source fork).

---

## **1. Core Components Overview**

| Component | Role | Description |
| --- | --- | --- |
| **Elasticsearch** | Search & Storage | Distributed, JSON-based RESTful search engine built on Apache Lucene. |
| **Logstash** | Ingestion & Transform | Server-side data processing pipeline that ingests, parses, filters, and routes data. |
| **Kibana** | Visualization & UI | Web interface to explore, analyze, and build interactive dashboards. |
| **Beats / Elastic Agent** | Collection | Lightweight single-purpose agents installed on edge servers to ship telemetry. |

> [!NOTE]
> **OpenSearch Compatibility**: OpenSearch and OpenSearch Dashboards (maintained by AWS and the Linux Foundation) are open-source forks of Elasticsearch and Kibana 7.10. Most queries, APIs, and ingest pipelines are directly compatible.

---

## **2. Quickstart with Docker Compose (Elastic 8.x)**

Create `docker-compose.yml` for a secure local development stack:

```yaml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data

  kibana:
    image: docker.elastic.co/kibana/kibana:8.12.0
    container_name: kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  es_data:
```

Run:

```bash
docker compose up -d
```

Access Kibana at `http://localhost:5601` and Elasticsearch at `http://localhost:9200`.

---

## **3. Elasticsearch Operations & Diagnostics**

### 🔹 Cluster Health & Node Inspection

```bash
# Check cluster status (green, yellow, red)
curl -s -X GET "http://localhost:9200/_cluster/health?pretty"

# Inspect node allocations and memory
curl -s -X GET "http://localhost:9200/_cat/nodes?v"

# List all indices with document counts and size
curl -s -X GET "http://localhost:9200/_cat/indices?v&s=index"

# Inspect shard distribution
curl -s -X GET "http://localhost:9200/_cat/shards?v"

# Diagnose why an unassigned shard is not allocating
curl -s -X GET "http://localhost:9200/_cluster/allocation/explain?pretty"
```

### 🔹 CRUD Operations & Search

```bash
# Index a single document
curl -X POST "http://localhost:9200/logs-app/_doc/1" \
  -H 'Content-Type: application/json' \
  -d '{
    "@timestamp": "2026-08-30T10:00:00Z",
    "service": "billing",
    "level": "ERROR",
    "message": "Database connection timeout"
  }'

# Retrieve the document by ID
curl -X GET "http://localhost:9200/logs-app/_doc/1?pretty"

# Search with Query DSL
curl -X POST "http://localhost:9200/logs-app/_search?pretty" \
  -H 'Content-Type: application/json' \
  -d '{
    "query": {
      "bool": {
        "must": [
          { "match": { "level": "ERROR" } }
        ],
        "filter": [
          { "range": { "@timestamp": { "gte": "now-24h" } } }
        ]
      }
    }
  }'
```

---

## **4. Data Streams & Index Lifecycle Management (ILM)**

ILM automates index roll-overs and tier transitions based on size, age, or doc count across hardware tiers:

1. **Hot**: High indexing rate, active querying (fast NVMe SSDs).
2. **Warm**: Read-only queries, no indexing (balanced storage).
3. **Cold**: Infrequently queried, compressed (cost-effective storage).
4. **Frozen**: Searchable snapshots stored in object storage (S3/GCS).
5. **Delete**: Safely purge logs older than retention policy (e.g., 90 days).

Create an ILM Policy:

```bash
curl -X PUT "http://localhost:9200/_ilm/policy/logs_lifecycle_policy" \
  -H 'Content-Type: application/json' \
  -d '{
    "policy": {
      "phases": {
        "hot": {
          "actions": {
            "rollover": {
              "max_size": "50GB",
              "max_age": "7d"
            }
          }
        },
        "warm": {
          "min_age": "7d",
          "actions": {
            "forcemerge": { "max_num_segments": 1 }
          }
        },
        "delete": {
          "min_age": "30d",
          "actions": { "delete": {} }
        }
      }
    }
  }'
```

---

## **5. Logstash Pipeline Configuration**

Logstash pipelines consist of three sections: **`input`**, **`filter`**, and **`output`**.

### Production Pipeline Example (`/etc/logstash/conf.d/app-pipeline.conf`)

```ruby
input {
  beats {
    port => 5044
  }
}

filter {
  # Parse standard Syslog or JSON
  if [type] == "syslog" {
    grok {
      match => { "message" => "%{SYSLOGTIMESTAMP:syslog_timestamp} %{SYSLOGHOST:syslog_hostname} %{DATA:syslog_program}(?:\[%{POSINT:syslog_pid}\])?: %{GREEDYDATA:syslog_message}" }
      add_field => [ "received_at", "%{@timestamp}" ]
    }
    date {
      match => [ "syslog_timestamp", "MMM  d HH:mm:ss", "MMM dd HH:mm:ss" ]
    }
  }

  # Parse structured JSON payloads
  if [fields][log_format] == "json" {
    json {
      source => "message"
      target => "parsed_json"
    }
  }

  # Drop health check pings to save storage
  if [message] =~ "^GET /healthz" {
    drop {}
  }
}

output {
  elasticsearch {
    hosts => ["http://localhost:9200"]
    index => "logs-%{[fields][service]}-%{+YYYY.MM.dd}"
  }
}
```

Validate and run:

```bash
# Test pipeline syntax without running
/usr/share/logstash/bin/logstash -f /etc/logstash/conf.d/app-pipeline.conf --config.test_and_exit

# Run with auto-reload enabled
/usr/share/logstash/bin/logstash -f /etc/logstash/conf.d/app-pipeline.conf --config.reload.automatic
```

---

## **6. Beats & Modern Elastic Agent**

### 🔹 Filebeat Configuration (`/etc/filebeat/filebeat.yml`)

```yaml
filebeat.inputs:
  - type: filestream
    id: app-logs
    enabled: true
    paths:
      - /var/log/app/*.log
    parsers:
      - multiline:
          type: pattern
          pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
          negate: true
          match: after

output.logstash:
  hosts: ["logstash:5044"]
```

### 🔹 Elastic Agent & Fleet (Modern Unified Architecture)

In Elastic 8.x+, **Elastic Agent** replaces individual standalone Beats (Filebeat, Metricbeat, Heartbeat, Packetbeat) with a single unified binary managed centrally from Kibana via **Fleet**:

* **Fleet Server**: Central control plane communicating policy updates to agents.
* **Integrations**: Add monitoring for Nginx, AWS, MySQL, or Kubernetes with 1 click in Kibana without editing edge config files.

---

## **7. Kibana Visualizations & Lens**

1. **Kibana Lens**: Modern drag-and-drop visualization tool that automatically chooses optimal charts based on field types.
2. **Kibana Discover**: Interactive search interface with full KQL (Kibana Query Language) support:
   ```kql
   service.name : "billing" and response_code >= 500 and not client.ip : "127.0.0.1"
   ```
3. **Canvas**: Presentation-grade pixel-perfect infographics and live dashboards for NOC/executive screens.

---

## **8. Security & Authentication (Elastic 8.x)**

Elasticsearch 8.x enables TLS and user authentication by default.

```bash
# Reset superuser (elastic) password
/usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic

# Generate enrollment token for connecting Kibana
/usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana

# Generate service account token for Filebeat or Logstash
/usr/share/elasticsearch/bin/elasticsearch-service-tokens create elastic/filebeat filebeat-token
```

---

## **9. Troubleshooting & Performance Tuning**

* **JVM Heap Sizing**: Set JVM heap size to **50% of available physical RAM**, but **do not exceed 31 GB** (to preserve compressed object pointers / Compressed OOPs):
  Edit `/etc/elasticsearch/jvm.options.d/heap.options`:
  ```text
  -Xms16g
  -Xmx16g
  ```
* **Avoid Unassigned Shards**: Inspect root cause with `_cluster/allocation/explain`. Common reasons: low disk watermark threshold (default 85% warning, 90% read-only).
* **Tune Logstash Pipelines**: Match `pipeline.workers` to the number of CPU cores and tune `pipeline.batch.size` (e.g., 125-250 events) in `logstash.yml`.

---

## 📚 **Learning Resources**

* 🔗 [Elasticsearch Official Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
* 📖 [Logstash Reference](https://www.elastic.co/guide/en/logstash/current/index.html)
* 📊 [Kibana User Guide](https://www.elastic.co/guide/en/kibana/current/index.html)
* 🛡️ [OpenSearch Project Documentation](https://opensearch.org/docs/latest/)
