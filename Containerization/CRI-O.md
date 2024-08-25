# CRI-O Cheatsheet

![text](https://imgur.com/iET0fW6.png)

## Table of Contents

1. **Introduction to CRI-O**
   - What is CRI-O?
   - Architecture Overview
   - Key Features
2. **Installation**
   - System Requirements
   - Installing CRI-O on Linux
   - Post-Installation Configuration
3. **Basic Commands**
   - CRI-O CLI Overview
   - Starting and Stopping CRI-O
   - Managing Containers
   - Viewing Logs
4. **Container Management**
   - Pulling Images
   - Running Containers
   - Stopping and Removing Containers
   - Viewing Running Containers
5. **Networking**
   - Default Networking Configuration
   - Configuring Custom Networks
   - Using CNI Plugins with CRI-O
6. **Storage**
   - Managing Container Storage
   - Configuring Storage Options
   - Persistent Storage Management
7. **Security**
   - Pod Security Policies (PSPs)
   - SELinux and CRI-O
   - Seccomp Profiles
   - AppArmor Integration
8. **Monitoring and Logging**
   - Integrating with Prometheus
   - Setting Up Log Collection
   - Debugging Containers
9. **Advanced Configuration**
   - CRI-O Configuration Files
   - Runtime Configuration
   - Resource Limits and Cgroups
   - Tuning for Performance
10. **Troubleshooting**
    - Common Issues and Fixes
    - Analyzing CRI-O Logs
    - Debugging Failed Containers
11. **Integration with Kubernetes**
    - Configuring CRI-O with Kubernetes
    - CRI-O as a Container Runtime for K8s
    - Multi-tenancy with CRI-O in Kubernetes
12. **Best Practices**
    - Security Best Practices
    - Performance Optimization
    - Efficient Resource Management
13. **FAQs**
    - Common Questions about CRI-O
14. **References**
    - Official Documentation
    - Community Resources

---

## 1. Introduction to CRI-O

### What is CRI-O?

- **CRI-O** is an open-source, lightweight container runtime for Kubernetes. It is designed to provide a minimal and stable interface between Kubernetes and the container runtime, adhering to the Container Runtime Interface (CRI) specifications.

### Architecture Overview

- **CRI-O** integrates directly with Kubernetes, using OCI-compatible runtimes (like runc) to handle container operations. It replaces the need for a full container engine like Docker in Kubernetes environments.

### Key Features

- **Lightweight**: Minimal dependencies and a smaller footprint compared to full container engines.
- **Compatibility**: Fully compliant with Kubernetes and the Open Container Initiative (OCI) specifications.
- **Security**: Integrates with SELinux, AppArmor, and seccomp for enhanced security.
- **Performance**: Optimized for performance with lower overhead.

---

## 2. Installation

### System Requirements

- **Supported OS**: CRI-O supports various Linux distributions including Fedora, CentOS, and Ubuntu.
- **Kernel Version**: Ensure that your Linux kernel is 4.19 or higher for optimal compatibility.

### Installing CRI-O on Linux

- **Fedora/CentOS**:

  ```bash
  sudo dnf install -y cri-o
  ```

- **Ubuntu**:

  ```bash
  sudo apt-get install -y cri-o
  ```

### Post-Installation Configuration

- **Start and Enable CRI-O**:

  ```bash
  sudo systemctl start crio
  sudo systemctl enable crio
  ```

- **Verify Installation**:

  ```bash
  crio --version
  ```

---

## 3. Basic Commands

### CRI-O CLI Overview

- **`crio`**: The main command for interacting with the CRI-O service.
- **`crictl`**: A CLI tool used to manage containers and images through CRI-O.

### Starting and Stopping CRI-O

- **Start CRI-O**:

  ```bash
  sudo systemctl start crio
  ```

- **Stop CRI-O**:

  ```bash
  sudo systemctl stop crio
  ```

### Managing Containers

- **List Running Containers**:

  ```bash
  sudo crictl ps
  ```

- **Stop a Container**:

  ```bash
  sudo crictl stop <container_id>
  ```

- **Remove a Container**:

  ```bash
  sudo crictl rm <container_id>
  ```

### Viewing Logs

- **View CRI-O Logs**:

  ```bash
  sudo journalctl -u crio
  ```

---

## 4. Container Management

### Pulling Images

- **Pull an Image**:

  ```bash
  sudo crictl pull <image_name>
  ```

### Running Containers

- **Run a Container**:

  ```bash
  sudo crictl run <pod_config.json> <container_config.json>
  ```

### Stopping and Removing Containers

- **Stop a Container**:

  ```bash
  sudo crictl stop <container_id>
  ```

- **Remove a Container**:

  ```bash
  sudo crictl rm <container_id>
  ```

### Viewing Running Containers

- **List Containers**:

  ```bash
  sudo crictl ps
  ```

---

## 5. Networking

### Default Networking Configuration

- **Default Network**: CRI-O uses the `cni0` bridge for networking by default.

### Configuring Custom Networks

- **CNI Plugins**: CRI-O can use various CNI plugins to configure custom network setups.

### Using CNI Plugins with CRI-O

- **Install CNI Plugins**:

  ```bash
  sudo dnf install -y containernetworking-plugins
  ```

- **Configure Plugin**: Add your CNI plugin configuration in `/etc/cni/net.d/`.

---

## 6. Storage

### Managing Container Storage

- **Default Storage**: CRI-O uses `overlay` storage driver by default.

### Configuring Storage Options

- **Modify Storage Driver**: Edit `/etc/containers/storage.conf` to change the storage driver.

### Persistent Storage Management

- **Mount Volumes**: Use `--mount` option to attach persistent storage volumes to containers.

---

## 7. Security

### Pod Security Policies (PSPs)

- **Enable PSPs**: Configure PSPs in Kubernetes to apply security restrictions on CRI-O managed containers.

### SELinux and CRI-O

- **SELinux Enforcement**: Ensure SELinux is enabled on the host system for better security.

### Seccomp Profiles

- **Enable Seccomp**: CRI-O supports seccomp profiles to restrict system calls for containers.

### AppArmor Integration

- **AppArmor Profiles**: Apply AppArmor profiles for CRI-O containers to enforce security policies.

---

## 8. Monitoring and Logging

### Integrating with Prometheus

- **Prometheus Metrics**: CRI-O exposes metrics that can be scraped by Prometheus for monitoring.

### Setting Up Log Collection

- **Log Rotation**: Configure log rotation in `/etc/crio/crio.conf` to manage container logs.

### Debugging Containers

- **Container Logs**:

  ```bash
  sudo crictl logs <container_id>
  ```

---

## 9. Advanced Configuration

### CRI-O Configuration Files

- **Main Configuration File**: `/etc/crio/crio.conf`
- **Modify Configurations**: Adjust settings for runtime, networking, and storage.

### Runtime Configuration

- **Specify Runtime**: Use the `runtime` section in `crio.conf` to set the container runtime (e.g., runc, kata).

### Resource Limits and Cgroups

- **Set Resource Limits**: Define CPU and memory limits in the container configuration.

### Tuning for Performance

- **Adjust Parameters**: Modify parameters like `pids_limit` and `log_size_max` in `crio.conf` for performance tuning.

---

## 10. Troubleshooting

### Common Issues and Fixes

- **Containers Not Starting**: Check logs for errors related to runtime or configuration issues.
- **Networking Issues**: Verify CNI plugin configurations and network settings.

### Analyzing CRI-O Logs

- **View Logs**:

  ```bash
  sudo journalctl -u crio
  ```

### Debugging Failed Containers

- **Check Exit Code**:

  ```bash
  sudo crictl inspect <container_id>
  ```

---

## 11. Integration with Kubernetes

### Configuring CRI-O with Kubernetes

- **Set CRI-O as the Default Runtime**: Modify Kubernetes configuration to use CRI-O as the default container runtime.

### CRI-O as a Container Runtime for K8s

- **Installation**: Ensure CRI-O is installed and configured on all Kubernetes nodes.

### Multi-tenancy with CRI-O in Kubernetes

- **Namespace Isolation**: Use Kubernetes namespaces and CRI-O security features to ensure tenant isolation.

---

## 12. Best Practices

### Security Best Practices

- **Use SELinux**: Enable SELinux for all nodes running CRI-O.
- **Limit Resource Usage**: Define CPU and memory limits to prevent resource exhaustion.

### Performance Optimization

- **Tune Runtime**: Adjust runtime parameters for high-performance workloads.
- **Log Management**: Set up proper log rotation to prevent disk space exhaustion.

### Efficient Resource Management

- **Resource Limits**: Apply resource limits to containers to optimize cluster resource usage.

---

## 13. FAQs

### Common Questions about CRI-O

- **

Q**: How does CRI-O differ from Docker?
  **A**: CRI-O is a lightweight container runtime designed specifically for Kubernetes, whereas Docker is a full-featured container platform.

- **Q**: Can CRI-O run standalone without Kubernetes?
  **A**: CRI-O is designed to run within Kubernetes environments, but it can also be used with tools like `crictl` for standalone operations.

---

## 14. References

### Official Documentation

- [CRI-O GitHub Repository](https://github.com/cri-o/cri-o)
- [CRI-O Documentation](https://crio.readthedocs.io/)

### Community Resources

- [Kubernetes CRI-O Integration Guide](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#cri-o)
