# 🏗️ Terraform on AWS Cheatsheet

![text](https://stratusgrid.com/hubfs/AWS%20Configuration%20Recorder%20Module%20on%20Terraform.webp)

**Terraform on AWS** enables teams to provision, manage, and version cloud infrastructure using declarative HashiCorp Configuration Language (HCL). This guide covers modern patterns with the **AWS Provider v5.x**, **Terraform 1.5–1.10+**, and production architecture standards.

---

## **1. Modern Provider Configuration (`default_tags`)**

In AWS Provider v5.x, declare global tags at the provider level so every created resource inherits organizational metadata automatically:

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Environment = "Production"
      Project     = "CoreInfrastructure"
      ManagedBy   = "Terraform"
      Repository  = "https://github.com/myorg/infra"
    }
  }
}
```

---

## **2. Remote State & Locking (S3 + DynamoDB / S3 Native)**

```hcl
terraform {
  backend "s3" {
    bucket         = "myorg-terraform-state-prod"
    key            = "vpc/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```

> [!TIP]
> **Terraform 1.10+ Native S3 Locking**: Terraform 1.10+ supports native S3 conditional writes, eliminating the need to create and maintain a DynamoDB table for state locking!

---

## **3. Modern S3 Bucket Architecture (AWS Provider v5.x)**

In modern AWS provider versions, monolithic `aws_s3_bucket` arguments (such as inline versioning and ACLs) are broken into dedicated modular resources:

```hcl
# Core Bucket Definition
resource "aws_s3_bucket" "app_data" {
  bucket = "myorg-app-data-storage-prod"

  lifecycle {
    prevent_destroy = true
  }
}

# Enforce Bucket Owner Ownership (disables legacy S3 ACLs)
resource "aws_s3_bucket_ownership_controls" "app_data" {
  bucket = aws_s3_bucket.app_data.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# Block all public access
resource "aws_s3_bucket_public_access_block" "app_data" {
  bucket = aws_s3_bucket.app_data.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable Object Versioning
resource "aws_s3_bucket_versioning" "app_data" {
  bucket = aws_s3_bucket.app_data.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Enable Server-Side Encryption (AES256 or KMS)
resource "aws_s3_bucket_server_side_encryption_configuration" "app_data" {
  bucket = aws_s3_bucket.app_data.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
```

---

## **4. Production VPC Infrastructure Example**

```hcl
# VPC Definition
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "prod-vpc"
  }
}

# Public Subnets with for_each
variable "public_subnets" {
  type = map(string)
  default = {
    us-east-1a = "10.0.1.0/24"
    us-east-1b = "10.0.2.0/24"
  }
}

resource "aws_subnet" "public" {
  for_each                = var.public_subnets
  vpc_id                  = aws_vpc.main.id
  cidr_block              = each.value
  availability_zone       = each.key
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-${each.key}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "prod-igw"
  }
}
```

---

## **5. Modern Refactoring & Continuous Checks**

### 🔹 Declarative `import` Blocks (Terraform 1.5+)

Import existing cloud resources directly through code:

```hcl
import {
  to = aws_security_group.allow_tls
  id = "sg-0123456789abcdef0"
}
```

### 🔹 Refactoring without Downtime (`moved` Blocks)

Rename a resource in your configuration without Terraform planning to destroy and recreate it:

```hcl
moved {
  from = aws_instance.web_server
  to   = aws_instance.api_gateway
}
```

### 🔹 Continuous Health Assertions (`check` Blocks)

```hcl
check "api_gateway_health" {
  data "http" "api_endpoint" {
    url = "https://${aws_lb.web.dns_name}/healthz"
  }

  assert {
    condition     = data.http.api_endpoint.status_code == 200
    error_message = "API Gateway returned status ${data.http.api_endpoint.status_code}."
  }
}
```

---

## **6. CLI Workflow Quick Reference**

```bash
# Initialize and upgrade plugins
terraform init -upgrade

# Canonical formatting check
terraform fmt -recursive -check

# Validate configuration syntax
terraform validate

# Plan and export to execution file
terraform plan -out=tfplan

# Apply the pre-calculated plan file
terraform apply tfplan

# Target a specific resource replacement (modern taint alternative)
terraform apply -replace="aws_instance.api_gateway"
```

---

## 📚 **Learning Resources**

* 🔗 [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
* 📘 [HashiCorp AWS Tutorials](https://developer.hashicorp.com/terraform/tutorials/aws)
* 🏛️ [Terraform AWS Modules Repository](https://github.com/terraform-aws-modules)
