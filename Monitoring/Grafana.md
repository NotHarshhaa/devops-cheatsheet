# Grafana Cheatsheet

![text](https://imgur.com/j07r4L6.png)

**1. Introduction:**

- **Grafana** is an open-source platform for monitoring and observability that allows you to query, visualize, and alert on metrics from multiple data sources like Prometheus, InfluxDB, Elasticsearch, and more.

**2. Key Concepts:**

- **Dashboard:** A collection of panels organized into a grid.
- **Panel:** A visualization of data (graphs, charts, etc.) from a specific data source.
- **Data Source:** The database or service that provides the metrics for Grafana to visualize.
- **Alerting:** Set up conditions to trigger notifications when metrics meet specific criteria.

**3. Installation:**

- **Running Grafana:**

  ```bash
  sudo apt-get install -y adduser libfontconfig1
  wget https://dl.grafana.com/oss/release/grafana_7.5.7_amd64.deb
  sudo dpkg -i grafana_7.5.7_amd64.deb
  sudo systemctl start grafana-server
  sudo systemctl enable grafana-server
  ```

- **Docker:**

  ```bash
  docker run -d -p 3000:3000 --name=grafana grafana/grafana
  ```

**4. Configuring Data Sources:**

- **Adding Prometheus as a Data Source:**
  1. Navigate to **Configuration > Data Sources**.
  2. Click on **Add data source** and select **Prometheus**.
  3. Enter the URL of your Prometheus server (e.g., `http://localhost:9090`).
  4. Click **Save & Test** to verify the connection.

- **Adding Elasticsearch as a Data Source:**
  1. Navigate to **Configuration > Data Sources**.
  2. Click on **Add data source** and select **Elasticsearch**.
  3. Enter the URL, index name, and time field.
  4. Click **Save & Test** to verify the connection.

**5. Building Dashboards:**

- **Creating a New Dashboard:**
  1. Click the **+** icon in the sidebar and select **Dashboard**.
  2. Click **Add new panel**.
  3. Choose your data source and write a query (e.g., `rate(http_requests_total[5m])` for Prometheus).
  4. Select a visualization type (e.g., **Graph**, **Stat**, **Gauge**).
  5. Save the panel and the dashboard.

- **Using Variables:**
  - **Creating a Variable:**
    1. Go to **Dashboard settings** > **Variables** > **New**.
    2. Set the **Name**, **Type** (e.g., **Query**), and **Query**.
    3. Use the variable in panel queries by referencing it as **`$variable_name`**.

**6. Alerting:**

- **Creating Alerts:**

  1. Add a panel to your dashboard.
  2. In the **Alert** tab, click **Create Alert**.
  3. Set the **Conditions** for triggering the alert (e.g., when a metric crosses a threshold).
  4. Define the **Evaluation Interval** and **No Data** options.
  5. Configure **Notifications** to send alerts via email, Slack, or other channels.

- **Managing Alerts:**
  - Alerts can be managed centrally through the **Alerting** section in the sidebar.

**7. Grafana Plugins:**

- **Installing Plugins:**

  ```bash
  grafana-cli plugins install grafana-piechart-panel
  sudo systemctl restart grafana-server
  ```

- **Popular Plugins:**
  - **Pie Chart Panel:** Display metrics in a pie chart.
  - **Worldmap Panel:** Visualize data on a world map.
  - **Alert List Panel:** Display active alerts from multiple sources.

**8. Dashboard Templating:**

- **Using Templated Dashboards:**
  - Leverage variables to create dynamic dashboards that can change based on user input.

- **Dynamic Panels:**
  - Create repeating panels or rows based on variable values (e.g., show metrics per host).

**9. Customizing Grafana:**

- **Themes:**
  - Switch between light and dark themes via **Preferences** in the dashboard settings.

- **Custom Branding:**
  - Modify Grafana's appearance by adding custom logos and colors. Requires editing configuration files and CSS.

**10. Securing Grafana:**

- **User Management:**
  - Add users and assign them roles such as Viewer, Editor, or Admin.

- **LDAP/SSO Integration:**
  - Configure Grafana to use LDAP or Single Sign-On (SSO) for user authentication.

- **Enabling HTTPS:**

  ```yaml
  [server]
  protocol = https
  cert_file = /path/to/cert.crt
  cert_key = /path/to/cert.key
  ```

**11. Advanced Queries and Visualizations:**

- **Grafana with PromQL:**
  - Use advanced PromQL queries for more complex visualizations.

- **Annotations:**
  - Add annotations to mark specific events on graphs, useful for correlating issues with changes or incidents.

**12. Grafana Loki:**

- **Introduction to Loki:**
  - Grafana Loki is a horizontally scalable, highly available log aggregation system inspired by Prometheus.

- **Setting up Loki:**

  ```bash
  docker run -d --name=loki -p 3100:3100 grafana/loki:2.2.0 -config.file=/etc/loki/local-config.yaml
  ```

- **Querying Logs in Grafana:**
  - Use **Loki** as a data source to query and visualize logs alongside metrics.

**13. Grafana in Kubernetes:**

- **Deploying Grafana in Kubernetes:**

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: grafana
  spec:
    replicas: 1
    selector:
      matchLabels:
        app: grafana
    template:
      metadata:
        labels:
          app: grafana
      spec:
        containers:
        - name: grafana
          image: grafana/grafana:7.5.7
          ports:
          - containerPort: 3000
  ```

**14. Troubleshooting Grafana:**

- **Common Issues:**
  - **No Data:** Check data source configuration and queries.
  - **Slow Dashboards:** Optimize queries and reduce the time range.
  - **Plugin Errors:** Ensure plugins are compatible with your Grafana version.

- **Debugging:**
  - View logs at `/var/log/grafana/grafana.log` for error details.
  - Use **`curl`** to test data source connectivity (e.g., `curl http://localhost:9090` for Prometheus).
