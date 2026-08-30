# ☁️ AWS Cheatsheet

![text](https://imgur.com/DDbwilK.png)

**Amazon Web Services (AWS)** is the world's most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally. It powers compute, storage, databases, networking, machine learning, and security for millions of customers.

---

## **1. CLI Setup & Modern Authentication**

### 🔹 AWS IAM Identity Center (AWS SSO)

The recommended standard for secure, temporary CLI credential generation:

```bash
# Configure SSO profile
aws configure sso

# Log in using SSO session
aws sso login --profile my-dev-profile

# Verify active caller identity
aws sts get-caller-identity
```

---

## **2. Core Compute Services**

### 🔹 Amazon EC2 (Elastic Compute Cloud)

Scalable virtual servers running across Intel, AMD, and AWS Graviton (ARM64) processors.

```bash
# Launch an EC2 Graviton instance (t4g.micro) with Launch Template
aws ec2 run-instances \
  --launch-template LaunchTemplateName=my-web-template,Version=1 \
  --count 1

# List running instances with IDs and public IPs
aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" \
  --query "Reservations[*].Instances[*].[InstanceId,InstanceType,PublicIpAddress,Tags[?Key=='Name'].Value|[0]]" \
  --output table

# Stop and terminate instances
aws ec2 stop-instances --instance-ids i-0123456789abcdef0
aws ec2 terminate-instances --instance-ids i-0123456789abcdef0
```

### 🔹 AWS Lambda (Serverless Compute)

Execute code in response to events without provisioning or managing servers:

```bash
# Deploy a Lambda function using modern Python 3.12 runtime
aws lambda create-function \
  --function-name order-processor \
  --runtime python3.12 \
  --role arn:aws:iam::123456789012:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://function.zip

# Invoke a function synchronously and output payload
aws lambda invoke \
  --function-name order-processor \
  --payload '{"orderId": "12345"}' \
  --cli-binary-format raw-in-base64-out \
  response.json
```

### 🔹 Amazon ECS & EKS (Containers)

* **ECS (Elastic Container Service)**: Highly scalable container orchestration using AWS Fargate or EC2.
* **EKS (Elastic Kubernetes Service)**: Managed certified Kubernetes with native VPC CNI and IAM integration.

```bash
# Update local kubeconfig for EKS cluster
aws eks update-kubeconfig --name my-cluster --region us-east-1
```

---

## **3. Storage Services**

### 🔹 Amazon S3 (Simple Storage Service)

High-durability (99.999999999%) object storage:

```bash
# Create an S3 bucket with Bucket Owner Enforced (disables ACLs)
aws s3api create-bucket \
  --bucket my-company-data-prod \
  --region us-east-1

# Enable default AES-256 server-side encryption
aws s3api put-bucket-encryption \
  --bucket my-company-data-prod \
  --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'

# Sync local directory to S3
aws s3 sync ./dist s3://my-company-data-prod/dist --delete
```

### 🔹 Amazon EBS (Elastic Block Store)

Persistent block storage for EC2 instances. Always prefer **gp3** volumes for independent baseline IOPS and throughput provisioning without size scaling.

```bash
# Create a 50GB gp3 volume with 3000 IOPS and 125 MB/s throughput
aws ec2 create-volume \
  --size 50 \
  --volume-type gp3 \
  --iops 3000 \
  --throughput 125 \
  --availability-zone us-east-1a
```

---

## **4. Databases: Relational, NoSQL & Serverless**

### 🔹 Amazon RDS & Aurora Serverless v2

* **Aurora Serverless v2**: Automatically scales compute in fine-grained increments (ACUs) within fraction-of-a-second intervals.

```bash
# Create Aurora PostgreSQL cluster with Aurora Serverless v2 scaling configuration
aws rds create-db-cluster \
  --db-cluster-identifier prod-cluster \
  --engine aurora-postgresql \
  --master-username pgadmin \
  --master-user-password "MasterPassword123!" \
  --serverless-v2-scaling-configuration MinCapacity=0.5,MaxCapacity=16
```

### 🔹 Amazon DynamoDB (NoSQL)

Managed key-value and document database with single-digit millisecond latency:

```bash
# Create DynamoDB table with On-Demand billing (PAY_PER_REQUEST)
aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions AttributeName=UserId,AttributeType=S \
  --key-schema AttributeName=UserId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

---

## **5. Networking & Content Delivery**

### 🔹 Amazon VPC (Virtual Private Cloud)

Logically isolated virtual network for AWS resources:

```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create public subnet
aws ec2 create-subnet --vpc-id vpc-0123456789abcdef0 --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
```

### 🔹 Elastic Load Balancing (ALB / NLB)

* **Application Load Balancer (ALB)**: Layer 7 load balancer with path, host, and HTTP header routing.
* **Network Load Balancer (NLB)**: Layer 4 ultra-high performance load balancer handling millions of requests per second.

```bash
# Create an internet-facing Application Load Balancer
aws elbv2 create-load-balancer \
  --name web-alb \
  --subnets subnet-0123456789abcdef0 subnet-0987654321fedcba0 \
  --security-groups sg-0123456789abcdef0 \
  --scheme internet-facing \
  --type application
```

---

## **6. Security, Identity & Secrets**

### 🔹 IAM Roles & Least Privilege

```bash
# Attach managed policy to role
aws iam attach-role-policy \
  --role-name EC2-App-Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
```

### 🔹 AWS Secrets Manager

Securely store and automatically rotate database credentials and API keys:

```bash
# Create secret
aws secretsmanager create-secret \
  --name "prod/app/db" \
  --secret-string '{"username":"admin","password":"StrongPassword123!"}'

# Retrieve secret value
aws secretsmanager get-secret-value \
  --secret-id "prod/app/db" \
  --query SecretString \
  --output text
```

---

## **7. Modern Auto Scaling with Launch Templates**

> [!IMPORTANT]
> **Deprecation Notice**: Launch Configurations are deprecated by AWS. Always use **EC2 Launch Templates** for Auto Scaling Groups.

```bash
# Create Launch Template
aws ec2 create-launch-template \
  --launch-template-name web-template \
  --version-description "v1-production" \
  --launch-template-data '{
    "ImageId": "ami-0c55b159cbfafe1f0",
    "InstanceType": "t3.medium",
    "SecurityGroupIds": ["sg-0123456789abcdef0"]
  }'

