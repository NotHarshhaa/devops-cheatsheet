# Docker Cheatsheet

![text](https://imgur.com/XHwJp6U.png)

## Checkout detailed article on [Dev.to](https://dev.to/prodevopsguytech/docker-commands-from-beginner-to-advanced-for-devops-engineers-bb3)

## 1. Introduction to Docker

### What is Docker?

- **Docker** is an open-source platform that automates the deployment, scaling, and management of applications by using containerization technology. Containers are lightweight, portable, and consistent environments that contain everything needed to run a piece of software, including the code, runtime, system tools, libraries, and settings.

### Key Concepts

- **Docker Engine**: The core component of Docker, responsible for running containers.
- **Image**: A lightweight, standalone, and executable software package that includes everything needed to run an application.
- **Container**: A runtime instance of a Docker image that shares the host system's kernel.
- **Dockerfile**: A script containing a series of commands to assemble a Docker image.
- **Registry**: A storage and distribution system for Docker images, such as Docker Hub.
- **Docker Compose**: A tool for defining and running multi-container Docker applications using a YAML file.

---

## 2. Installing Docker

### Install Docker on Linux

- **Install Docker Engine**:

  ```bash
  sudo apt-get update
  sudo apt-get install docker-ce docker-ce-cli containerd.io
  ```

- **Start Docker Service**:

  ```bash
  sudo systemctl start docker
  sudo systemctl enable docker
  ```

### Install Docker on macOS

- **Install Docker Desktop**:
  - Download and install Docker Desktop from [Docker's official website](https://www.docker.com/products/docker-desktop).

### Install Docker on Windows

- **Install Docker Desktop**:
  - Download and install Docker Desktop from [Docker's official website](https://www.docker.com/products/docker-desktop).

---

## 3. Basic Docker Operations

### Working with Docker Images

- **Search for an Image**:

  ```bash
  docker search nginx
  ```

- **Pull an Image from Docker Hub**:

  ```bash
  docker pull nginx
  ```

- **List All Images**:

  ```bash
  docker images
  ```

- **Remove an Image**:

  ```bash
  docker rmi nginx
  ```

### Working with Docker Containers

- **Run a Container**:

  ```bash
  docker run -d -p 80:80 --name mynginx nginx
  ```

- **List Running Containers**:

  ```bash
  docker ps
  ```

- **List All Containers (including stopped)**:

  ```bash
  docker ps -a
  ```

- **Stop a Running Container**:

  ```bash
  docker stop mynginx
  ```

- **Remove a Container**:

  ```bash
  docker rm mynginx
  ```

### Docker Networks

- **List All Networks**:

  ```bash
  docker network ls
  ```

- **Create a New Network**:

  ```bash
  docker network create mynetwork
  ```

- **Connect a Container to a Network**:

  ```bash
  docker network connect mynetwork mynginx
  ```

- **Disconnect a Container from a Network**:

  ```bash
  docker network disconnect mynetwork mynginx
  ```

---

## 4. Building Docker Images

### Dockerfile Basics

- **Sample Dockerfile**:

  ```Dockerfile
  # Use an official Node.js runtime as a parent image
  FROM node:14

  # Set the working directory in the container
  WORKDIR /app

  # Copy the current directory contents into the container at /app
  COPY . /app

  # Install any needed packages specified in package.json
  RUN npm install

  # Make port 8080 available to the world outside this container
  EXPOSE 8080

  # Define environment variable
  ENV NODE_ENV production

  # Run app.js using node
  CMD ["node", "app.js"]
  ```

### Building an Image from a Dockerfile

- **Build the Image**:

  ```bash
  docker build -t mynodeapp .
  ```

### Managing Image Tags

- **Tag an Image**:

  ```bash
  docker tag mynodeapp myrepo/mynodeapp:v1.0
  ```

- **Push an Image to Docker Hub**:

  ```bash
  docker push myrepo/mynodeapp:v1.0
  ```

---

## 5. Docker Compose

### Introduction to Docker Compose

- **Docker Compose** is a tool for defining and running multi-container Docker applications. You use a YAML file to configure your application's services, and then use a single command to create and start all the services.

### Sample `docker-compose.yml` File

```yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "8080:80"
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: example
```

### Docker Compose Commands

- **Start Services**:

  ```bash
  docker-compose up
  ```

- **Stop Services**:

  ```bash
  docker-compose down
  ```

- **Scale Services**:

  ```bash
  docker-compose up --scale web=3
  ```

### Managing Volumes with Docker Compose

- **Defining Volumes**:

  ```yaml
  services:
    web:
      image: nginx
      volumes:
        - ./webdata:/usr/share/nginx/html
  ```

---

## 6. Docker Volumes and Storage

### Understanding Docker Volumes

- **Volumes** are the preferred mechanism for persisting data generated and used by Docker containers.

### Managing Volumes

- **Create a Volume**:

  ```bash
  docker volume create myvolume
  ```

- **List All Volumes**:

  ```bash
  docker volume ls
  ```

- **Inspect a Volume**:

  ```bash
  docker volume inspect myvolume
  ```

- **Remove a Volume**:

  ```bash
  docker volume rm myvolume
  ```

### Mounting Volumes

- **Mount a Volume to a Container**:

  ```bash
  docker run -d -p 80:80 --name mynginx -v myvolume:/usr/share/nginx/html nginx
  ```

### Bind Mounts

- **Use a Bind Mount**:

  ```bash
  docker run -d -p 80:80 --name mynginx -v /path/to/local/dir:/usr/share/nginx/html nginx
  ```

---

## 7. Docker Networking

### Networking Modes

- **Bridge Network**: The default network driver, which allows containers to communicate on the same host.
- **Host Network**: Removes network isolation between the container and the Docker host.
- **Overlay Network**: Enables networking between multiple Docker hosts in a swarm.

### Working with Networks

- **Create a User-Defined Bridge Network**:

  ```bash
  docker network create mynetwork
  ```

- **Run a Container in a Network**:

  ```bash
  docker run -d --name mynginx --network=mynetwork nginx
  ```

- **Inspect a Network**:

  ```bash
  docker network inspect mynetwork
  ```

### DNS in Docker

- Docker containers can resolve each other's hostnames to IP addresses by using the embedded DNS server.

---

## 8. Docker Security

### Securing Docker

- **Least Privileged User**: Always run containers as a non-root user.

  ```Dockerfile
  FROM nginx
  USER www-data
  ```

- **Use Trusted Images**: Use official images or images from trusted sources.
- **Keep Docker Updated**: Regularly update Docker to the latest version to benefit from security patches.

### Docker Content Trust

- **Enable Docker Content Trust (DCT)**:

  ```bash
  export DOCKER_CONTENT_TRUST=1
  ```

### Managing Secrets

- **Create a Secret in Docker Swarm**:

  ```bash
  echo "mysecretpassword" | docker secret create my_secret -
  ```

- **Use a Secret in a Service**:

  ```bash
  docker service create --name myservice --secret my_secret nginx
  ```

### Securing Docker Daemon

- **Use TLS to Secure Docker API**:
  - Generate TLS certificates and configure the Docker daemon to use them for secure communication.

### Limiting Container Resources

- **Limit Memory**:

  ```bash
  docker run -d --name mynginx --memory="256m" nginx
  ```

- **Limit CPU**:

  ```bash
  docker run -d --name mynginx --cpus="1.0" nginx
  ```

---

## 9. Advanced Docker Features

### Docker Swarm

- **Initialize a Swarm**:

  ```bash
  docker swarm init
  ```

- **Join a Swarm**:

  ```bash
  docker swarm join --token SWMTKN-1-xxxx
  ```

- **Deploy a Stack**:

  ```bash
  docker stack deploy -c docker-compose.yml mystack
  ```

### Multi-Stage Builds

- **Example of a Multi-Stage Dockerfile**:

  ```Dockerfile
  # First Stage
  FROM golang:1.16 as builder
  WORKDIR /app
  COPY . .
  RUN go build -o myapp

  # Second Stage
  FROM alpine:latest
  WORKDIR /app
  COPY --from=builder /app/myapp .
  CMD ["./myapp"]
  ```

### Docker Plugins

- **List Installed Plugins**:

  ```bash
  docker plugin ls
  ```

- **Install a Plugin

**:

  ```bash
  docker plugin install vieux/sshfs
  ```

### Docker Daemon Configuration

- **Customizing Docker Daemon**:
  - Edit the `/etc/docker/daemon.json` file to configure the Docker daemon.

  ```json
  {
    "log-driver": "json-file",
    "log-level": "warn",
    "storage-driver": "overlay2"
  }
  ```

- **Reload Daemon Configuration**:

  ```bash
  sudo systemctl reload docker
  ```

---

## 10. Monitoring and Logging

### Docker Logs

- **View Container Logs**:

  ```bash
  docker logs mynginx
  ```

- **Follow Logs**:

  ```bash
  docker logs -f mynginx
  ```

### Monitoring Containers

- **Inspect Resource Usage**:

  ```bash
  docker stats mynginx
  ```

- **Docker Events**:
  - Monitor Docker events in real-time.

  ```bash
  docker events
  ```

### Integrating with Monitoring Tools

- **Prometheus and Grafana**: Use cAdvisor and Prometheus Node Exporter to monitor Docker containers.

  ```bash
  docker run -d --name=cadvisor --volume=/:/rootfs:ro --volume=/var/run:/var/run:ro --volume=/sys:/sys:ro --volume=/var/lib/docker/:/var/lib/docker:ro --volume=/dev/disk/:/dev/disk:ro --publish=8080:8080 google/cadvisor:latest
  ```

---

## 11. Docker Best Practices

### Dockerfile Best Practices

- **Minimize Image Size**: Use multi-stage builds and slim base images.
- **Leverage Build Cache**: Organize Dockerfile instructions to maximize the use of cache layers.
- **Use `.dockerignore`**: Exclude unnecessary files from the build context using a `.dockerignore` file.

### Container Management Best Practices

- **Immutable Infrastructure**: Treat containers as immutable, replace rather than modify running containers.
- **Keep Containers Stateless**: Design containers to be stateless, with external data persistence.
- **Log to STDOUT/STDERR**: Ensure containers log to STDOUT/STDERR for easier aggregation and analysis.

### Security Best Practices

- **Regularly Scan Images**: Use tools like `trivy` to scan images for vulnerabilities.
- **Use Namespaces**: Use namespaces to isolate container resources and enhance security.
- **Limit Capabilities**: Drop unnecessary capabilities from containers.

  ```bash
  docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx
  ```

---

## 12. Troubleshooting Docker

### Common Issues

- **Container Exits Immediately**:
  - Check the Docker logs for errors.

  ```bash
  docker logs <container_id>
  ```

- **Image Build Fails**:
  - Debug using the `--no-cache` option to rebuild the image without cache.

  ```bash
  docker build --no-cache -t myimage .
  ```

- **Networking Issues**:
  - Verify network settings and connectivity.

  ```bash
  docker network inspect <network_name>
  ```

### Useful Docker Commands for Troubleshooting

- **Inspect a Container**:

  ```bash
  docker inspect <container_id>
  ```

- **Enter a Running Container**:

  ```bash
  docker exec -it <container_id> /bin/bash
  ```

- **Check Resource Usage**:

  ```bash
  docker stats
  ```

---

## 13. References

### Official Documentation

- [Docker Documentation](https://docs.docker.com/)

### Community Resources

- [Docker Hub](https://hub.docker.com/)
- [Docker GitHub Repository](https://github.com/docker/docker-ce)
- [Docker Forums](https://forums.docker.com/)
