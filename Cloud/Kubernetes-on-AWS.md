# ☸️ Kubernetes on AWS (Amazon EKS) Cheatsheet

![text](https://imgur.com/lWOk4cE.png)

**Amazon Elastic Kubernetes Service (Amazon EKS)** is a managed certified Kubernetes service running across multiple AWS Availability Zones. It automates control plane provisioning, scaling, patching, and natively integrates with AWS VPC networking, IAM security, and Elastic Load Balancing.

---

## **1. EKS Cluster Creation & Setup**

### 🔹 Creating an EKS Cluster with AWS CLI

```bash
# Create IAM role for EKS control plane
aws iam create-role \
  --role-name EKS-Cluster-Role \
  --assume-role-policy-document file://cluster-trust-policy.json

aws iam attach-role-policy \
  --role-name EKS-Cluster-Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy

# Create EKS cluster
aws eks create-cluster \
  --name prod-cluster \
  --role-arn arn:aws:iam::123456789012:role/EKS-Cluster-Role \
  --resources-vpc-config subnetIds=subnet-0123456789abcdef0,subnet-0987654321fedcba0 \
  --kubernetes-version 1.30
```

### 🔹 Updating Local `kubeconfig`

```bash
aws eks update-kubeconfig --name prod-cluster --region us-east-1
kubectl get nodes
```

---

## **2. Modern Cluster Authentication: EKS Access Entries**

> [!IMPORTANT]
> **Deprecation Notice**: AWS EKS has officially deprecated managing cluster permissions via the `aws-auth` ConfigMap. Always use **EKS Access Entries** for declarative, IAM-managed access.

```bash
# 1. Enable Access Entries authentication mode on the cluster
aws eks update-cluster-config \
  --name prod-cluster \
  --access-config authenticationMode=API_AND_CONFIG_MAP

# 2. Grant an IAM Role cluster administrator access
aws eks create-access-entry \
  --cluster-name prod-cluster \
  --principal-arn arn:aws:iam::123456789012:role/DevOpsAdmin \
  --type STANDARD

aws eks associate-access-policy \
  --cluster-name prod-cluster \
  --principal-arn arn:aws:iam::123456789012:role/DevOpsAdmin \
  --policy-arn arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy \
  --access-scope type=cluster
```

---

## **3. Node Provisioning: Managed Node Groups & Karpenter**

### 🔹 Managed Node Groups

```bash
aws eks create-nodegroup \
  --cluster-name prod-cluster \
  --nodegroup-name general-nodes \
  --scaling-config minSize=2,maxSize=10,desiredSize=3 \
  --instance-types t3.medium \
  --subnets subnet-0123456789abcdef0 subnet-0987654321fedcba0 \
  --node-role arn:aws:iam::123456789012:role/EKS-Node-Role
```

### 🔹 Next-Gen Node Autoscaling with Karpenter

Karpenter is AWS's open-source, high-performance node auto-provisioner that rapidly launches right-sized EC2 instances directly in response to pending unschedulable pods.

File: `nodepool.yaml`:

```yaml
apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: default
spec:
  template:
    spec:
      requirements:
        - key: kubernetes.io/arch
          operator: In
          values: ["arm64", "amd64"]
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot", "on-demand"]
        - key: karpenter.k8s.aws/instance-category
          operator: In
          values: ["c", "m", "r"]
      nodeClassRef:
        name: default
  disruption:
    consolidationPolicy: WhenUnderutilized
    expireAfter: 720h
---
apiVersion: karpenter.k8s.aws/v1beta1
kind: EC2NodeClass
metadata:
  name: default
spec:
  amiFamily: AL2023
  role: "KarpenterNodeRole-prod-cluster"
  subnetSelectorTerms:
    - tags:
        karpenter.sh/discovery: "prod-cluster"
  securityGroupSelectorTerms:
    - tags:
        karpenter.sh/discovery: "prod-cluster"
```

Apply:

```bash
kubectl apply -f nodepool.yaml
```

---

## **4. Pod Identity & IAM Authentication**

### 🔹 EKS Pod Identity (Modern Replacement for IRSA)

EKS Pod Identity simplifies granting AWS IAM permissions to Kubernetes pods without needing OIDC provider configuration or complex trust policies.

```bash
# 1. Install EKS Pod Identity Agent add-on
aws eks create-addon \
  --cluster-name prod-cluster \
  --addon-name eks-pod-identity-agent

# 2. Associate IAM Role with Kubernetes ServiceAccount
aws eks create-pod-identity-association \
  --cluster-name prod-cluster \
  --role-arn arn:aws:iam::123456789012:role/S3ReaderRole \
  --namespace default \
  --service-account s3-reader-sa
```

Pods using `serviceAccountName: s3-reader-sa` automatically receive temporary AWS credentials!

---

## **5. Ingress & Load Balancing: AWS Load Balancer Controller**

The AWS Load Balancer Controller manages ALBs (Application Load Balancers) and NLBs (Network Load Balancers).

### 🔹 Ingress Manifest (Provisions AWS Application Load Balancer)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: default
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS": 443}]'
    alb.ingress.kubernetes.io/ssl-redirect: '443'
spec:
  ingressClassName: alb
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80
```

---

## **6. Cluster Maintenance & Upgrades**

```bash
# Check available cluster upgrades
aws eks describe-update --name prod-cluster

# Upgrade EKS control plane to Kubernetes 1.30
aws eks update-cluster-version \
  --name prod-cluster \
  --kubernetes-version 1.30

# Upgrade managed node groups to match control plane version
aws eks update-nodegroup-version \
  --cluster-name prod-cluster \
  --nodegroup-name general-nodes \
  --kubernetes-version 1.30
```

---

## 📚 **Learning Resources**

* 🔗 [Amazon EKS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)
* 🚀 [Karpenter Official Documentation](https://karpenter.sh/)
* 📦 [AWS Load Balancer Controller Documentation](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
* 🛡️ [EKS Best Practices Guide](https://aws.github.io/aws-eks-best-practices/)
