# Kubernetes Cheatsheet

![text](https://imgur.com/aYuSIvY.png)

### Checkout detailed article on [Dev.to](https://dev.to/prodevopsguytech/kubernetes-commands-for-devops-engineers-124o)

**1. Introduction:**

- **Kubernetes** is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. Kubernetes clusters can span hosts across public, private, or hybrid clouds.

**2. Key Concepts:**

- **Cluster:** A set of nodes where Kubernetes runs, consisting of at least one master node and multiple worker nodes.
- **Node:** A worker machine in Kubernetes, either a virtual or a physical machine, where Pods are deployed.
- **Pod:** The smallest deployable unit in Kubernetes, a Pod encapsulates one or more containers.
- **Service:** An abstraction that defines a logical set of Pods and a policy by which to access them.
- **Deployment:** A higher-level concept that manages Pods and ReplicaSets.

**3. Kubernetes Architecture:**

- **Master Components:**
  - **API Server:** The front-end for the Kubernetes control plane.
  - **Scheduler:** Assigns Pods to nodes based on resource availability.
  - **Controller Manager:** Manages controllers that regulate the state of the cluster.
  - **etcd:** A consistent and highly-available key-value store used as Kubernetes' backing store for all cluster data.

- **Worker Node Components:**
  - **Kubelet:** Ensures that containers are running in a Pod.
  - **Kube-proxy:** Manages network communication inside and outside of the cluster.
  - **Container Runtime:** Software responsible for running containers, e.g., Docker, containerd.

**4. Kubernetes Installation:**

- **Minikube (Local Cluster):**

  ```bash
  curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
  sudo install minikube-linux-amd64 /usr/local/bin/minikube
  minikube start
  ```

- **Kubeadm (Production Cluster):**

  ```bash
  kubeadm init
  ```

**5. Managing Pods:**

- **Create a Pod:**

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: my-pod
  spec:
    containers:
    - name: nginx
      image: nginx
  ```

  ```bash
  kubectl apply -f pod.yaml
  ```

- **View Pod Status:**

  ```bash
  kubectl get pods
  ```

- **Describe a Pod:**

  ```bash
  kubectl describe pod my-pod
  ```

- **Delete a Pod:**

  ```bash
  kubectl delete pod my-pod
  ```

**6. Deployments and Scaling:**

- **Create a Deployment:**

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: nginx-deployment
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: nginx
    template:
      metadata:
        labels:
          app: nginx
      spec:
        containers:
        - name: nginx
          image: nginx:1.14.2
  ```

  ```bash
  kubectl apply -f deployment.yaml
  ```

- **Scaling a Deployment:**

  ```bash
  kubectl scale deployment/nginx-deployment --replicas=5
  ```

- **Rolling Updates:**

  ```bash
  kubectl set image deployment/nginx-deployment nginx=nginx:1.16.0
  ```

**7. Services and Networking:**

- **Expose a Deployment as a Service:**

  ```bash
  kubectl expose deployment/nginx-deployment --type=LoadBalancer --name=my-service
  ```

- **Service Types:**
  - **ClusterIP:** Default type, accessible only within the cluster.
  - **NodePort:** Exposes the Service on each Node’s IP at a static port.
  - **LoadBalancer:** Provision a LoadBalancer to expose the Service externally.

**8. Persistent Storage:**

- **Persistent Volume (PV):**

  ```yaml
  apiVersion: v1
  kind: PersistentVolume
  metadata:
    name: pv-name
  spec

:
    capacity:
      storage: 1Gi
    accessModes:
      - ReadWriteOnce
    persistentVolumeReclaimPolicy: Retain
    storageClassName: manual
    hostPath:
      path: "/mnt/data"

  ```

- **Persistent Volume Claim (PVC):**
  ```yaml
  apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
    name: pvc-name
  spec:
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  ```

- **Mounting a PVC to a Pod:**

  ```yaml
  spec:
    volumes:
      - name: my-volume
        persistentVolumeClaim:
          claimName: pvc-name
    containers:
      - name: my-container
        volumeMounts:
          - mountPath: "/mnt/data"
            name: my-volume
  ```

**9. ConfigMaps and Secrets:**

- **ConfigMap Example:**

  ```yaml
  apiVersion: v1
  kind: ConfigMap
  metadata:
    name: my-config
  data:
    key: value
  ```

- **Secret Example:**

  ```yaml
  apiVersion: v1
  kind: Secret
  metadata:
    name: my-secret
  type: Opaque
  data:
    username: YWRtaW4=
    password: MWYyZDFlMmU2N2Rm
  ```

**10. Advanced Kubernetes Concepts:**

- **Helm Charts:** Package manager for Kubernetes.
- **Operators:** Extend Kubernetes functionalities by managing complex applications.
- **Custom Resource Definitions (CRD):** Extend Kubernetes API to manage custom resources.

**11. Monitoring and Logging:**

- **Prometheus and Grafana:** For metrics and monitoring.
- **ELK Stack (Elasticsearch, Logstash, Kibana):** For centralized logging.
- **kubectl logs:** View logs of a specific Pod.

**12. Kubernetes Security:**

- **RBAC (Role-Based Access Control):** Define access controls in the cluster.

  ```yaml
  apiVersion: rbac.authorization.k8s.io/v1
  kind: Role
  metadata:
    namespace: default
    name: pod-reader
  rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "watch", "list"]
  ```

- **Network Policies:** Define how Pods communicate with each other and other network endpoints.

  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    name: allow-nginx
  spec:
    podSelector:
      matchLabels:
        app: nginx
    policyTypes:
      - Ingress
    ingress:
      - from:
        - ipBlock:
            cidr: 192.168.1.0/24
  ```

**13. Troubleshooting Kubernetes:**

- **kubectl get events:** Get events to diagnose issues.
- **kubectl describe:** Describe resource for detailed state.
- **kubectl debug:** Debug a container in a pod.
