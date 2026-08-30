# 🧊 CRI-O Cheatsheet

![text](https://imgur.com/iET0fW6.png)

**CRI-O** is an open-source, lightweight Container Runtime Interface (CRI) implementation specifically optimized for Kubernetes. It allows Kubernetes to run containers directly using Open Container Initiative (OCI) compatible runtimes (like `runc` or `crun`) without the overhead of full general-purpose container engines.

---

## **1. Architecture & Core Concepts**

```plaintext
Kubernetes Kubelet
       ↓ (gRPC / CRI API)
  [ CRI-O Daemon ]
       ↓ (OCI Runtime Spec)
  [ runc / crun ]
       ↓
Linux Kernel (cgroups v2, namespaces, seccomp, SELinux)
```

| Component | Description |
| --- | --- |
| **`crio`** | The main background daemon listening on a Unix socket (`/var/run/crio/crio.sock`). |
| **`crictl`** | The official CLI client for debugging and inspecting CRI-compatible runtimes. |
| **`conmon`** | Container monitoring program that monitors runtime instances, handles I/O streams, and catches exit codes. |
| **OCI Runtimes** | Low-level execution runtimes (`runc`, or fast C-based `crun`). |

---

## **2. Installation & Prerequisites**

### 🔹 Kernel Modules & Sysctl Settings

```bash
# Load required kernel modules
cat <<EOF | sudo tee /etc/modules-load.d/crio.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# Configure sysctl networking parameters
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sudo sysctl --system
```

### 🔹 Install via Kubernetes Community Repositories (`pkgs.k8s.io`)

```bash
KUBERNETES_VERSION=v1.30
CRIO_VERSION=v1.30

# Add Kubernetes repository key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/addons:/cri-o:/stable:/$CRIO_VERSION/deb/Release.key | \
  sudo gpg --dearmor -o /etc/apt/keyrings/cri-o-apt-keyring.gpg

echo "deb [signed-by=/etc/apt/keyrings/cri-o-apt-keyring.gpg] https://pkgs.k8s.io/addons:/cri-o:/stable:/$CRIO_VERSION/deb/ /" | \
  sudo tee /etc/apt/sources.list.d/cri-o.list

sudo apt-get update
sudo apt-get install -y cri-o

sudo systemctl daemon-reload
sudo systemctl enable --now crio
```

---

## **3. CLI Debugging with `crictl`**

Configure `/etc/crictl.yaml` for instant command execution:

```yaml
runtime-endpoint: unix:///var/run/crio/crio.sock
image-endpoint: unix:///var/run/crio/crio.sock
timeout: 10
debug: false
```

### 🔹 Essential `crictl` Commands

```bash
# 1. Check runtime and networking status
sudo crictl info
sudo crictl status

# 2. List running Pod Sandboxes
sudo crictl pods

# 3. List all containers
sudo crictl ps -a

# 4. Pull container image
sudo crictl pull docker.io/library/nginx:alpine

# 5. View container logs
sudo crictl logs <container-id>

# 6. Stream live logs with follow
sudo crictl logs -f <container-id>

# 7. Execute command inside a running container
sudo crictl exec -it <container-id> sh

# 8. View live CPU and memory usage of containers
sudo crictl stats

# 9. Inspect a pod sandbox details
sudo crictl inspectp <pod-id>
```

---

## **4. Modern Security: Pod Security Standards (PSS/PSA)**

> [!IMPORTANT]
> **Kubernetes 1.25+ Removal**: Legacy Pod Security Policies (PSPs) have been permanently removed. CRI-O enforces container security boundaries according to Kubernetes **Pod Security Standards**:

* **Privileged**: Unrestricted capabilities for cluster system infrastructure.
* **Baseline**: Prevents known privilege escalations with default container configurations.
* **Restricted**: Hardened configuration dropping all root privileges, enforcing read-only root filesystems, and requiring seccomp profiles.

CRI-O applies default seccomp profiles located at `/etc/crio/seccomp.json` and supports SELinux labeling automatically.

---

## **5. Configuring Kubelet for CRI-O**

Configure `/var/lib/kubelet/kubeadm-flags.env` or `kubeadm-config.yaml`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
nodeRegistration:
  criSocket: unix:///var/run/crio/crio.sock
```

---

## **6. Troubleshooting CRI-O**

* **Inspect Service Logs**:
  ```bash
  journalctl -u crio --no-pager -n 100 -f
  ```
* **Verify Socket Availability**:
  ```bash
  ls -la /var/run/crio/crio.sock
  ```
* **Clean Unused Containers & Images**:
  ```bash
  sudo crictl rmi --prune
  ```

---

## 📚 **Learning Resources**

* 🔗 [Official CRI-O Documentation](https://cri-o.io/)
* 📦 [CRI-O GitHub Repository](https://github.com/cri-o/cri-o)
* 🛠️ [Kubernetes Container Runtime Interface (CRI)](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#cri-o)