# Create Auto Scaling Group using Launch Template
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name web-asg \
  --launch-template LaunchTemplateName=web-template,Version='$Latest' \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2 \
  --vpc-zone-identifier "subnet-0123456789abcdef0,subnet-0987654321fedcba0"
```

---

## **8. Best Practices (AWS Well-Architected Framework)**

1. **Security**: Enforce MFA, disallow root account usage, use IAM Roles with temporary credentials, and enable AWS CloudTrail across all regions.
2. **Reliability**: Architect for multi-AZ redundancy, use Auto Scaling groups, and back up data using AWS Backup or automated snapshots.
3. **Performance Efficiency**: Adopt AWS Graviton instances for up to 40% better price-performance and use gp3 storage over gp2.
4. **Cost Optimization**: Right-size compute, leverage Savings Plans / Reserved Instances for steady workloads, and configure S3 Lifecycle policies to transition cold data to Glacier Flexible/Deep Archive.
5. **Operational Excellence**: Define everything in Infrastructure as Code (Terraform / AWS CDK) and automate observability via CloudWatch dashboards and composite alarms.

---

## 📚 **Learning Resources**

* 🔗 [Official AWS Documentation](https://docs.aws.amazon.com/)
* 🏛️ [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
* 💻 [AWS CLI Command Reference](https://awscli.amazonaws.com/v2/documentation/api/latest/index.html)
* 🎓 [AWS Skill Builder Free Training](https://explore.skillbuilder.aws/)
