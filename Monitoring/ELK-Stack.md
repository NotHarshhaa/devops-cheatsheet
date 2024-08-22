# ELK Stack Cheatsheet

![text](https://imgur.com/wLayBA4.png)

**1. Introduction:**

- The **ELK Stack** is a powerful suite of open-source tools: **Elasticsearch** for search and analytics, **Logstash** for data processing, and **Kibana** for visualization. It's often extended with **Beats** for data collection and **X-Pack** for additional features.

**2. Elasticsearch:**

- **Installing Elasticsearch:**

  ```bash
  wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.10.2-x86_64.rpm
  sudo rpm -ivh elasticsearch-7.10.2-x86_64.rpm
  sudo systemctl start elasticsearch
  sudo systemctl enable elasticsearch
  ```

- **Basic Configuration:**
  - Edit `/etc/elasticsearch/elasticsearch.yml`:

  ```yaml
  network.host: localhost
  http.port: 9200
  ```

- **Basic Queries:**

  ```bash
  curl -X GET "localhost:9200/_cat/indices?v"
  curl -X GET "localhost:9200/my-index/_search?q=user:john"
  ```

- **Indexing Documents:**

  ```bash
  curl -X POST "localhost:9200/my-index/_doc/1" -H 'Content-Type: application/json' -d'
  {
    "user": "john",
    "message": "Hello, Elasticsearch!"
  }'
  ```

- **Elasticsearch Cluster:**
  - Configure multi-node clusters by setting `cluster.name`, `node.name`, and `discovery.seed_hosts` in `elasticsearch.yml`.

**3. Logstash:**

- **Installing Logstash:**

  ```bash
  wget https://artifacts.elastic.co/downloads/logstash/logstash-7.10.2.rpm
  sudo rpm -ivh logstash-7.10.2.rpm
  sudo systemctl start logstash
  sudo systemctl enable logstash
  ```

- **Logstash Configuration:**

  ```yaml
  input {
    file {
      path => "/var/log/syslog"
      start_position => "beginning"
    }
  }
  filter {
    grok {
      match => { "message" => "%{SYSLOGLINE}" }
    }
  }
  output {
    elasticsearch {
      hosts => ["localhost:9200"]
      index => "syslog-%{+YYYY.MM.dd}"
    }
  }
  ```

- **Running Logstash:**

  ```bash
  sudo systemctl start logstash
  ```

- **Using Beats with Logstash:**
  - Use **Filebeat**, **Metricbeat**, or **Packetbeat** to ship data to Logstash for processing.

**4. Kibana:**

- **Installing Kibana:**

  ```bash
  wget https://artifacts.elastic.co/downloads/kibana/kibana-7.10.2-x86_64.rpm
  sudo rpm -ivh kibana-7.10.2-x86_64.rpm
  sudo systemctl start kibana
  sudo systemctl enable kibana
  ```

- **Basic Configuration:**
  - Edit `/etc/kibana/kibana.yml`:

  ```yaml
  server.port: 5601
  server.host: "localhost"
  elasticsearch.hosts: ["http://localhost:9200"]
  ```

- **Creating Visualizations:**
  1. Navigate to **Visualize** in the Kibana interface.
  2. Choose a visualization type (e.g., line chart, pie chart).
  3. Select the data source and configure your queries.
  4. Save and add the visualization to a dashboard.

- **Kibana Dashboards:**
  - Use dashboards to combine multiple visualizations into a single view, useful for monitoring and analysis.

**5. Beats:**

- **Filebeat:**
  - **Installing Filebeat:**

    ```bash
    wget https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.10.2-x86_64.rpm
    sudo rpm -ivh filebeat-7.10.2-x86_64.rpm
    sudo systemctl start filebeat
    sudo systemctl enable filebeat
    ```

  - **Configuring Filebeat:**

    ```yaml
    filebeat.inputs:
    - type: log
      paths:
        - /var/log/syslog

    output.elasticsearch:
      hosts: ["localhost:9200"]
    ```

  - **Running Filebeat:**

    ```bash
    sudo systemctl start filebeat
    ```

- **Metricbeat:**
  - Collects metrics from the system and services like MySQL, Docker, etc.

- **Packetbeat:**
  - Captures network traffic and analyzes protocols.

**6. Security in ELK Stack:**

- **Enabling HTTPS in Elasticsearch:**

  ```yaml
  xpack.security.enabled: true
  xpack.security.http.ssl.enabled: true
  xpack.security.http.ssl.keystore.path: /path/to/keystore.jks
  ```

- **User Authentication:**
  - Use **X-Pack** to manage users, roles, and permissions.

**7. ELK Stack in Kubernetes:**

- **Deploying ELK Stack:**
  - Use Helm charts to deploy the ELK stack in Kubernetes for easier management and scaling.

**8. Troubleshooting ELK Stack:**

- **Common Issues:**
  - **High Memory Usage:** Optimize the heap size in Elasticsearch.
  - **Logstash Performance:** Tune pipeline workers

 and batch size.

- **Debugging:**
  - Check logs for Elasticsearch (`/var/log/elasticsearch/`), Logstash (`/var/log/logstash/`), and Kibana (`/var/log/kibana/`).
  - Use `curl` to test Elasticsearch endpoints and ensure services are running.
