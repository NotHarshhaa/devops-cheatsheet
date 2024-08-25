# OpenShift Cheatsheet

![text](https://imgur.com/2HuS6vE.png)

## Table of Contents

1. **Introduction to OpenShift**
   - What is OpenShift?
   - Key Features
   - OpenShift Editions
   - Architecture Overview
2. **Installation and Setup**
   - System Requirements
   - Installing OpenShift
   - Setting Up OpenShift CLI (`oc`)
   - Post-Installation Configuration
3. **Basic Concepts**
   - Projects and Namespaces
   - Pods, Services, and Routes
   - Deployments and DeploymentConfigs
   - StatefulSets and DaemonSets
   - OpenShift Builds and ImageStreams
   - ConfigMaps and Secrets
4. **User Management**
   - Creating and Managing Users
   - Role-Based Access Control (RBAC)
   - Service Accounts
   - Managing Quotas and Limits
5. **Networking**
   - OpenShift SDN Overview
   - Ingress and Egress Traffic Management
   - Configuring Routes and DNS
   - NetworkPolicies for Pod Security
6. **Storage**
   - Persistent Volumes and Persistent Volume Claims
   - StorageClasses and Dynamic Provisioning
   - Managing Storage for Stateful Applications
   - NFS and GlusterFS Integration
7. **Security**
   - OpenShift Security Context Constraints (SCCs)
   - Using SELinux with OpenShift
   - Securing Routes with TLS
   - OpenShift Compliance and Security Audits
8. **Application Lifecycle Management**
   - Creating Applications using `oc new-app`
   - Managing Application Deployments
   - Rolling Updates and Rollbacks
   - Blue-Green and Canary Deployments
9. **Monitoring and Logging**
   - Monitoring with Prometheus and Grafana
   - Logging with Elasticsearch, Fluentd, and Kibana (EFK)
   - Setting Up Alerts and Notifications
   - Debugging Pods and Containers
10. **Advanced Configuration**
    - Customizing OpenShift Templates
    - Managing Resources with Limits and Requests
    - Configuring Auto-scaling with Horizontal Pod Autoscalers (HPA)
    - Customizing OpenShift SDN
11. **CI/CD Pipelines**
    - OpenShift Pipelines with Tekton
    - Integrating Jenkins with OpenShift
    - Automating Builds with BuildConfigs
    - Continuous Delivery Strategies
12. **OpenShift Service Mesh**
    - Introduction to Istio and Service Mesh
    - Configuring OpenShift Service Mesh
    - Traffic Management with Istio
    - Monitoring and Tracing with Kiali and Jaeger
13. **Serverless Computing**
    - OpenShift Serverless Overview
    - Deploying Serverless Applications with Knative
    - Autoscaling Serverless Functions
14. **Hybrid Cloud and Multi-Cloud Deployments**
    - OpenShift 4.x Hybrid Cloud Capabilities
    - Deploying OpenShift Across Multiple Clouds
    - Managing Multi-Cluster Deployments with ACM
15. **Troubleshooting and Best Practices**
    - Common Issues and Fixes
    - Best Practices for OpenShift Operations
    - Performance Tuning
16. **FAQs**
    - Common Questions about OpenShift
17. **References**
    - Official Documentation
    - Community Resources

---

## 1. Introduction to OpenShift

### What is OpenShift?

- **OpenShift** is an enterprise Kubernetes platform developed by Red Hat, offering container orchestration, DevOps tools, and a robust ecosystem for developing, deploying, and managing applications at scale.

### Key Features

- **Integrated Developer Tools**: Supports CI/CD pipelines, source-to-image (S2I) builds, and developer environments.
- **Enterprise Security**: Includes role-based access control (RBAC), network policies, and Security Context Constraints (SCCs).
- **Scalability**: Auto-scaling features for applications and clusters.
- **Multi-cloud and Hybrid Cloud**: Deploy and manage applications across multiple cloud environments.

### OpenShift Editions

- **OpenShift Container Platform (OCP)**: The full-featured enterprise version.
- **OpenShift Online**: Managed OpenShift service hosted by Red Hat.
- **OpenShift Dedicated**: A managed version of OpenShift Container Platform.
- **OKD (OpenShift Kubernetes Distribution)**: The open-source, community-supported version.

### Architecture Overview

- **Master Nodes**: Handle API requests, manage the cluster state, and schedule workloads.
- **Worker Nodes**: Run the containerized applications, managed by the master nodes.
- **etcd**: A distributed key-value store that holds the cluster state.
- **SDN**: OpenShift Software-Defined Networking for managing networking.

---

## 2. Installation and Setup

### System Requirements

- **Operating System**: RHEL, CentOS, or Fedora.
- **Memory**: Minimum 16 GB RAM for a single-node installation.
- **Storage**: At least 50 GB of disk space.
- **CPU**: 4 cores or more.

### Installing OpenShift

- **Single-node Cluster (CodeReady Containers)**:

  ```bash
  crc setup
  crc start
  ```

- **Multi-node Cluster (OpenShift Installer)**:

  ```bash
  openshift-install create cluster
  ```

### Setting Up OpenShift CLI (`oc`)

- **Install `oc` CLI**:

  ```bash
  sudo dnf install -y openshift-clients
  ```

- **Login to Cluster**:

  ```bash
  oc login https://<master-url>:6443 --token=<token>
  ```

### Post-Installation Configuration

- **Verify Installation**:

  ```bash
  oc status
  ```

- **Set up Default Project**:

  ```bash
  oc new-project <project-name>
  ```

---

## 3. Basic Concepts

### Projects and Namespaces

- **Create a New Project**:

  ```bash
  oc new-project myproject
  ```

- **Switch Project**:

  ```bash
  oc project myproject
  ```

### Pods, Services, and Routes

- **Create a Pod**:

  ```bash
  oc run myapp --image=myimage
  ```

- **Expose a Service**:

  ```bash
  oc expose pod myapp --port=8080
  ```

- **Create a Route**:

  ```bash
  oc expose service myapp
  ```

### Deployments and DeploymentConfigs

- **Create a Deployment**:

  ```bash
  oc create deployment myapp --image=myimage
  ```

- **Update a Deployment**:

  ```bash
  oc set image deployment/myapp myapp=mynewimage
  ```

### StatefulSets and DaemonSets

- **Create a StatefulSet**:

  ```bash
  oc create -f statefulset.yaml
  ```

- **Create a DaemonSet**:

  ```bash
  oc create daemonset myds --image=mydaemonimage
  ```

### OpenShift Builds and ImageStreams

- **Start a Build**:

  ```bash
  oc start-build mybuild
  ```

- **Create an ImageStream**:

  ```bash
  oc create imagestream myimage
  ```

### ConfigMaps and Secrets

- **Create a ConfigMap**:

  ```bash
  oc create configmap myconfig --from-file=config.yaml
  ```

- **Create a Secret**:

  ```bash
  oc create secret generic mysecret --from-literal=password=secret
  ```

---

## 4. User Management

### Creating and Managing Users

- **Create a New User**:

  ```bash
  oc create user myuser
  ```

- **Assign a User to a Project**:

  ```bash
  oc adm policy add-role-to-user admin myuser -n myproject
  ```

### Role-Based Access Control (RBAC)

- **Create a Role**:

  ```bash
  oc create role myrole --verb=get --verb=list --resource=pods
  ```

- **Assign a Role to a User**:

  ```bash
  oc adm policy add-role-to-user myrole myuser -n myproject
  ```

### Service Accounts

- **Create a Service Account**:

  ```bash
  oc create serviceaccount myserviceaccount
  ```

- **Assign a Role to a Service Account**:

  ```bash
  oc adm policy add-cluster-role-to-user cluster-admin -z myserviceaccount
  ```

### Managing Quotas and Limits

- **Create a Resource Quota**:

  ```bash
  oc create quota myquota --hard=cpu=2,memory=4Gi -n myproject
  ```

- **Set Limits for a Project**:

  ```bash
  oc create limitrange mylimits --default=cpu=500m,memory=1Gi -n myproject
  ```

---

## 5. Networking

### OpenShift SDN Overview

- **Default Network**: OpenShift uses the OpenShift SDN by default, which provides networking capabilities to connect pods and services.

### Ingress and Egress Traffic Management

- **Create an Ingress Rule**:

  ```bash
  oc create route edge myroute --service=myservice --hostname=myapp.example.com
  ```

### Configuring Routes and DNS

- **Create a Route**:

  ```bash
  oc expose service myservice --hostname=myapp.example.com
  ```

- **Check Route Status**:

  ```bash
  oc get routes
  ```

### NetworkPolicies for Pod Security

- **Create a NetworkPolicy**:

  ```bash
  oc create -f networkpolicy.yaml
  ```

---

## 6

. Storage

### Persistent Volumes and Persistent Volume Claims

- **Create a Persistent Volume**:

  ```bash
  oc create -f persistentvolume.yaml
  ```

- **Create a Persistent Volume Claim**:

  ```bash
  oc create -f persistentvolumeclaim.yaml
  ```

### StorageClasses and Dynamic Provisioning

- **Create a StorageClass**:

  ```bash
  oc create -f storageclass.yaml
  ```

- **Use Dynamic Provisioning**: OpenShift can automatically provision storage based on the StorageClass.

### Managing Storage for Stateful Applications

- **Assign a Persistent Volume to a StatefulSet**:

  ```yaml
  volumeClaimTemplates:
  - metadata:
      name: myvolume
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: "mystorageclass"
      resources:
        requests:
          storage: 1Gi
  ```

### NFS and GlusterFS Integration

- **Use NFS**: Set up NFS as a storage backend and create PersistentVolumes with NFS settings.
- **Use GlusterFS**: Deploy a GlusterFS cluster and configure OpenShift to use it as a storage backend.

---

## 7. Security

### OpenShift Security Context Constraints (SCCs)

- **View Available SCCs**:

  ```bash
  oc get scc
  ```

- **Assign an SCC to a Service Account**:

  ```bash
  oc adm policy add-scc-to-user privileged -z myserviceaccount -n myproject
  ```

### Using SELinux with OpenShift

- **Enable SELinux**:

  ```bash
  setenforce 1
  ```

- **Configure SELinux for OpenShift**: Ensure the correct SELinux policies are in place for OpenShift.

### Securing Routes with TLS

- **Create a TLS Route**:

  ```bash
  oc create route edge myroute --service=myservice --cert=tls.crt --key=tls.key --ca-cert=ca.crt
  ```

### OpenShift Compliance and Security Audits

- **Run a Security Scan**:

  ```bash
  oc adm diagnostics security
  ```

- **Compliance Operator**: Use OpenShift's Compliance Operator to automate security compliance checks.

---

## 8. Application Lifecycle Management

### Creating Applications using `oc new-app`

- **Create an Application from a Git Repository**:

  ```bash
  oc new-app https://github.com/myorg/myrepo.git --name=myapp
  ```

### Managing Application Deployments

- **Create a DeploymentConfig**:

  ```bash
  oc create -f deploymentconfig.yaml
  ```

- **Trigger a New Deployment**:

  ```bash
  oc rollout latest dc/myapp
  ```

### Rolling Updates and Rollbacks

- **Perform a Rolling Update**:

  ```bash
  oc set image dc/myapp myapp=mynewimage
  ```

- **Rollback to a Previous Version**:

  ```bash
  oc rollout undo dc/myapp
  ```

### Blue-Green and Canary Deployments

- **Blue-Green Deployment**: Create two separate environments (blue and green) and switch traffic between them using routes.
- **Canary Deployment**: Gradually shift traffic to a new version using multiple routes and services.

---

## 9. Monitoring and Logging

### Monitoring with Prometheus and Grafana

- **Access Prometheus**: Typically available at `<openshift-master>:9090`.
- **Access Grafana**: Access via the OpenShift Web Console under Monitoring > Dashboards.

### Logging with Elasticsearch, Fluentd, and Kibana (EFK)

- **View Logs in Kibana**: Access Kibana via the OpenShift Web Console.
- **Search Logs**:

  ```bash
  oc logs -f <pod-name>
  ```

### Setting Up Alerts and Notifications

- **Configure Alerts in Prometheus**: Set up alerting rules in Prometheus.
- **Integrate with Notification Channels**: Use Alertmanager to send notifications to channels like Slack, email, etc.

### Debugging Pods and Containers

- **Get Pod Logs**:

  ```bash
  oc logs <pod-name>
  ```

- **Execute Commands in a Running Pod**:

  ```bash
  oc exec -it <pod-name> -- /bin/bash
  ```

---

## 10. Advanced Configuration

### Customizing OpenShift Templates

- **Create a New Template**:

  ```bash
  oc create -f template.yaml
  ```

- **Instantiate a Template**:

  ```bash
  oc process -f template.yaml | oc create -f -
  ```

### Managing Resources with Limits and Requests

- **Set Resource Limits**:

  ```yaml
  resources:
    requests:
      memory: "64Mi"
      cpu: "250m"
    limits:
      memory: "128Mi"
      cpu: "500m"
  ```

### Configuring Auto-scaling with Horizontal Pod Autoscalers (HPA)

- **Create an HPA**:

  ```bash
  oc autoscale dc/myapp --min=1 --max=10 --cpu-percent=80
  ```

### Customizing OpenShift SDN

- **Configure SDN**: Modify the SDN configuration through the OpenShift Web Console or by editing the SDN-related resources.

---

## 11. CI/CD Pipelines

### OpenShift Pipelines with Tekton

- **Install Tekton**:

  ```bash
  oc apply -f tekton-pipelines.yaml
  ```

- **Create a Tekton Pipeline**:

  ```bash
  oc create -f pipeline.yaml
  ```

### Integrating Jenkins with OpenShift

- **Deploy Jenkins**:

  ```bash
  oc new-app jenkins-ephemeral
  ```

- **Create a Jenkins Pipeline**:

  ```bash
  oc create -f jenkins-pipeline.yaml
  ```

### Automating Builds with BuildConfigs

- **Create a BuildConfig**:

  ```bash
  oc create -f buildconfig.yaml
  ```

- **Trigger a Build**:

  ```bash
  oc start-build mybuildconfig
  ```

### Continuous Delivery Strategies

- **Implement CI/CD with Jenkins**: Create pipelines in Jenkins integrated with OpenShift to manage the full application lifecycle.
- **Use Tekton for GitOps**: Automate deployments using GitOps principles with Tekton pipelines.

---

## 12. OpenShift Service Mesh

### Introduction to Istio and Service Mesh

- **Service Mesh Overview**: OpenShift Service Mesh is based on Istio, providing traffic management, security, and observability for microservices.

### Configuring OpenShift Service Mesh

- **Install Service Mesh Components**:

  ```bash
  oc apply -f servicemesh-install.yaml
  ```

- **Create a Service Mesh Control Plane**:

  ```bash
  oc apply -f controlplane.yaml
  ```

### Traffic Management with Istio

- **Create a VirtualService**:

  ```bash
  oc create -f virtualservice.yaml
  ```

- **Configure Traffic Splitting**:

  ```yaml
  http:
  - route:
    - destination:
        host: myservice
        subset: v1
      weight: 50
    - destination:
        host: myservice
        subset: v2
      weight: 50
  ```

### Monitoring and Tracing with Kiali and Jaeger

- **Access Kiali**: Typically available via the OpenShift Web Console under the Service Mesh section.
- **Use Jaeger for Tracing**: View distributed traces for microservices in Jaeger.

---

## 13. Serverless Computing

### OpenShift Serverless Overview

- **Knative on OpenShift**: OpenShift Serverless is built on Knative, providing serverless capabilities for deploying functions and apps that scale to zero.

### Deploying Serverless Applications with Knative

- **Create a Knative Service**:

  ```bash
  oc create -f knative-service.yaml
  ```

### Autoscaling Serverless Functions

- **Configure Autoscaling**:

  ```yaml
  spec:
    autoscaler:
      minReplicas: 1
      maxReplicas: 5
  ```

---

## 14. Hybrid Cloud and Multi-Cloud Deployments

### OpenShift 4.x Hybrid Cloud Capabilities

- **Deploy on Multiple Clouds**: OpenShift supports deployment across AWS, Azure, GCP, and on-premise environments.

### Deploying OpenShift Across Multiple Clouds

- **Use Red Hat Advanced Cluster Management (ACM)**: Manage multiple OpenShift clusters across different environments.
- **Configure Multi-Cloud Deployments**: Use ACM to deploy applications across multiple OpenShift clusters.

### Managing Multi-Cluster Deployments with ACM

- **Install ACM**:

  ```bash
  oc apply -f acm-install.yaml
  ```

- **Manage Multiple Clusters**: Use ACM to oversee the health, configuration, and workload management across multiple clusters.

---

## 15. Troubleshooting and Best Practices

### Common Issues and Fixes

- **Debugging Pods**:

  ```bash
  oc describe pod <pod-name>
  ```

- **Network Issues**: Check the status of routes and network policies.

### Best Practices for OpenShift Operations

- **Use RBAC**: Ensure role-based access control is correctly implemented to limit access.
- **Monitor Resource Usage**: Use monitoring tools to keep an eye on resource usage and scaling needs.

### Performance Tuning

- **Optimize Resource Requests and Limits**: Set appropriate limits and requests for CPU and memory to avoid over-provisioning.
- **Tune SDN**: Adjust SDN configurations for optimal network performance.

---

## 16. FAQs



### Common Questions about OpenShift

- **What is the difference between OpenShift and Kubernetes?**
  - OpenShift is an enterprise Kubernetes platform with additional features like integrated CI/CD, developer tools, and enterprise security.

- **How do I upgrade OpenShift?**
  - Upgrading OpenShift involves using the OpenShift CLI or the Web Console to initiate a cluster upgrade.

---

## 17. References

### Official Documentation

- [OpenShift Documentation](https://docs.openshift.com/)
- [Red Hat OpenShift Blog](https://cloud.redhat.com/blog/)

### Community Resources

- [OpenShift Commons](https://commons.openshift.org/)
- [Red Hat Developer](https://developers.redhat.com/)
