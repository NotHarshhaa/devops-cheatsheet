# 🌐 Google Cloud Platform (GCP) Cheatsheet

![text](https://imgur.com/2MpF0w5.png)

**Google Cloud Platform (GCP)** provides modular cloud services including computing, data storage, data analytics, and machine learning running on the same secure global infrastructure that Google uses internally for its end-user products.

---

## **1. CLI Setup & Project Configuration**

```bash
# Initialize and authenticate gcloud SDK
gcloud init

# Set default project and compute region
gcloud config set project my-production-project
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a

# List active configurations
gcloud config list
```

---

## **2. Core Compute Services**

### 🔹 Google Compute Engine (GCE)

Scalable virtual machines powered by Google infrastructure:

```bash
# Create an e2-medium Compute Engine instance with Ubuntu 22.04
gcloud compute instances create web-instance-1 \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --tags=http-server,https-server

# SSH directly into the instance via IAP (Identity-Aware Proxy)
gcloud compute ssh web-instance-1 --zone=us-central1-a --tunnel-through-iap
```

### 🔹 Google Kubernetes Engine (GKE) & GKE Autopilot

* **GKE Standard**: You manage node pools, machine types, and scaling configurations.
* **GKE Autopilot (Recommended)**: Google automatically provisions, configures, and manages all underlying node infrastructure and security hardening.

```bash
# Create a production GKE Autopilot cluster
gcloud container clusters create-auto prod-autopilot \
  --region=us-central1

# Get cluster credentials for kubectl
gcloud container clusters get-credentials prod-autopilot --region=us-central1
```

### 🔹 Cloud Run (Serverless Container Platform)

Deploy and scale containerized applications from 0 to thousands of instances automatically:

```bash
# Deploy a container to Cloud Run with automatic HTTPS
gcloud run deploy api-service \
  --image=us-central1-docker.pkg.dev/my-project/apps/api:v1 \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1
```

---

## **3. Storage Services**

### 🔹 Cloud Storage (`gcloud storage`)

> [!TIP]
> **Performance Tip**: Always use the modern **`gcloud storage`** CLI instead of legacy `gsutil`. It provides up to 94% faster transfer performance through multi-threaded parallel transfers.

```bash
# Create a bucket with Uniform Bucket-Level Access (disables legacy ACLs)
gcloud storage buckets create gs://my-company-assets-prod \
  --location=us-central1 \
  --uniform-bucket-level-access

# Upload a local directory recursively
gcloud storage cp -r ./dist/* gs://my-company-assets-prod/dist/

# Set lifecycle rule (e.g. transition objects to Nearline after 30 days)
gcloud storage buckets update gs://my-company-assets-prod --lifecycle-file=lifecycle.json
```

### 🔹 Artifact Registry (Modern Container & Package Registry)

The modern OCI-compliant registry replacing deprecated Google Container Registry (`gcr.io`):

```bash
# Create a Docker repository
gcloud artifacts repositories create docker-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Production Docker images"

# Authenticate Docker client to Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev
```

---

## **4. Managed Databases**

### 🔹 Cloud SQL (Managed MySQL / PostgreSQL)

```bash
# Create a high-availability PostgreSQL 15 instance
gcloud sql instances create pg-prod \
  --database-version=POSTGRES_15 \
  --tier=db-custom-2-7680 \
  --region=us-central1 \
  --availability-type=REGIONAL \
  --storage-auto-increase

# Set root/admin password
gcloud sql users set-password postgres \
  --instance=pg-prod \
  --password="SuperSecurePassword123!"
```

### 🔹 Cloud Spanner (Global Relational Database)

Combines the benefits of relational database structure with non-relational horizontal scale:

```bash
# Create a Spanner instance
gcloud spanner instances create spanner-prod \
  --config=regional-us-central1 \
  --description="Production Spanner Instance" \
  --nodes=1
```

---

## **5. Networking & VPC**

```bash
# Create a custom VPC network
gcloud compute networks create prod-vpc --subnet-mode=custom

# Add a subnet
gcloud compute networks subnets create us-central1-subnet \
  --network=prod-vpc \
  --region=us-central1 \
  --range=10.10.0.0/24

# Create firewall rule allowing HTTP traffic
gcloud compute firewall-rules create allow-http \
  --network=prod-vpc \
  --allow=tcp:80 \
  --target-tags=http-server
```

---

## **6. Identity, Security & Workload Identity Federation**

### 🔹 Workload Identity Federation (Eliminate Service Account Keys)

> [!IMPORTANT]
> **Zero Service Account Keys**: Never download or store long-lived JSON service account keys in CI/CD. Use **Workload Identity Federation** with GitHub Actions or GitLab CI to exchange OpenID Connect (OIDC) tokens for short-lived Google Cloud credentials.

```bash
# Create a Workload Identity Pool
gcloud iam workload-identity-pools create "github-pool" \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Create a Provider inside the pool
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository"
```

---

## **7. Google Cloud Observability (Formerly Stackdriver)**

* **Cloud Logging**: Collects and queries application and audit logs using Logging Query Language.
* **Cloud Monitoring**: Dashboards, metrics collection, and alerting policies.
* **Cloud Trace & Cloud Profiler**: Distributed tracing and latency profiling for microservices.

```bash
# Write a structured test log entry via CLI
gcloud logging write app-logs '{"event": "deployment", "status": "successful"}' --severity=INFO

# Read latest error logs from Cloud Run
gcloud logging read 'resource.type="cloud_run_revision" AND severity>=ERROR' --limit=10 --format=json
```

---

## **8. Budgets & Cost Management**

```bash
# Create a monthly spending budget alert
gcloud billing budgets create \
  --billing-account=012345-67890A-BCDEF0 \
  --display-name="Production Budget" \
  --budget-amount=500USD
```

---

## 📚 **Learning Resources**

* 🔗 [Google Cloud Official Documentation](https://cloud.google.com/docs)
* 🏛️ [Google Cloud Architecture Center](https://cloud.google.com/architecture)
* 💻 [gcloud CLI Command Reference](https://cloud.google.com/sdk/gcloud/reference)
* 🎓 [Google Cloud Skills Boost Free Labs](https://www.cloudskillsboost.google/)
