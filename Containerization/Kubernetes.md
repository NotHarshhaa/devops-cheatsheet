# Kubernetes Cheatsheet

![text](https://imgur.com/aYuSIvY.png)

## Checkout detailed article on [Dev.to](https://dev.to/prodevopsguytech/kubernetes-commands-for-devops-engineers-124o)

## 1. Introduction to Kubernetes

### What is Kubernetes?

- **Kubernetes** is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications.

### Key Concepts

- **Cluster**: A set of worker machines, called nodes, that run containerized applications.
- **Node**: A single machine in a Kubernetes cluster.
- **Pod**: The smallest deployable unit, which can contain one or more containers.
- **Service**: A stable network endpoint to expose a set of pods.
- **Namespace**: A way to divide cluster resources between multiple users.
- **Kubelet**: An agent running on each node that ensures containers are running in a Pod.
- **Kubectl**: Command-line tool to interact with Kubernetes clusters.

---

## 2. Basic Kubernetes Operations

### Setting Up a Kubernetes Cluster

- **Minikube**: Set up a single-node Kubernetes cluster for testing.

  ```bash
  minikube start
  ```

### Working with `kubectl`

- **Get Cluster Information**:

  ```bash
  kubectl cluster-info
  ```

- **Get All Nodes in the Cluster**:

  ```bash
  kubectl get nodes
  ```

### Managing Pods

- **Create a Pod**:

  ```bash
  kubectl run mypod --image=nginx
  ```

- **List All Pods**:

  ```bash
  kubectl get pods
  ```

- **Describe a Pod**:

  ```bash
  kubectl describe pod mypod
  ```

- **Delete a Pod**:

  ```bash
  kubectl delete pod mypod
  ```

### Using Namespaces

- **List All Namespaces**:

  ```bash
  kubectl get namespaces
  ```

- **Create a Namespace**:

  ```bash
  kubectl create namespace mynamespace
  ```

- **Delete a Namespace**:

  ```bash
  kubectl delete namespace mynamespace
  ```

---

## 3. Deployments and Scaling

### Deployments

- **Create a Deployment**:

  ```bash
  kubectl create deployment myapp --image=nginx
  ```

- **View Deployment Status**:

  ```bash
  kubectl get deployments
  ```

- **Update a Deployment**:

  ```bash
  kubectl set image deployment/myapp nginx=nginx:1.16
  ```

- **Rollback a Deployment**:

  ```bash
  kubectl rollout undo deployment/myapp
  ```

### Scaling Applications

- **Scale a Deployment**:

  ```bash
  kubectl scale deployment myapp --replicas=3
  ```

- **Auto-scaling with Horizontal Pod Autoscaler (HPA)**:

  ```bash
  kubectl autoscale deployment myapp --min=1 --max=5 --cpu-percent=80
  ```

---

## 4. Services and Networking

### Services

- **Expose a Pod with a Service**:

  ```bash
  kubectl expose pod mypod --port=80 --target-port=8080
  ```

- **Create a Service for a Deployment**:

  ```bash
  kubectl expose deployment myapp --type=NodePort --port=80
  ```

- **List All Services**:

  ```bash
  kubectl get services
  ```

### Networking

- **Understanding Cluster Networking**: Kubernetes abstracts network communication between Pods.
- **Network Policies**: Restrict Pod communication using Network Policies.

  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    name: mynetworkpolicy
    namespace: mynamespace
  spec:
    podSelector:
      matchLabels:
        role: db
    policyTypes:
    - Ingress
    - Egress
    ingress:
    - from:
      - podSelector:
          matchLabels:
            role: frontend
    egress:
    - to:
      - podSelector:
          matchLabels:
            role: backend
  ```

---

## 5. Persistent Storage

### Volumes

- **Create a Persistent Volume**:

  ```yaml
  apiVersion: v1
  kind: PersistentVolume
  metadata:
    name: mypv
  spec:
    capacity:
      storage: 1Gi
    accessModes:
      - ReadWriteOnce
    hostPath:
      path: "/mnt/data"
  ```

- **Create a Persistent Volume Claim**:

  ```yaml
  apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
    name: mypvc
  spec:
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  ```

### StorageClasses

- **Create a StorageClass**:

  ```yaml
  apiVersion: storage.k8s.io/v1
  kind: StorageClass
  metadata:
    name: mystorageclass
  provisioner: kubernetes.io/aws-ebs
  parameters:
    type: gp2
  ```

---

## 6. ConfigMaps and Secrets

### ConfigMaps

- **Create a ConfigMap from a File**:

  ```bash
  kubectl create configmap myconfig --from-file=config.txt
  ```

- **View a ConfigMap**:

  ```bash
  kubectl get configmap myconfig -o yaml
  ```

- **Use a ConfigMap in a Pod**:

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: mypod
  spec:
    containers:
    - name: mycontainer
      image: nginx
      envFrom:
      - configMapRef:
          name: myconfig
  ```

### Secrets

- **Create a Secret from a Literal Value**:

  ```bash
  kubectl create secret generic mysecret --from-literal=username=admin
  ```

- **View a Secret**:

  ```bash
  kubectl get secret mysecret -o yaml
  ```

- **Use a Secret in a Pod**:

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: mypod
  spec:
    containers:
    - name: mycontainer
      image: nginx
      envFrom:
      - secretRef:
          name: mysecret
  ```

---

## 7. Ingress Controllers

### Setting Up Ingress

- **Install an Ingress Controller**: Use a Helm chart or YAML manifest to install an ingress controller (e.g., NGINX Ingress Controller).

  ```bash
  kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
  ```

### Configuring Ingress Resources

- **Create an Ingress Resource**:

  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: myingress
  spec:
    rules:
    - host: myapp.example.com
      http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: myapp-service
              port:
                number: 80
  ```

- **TLS Termination with Ingress**:

  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: myingress
  spec:
    tls:
    - hosts:
      - myapp.example.com
      secretName: mytlssecret
    rules:
    - host: myapp.example.com
      http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: myapp-service
              port:
                number: 80
  ```

---

## 8. Kubernetes Security

### Role-Based Access Control (RBAC)

- **Create a Role**:

  ```yaml
  apiVersion: rbac.authorization.k8s.io/v1
  kind: Role
  metadata:
    namespace: mynamespace
    name: myrole
  rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "watch", "list"]
  ```

- **Bind a Role to a User**:

  ```yaml
  apiVersion: rbac.authorization.k8s.io/v1
  kind: RoleBinding
  metadata:
    name: myrolebinding
    namespace: mynamespace
  subjects:
  - kind: User
    name: myuser
    apiGroup: rbac.authorization.k8s.io
  roleRef:
    kind: Role
    name: myrole
    apiGroup: rbac.authorization.k8s.io
  ```

### Pod Security Policies (PSP)

- **Create a PSP**:

  ```yaml
  apiVersion: policy/v1beta1
  kind: PodSecurityPolicy
  metadata:
    name: mypsp
  spec:
    privileged: false
    seLinux:
      rule: RunAsAny
    supplementalGroups:
      rule: RunAsAny
    runAsUser:
      rule: RunAsAny
    fsGroup:
      rule: RunAsAny
    volumes:
    - '*'
  ```

### Network Policies

- **Create a Network Policy**:

  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    name: allow-db
    namespace: mynamespace
  spec:
    podSelector:
      matchLabels:
        role: db
    policyTypes:


    - Ingress
    ingress:
    - from:
      - podSelector:
          matchLabels:
            role: frontend
  ```

