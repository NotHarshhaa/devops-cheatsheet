# 🐳 Docker Cheatsheet

![text](https://imgur.com/XHwJp6U.png)

## Checkout detailed article on [Dev.to](https://dev.to/prodevopsguytech/docker-commands-from-beginner-to-advanced-for-devops-engineers-bb3)

**Docker** is the premier platform for developing, shipping, and running containerized applications. It enables developers to package an application with all of its dependencies into an immutable, portable container image.

---

## **1. Installation Quickstart (APT Keyrings)**

```bash
# Add Docker's official GPG key
sudo apt-get update && sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add repository to Apt sources
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine, Buildx, and Compose plugin
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

---

## **2. Core Container Operations**

```bash
# Run a container in detached mode with port mapping and auto-restart
docker run -d \
  --name webapp \
  -p 8080:80 \
  --restart unless-stopped \
  --memory="512m" \
  --cpus="1.5" \
  nginx:alpine

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Execute interactive shell inside running container
docker exec -it webapp sh

# View container resource utilization in real time
docker stats webapp

# Stream logs with timestamps
docker logs -f --tail 100 -t webapp

# Stop and remove containers
docker stop webapp
docker rm webapp
```

---

## **3. Production Multi-Stage Dockerfile**

Multi-stage builds separate compile-time dependencies from the minimal production runtime container:

```dockerfile
# Stage 1: Build Environment
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal Production Image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Run as non-root user
USER node
COPY --chown=node:node package*.json ./
RUN npm ci --only=production
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

## **4. Multi-Architecture Builds with Docker Buildx**

Build images for multiple CPU architectures (e.g. AMD64 and ARM64/Apple Silicon) simultaneously:

```bash
# Create and use a new Buildx builder
docker buildx create --name mybuilder --use
docker buildx inspect --bootstrap

# Build and push multi-platform images directly to registry
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t myorg/myapp:v1.0.0 \
  --push .
```

---

## **5. Docker Compose v2 Quick Reference**

> [!TIP]
> Modern Docker Compose is integrated as a Docker CLI plugin (`docker compose`), replacing the legacy Python script (`docker-compose`).

Example `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html:ro
    depends_on:
      - api
    restart: always

  api:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - PORT=3000
      - DB_HOST=db
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: appdb
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:

secrets:
  db_password:
    file: ./db_password.txt
```

CLI commands:

```bash
# Start all services in the background
docker compose up -d

# View consolidated logs
docker compose logs -f

# Rebuild containers after code changes
docker compose up -d --build

# Stop and remove all containers, networks, and volumes
docker compose down -v
```

---

## **6. Networks & Volumes**

### 🔹 Custom Networks

```bash
# Create an isolated bridge network
docker network create my-network

# Connect a running container to a network
docker network connect my-network webapp
```

### 🔹 Named Volumes

```bash
# Create volume
docker volume create app-data

# Inspect volume host mount point
docker volume inspect app-data

# Prune all unused volumes
docker volume prune -f
```

---

## **7. Security & Vulnerability Scanning (Docker Scout)**

```bash
# Scan a local image for CVE vulnerabilities
docker scout cves nginx:latest

# Compare image vulnerabilities with a baseline image
docker scout compare --to nginx:1.24 nginx:latest

# Recommend base image updates
docker scout recommendations nginx:latest
```

---

## **8. System Maintenance & Cleanup**

```bash
# Clean all stopped containers, unused networks, and dangling images
docker system prune -f

# Clean absolutely everything (including unused volumes and all unused images)
docker system prune -a --volumes -f

# Inspect disk consumption
docker system df
```

---

## 📚 **Learning Resources**

* 🔗 [Official Docker Documentation](https://docs.docker.com/)
* 📦 [Docker Hub](https://hub.docker.com/)
* 🛡️ [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
