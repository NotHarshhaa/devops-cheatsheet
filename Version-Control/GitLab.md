# 🦊 GitLab Cheatsheet

![text](https://imgur.com/QJ7J3qs.png)

**GitLab** is a comprehensive, single-application DevSecOps platform providing source code management (Git), advanced CI/CD pipelines, container and package registries, security scanning, and Kubernetes integration.

---

## **1. Core Platform Architecture**

| Feature | Description |
| --- | --- |
| **GitLab CI/CD** | Industry-standard declarative pipeline engine configured via `.gitlab-ci.yml`. |
| **GitLab Runner** | Scalable agent (Docker, Kubernetes, Shell, VirtualBox) that executes pipeline jobs. |
| **GitLab Agent for Kubernetes (`agentk`)** | Secure, pull-based GitOps integration connecting Kubernetes clusters to GitLab. |
| **Container & Package Registry** | Built-in registry for Docker/OCI images, Maven, npm, PyPI, and Helm charts. |
| **Integrated DevSecOps** | Native SAST, DAST, Secret Detection, Container Scanning, and License Compliance. |

---

## **2. Account & SSH Key Setup**

### 🔹 Generate Modern Ed25519 SSH Key

Ed25519 is the modern cryptographic standard offering superior security and speed over legacy RSA:

```bash
# Generate Ed25519 SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Add your public key (`cat ~/.ssh/id_ed25519.pub`) to GitLab:
1. Navigate to **Preferences** → **SSH Keys** → **Add new key**.
2. Test connection:
   ```bash
   ssh -T git@gitlab.com
   ```

---

## **3. Modern GitLab CI/CD (`.gitlab-ci.yml`)**

### 🔹 Modern Pipeline: `rules`, DAG Pipelines (`needs`), and Caching

> [!IMPORTANT]
> **Modern Syntax Update**: The legacy `only` and `except` keywords are deprecated. Always use **`rules:`** to control job execution.

```yaml
stages:
  - build
  - test
  - deploy

default:
  image: node:20-alpine
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - .npm/

# Build Stage
build_job:
  stage: build
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run build
  artifacts:
    name: "build-artifacts-${CI_COMMIT_REF_SLUG}"
    paths:
      - dist/
    expire_in: 1 week

# Test Stage (Runs in parallel with DAG optimization)
unit_test:
  stage: test
  needs: ["build_job"]  # Starts immediately after build_job completes without waiting for other build stage jobs
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run test:unit
  coverage: '/All files[^|]*\|[^|]*\s+(\d+(?:\.\d+)?)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

lint_check:
  stage: test
  needs: []  # Starts immediately at pipeline start (DAG)
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run lint

# Deploy to Production (Only on default branch with manual trigger)
deploy_prod:
  stage: deploy
  needs: ["unit_test", "lint_check"]
  script:
    - ./scripts/deploy.sh production
  environment:
    name: production
    url: https://app.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: manual
```

---

## **4. `cache` vs `artifacts`**

| Feature | `cache` | `artifacts` |
| --- | --- | --- |
| **Purpose** | Speeds up execution by reusing dependencies across builds (e.g. `node_modules`, `.pip-cache`). | Passes verified build outputs or test reports between pipeline stages. |
| **Guaranteed?** | No (can be purged or missing on new runners). | Yes (downloaded and extracted before subsequent stage jobs). |
| **Transfer** | Stored in S3 or local runner cache directory. | Uploaded to GitLab server and downloadable from UI. |

---

## **5. Built-in Container Registry Operations**

GitLab CI automatically provides pre-configured credentials for the project container registry:

```yaml
build_and_push_docker:
  stage: build
  image: docker:25.0
  services:
    - docker:25.0-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - echo "$CI_REGISTRY_PASSWORD" | docker login $CI_REGISTRY -u $CI_REGISTRY_USER --password-stdin
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA -t $CI_REGISTRY_IMAGE:latest .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

---

## **6. Dynamic Review Apps (Ephemeral Environments)**

Automatically deploy a staging environment for each active Merge Request:

```yaml
deploy_review:
  stage: deploy
  script:
    - ./scripts/deploy-review.sh $CI_ENVIRONMENT_SLUG
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    url: https://$CI_ENVIRONMENT_SLUG.review.example.com
    on_stop: stop_review
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

stop_review:
  stage: deploy
  script:
    - ./scripts/teardown-review.sh $CI_ENVIRONMENT_SLUG
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    action: stop
  when: manual
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

---

## **7. GitLab DevSecOps Security Templates**

Enable comprehensive security scans by adding GitLab's official CI templates:

```yaml
include:
  # Static Application Security Testing
  - template: Security/SAST.gitlab-ci.yml
  # Secret Detection
  - template: Security/Secret-Detection.gitlab-ci.yml
  # Container Scanning
  - template: Security/Container-Scanning.gitlab-ci.yml
  # Dependency Scanning
  - template: Security/Dependency-Scanning.gitlab-ci.yml
```

---

## **8. Modern Kubernetes Integration: GitLab Agent (`agentk`)**

GitLab uses a pull-based Kubernetes Agent (`agentk`) installed via Helm inside your cluster:

```bash
# Install GitLab Kubernetes Agent via Helm
helm repo add gitlab https://charts.gitlab.io
helm repo update
helm upgrade --install k8s-agent gitlab/gitlab-agent \
  --namespace gitlab-agent \
  --create-namespace \
  --set image.tag="v16.9.0" \
  --set config.token="<AGENT_TOKEN>" \
  --set config.kasAddress="wss://kas.gitlab.com"
```

Configure GitOps synchronization in `.gitlab/agents/<agent-name>/config.yaml`:

```yaml
gitops:
  manifest_projects:
    - id: "my-group/my-k8s-manifests"
      paths:
        - glob: "manifests/**/*.yaml"
```

---

## **9. GitLab CLI (`glab`) Everyday Workflows**

```bash
# Authenticate with GitLab instance
glab auth login

# Clone project
glab repo clone group/project

# Create a Merge Request with title and description
glab mr create --fill --remove-source-branch

# Checkout a team member's Merge Request locally
glab mr checkout 42

# View Merge Request approval status
glab mr view 42

# Watch the pipeline for the current branch
glab ci view

# Stream live terminal output of a running job
glab ci trace <job-id>
```

---

## **10. Production Best Practices**

1. **Protect Main Branches**: Require Merge Request approvals, enforce code owner reviews via `CODEOWNERS`, and enable "Pipelines must succeed".
2. **Mask and Protect CI Variables**: Mark sensitive API tokens and credentials as **Masked** and **Protected** in **Settings** → **CI/CD** → **Variables**.
3. **Use DAG (`needs:`) for Faster Pipelines**: Eliminate stage bottlenecks by allowing independent tests to execute as soon as their required build artifacts are ready.
4. **Use Pre-commit / Secret Detection**: Prevent secret leaks before commits reach the remote server.

---

## 📚 **Learning Resources**

* 🔗 [Official GitLab Documentation](https://docs.gitlab.com/)
* 📜 [GitLab CI/CD Keyword Reference](https://docs.gitlab.com/ee/ci/yaml/)
* 📦 [GitLab Agent for Kubernetes](https://docs.gitlab.com/ee/user/clusters/agent/)
* 💻 [GitLab CLI (`glab`) Repository](https://gitlab.com/gitlab-org/cli)
