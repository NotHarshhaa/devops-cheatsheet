# Kubernetes on AWS Cheatsheet

![text](https://imgur.com/lWOk4cE.png)

## 1. Introduction to Kubernetes on AWS

### What is Kubernetes?

- **Kubernetes** is an open-source platform for automating containerized application deployment, scaling, and management.

### Kubernetes on AWS

- AWS offers managed Kubernetes services through **Amazon EKS** (Elastic Kubernetes Service), which simplifies the process of running Kubernetes clusters on AWS infrastructure.

---

## 2. Setting Up Kubernetes on AWS

### Amazon EKS Overview

- **Amazon EKS** is a managed service that simplifies running Kubernetes on AWS by handling the control plane and providing integration with AWS services.

### Creating an EKS Cluster

- **Using AWS Management Console**:
  1. Go to the Amazon EKS console.
  2. Click **Create cluster**.
  3. Follow the wizard to configure cluster settings, including VPC, subnets, and IAM roles.

- **Using AWS CLI**:

  ```bash
  aws eks create-cluster --name my-cluster --role-arn arn:aws:iam::123456789012:role/EKS-Cluster-Role --resources-vpc-config subnetIds=subnet-0bb1c79de4EXAMPLE,subnet-0bb1c79de4EXAMPLE
  ```

### Configuring kubectl

- **Update kubeconfig**:

  ```bash
  aws eks update-kubeconfig --name my-cluster
  ```

---

## 3. EKS Cluster Configuration

### Node Groups

- **Create Node Group Using Console**:
  1. Go to the Amazon EKS console.
  2. Select your cluster.
  3. Navigate to the **Compute** tab and click **Add Node Group**.
  4. Configure settings such as instance types, scaling options, and IAM roles.

- **Create Node Group Using AWS CLI**:

  ```bash
  aws eks create-nodegroup --cluster-name my-cluster --nodegroup-name my-node-group --scaling-config minSize=1,maxSize=3,desiredSize=2 --disk-size 20 --subnets subnet-0bb1c79de4EXAMPLE,subnet-0bb1c79de4EXAMPLE --instance-types t3.medium --node-role arn:aws:iam::123456789012:role/EKS-Node-Role
  ```

### IAM Roles and Policies

- **Create IAM Roles**:
  - **EKS Cluster Role**: Grants EKS permissions to interact with AWS services.
  - **Node Instance Role**: Grants permissions for the worker nodes.

- **Attach Policies**:
  - **AmazonEKSClusterPolicy**
  - **AmazonEKSWorkerNodePolicy**
  - **AmazonEC2ContainerRegistryReadOnly**

---

## 4. Networking

### VPC and Subnet Configuration

- **Create VPC**:

  ```bash
  aws ec2 create-vpc --cidr-block 10.0.0.0/16
  ```

- **Create Subnets**:

  ```bash
  aws ec2 create-subnet --vpc-id vpc-0bb1c79de4EXAMPLE --cidr-block 10.0.1.0/24 --availability-zone us-west-2a
  ```

- **Configure Security Groups**:
  - Allow inbound traffic on port 443 (Kubernetes API server).
  - Allow outbound traffic for node communication.

### Cluster Networking

- **Use Amazon VPC CNI Plugin**:
  - Ensures that Kubernetes pods get IP addresses from the VPC network.

  ```bash
  kubectl apply -f https://raw.githubusercontent.com/aws/amazon-vpc-cni-k8s/master/config/v1.12/aws-k8s-cni.yaml
  ```

---

## 5. Deploying Applications

### Deploying with kubectl

- **Create a Deployment**:

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: my-deployment
  spec:
    replicas: 2
    selector:
      matchLabels:
        app: my-app
    template:
      metadata:
        labels:
          app: my-app
      spec:
        containers:
        - name: my-container
          image: my-image:latest
          ports:
          - containerPort: 80
  ```

- **Apply the Deployment**:

  ```bash
  kubectl apply -f deployment.yaml
  ```

### Managing Services

- **Create a Service**:

  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: my-service
  spec:
    selector:
      app: my-app
    ports:
    - protocol: TCP
      port: 80
      targetPort: 80
    type: LoadBalancer
  ```

- **Apply the Service**:

  ```bash
  kubectl apply -f service.yaml
  ```

### Ingress Controllers

- **Install NGINX Ingress Controller**:

  ```bash
  kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/aws/deploy.yaml
  ```

- **Create an Ingress Resource**:

  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: my-ingress
  spec:
    rules:
    - host: myapp.example.com
      http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: my-service
              port:
                number: 80
  ```

---

## 6. Storage

### EBS Volumes

- **Create and Attach an EBS Volume**:
  - **Create Volume**:

    ```bash
    aws ec2 create-volume --size 10 --availability-zone us-west-2a --volume-type gp2
    ```

  - **Attach Volume**:

    ```bash
    aws ec2 attach-volume --volume-id vol-0bb1c79de4EXAMPLE --instance-id i-0bb1c79de4EXAMPLE --device /dev/xvdf
    ```

### Persistent Volumes and Claims

- **Create a Persistent Volume**:

  ```yaml
  apiVersion: v1
  kind: PersistentVolume
  metadata:
    name: my-pv
  spec:
    capacity:
      storage: 10Gi
    accessModes:
      - ReadWriteOnce
    hostPath:
      path: /mnt/data
  ```

- **Create a Persistent Volume Claim**:

  ```yaml
  apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
    name: my-pvc
  spec:
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 10Gi
  ```

---

## 7. Monitoring and Logging

### CloudWatch Integration

- **Install CloudWatch Agent**:

  ```bash
  kubectl apply -f https://s3.amazonaws.com/amazoncloudwatch-agent-kubernetes/amazon-cloudwatch-agent.yaml
  ```

- **Configure CloudWatch Logs**:
  - Create log groups and streams in CloudWatch.
  - Set up IAM roles to allow Kubernetes to push logs to CloudWatch.

### Prometheus and Grafana

- **Install Prometheus**:

  ```bash
  kubectl create namespace monitoring
  kubectl apply -f https://github.com/prometheus/prometheus/releases/download/v2.26.0/prometheus-2.26.0.yaml
  ```

- **Install Grafana**:

  ```bash
  kubectl apply -f https://raw.githubusercontent.com/grafana/grafana/main/deploy/kubernetes/grafana-deployment.yaml
  ```

- **Configure Prometheus and Grafana**:
  - Set up Prometheus as a data source in Grafana.
  - Import pre-built dashboards or create custom ones.

---

## 8. Security

### IAM Roles for Service Accounts

- **Create IAM Role for Service Account**:

  ```bash
  aws iam create-role --role-name my-k8s-role --assume-role-policy-document file://trust-policy.json
  ```

- **Attach Policies**:

  ```bash
  aws iam attach-role-policy --role-name my-k8s-role --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
  ```

- **Associate IAM Role with Kubernetes Service Account**:

  ```yaml
  apiVersion: v1
  kind: ServiceAccount
  metadata:
    name: my-service-account
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/my-k8s-role
  ```

### Network Policies

- **Create a Network Policy**:

  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    name: allow-front-end
  spec:
    podSelector:
      matchLabels:
        role: front-end
    ingress:
    - from:
      - podSelector:
          matchLabels:
            role: back-end
  ```

### Secrets Management

- **Create a Kubernetes Secret**:

  ```bash
  kubectl create secret generic my-secret --from-literal=password=my-password
  ```

- **Access Secret in Pods**:

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: my-pod
  spec:
    containers:
    - name: my-container
      image: my-image
      env:
      - name: MY

_SECRET
        valueFrom:
          secretKeyRef:
            name: my-secret
            key: password

  ```

---

## 9. Auto-scaling and Load Balancing

### Horizontal Pod Autoscaler
- **Create Horizontal Pod Autoscaler**:
  ```bash
  kubectl autoscale deployment my-deployment --cpu-percent=50 --min=1 --max=10
  ```

### Cluster Autoscaler

- **Install Cluster Autoscaler**:

  ```bash
  kubectl apply -f https://github.com/kubernetes/autoscaler/releases/download/<version>/cluster-autoscaler-v<version>.yaml
  ```

### ELB Integration

- **Configure ELB for Load Balancing**:
  - Ensure the service type is `LoadBalancer`.

  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: my-service
  spec:
    type: LoadBalancer
    selector:
      app: my-app
    ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  ```

---

## 10. Backup and Recovery

### EBS Snapshots

- **Create Snapshot**:

  ```bash
  aws ec2 create-snapshot --volume-id vol-0bb1c79de4EXAMPLE --description "My snapshot"
  ```

- **Restore from Snapshot**:

  ```bash
  aws ec2 create-volume --snapshot-id snap-0bb1c79de4EXAMPLE --availability-zone us-west-2a
  ```

### Backup Strategies

- **Use Velero for Backup and Restore**:
  - **Install Velero**:

    ```bash
    velero install --provider aws --bucket <bucket-name> --secret-file <credentials-file> --backup-location-config region=<region>
    ```

- **Create a Backup**:

  ```bash
  velero backup create my-backup --include-namespaces my-namespace
  ```

---

## 11. Upgrades and Maintenance

### Upgrading EKS Clusters

- **Upgrade Control Plane**:
  - **Using Console**: Select your cluster and choose to upgrade.
  - **Using CLI**:

    ```bash
    aws eks update-cluster-version --name my-cluster --kubernetes-version 1.21
    ```

### Upgrading Node Groups

- **Update Node Groups**:

  ```bash
  aws eks update-nodegroup-version --cluster-name my-cluster --nodegroup-name my-node-group --release-version 1.21
  ```

### Regular Maintenance

- **Monitor Cluster Health**: Use AWS CloudWatch and Prometheus for monitoring.
- **Check for Vulnerabilities**: Regularly scan images and clusters for security vulnerabilities.

---

## 12. References

### Official Documentation

- [Amazon EKS Documentation](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

### Tools and Resources

- [AWS CLI Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
- [Kubectl Documentation](https://kubernetes.io/docs/reference/kubectl/)
