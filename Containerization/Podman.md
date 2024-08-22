# Podman Cheatsheet

![text](https://imgur.com/6x1bZIJ.png)

**1. Introduction:**

- **Podman** is an open-source container engine that performs much like Docker but without the daemon dependency. It supports the Open Container Initiative (OCI) standards for both containers and container images.

**2. Key Concepts:**

- **Pod:** A group of containers that run together and share resources, similar to a Kubernetes Pod.
- **Rootless Containers:** Podman can run containers as a non-root user.
- **Docker Compatibility:** Podman commands are similar to Docker, making it easy to switch between the two.

**3. Installation:**

- **On Fedora:**

  ```bash
  sudo dnf install podman
  ```
  
- **On Ubuntu:**

  ```bash
  sudo apt-get -y install podman
  ```

**4. Basic Podman Commands:**

- **Run a Container:**

  ```bash
  podman run -dt -p 8080:80 nginx
  ```
  
- **List Running Containers:**

  ```bash
  podman ps
  ```
  
- **Stop a Container:**

  ```bash
  podman stop container_id
  ```
  
- **Remove a Container:**

  ```bash
  podman rm container_id
  ```

- **Build an Image:**

  ```bash
  podman build -t my-image:latest .
  ```

**5. Podman vs Docker:**

- **No Daemon:** Podman does not rely on a central daemon; each container is an isolated process.
- **Rootless Mode:** Allows running containers without root privileges, enhancing security.
- **Podman Pods:** Group containers under a single network namespace.

**6. Pods in Podman:**

- **Create a Pod:**

  ```bash
  podman pod create --name mypod -p 8080:80
  ```
  
- **Run a Container in a Pod:**

  ```bash
  podman run -dt --pod mypod nginx
  ```

- **Inspect a Pod:**

  ```bash
  podman pod inspect mypod
  ```

- **Stop a Pod:**

  ```bash
  podman pod stop mypod
  ```

**7. Networking:**

- **Podman Network Command:**

  ```bash
  podman network create mynetwork
  ```

- **Attaching a Container to a Network:**

  ```bash
  podman run -dt --network mynetwork nginx
  ```

**8. Storage Management:**

- **Mount a Volume:**

  ```bash
  podman run -dt -v /host/data:/container/data nginx
  ```

- **List Volumes:**

  ```bash
  podman volume ls
  ```

- **Create a Volume:**

  ```bash
  podman volume create myvolume
  ```

**9. Rootless Containers:**

- **Running Rootless:**

  ```bash
  podman --rootless run -dt -p 8080:80 nginx
  ```

- **Inspect Rootless Mode:**

  ```bash
  podman info --format '{{.Host.Rootless}}'
  ```

**10. Podman Compose:**

- **Install Podman Compose:**

  ```bash
  pip3 install podman-compose
  ```

- **Using Docker Compose with Podman:**

  ```bash
  podman-compose up
  ```

**11. Troubleshooting Podman:**

- **Check Podman Logs:**

  ```bash
  podman logs container_id
  ```

- **Check Network Configuration:**

  ```bash
  podman network inspect mynetwork
  ```

- **Debugging Podman Containers:**

  ```bash
  podman exec -it container_id /bin/bash
  ```

**12. Podman in CI/CD:**

- **Using Podman in GitLab CI:**

  ```yaml
  image: quay.io/podman/stable

  build:
    script:
      - podman build -t myimage .
      - podman push myimage registry.example.com/myimage:latest
  ```

**13. Security Best Practices:**

- **Run Containers as Non-Root:**
  - Use rootless mode or specify a non-root user in the container.

  ```bash
  podman run -dt -u 1001 nginx
  ```

- **Use SELinux:**
  - Enable SELinux for added security on supported systems.

  ```bash
  podman run -dt --security-opt label=type:container_runtime_t nginx
  ```

**14. Migrating from Docker to Podman:**

- **Docker Compatibility Mode:**

  ```bash
  alias docker=podman
  ```

- **Importing Docker Images:**

  ```bash
  podman pull docker-daemon:nginx:latest
  ```

**15. Podman on Kubernetes:**

- **CRI-O Integration:**
  - Podman can be used with CRI-O as a runtime for Kubernetes, allowing seamless integration with Kubernetes clusters.
