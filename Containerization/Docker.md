# Docker Cheatsheet

![text](https://imgur.com/XHwJp6U.png)

### Checkout detailed article on [Dev.to](https://dev.to/prodevopsguytech/docker-commands-from-beginner-to-advanced-for-devops-engineers-bb3)

**1. Introduction:**

- **Docker** is a platform that automates the deployment of applications inside lightweight, portable containers. It allows developers to package an application with all its dependencies into a standardized unit for software development.

**2. Key Concepts:**

- **Container:** An isolated environment where applications run. Containers are lightweight and share the host OS kernel.
- **Image:** A read-only template with instructions for creating a Docker container.
- **Dockerfile:** A script containing a list of commands to create a Docker image.
- **Docker Hub:** A cloud-based repository where you can find and store Docker images.
- **Registry:** A storage and content delivery system, holding named Docker images, available in different tagged versions.

**3. Basic Docker Commands:**

- **Run a Container:**

  ```bash
  docker run -d -p 8080:80 nginx
  ```

  - `-d`: Run container in the background.
  - `-p 8080:80`: Map port 8080 on the host to port 80 in the container.
  
- **List Containers:**

  ```bash
  docker ps
  ```

  - `-a`: List all containers, including stopped ones.
  
- **Stop a Container:**

  ```bash
  docker stop container_id
  ```
  
- **Remove a Container:**

  ```bash
  docker rm container_id
  ```
  
- **Build an Image:**

  ```bash
  docker build -t my-image:latest .
  ```

  - `-t my-image:latest`: Tag the image with a name and version.
  
- **Pull an Image from Docker Hub:**

  ```bash
  docker pull ubuntu:latest
  ```

- **Push an Image to Docker Hub:**

  ```bash
  docker push mydockerhubusername/my-image:latest
  ```

**4. Dockerfile Essentials:**

- **Basic Dockerfile Structure:**

  ```Dockerfile
  FROM ubuntu:20.04
  RUN apt-get update && apt-get install -y nginx
  COPY . /var/www/html
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  ```

  - **FROM:** Sets the base image.
  - **RUN:** Executes commands in the image.
  - **COPY:** Copies files from the host to the container.
  - **EXPOSE:** Specifies the port on which the container listens.
  - **CMD:** Provides the default command for the container.

**5. Networking:**

- **Bridge Network (Default):** Connect containers on the same host.

  ```bash
  docker network create my-bridge-network
  docker run -d --name my-container --network my-bridge-network nginx
  ```
  
- **Host Network:** The container uses the host's networking.

  ```bash
  docker run --rm -d --network host nginx
  ```
  
- **Overlay Network:** For multi-host networking in Docker Swarm or Kubernetes.

  ```bash
  docker network create -d overlay my-overlay-network
  ```

**6. Volumes:**

- **Creating a Volume:**

  ```bash
  docker volume create my-volume
  ```
  
- **Mounting a Volume:**

  ```bash
  docker run -d --name my-container -v my-volume:/data busybox
  ```
  
- **Bind Mounts:**

  ```bash
  docker run -d --name my-container -v /host/data:/container/data busybox
  ```

**7. Docker Compose:**

- **Basic `docker-compose.yml` Example:**

  ```yaml
  version: '3'
  services:
    web:
      image: nginx
      ports:
        - "8080:80"
    db:
      image: mysql
      environment:
        MYSQL_ROOT_PASSWORD: example
  ```

- **Commands:**
  - Start services: `docker-compose up -d`
  - Stop services: `docker-compose down`
  - View logs: `docker-compose logs`

**8. Advanced Docker Topics:**

- **Multi-Stage Builds:** Optimize image size by separating the build environment from the runtime environment.

  ```Dockerfile
  FROM golang:1.16 AS builder
  WORKDIR /app
  COPY . .
  RUN go build -o myapp

  FROM alpine:3.13
  COPY --from=builder /app/myapp /usr/local/bin/
  CMD ["myapp"]
  ```
  
- **Docker Secrets:** Manage sensitive data securely.

  ```bash
  echo "my_secret_password" | docker secret create my_secret -
  ```
  
- **Docker Swarm Mode:** Enable clustering of Docker engines.

  ```bash
  docker swarm init
  ```

**9. Security Best Practices:**

- **Use Official Images:** Prefer official images from Docker Hub to ensure security.
- **Minimize Image Layers:** Combine commands in Dockerfile to reduce the number of layers.
- **Run as Non-Root User:** Avoid running containers as the root user.

  ```Dockerfile
  USER nobody
  ```

**10. Troubleshooting:**

- **Inspecting a Container:**

  ```bash
  docker inspect container_id
  ```
  
- **Accessing Container Logs:**

  ```bash
  docker logs container_id
  ```
  
- **Entering a Running Container:**

  ```bash
  docker exec -it container_id /bin/bash
  ```
