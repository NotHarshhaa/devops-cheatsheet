# 📊 CloudWatch Cheatsheet

![text](https://imgur.com/BU5g7ce.png)

Amazon CloudWatch is a comprehensive monitoring, observability, and management service designed for AWS cloud and hybrid infrastructures. It collects operational data in the form of logs, metrics, and events, providing unified visibility of AWS resources, applications, and services.

---

## **1. Core Architecture & Concepts**

| Component | Description |
| --- | --- |
| **Metrics** | Time-ordered data points representing resource performance (CPU, memory, latency). |
| **Namespaces** | Containers for metrics (e.g., `AWS/EC2`, `AWS/RDS`, `CustomApp/Production`). |
| **Dimensions** | Key-value pairs that uniquely identify a metric (e.g., `InstanceId=i-12345`). |
| **Logs** | Log events organized into **Log Streams**, which belong to parent **Log Groups**. |
| **Alarms** | Watchers over single metrics or composite alarms triggering notifications or auto-remediation. |
| **Synthetics** | Configurable canaries that monitor endpoints and APIs around the clock. |
| **Evidently / Rum** | Real-user monitoring and feature flagging for front-end telemetry. |

---

## **2. CLI Quick Reference**

```bash
# Stream live logs directly to your terminal (follow mode)
aws logs tail /aws/lambda/my-function --follow

# Stream logs with a pattern filter
aws logs tail /aws/lambda/my-function --filter-pattern "ERROR" --since 1h

# Publish a custom metric data point
aws cloudwatch put-metric-data \
  --namespace "EcommerceApp" \
  --metric-name "CheckoutLatency" \
  --unit "Milliseconds" \
  --value 245.5 \
  --dimensions Service=Payment,Environment=Prod

# List active alarms in ALARM state
aws cloudwatch describe-alarms --state-value ALARM

# Temporarily disable an alarm during maintenance
aws cloudwatch disable-alarm-actions --alarm-names "High-CPU-Alert"
```

---

## **3. CloudWatch Agent Setup**

The unified CloudWatch Agent collects both system-level metrics (RAM, swap, disk space) and server log files from EC2 or on-premises servers.

### Installation

```bash
# Ubuntu / Debian
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Amazon Linux 2 / RHEL 8+
sudo dnf install -y amazon-cloudwatch-agent
```

### Production Configuration (`/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json`)

```json
{
  "agent": {
    "metrics_collection_interval": 60,
    "run_as_user": "cwagent"
  },
  "metrics": {
    "metrics_collected": {
      "mem": {
        "measurement": [
          "mem_used_percent",
          "mem_available_percent"
        ]
      },
      "disk": {
        "measurement": [
          "used_percent"
        ],
        "resources": [
          "/"
        ]
      }
    },
    "append_dimensions": {
      "InstanceId": "${aws:InstanceId}"
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/nginx/access.log",
            "log_group_name": "/app/web/nginx/access",
            "log_stream_name": "{instance_id}",
            "retention_in_days": 30
          }
        ]
      }
    }
  }
}
```

Start the agent:

```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -s \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
```

---

## **4. CloudWatch Logs Insights (Real-World Queries)**

Logs Insights provides an interactive query language to analyze unstructured and JSON log streams.

### 🔹 Top 20 Slowest Requests (Latency Analysis)

```sql
fields @timestamp, @message, duration
| filter duration > 1000
| sort duration desc
| limit 20
```

### 🔹 Calculate 50th, 90th, and 99th Percentile Latency

```sql
stats pct(duration, 50) as p50,
      pct(duration, 90) as p90,
      pct(duration, 99) as p99 by bin(5m)
```

### 🔹 Count HTTP Status Codes Over Time

```sql
filter @message like /HTTP\//
| parse @message "* * * [*] \"* * *\" * *" as host, client_ip, user, time, method, uri, protocol, status, bytes
| stats count(*) as total by status, bin(5m)
| sort total desc
```

### 🔹 Identify Top Application Exceptions

```sql
fields @timestamp, @message
| filter @message like /(?i)(Exception|Error|Fatal)/
| stats count(*) as exception_count by @message
| sort exception_count desc
| limit 15
```

---

## **5. Metric Math Production Recipes**

Metric Math allows you to create calculated metrics from multiple raw time series.

### 🔹 Calculate Request Error Rate Percentage

Let:
* `m1` = 5xx Server Errors (`HTTPCode_Target_5XX_Count`)
* `m2` = Total Requests (`RequestCount`)

**Expression:**
```text
(m1 / m2) * 100
```

### 🔹 Network Throughput in Megabytes/sec (MB/s)

Let `m1` = `NetworkIn` (bytes per period, period = 300s):

**Expression:**
```text
m1 / 300 / 1024 / 1024
```

### 🔹 Dynamic Anomaly Detection Band

Using built-in anomaly functions:

**Expression:**
```text
ANOMALY_DETECTION_BAND(m1, 2)
```

---

## **6. CloudWatch Alarms & Composite Alarms**

### Creating a High CPU Alarm with AWS CLI

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "EC2-HighCPU-Utilization" \
  --alarm-description "Triggers when CPU exceeds 80% for 10 minutes" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80.0 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:ops-alerts \
  --dimensions Name=InstanceId,Value=i-0123456789abcdef0
```

### Composite Alarms (Reducing Alert Fatigue)

Composite alarms evaluate boolean logic (`ALARM("alarm1") AND ALARM("alarm2")`) before triggering notifications:

```json
{
  "AlarmRule": "ALARM(\"HighCPU-Prod\") AND ALARM(\"HighLatency-Prod\") AND NOT ALARM(\"Deployment-InProgress\")"
}
```

---

## **7. CloudWatch Synthetics (API & Web Canaries)**

CloudWatch Synthetics monitors your customer-facing endpoints, REST APIs, and multi-step user workflows 24/7 using headless Chromium (Puppeteer/Node.js or Python/Selenium).

Canary Script Example (Heartbeat API Check):

```javascript
const syn = require('Synthetics');
const log = require('SyntheticsLogger');

const apiCanaryBlueprint = async function () {
    let requestOptions = {
        hostname: 'api.example.com',
        path: '/healthz',
        method: 'GET',
        port: 443,
        protocol: 'https:'
    };

    let stepConfig = {
        stepName: 'CheckAPIHealth',
        includeRequestHeaders: true
    };

    await syn.executeHttpStep('CheckAPIHealth', requestOptions, async function (res) {
        if (res.statusCode !== 200) {
            throw new Error('API returned status code ' + res.statusCode);
        }
    }, stepConfig);
};

exports.handler = async () => {
    return await apiCanaryBlueprint();
};
```

---

## **8. Container Insights (EKS & ECS)**

Container Insights collects, aggregates, and summarizes metrics and logs from containerized applications.

* **Amazon ECS**: Enable in cluster settings (`settings: [ { name: "containerInsights", value: "enabled" } ]`).
* **Amazon EKS**: Deploy the CloudWatch Agent and Fluent Bit as daemonsets via the **AWS Distro for OpenTelemetry (ADOT)** or official Helm chart:

```bash
helm upgrade --install aws-cloudwatch-metrics \
  --namespace amazon-cloudwatch \
  --create-namespace \
  oci://public.ecr.aws/aws-observability/cloudwatch-agent-chart
```

---

## **9. Amazon EventBridge (Formerly CloudWatch Events)**

Amazon EventBridge has superseded CloudWatch Events, providing schema registries and multi-source event buses.

Example Rule: Intercept EC2 State Changes and trigger an AWS Lambda remediation function:

```json
{
  "source": ["aws.ec2"],
  "detail-type": ["EC2 Instance State-change Notification"],
  "detail": {
    "state": ["shutting-down", "stopped"]
  }
}
```

---

## **💰 Cost Optimization & Retention Strategies**

1. **Set Log Retention Periods**: By default, log groups retain logs indefinitely. Always configure retention:
   ```bash
   aws logs put-retention-policy --log-group-name "/aws/lambda/my-app" --retention-in-days 14
   ```
2. **Export to S3 for Cold Archival**: Export historical log streams to S3 Glacier for compliance auditing at a fraction of CloudWatch storage costs.
3. **Use Metric Filters Wisely**: Extract only actionable numbers into custom metrics instead of indexing redundant text.
4. **Clean Up Unused Canaries & Dashboards**: Synthetics canaries incur continuous execution charges per run.

---

## 📚 **References & Documentation**

* 🔗 [Amazon CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/)
* 🔍 [CloudWatch Logs Insights Query Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
* 📐 [Metric Math Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)
* 🛠️ [CloudWatch Agent Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)
