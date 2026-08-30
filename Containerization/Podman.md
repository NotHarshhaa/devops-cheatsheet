# 🦭 Podman Cheatsheet

![text](https://imgur.com/6x1bZIJ.png)

**Podman** (Pod Manager) is a daemonless, open-source Linux tool designed for developing, managing, and running OCI containers and pods. Because it operates without a background root daemon, Podman is the premier engine for secure, **rootless** container workloads.

---

## **1. Core Architecture & Key Concepts**

| Concept | Description |
| --- | --- |
| **Daemonless Architecture** | Podman commands execute directly as child processes of the user shell using the fork-exec model. |
| **Rootless by Default** | Runs containers entirely without root privileges using Linux user namespaces (`subuid` / `subgid`). |
| **Podman Pods** | Groups of containers sharing IPC, network, and PID namespaces (identical to Kubernetes Pods). |
| **Quadlet** | Declarative systemd unit file generator (`.container`, `.pod`) for running production containers under systemd. |

---

## **2. Installation Quickstart**

```bash
# Fedora / RHEL 8/9
sudo dnf install -y podman

# Ubuntu / Debian
sudo apt-get update && sudo apt-get install -y podman

# Verify version and rootless mode
podman info
```

---

## **3. Basic Container Operations**

Podman CLI syntax is directly compatible with Docker:

```bash
# Run a rootless container with port forwarding
podman run -d --name web -p 8080:80 nginx:alpine

# List active containers
podman ps

# Execute an interactive shell
podman exec -it web sh

# Inspect container IP and configuration
podman inspect web

# View container logs
podman logs -f web

# Stop and remove container
podman stop web
podman rm web
```

---

## **4. Podman Pods (Multi-Container Grouping)**

Pods allow multiple containers to share the same localhost network:

```bash
# 1. Create a Pod with published ports
podman pod create --name web-pod -p 8080:80

# 2. Add an Nginx container to the pod
podman run -d --pod web-pod --name web-frontend nginx:alpine

# 3. Add an API container to the same pod (can talk to frontend via localhost)
podman run -d --pod web-pod --name api-backend my-api:latest

# 4. List all pods and their running container counts
podman pod ps

# 5. Stop and delete the entire pod
podman pod stop web-pod
podman pod rm web-pod
```

---

## **5. Kubernetes YAML Integration: `generate kube` & `play kube`**

Podman can run and export standard Kubernetes manifests directly without needing a Kubernetes cluster:

```bash
# Generate a Kubernetes Pod YAML from an existing running Podman pod
podman generate kube web-pod > pod.yaml

# Run an existing Kubernetes Pod manifest directly on your local machine
podman play kube pod.yaml

# Tear down the containers created from the Kubernetes manifest
podman play kube --down pod.yaml
```

---

## **6. Modern systemd Integration: Quadlet (Podman 4.4 - 5.x)**

> [!TIP]
> **Modern Standard**: Quadlet replaces legacy `podman generate systemd`. Create simple `.container` unit files and let systemd manage the container lifecycle.

File: `~/.config/containers/systemd/webapp.container`:

```ini
[Unit]
Description=Production Web Service
After=network-online.target

[Container]
Image=docker.io/library/nginx:alpine
PublishPort=8080:80
AutoUpdate=registry

[Install]
WantedBy=default.target
```

Manage via systemd:

```bash
# Reload user systemd daemon
systemctl --user daemon-reload

# Start and enable the service
systemctl --user enable --now webapp.service

# Check service status
systemctl --user status webapp.service
```

---

## **7. Modern Rootless Networking (Pasta & Netavark)**

Podman 5.x defaults to **`pasta`** for user-mode networking and **`Netavark`** as the network stack:

* **High Performance**: Delivers significantly higher network throughput and lower CPU overhead than legacy `slirp4netns`.
* **Port Forwarding**: Preserves original client IP addresses on inbound packets.

---

## **8. Docker Compatibility Alias**

Podman provides a drop-in wrapper package or shell alias:

```bash
# Install docker alias package (RHEL/Fedora)
sudo dnf install podman-docker

# Or add to ~/.bashrc
alias docker=podman
```

---

## 📚 **Learning Resources**

* 🔗 [Official Podman Documentation](https://podman.io/)
* 📦 [Podman GitHub Repository](https://github.com/containers/podman)
* ⚙️ [Quadlet Documentation](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)
