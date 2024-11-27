# GitLab Cheatsheet

![text](https://imgur.com/QJ7J3qs.png)

**GitLab** is a web-based DevOps platform that provides a robust set of tools for source code management, CI/CD, project management, and deployment automation. This cheatsheet covers everything from basic usage to advanced GitLab features.

---

## 1. **Introduction to GitLab**

### What is GitLab?

GitLab is an open-source DevOps platform offering integrated tools for:

- Source control (Git)
- Continuous Integration/Continuous Deployment (CI/CD)
- Issue tracking and project management
- Container registry and DevSecOps

### Key Features

- **Git Repository Management**: Handles distributed version control and code review.
- **CI/CD Pipelines**: Automates testing, integration, and deployment.
- **DevSecOps**: Built-in security scanning for dependencies, container images, and code.
- **Container Registry**: Docker container management.

---

## 2. **Basic GitLab Setup**

### Signing Up and Creating a Project

1. **Sign up**: Visit [GitLab](https://gitlab.com/) and create an account.
2. **Create a Project**:
   - Go to **Projects** → **New Project**.
   - Choose **Blank Project**, **Import**, or **Template**.
   - Configure visibility (Private, Internal, or Public).

### Adding SSH Keys

1. Generate an SSH key:

   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```

2. Copy the public key:

   ```bash
   cat ~/.ssh/id_rsa.pub
   ```

3. Add the key in GitLab:
   - Go to **User Settings** → **SSH Keys** → Paste the public key.

---

## 3. **GitLab Basics**

### Cloning a Repository

```bash
git clone git@gitlab.com:username/projectname.git
```

### Committing Changes

```bash
# Stage files
git add .
# Commit files
git commit -m "Initial commit"
# Push changes
git push origin main
```

### Branching

- Create a branch:

  ```bash
  git checkout -b feature-branch
  ```

- Push the branch:

  ```bash
  git push origin feature-branch
  ```

### Merge Requests (MRs)

1. Go to your project on GitLab.
2. Navigate to **Merge Requests** → **New Merge Request**.
3. Select source and target branches and create an MR.

---

## 4. **Working with GitLab CI/CD**

### Basics of `.gitlab-ci.yml`

The `.gitlab-ci.yml` file defines the CI/CD pipeline.

#### Example File:

```yaml
stages:
  - build
  - test
  - deploy

build_job:
  stage: build
  script:
    - echo "Building the project"
    - ./build-script.sh

test_job:
  stage: test
  script:
    - echo "Running tests"
    - ./test-script.sh

deploy_job:
  stage: deploy
  script:
    - echo "Deploying to production"
    - ./deploy-script.sh
```

### Pipeline Lifecycle

1. **Stages**: Define steps (e.g., `build`, `test`, `deploy`).
2. **Jobs**: Define tasks in each stage.
3. **Runners**: Execute pipeline jobs (shared or custom).

### Running a Pipeline

- Push changes to a branch:

  ```bash
  git push origin branch-name
  ```

- Check pipelines:
  - Navigate to **CI/CD** → **Pipelines** in GitLab.

---

## 5. **Intermediate GitLab Features**

### GitLab Runners

- Runners execute CI/CD jobs.
- **Shared Runners**: Provided by GitLab.
- **Custom Runners**: Self-hosted.

#### Register a Custom Runner:

1. Install GitLab Runner:

   ```bash
   sudo apt install gitlab-runner
   ```

2. Register the Runner:

   ```bash
   gitlab-runner register
   ```

   - Enter GitLab URL, registration token, executor (e.g., `shell`, `docker`), and tags.

### Managing Variables

- **Set Environment Variables**:
  1. Go to **Settings** → **CI/CD** → **Variables**.
  2. Add variables (e.g., `AWS_ACCESS_KEY`, `DOCKER_PASSWORD`).
  
- Use in `.gitlab-ci.yml`:

  ```yaml
  script:
    - echo $MY_VARIABLE
  ```

### Artifacts

Artifacts store job outputs.

```yaml
test_job:
  stage: test
  script:
    - ./run-tests
  artifacts:
    paths:
      - test-results/
```

---

## 6. **Advanced GitLab Features**

### GitLab Pages

Host static websites directly on GitLab.

#### Example `.gitlab-ci.yml` for Pages:

```yaml
pages:
  stage: deploy
  script:
    - mkdir .public
    - cp -r * .public
  artifacts:
    paths:
      - public
```

### Container Registry

- GitLab provides a built-in Docker registry for container storage.
- **Push an Image**:

  ```bash
  docker build -t registry.gitlab.com/username/projectname:tag .
  docker login registry.gitlab.com
  docker push registry.gitlab.com/username/projectname:tag
  ```

### GitLab Kubernetes Integration

- Integrate Kubernetes clusters with GitLab for deployments.
- Navigate to **Operations** → **Kubernetes** to connect your cluster.

#### Deploy Using Helm:

```yaml
deploy:
  stage: deploy
  script:
    - helm install my-app ./helm-chart
```

---

## 7. **Security in GitLab**

### SAST (Static Application Security Testing)

- Enable SAST to scan for vulnerabilities:

  ```yaml
  include:
    - template: Security/SAST.gitlab-ci.yml
  ```

### DAST (Dynamic Application Security Testing)

- Perform runtime vulnerability scans:

  ```yaml
  include:
    - template: Security/DAST.gitlab-ci.yml
  ```

### Secret Detection

- Detect hardcoded secrets:

  ```yaml
  include:
    - template: Security/Secret-Detection.gitlab-ci.yml
  ```

---

## 8. **GitLab Monitoring and Analytics**

### Pipeline Analytics

- Navigate to **Analytics** → **CI/CD** → **Pipelines** to review pipeline efficiency.

### Code Coverage

- Enable coverage reports in `.gitlab-ci.yml`:

  ```yaml
  test_job:
    stage: test
    script:
      - ./run-tests
    coverage: '/Code Coverage: \d+%/'
  ```

### Container Scanning

- Scan Docker images for vulnerabilities:

  ```yaml
  include:
    - template: Security/Container-Scanning.gitlab-ci.yml
  ```

---

## 9. **GitLab Backup and Recovery**

### Backing Up GitLab

- For self-hosted GitLab, run:

  ```bash
  gitlab-backup create
  ```

- Backup includes repositories, CI/CD logs, uploads, and settings.

### Restoring GitLab

- Restore a backup:

  ```bash
  gitlab-restore restore BACKUP_FILE=backup_filename
  ```

---

## 10. **Troubleshooting GitLab**

### Common Errors

- **Pipeline Failures**:
  - Check pipeline logs in **CI/CD** → **Jobs**.
- **Runner Issues**:
  - Ensure the runner is active: `gitlab-runner status`.
- **Permission Errors**:
  - Verify SSH key and repository access.

### Debugging CI/CD Pipelines

- Add verbose logging:

  ```yaml
  script:
    - echo "Debugging info"
    - set -x
    - ./my-script.sh
  ```

---

## 11. **GitLab Best Practices**

- **Use Branching Strategies**:
  - Implement GitLab Flow or GitFlow for streamlined collaboration.
- **Secure CI/CD Pipelines**:
  - Use environment variables to manage sensitive data.
- **Automate Reviews**:
  - Use merge request templates and code owners.
- **Leverage GitLab Templates**:
  - Use pre-built `.gitlab-ci.yml` templates to save time.
- **Monitor Usage**:
  - Regularly check project and pipeline analytics.

---

## 12. **Useful GitLab CLI Commands**

### Basic Commands

- **Login to GitLab CLI**:

  ```bash
  glab auth login
  ```

- **List Repositories**:

  ```bash
  glab repo list
  ```

- **Create an Issue**:

  ```bash
  glab issue create --title "Bug report" --description "Details here"
  ```

---

## References and Resources

1. [GitLab Documentation](https://docs.gitlab.com/)
2. [GitLab CI/CD Examples](https://docs.gitlab.com/ee/ci/examples/)
3. [GitLab CLI](https://github.com/profclems/glab)
