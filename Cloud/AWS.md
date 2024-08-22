# AWS Cheatsheet

![text](https://imgur.com/DDbwilK.png)

**1. Introduction:**

- **Amazon Web Services (AWS)** is a comprehensive cloud platform offering over 200 fully featured services from data centers globally. AWS provides cloud solutions for compute, storage, databases, machine learning, security, and more.

**2. Core AWS Services:**

- **Compute:**
  - **EC2 (Elastic Compute Cloud):**
    - Virtual servers for running applications.
    - Instance types: General Purpose, Compute Optimized, Memory Optimized, etc.
    - Key Concepts: AMI, Instance Types, Key Pairs, Security Groups, EBS Volumes.
    - Example:

      ```bash
      aws ec2 run-instances --image-id ami-12345678 --instance-type t2.micro --key-name MyKeyPair
      ```

  - **Lambda:**
    - Serverless computing to run code without provisioning or managing servers.
    - Key Concepts: Functions, Event Sources, IAM Roles.
    - Example:

      ```bash
      aws lambda create-function --function-name my-function --runtime python3.8 --role arn:aws:iam::123456789012:role/execution_role --handler my_function.handler --zip-file fileb://my-deployment-package.zip
      ```

  - **ECS/EKS (Elastic Container Service/Elastic Kubernetes Service):**
    - ECS: Fully managed container orchestration service.
    - EKS: Managed Kubernetes service for running Kubernetes on AWS.
    - Key Concepts: Clusters, Tasks, Services, Fargate.
    - Example:

      ```bash
      aws ecs create-cluster --cluster-name my-cluster
      ```

- **Storage:**
  - **S3 (Simple Storage Service):**
    - Scalable object storage service.
    - Key Concepts: Buckets, Objects, Storage Classes, Lifecycle Policies.
    - Example:

      ```bash
      aws s3 mb s3://my-bucket
      aws s3 cp my-file.txt s3://my-bucket/
      ```

  - **EBS (Elastic Block Store):**
    - Block storage for use with EC2 instances.
    - Key Concepts: Volumes, Snapshots, Volume Types (gp2, io1, st1, etc.).
    - Example:

      ```bash
      aws ec2 create-volume --size 10 --region us-east-1 --availability-zone us-east-1a --volume-type gp2
      ```

  - **Glacier:**
    - Long-term, secure, and durable storage for data archiving and backup.
    - Key Concepts: Vaults, Archives, Retrieval Policies.
    - Example:

      ```bash
      aws glacier create-vault --vault-name my-vault --account-id -
      ```

- **Database:**
  - **RDS (Relational Database Service):**
    - Managed relational database service supporting various engines (MySQL, PostgreSQL, Oracle, SQL Server, etc.).
    - Key Concepts: DB Instances, Snapshots, Security Groups, Multi-AZ.
    - Example:

      ```bash
      aws rds create-db-instance --db-instance-identifier mydbinstance --db-instance-class db.t2.micro --engine mysql --master-username admin --master-user-password password --allocated-storage 20
      ```

  - **DynamoDB:**
    - Managed NoSQL database service.
    - Key Concepts: Tables, Items, Attributes, Primary Key, Global/Local Secondary Indexes.
    - Example:

      ```bash
      aws dynamodb create-table --table-name MyTable --attribute-definitions AttributeName=Id,AttributeType=N --key-schema AttributeName=Id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
      ```

  - **Aurora:**
    - MySQL and PostgreSQL-compatible relational database built for the cloud, providing high performance and availability.
    - Key Concepts: Clusters, Replicas, Global Databases.
    - Example:

      ```bash
      aws rds create-db-cluster --db-cluster-identifier my-cluster --engine aurora-mysql --master-username admin --master-user-password password
      ```

**3. Networking:**

- **VPC (Virtual Private Cloud):**
  - Isolated network environment to launch AWS resources.
  - Key Concepts: Subnets, Route Tables, Internet Gateways, NAT Gateways, Security Groups, NACLs.
  - Example:

    ```bash
    aws ec2 create-vpc --cidr-block 10.0.0.0/16
    aws ec2 create-subnet --vpc-id vpc-12345678 --cidr-block 10.0.1.0/24
    ```

- **Route 53:**
  - Scalable DNS and domain name registration service.
  - Key Concepts: Hosted Zones, Record Sets, Health Checks, Traffic Policies.
  - Example:

    ```bash
    aws route53 create-hosted-zone --name example.com --caller-reference unique-string
    ```

- **CloudFront:**
  - Content delivery network (CDN) for delivering content globally with low latency.
  - Key Concepts: Distributions, Origins, Behaviors, Edge Locations.
  - Example:

    ```bash
    aws cloudfront create-distribution --origin-domain-name mybucket.s3.amazonaws.com
    ```

- **Elastic Load Balancing (ELB):**
  - Distributes incoming traffic across multiple targets, such as EC2 instances.
  - Key Concepts: Load Balancers (ALB, NLB, CLB), Target Groups, Listeners.
  - Example:

    ```bash
    aws elbv2 create-load-balancer --name my-load-balancer --subnets subnet-12345678 subnet-87654321 --security-groups sg-12345678
    ```

**4. Security and Identity:**

- **IAM (Identity and Access Management):**
  - Manages users, groups, roles, and permissions.
  - Key Concepts: Users, Groups, Roles, Policies, MFA, Access Keys.
  - Example:

    ```bash
    aws iam create-user --user-name myuser
    aws iam attach-user-policy --user-name myuser --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
    ```

- **KMS (Key Management Service):**
  - Managed service for creating and controlling encryption keys.
  - Key Concepts: CMKs (Customer Master Keys), Aliases, Grants, Key Policies.
  - Example:

    ```bash
    aws kms create-key --description "My CMK"
    ```

- **CloudTrail:**
  - Tracks user activity and API usage across AWS accounts.
  - Key Concepts: Trails, Logs, S3 Buckets, Insights.
  - Example:

    ```bash
    aws cloudtrail create-trail --name MyTrail --s3-bucket-name my-bucket
    ```

**5. Management Tools:**

- **CloudFormation:**
  - Infrastructure as Code service for modeling and setting up AWS resources.
  - Key Concepts: Templates, Stacks, Resources, Outputs, Parameters.
  - Example:

    ```bash
    aws cloudformation create-stack --stack-name my-stack --template-body file://template.json
    ```

- **CloudWatch:**
  - Monitoring and observability service for AWS resources and applications.
  - Key Concepts: Metrics, Alarms, Logs, Events, Dashboards.
  - Example:

    ```bash
    aws cloudwatch put-metric-alarm --alarm-name my-alarm --metric-name CPUUtilization --namespace AWS/EC2 --statistic Average --period 300 --threshold 80 --comparison-operator GreaterThanOrEqualToThreshold --evaluation-periods 1 --alarm-actions arn:aws:sns:us-east-1:123456789012:my-topic
    ```

- **AWS Config:**
  - Service for assessing, auditing, and evaluating the configurations of AWS resources.
  - Key Concepts: Rules, Resources, Aggregators, Config Recorder.
  - Example:

    ```bash
    aws configservice put-configuration-recorder --configuration-recorder name=my-recorder,roleARN=arn:aws:iam::123456789012:role/my-role
    ```

- **Trusted Advisor:**
  - Provides real-time guidance to help you provision your resources following AWS best practices.
  - Key Concepts: Checks, Recommendations.
  - Example:
    - Access via AWS Management Console.

**6. Advanced Topics:**

- **Cost Management:**
  - Use AWS Cost Explorer, Budgets, and Cost & Usage Reports to monitor and optimize spending.
  - Example:

    ```bash
    aws ce get-cost-and-usage --time-period Start=2024-08-01,End=2024-08-31 --granularity MONTHLY --metrics "BlendedCost"
    ```

- **Auto Scaling:**
  - Automatically adjust the capacity of your resources based on demand.
  - Key Concepts: Auto Scaling Groups, Scaling Policies, Launch Configurations.
  - Example:

    ```bash
    aws autoscaling create-auto-scaling-group --auto-scaling-group-name my-asg --launch-configuration-name my-lc --min-size 1 --max-size 10 --desired-capacity 2 --vpc-zone-identifier subnet-12345678
    ```

- **Serverless Architectures:**
  - Use AWS Lambda, API Gateway, and DynamoDB to build serverless applications.
  - Key Concepts: Functions, APIs, Tables, Events, Triggers.
  - Example:

    ```bash
    aws apigateway create-rest-api --name 'My API'
    ```

**7. Best

 Practices:**

- **Security:**
  - Use IAM Roles and Policies, enable MFA, encrypt data at rest and in transit, monitor with CloudTrail, and apply the Principle of Least Privilege.
  
- **Reliability:**
  - Design for failure, use multiple Availability Zones (AZs), implement backups, and set up auto-scaling.

- **Performance Efficiency:**
  - Right-size instances, use appropriate storage classes, and leverage managed services.

- **Cost Optimization:**
  - Use Reserved Instances (RIs), Spot Instances, and review billing regularly.

- **Operational Excellence:**
  - Automate processes, monitor operations, and use infrastructure as code (IaC).
