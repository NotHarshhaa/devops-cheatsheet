# GCP Cheatsheet

![text](https://imgur.com/2MpF0w5.png)

**1. Introduction:**

- **Google Cloud Platform (GCP)** is a suite of cloud computing services offered by Google. It provides a range of services including compute, storage, databases, machine learning, and more.

**2. Core GCP Services:**

- **Compute:**
  - **Google Compute Engine (GCE):**
    - Scalable virtual machines running on Google’s infrastructure.
    - Key Concepts: Machine Types, Images, Snapshots, Persistent Disks.
    - Example:

      ```bash
      gcloud compute instances create my-instance --zone=us-central1-a --machine-type=e2-medium --image-family=debian-10 --image-project=debian-cloud
      ```

  - **Google Kubernetes Engine (GKE):**
    - Managed Kubernetes service for running containerized applications.
    - Key Concepts: Clusters, Nodes, Pods, Services, Deployments.
    - Example:

      ```bash
      gcloud container clusters create my-cluster --zone us-central1-a --num-nodes 3
      ```

  - **Cloud Functions:**
    - Serverless environment to execute code in response to events.
    - Key Concepts: Functions, Triggers, Event Sources.
    - Example:

      ```bash
      gcloud functions deploy my-function --runtime python39 --trigger-http --allow-unauthenticated
      ```

- **Storage:**
  - **Google Cloud Storage:**
    - Object storage service for storing and accessing data.
    - Key Concepts: Buckets, Objects, Classes (Standard, Nearline, Coldline, Archive).
    - Example:

      ```bash
      gsutil mb gs://my-bucket
      gsutil cp my-file.txt gs://my-bucket/
      ```

  - **Persistent Disks:**
    - Durable, high-performance block storage for VM instances.
    - Key Concepts: Disk Types (Standard, SSD, Balanced), Snapshots, Zonal/Regional Disks.
    - Example:

      ```bash
      gcloud compute disks create my-disk --size=100GB --type=pd-ssd --zone=us-central1-a
      ```

  - **Filestore:**
    - Fully managed file storage service for applications that require a file system interface.
    - Key Concepts: Instances, Tiers (Basic, High Scale, Enterprise).
    - Example:

      ```bash
      gcloud filestore instances create my-filestore-instance --zone=us-central1-a --tier=STANDARD --file-share=name="my-share",capacity=1TB --network=name="default"
      ```

- **Database:**
  - **Cloud SQL:**
    - Managed relational database service supporting MySQL, PostgreSQL, and SQL Server.
    - Key Concepts: Instances, Backups, Failover, Maintenance Windows.
    - Example:

      ```bash
      gcloud sql instances create my-instance --database-version=MYSQL_8_0 --tier=db-f1-micro --region=us-central1
      ```

  - **Cloud Spanner:**
    - Scalable, globally-distributed, and strongly consistent database service.
    - Key Concepts: Instances, Databases, Schemas, Nodes.
    - Example:

      ```bash
      gcloud spanner instances create my-instance --config=regional-us-central1 --nodes=1 --description="My Spanner Instance"
      ```

  - **Firestore:**
    - NoSQL document database for mobile, web, and server development.
    - Key Concepts: Collections, Documents, Queries, Indexes.
    - Example:

      ```bash
      gcloud firestore databases create --region=us-central
      ```

**3. Networking:**

- **VPC (Virtual Private Cloud):**
  - Isolated network environments within GCP.
  - Key Concepts: Subnets, Routes, Firewalls, VPN, Interconnect.
  - Example:

    ```bash
    gcloud compute networks create my-vpc --subnet-mode=custom
    gcloud compute networks subnets create my-subnet --network=my-vpc --region=us-central1 --range=10.0.0.0/24
    ```

- **Cloud Load Balancing:**
  - Global load balancing service for distributing traffic across multiple instances.
  - Key Concepts: Frontends, Backends, URL Maps, Health Checks.
  - Example:

    ```bash
    gcloud compute forwarding-rules create my-rule --global --target-http-proxy=my-proxy --ports=80
    ```

- **Cloud DNS:**
  - Managed DNS service running on the same infrastructure as Google.
  - Key Concepts: Managed Zones, DNS Records, Policies.
  - Example:

    ```bash
    gcloud dns managed-zones create my-zone --dns-name="example.com." --description="My DNS zone"
    gcloud dns record-sets transaction start --zone=my-zone
    gcloud dns record-sets transaction add --zone=my-zone --name="www.example.com." --ttl=300 --type=A "1.2.3.4"
    gcloud dns record-sets transaction execute --zone=my-zone
    ```

- **Cloud CDN:**
  - Content delivery network for delivering web and video content globally.
  - Key Concepts: Backends, Cache Modes, Signed URLs.
  - Example:

    ```bash
    gcloud compute url-maps create my-url-map --default-service=my-backend-service
    gcloud compute backend-buckets create my-backend-bucket --gcs-bucket-name=my-bucket
    gcloud compute backend-buckets add-backend --url-map=my-url-map --default-backend-bucket=my-backend-bucket
    ```

**4. Security and Identity:**

- **Identity and Access Management (IAM):**
  - Manage access to resources with fine-grained control.
  - Key Concepts: Roles, Permissions, Policies, Service Accounts.
  - Example:

    ```bash
    gcloud projects add-iam-policy-binding my-project --member="user:example@gmail.com" --role="roles/editor"
    ```

- **Cloud Identity:**
  - Identity management for users and groups across services.
  - Key Concepts: Directory, Groups, Security Settings, OAuth.
  - Example:
    - Managed via Google Admin Console.

- **Cloud Key Management Service (KMS):**
  - Create, manage, and use cryptographic keys.
  - Key Concepts: Key Rings, Keys, Versions, Policies.
  - Example:

    ```bash
    gcloud kms keyrings create my-keyring --location=global
    gcloud kms keys create my-key --keyring=my-keyring --location=global --purpose=encryption
    ```

- **Cloud Security Command Center (SCC):**
  - Security and risk management platform for GCP.
  - Key Concepts: Findings, Assets, Sources, Security Health Analytics.
  - Example:
    - Managed via GCP Console.

**5. Management Tools:**

- **Deployment Manager:**
  - Infrastructure as code service for managing GCP resources.
  - Key Concepts: Templates, Deployments, Resources.
  - Example:

    ```bash
    gcloud deployment-manager deployments create my-deployment --config=config.yaml
    ```

- **Stackdriver (now part of Operations Suite):**
  - Monitoring, logging, and diagnostics tool for GCP.
  - Key Concepts: Metrics, Logs, Alerts, Dashboards.
  - Example:

    ```bash
    gcloud logging write my-log "This is a log entry" --severity=ERROR
    ```

- **Cloud Console:**
  - Web-based interface to manage GCP resources.
  - Key Concepts: Dashboards, Cloud Shell, Editor.

- **Cloud Shell:**
  - Command-line interface with access to all GCP resources.
  - Example:

    ```bash
    gcloud config set project my-project
    ```

**6. Advanced Topics:**

- **Cost Management:**
  - Monitor and optimize your GCP costs using Billing Reports and Budgets.
  - Example

:
    ```bash
    gcloud beta billing budgets create --billing-account=012345-67890A-BCDEF0 --display-name="My Budget" --amount=500USD
    ```

- **Auto Scaling:**
  - Automatically adjust the number of VM instances based on demand.
  - Key Concepts: Instance Groups, Autoscaler, Metrics.
  - Example:

    ```bash
    gcloud compute instance-groups managed set-autoscaling my-group --max-num-replicas 10 --min-num-replicas 1 --target-cpu-utilization 0.6
    ```

- **Serverless Architectures:**
  - Use Cloud Functions, Cloud Run, and Pub/Sub for serverless solutions.
  - Key Concepts: Triggers, Events, Containers, Scaling.
  - Example:

    ```bash
    gcloud run deploy my-service --image=gcr.io/my-project/my-image --platform managed
    ```

**7. Best Practices:**

- **Security:**
  - Use IAM policies, encrypt data, monitor with SCC, apply security best practices.
  
- **Reliability:**
  - Use multiple zones/regions, set up failover, and implement backups.

- **Performance Efficiency:**
  - Choose appropriate machine types, use caching, optimize databases.

- **Cost Optimization:**
  - Use committed use contracts, monitor spend, and optimize resources.

- **Operational Excellence:**
  - Automate deployments, monitor operations, and use infrastructure as code (IaC).
