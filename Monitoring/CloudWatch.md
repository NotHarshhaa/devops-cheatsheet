# CloudWatch Cheatsheet

![text](https://imgur.com/BU5g7ce.png)

Amazon CloudWatch is a comprehensive monitoring and management service designed for AWS and hybrid cloud applications. This guide covers everything from basic concepts to advanced configurations, helping you leverage CloudWatch for performance monitoring, troubleshooting, and operational insights.

---

## **1. Introduction to CloudWatch**

### What is CloudWatch?

- Amazon CloudWatch is a monitoring and observability service for AWS resources and custom applications.
- Provides actionable insights through metrics, logs, alarms, and dashboards.
- Supports both infrastructure and application-level monitoring.

### Key Features:

- **Metrics**: Collect and monitor key performance data.
- **Logs**: Aggregate, analyze, and search logs.
- **Alarms**: Set thresholds for metrics to trigger automated actions.
- **Dashboards**: Visualize data in real time.
- **CloudWatch Events**: Trigger actions based on changes in AWS resources.

---

## **2. CloudWatch Architecture Overview**

- **Data Sources**:
  - AWS Services: EC2, RDS, Lambda, etc.
  - On-premises servers or hybrid setups using CloudWatch Agent.
- **Core Components**:
  - **Metrics**: Quantifiable data points (e.g., CPU utilization).
  - **Logs**: Application and system logs.
  - **Alarms**: Notifications or automated responses.
  - **Dashboards**: Custom visualizations.
  - **Insights**: Advanced log analytics.

---

## **3. Setting Up CloudWatch**

### Accessing CloudWatch

1. Go to the **AWS Management Console**.
2. Navigate to **CloudWatch** under the **Management & Governance** section.

### CloudWatch Agent Installation

To monitor custom metrics or on-premises resources:

1. Install the CloudWatch Agent on your instance:

   ```bash
   sudo yum install amazon-cloudwatch-agent
   ```

2. Configure the agent:

   ```bash
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
   ```

3. Start the agent:

   ```bash
   sudo /opt/aws/amazon-cloudwatch-agent/bin/start-amazon-cloudwatch-agent
   ```

### Setting IAM Permissions

Attach the **CloudWatchFullAccess** policy to the IAM role or user managing CloudWatch.

---

## **4. Metrics Monitoring**

### Viewing Metrics

1. In the CloudWatch console, go to **Metrics**.
2. Select a namespace (e.g., `AWS/EC2`, `AWS/Lambda`).
3. Choose metrics like `CPUUtilization`, `DiskWriteOps`, etc.

### Common Metrics:

- **EC2**:
  - `CPUUtilization`
  - `DiskReadBytes`
  - `NetworkIn/Out`
- **RDS**:
  - `DatabaseConnections`
  - `ReadIOPS`
  - `WriteLatency`
- **Lambda**:
  - `Invocations`
  - `Duration`
  - `Errors`

### Custom Metrics

To send custom metrics:

1. Install the AWS CLI.
2. Publish a metric:

   ```bash
   aws cloudwatch put-metric-data --namespace "CustomNamespace" --metric-name "MetricName" --value 100
   ```

---

## **5. CloudWatch Logs**

### Setting Up Log Groups and Streams

1. Navigate to **Logs** in the CloudWatch console.
2. Create a **Log Group** (e.g., `/aws/lambda/my-function`).
3. Each application/service writes to a **Log Stream** under the group.

### Exporting Logs to S3

1. Go to **Logs** → Select a log group.
2. Click **Actions** → **Export data to Amazon S3**.
3. Configure the export with the desired time range.

### Querying Logs with CloudWatch Logs Insights

1. Navigate to **Logs Insights**.
2. Write queries for analysis:

   ```sql
   fields @timestamp, @message
   | filter @message like /ERROR/
   | sort @timestamp desc
   | limit 20
   ```

---

## **6. CloudWatch Alarms**

### Creating an Alarm

1. Go to **Alarms** in the CloudWatch console.
2. Click **Create Alarm**.
3. Select a metric (e.g., `CPUUtilization`).
4. Set a threshold (e.g., `> 80%` for 5 minutes).
5. Choose an action (e.g., send an SNS notification).

### Alarm States:

- **OK**: Metric is within the defined threshold.
- **ALARM**: Metric breaches the threshold.
- **INSUFFICIENT DATA**: No data available.

### Advanced Alarm Configurations

- Composite Alarms: Combine multiple alarms.
- Actions:
  - Notify via SNS.
  - Trigger Lambda functions.
  - Stop/start EC2 instances.

---

## **7. CloudWatch Dashboards**

### Creating a Dashboard

1. Go to **Dashboards** in the CloudWatch console.
2. Click **Create Dashboard**.
3. Add widgets:
   - **Line** for metrics.
   - **Number** for single values.
   - **Text** for notes.

### Customizing Widgets

- Choose metrics from different namespaces.
- Configure time ranges and granularity.

### Example: Multi-Service Dashboard

- **EC2 Metrics**: CPU, Disk, Network.
- **RDS Metrics**: Connections, IOPS.
- **Lambda Metrics**: Invocations, Errors.

---

## **8. CloudWatch Events (EventBridge)**

### Creating Rules

1. Navigate to **Rules** under **Events** in the CloudWatch console.
2. Create a rule with an event pattern (e.g., EC2 state change).
3. Add a target (e.g., SNS, Lambda, Step Functions).

### Example: Automate Instance Shutdown

1. Event Pattern:

   ```json
   {
     "source": ["aws.ec2"],
     "detail-type": ["EC2 Instance State-change Notification"],
     "detail": {
       "state": ["stopped"]
     }
   }
   ```

2. Target: Send an SNS notification.

---

## **9. Advanced Configurations**

### Cross-Account Monitoring

1. Create a cross-account role with permissions to access CloudWatch in the target account.
2. Use the `CloudWatch:ListMetrics` and `CloudWatch:GetMetricData` APIs.

### Anomaly Detection

Enable anomaly detection for metrics:

1. Go to **Metrics** → Select a metric.
2. Click **Actions** → **Enable anomaly detection**.

### Metric Math

Perform calculations across metrics:

- Example: Combine CPU utilization across instances.

  ```bash
  (m1+m2)/2
  ```

---

## **10. Integration with Other Services**

### AWS Lambda

- Use `console.log()` to write logs to CloudWatch.
- Monitor Lambda-specific metrics like `Errors` and `Throttles`.

### ECS/EKS

- Enable CloudWatch Container Insights for detailed monitoring.
- Use `awslogs` driver to send container logs to CloudWatch.

### Integration with Third-Party Tools

- Use **DataDog** or **Grafana** for enhanced visualization.
- Integrate CloudWatch metrics into these platforms using APIs.

---

## **11. Security Best Practices**

### Log Retention

- Set retention policies for logs to reduce costs:

  ```bash
  aws logs put-retention-policy --log-group-name "/aws/lambda/my-function" --retention-in-days 30
  ```

### Fine-Grained Access Control

- Use IAM policies to restrict access to specific metrics, logs, or dashboards.

---

## **12. CloudWatch Pricing**

### Pricing Model

1. **Metrics**: Charged per metric, per month.
2. **Logs**:
   - Ingestion: Cost per GB ingested.
   - Storage: Cost per GB stored.
3. **Dashboards**: Charged per dashboard, per month.

### Cost Optimization Tips

- Use metric filters to limit data collection.
- Set shorter retention periods for logs.

---

## **13. Best Practices**

1. **Organize Log Groups**:
   - Use consistent naming conventions (e.g., `/application/environment/service`).

2. **Use Alarms Wisely**:
   - Avoid too many alarms to prevent alert fatigue.
   - Use composite alarms to group related metrics.

3. **Automate Monitoring**:
   - Automate alert creation and dashboards using CloudFormation or Terraform.

4. **Optimize Log Storage**:
   - Export logs to S3 for long-term storage and analysis.

5. **Enable Anomaly Detection**:
   - Automate anomaly detection for critical metrics.

---

## **14. References and Resources**

- [CloudWatch Documentation](https://docs.aws.amazon.com/cloudwatch/)
- [Metric Math Syntax Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)
- [CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/)