### Securing Kubernetes API Server

- **Enable API Server Auditing**:
  - Edit the API server manifest to include auditing options.

  ```yaml
  - --audit-log-path=/var/log/kubernetes/audit.log
  - --audit-policy-file=/etc/kubernetes/audit-policy.yaml
  ```

---

## 9. Advanced Kubernetes

### Custom Resource Definitions (CRDs)

- **Create a Custom Resource Definition**:

  ```yaml
  apiVersion: apiextensions.k8s.io/v1
  kind: CustomResourceDefinition
  metadata:
    name: myresources.example.com
  spec:
    group: example.com
    versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
    scope: Namespaced
    names:
      plural: myresources
      singular: myresource
      kind: MyResource
      shortNames:
      - mr
  ```

### Operators

- **Introduction to Operators**: Operators are Kubernetes applications designed to manage complex stateful applications by extending the Kubernetes API.
- **Creating an Operator**:
  - Use the Operator SDK to scaffold and build an operator.

  ```bash
  operator-sdk init --domain=example.com --repo=github.com/example/memcached-operator
  operator-sdk create api --group=cache --version=v1 --kind=Memcached --resource --controller
  ```

### Service Mesh with Istio

- **Install Istio**:

  ```bash
  istioctl install --set profile=demo
  ```

- **Deploy an Application with Istio**:
  - Annotate namespace to enable Istio sidecar injection.

  ```bash
  kubectl label namespace mynamespace istio-injection=enabled
  ```

  - Deploy application in the annotated namespace.
- **Traffic Management with Istio**:
  - Create VirtualService and DestinationRule to manage traffic routing.

  ```yaml
  apiVersion: networking.istio.io/v1alpha3
  kind: VirtualService
  metadata:
    name: myapp
  spec:
    hosts:
    - myapp.example.com
    http:
    - route:
      - destination:
          host: myapp
          subset: v1
  ```
  
### Monitoring and Logging

- **Prometheus and Grafana**:
  - **Install Prometheus**:

    ```bash
    kubectl apply -f https://github.com/prometheus-operator/prometheus-operator/blob/main/bundle.yaml
    ```

  - **Install Grafana**:

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/grafana/grafana/main/deploy/kubernetes/grafana-deployment.yaml
    ```

  - **View Metrics in Grafana**: Access the Grafana dashboard and configure data sources to use Prometheus.

- **Logging with ELK Stack**:
  - **Deploy ELK Stack**: Use Helm or custom YAML manifests to deploy Elasticsearch, Logstash, and Kibana.

    ```bash
    helm install elk-stack stable/elastic-stack
    ```

  - **Configure Fluentd for Log Collection**:
    - Deploy Fluentd as a DaemonSet to collect logs from all nodes and send them to Elasticsearch.

### High Availability and Disaster Recovery

- **Kubernetes High Availability (HA)**:
  - **HA Master Nodes**: Set up multiple master nodes to ensure availability.
  - **HA etcd Cluster**: Use an HA etcd cluster to store Kubernetes state with redundancy.

- **Disaster Recovery**:
  - **Backup and Restore etcd**:
    - Use `etcdctl` to take snapshots of the etcd cluster.

    ```bash
    etcdctl snapshot save /path/to/backup
    ```

    - Restore from the snapshot when needed.

### Federation

- **Multi-Cluster Federation**:
  - **Set Up Federation**: Use Kubernetes Federation v2 to manage multiple clusters from a single control plane.

  ```bash
  kubefedctl join mycluster --cluster-context=mycluster-context --host-cluster-context=host-cluster-context
  ```

  - **Deploy Federated Resources**: Deploy resources that span across multiple clusters using the Federation API.

---

## 10. References

### Official Documentation

- [Kubernetes Official Documentation](https://kubernetes.io/docs/)

### Community Resources

- [Kubernetes Slack](http://slack.k8s.io/)
- [Kubernetes GitHub Repository](https://github.com/kubernetes/kubernetes)
- [Kubernetes Blog](https://kubernetes.io/blog/)
