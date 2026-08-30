# 🪣 Bitbucket Cheatsheet

![text](https://imgur.com/7PDN0aZ.png)

**Bitbucket**, developed by Atlassian, is a Git-based source code management, CI/CD, and collaboration platform. It offers native integration with Jira, Confluence, and the broader Atlassian cloud ecosystem, making it a primary choice for enterprise DevOps teams.

---

## **1. Core Concepts & Overview**

| Feature | Description |
| --- | --- |
| **Workspaces & Projects** | Hierarchical grouping of repositories under organizational teams. |
| **Bitbucket Pipelines** | Serverless CI/CD service configured via `bitbucket-pipelines.yml` with native Docker container execution. |
| **Bitbucket Pipes** | Reusable, parameterized Docker-based tasks for integrating third-party tools (AWS, Slack, SonarCloud). |
| **Deployments** | Environment tracking (Test, Staging, Production) with concurrency limits and manual approval gates. |
| **Jira Smart Commits** | Automatically transition Jira issues, log work hours, or add comments via commit messages. |

---

## **2. Account & SSH Key Setup**

### 🔹 Generate Modern Ed25519 SSH Key

Ed25519 is the modern cryptographic standard, offering superior security and performance over legacy RSA:

```bash
# Generate Ed25519 key (recommended)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Fallback: RSA 4096-bit
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

Add your public key (`~/.ssh/id_ed25519.pub`) to Bitbucket:
1. Navigate to **Personal Settings** → **SSH Keys** → **Add Key**.
2. Test connection:
   ```bash
   ssh -T git@bitbucket.org
   ```

---

## **3. Basic Git & Daily Operations**

```bash
# Clone a repository using SSH
git clone git@bitbucket.org:workspace-name/repo-name.git
cd repo-name

# Modern branch switching (Git 2.23+)
git switch -c feature/login-auth

# Stage, commit, and link Jira issue
git add .
git commit -m "PROJ-101: Implement OAuth2 login flow #comment Completed initial handler"

# Push branch and set upstream tracking
git push -u origin feature/login-auth
```

### 🔹 Jira Smart Commits Syntax

Format: `<JIRA-ISSUE-KEY> #<COMMAND> <ARGUMENTS>`

```text
PROJ-42 #resolve #time 2h 30m #comment Ready for QA review
PROJ-88 #close
```

---

## **4. Bitbucket Pipelines (CI/CD)**

Pipelines run inside Docker containers defined directly in the root file `bitbucket-pipelines.yml`.

### 🔹 Production Pipeline Example with Caching & Testing

```yaml
image: node:20-alpine

definitions:
  caches:
    npm-custom: ~/.npm

pipelines:
  default:
    - step:
        name: Build and Test
        caches:
          - node
        script:
          - npm ci
          - npm test

  branches:
    main:
      - step:
          name: Build and Unit Test
          caches:
            - node
          script:
            - npm ci
            - npm run build
            - npm test
          artifacts:
            - build/**

      - step:
          name: Deploy to Staging
          deployment: staging
          script:
            - pipe: atlassian/aws-s3-deploy:1.6.0
              variables:
                AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID
                AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY
                AWS_DEFAULT_REGION: 'us-east-1'
                S3_BUCKET: 'my-staging-bucket'
                LOCAL_PATH: 'build'

      - step:
          name: Deploy to Production
          trigger: manual  # Requires human approval gate in UI
          deployment: production
          script:
            - pipe: atlassian/aws-s3-deploy:1.6.0
              variables:
                AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID
                AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY
                AWS_DEFAULT_REGION: 'us-east-1'
                S3_BUCKET: 'my-prod-bucket'
                LOCAL_PATH: 'build'
            - pipe: atlassian/slack-notify:2.8.0
              variables:
                WEBHOOK_URL: $SLACK_WEBHOOK_URL
                MESSAGE: 'Production deployment completed successfully! :rocket:'
```

---

## **5. Popular Bitbucket Pipes**

Pipes modularize pipeline steps without requiring custom bash scripts.

### 🔹 Build and Push Docker Image

```yaml
- step:
    name: Build & Push Docker Image
    services:
      - docker
    script:
      - pipe: atlassian/docker-build:1.0.0
        variables:
          IMAGE_NAME: 'myorg/myapp'
          TAGS: '${BITBUCKET_COMMIT} latest'
          DOCKER_USERNAME: $DOCKER_USERNAME
          DOCKER_PASSWORD: $DOCKER_PASSWORD
```

### 🔹 Run SonarCloud Static Code Analysis

```yaml
- step:
    name: SonarCloud Code Analysis
    script:
      - pipe: sonarsource/sonarcloud-scan:2.0.0
        variables:
          SONAR_TOKEN: $SONAR_TOKEN
          EXTRA_ARGS: '-Dsonar.projectKey=myorg_myapp'
```

---

## **6. Monorepo Selective Builds (`changesets`)**

Prevent rebuilding all services when only one subfolder changes:

```yaml
pipelines:
  pull-requests:
    '**':
      - step:
          name: Build Backend API Only
          condition:
            changesets:
              includePaths:
                - "backend/**"
          script:
            - cd backend && npm test

      - step:
          name: Build Frontend Only
          condition:
            changesets:
              includePaths:
                - "frontend/**"
          script:
            - cd frontend && npm test
```

---

## **7. Branch Permissions & Merge Checks**

Enforce governance and code review standards under **Repository Settings** → **Branch Permissions**:

1. **Prevent Direct Pushing**: Enforce all code changes to flow through Pull Requests.
2. **Minimum Approvals**: Require at least 2 peer reviews before merging.
3. **Passing Builds Check**: Block merging if the associated Bitbucket Pipeline build is failing or pending.
4. **Task Completion Check**: Require all PR review comment tasks to be resolved before merge.
5. **No Unresolved Discussions**: Prevent merging with active unacknowledged review threads.

---

## **8. Bitbucket REST API v2**

Authenticate using an **App Password** with scoped permissions:

```bash
# List all repositories in workspace
curl -s -u "$BB_USER:$BB_APP_PASSWORD" \
  "https://api.bitbucket.org/2.0/repositories/my-workspace" | jq .

# Trigger a custom pipeline build via API
curl -X POST -u "$BB_USER:$BB_APP_PASSWORD" \
  -H 'Content-Type: application/json' \
  https://api.bitbucket.org/2.0/repositories/my-workspace/my-repo/pipelines/ \
  -d '{
    "target": {
      "ref_type": "branch",
      "type": "pipeline_ref_target",
      "ref_name": "main"
    }
  }'
```

---

## **9. Production Best Practices**

1. **Use App Passwords Instead of Account Passwords**: Create dedicated app passwords with minimal scopes for CI/CD and API automations.
2. **Leverage Pipeline Service Containers**: Use `services: - docker` or define custom service containers (PostgreSQL, Redis) for integration tests.
3. **Secure Pipeline Variables**: Mark passwords, API tokens, and cloud keys as **Secured** in repository and deployment environment settings.
4. **Standardize PR Templates**: Add a `.bitbucket/pull_request_template.md` to ensure standardized descriptions, test logs, and Jira links.

---

## 📚 **Learning Resources**

* 🔗 [Official Bitbucket Documentation](https://support.atlassian.com/bitbucket-cloud/)
* 📦 [Bitbucket Pipes Marketplace](https://bitbucket.org/product/features/pipelines/integrations)
* 📜 [Bitbucket Cloud REST API Reference](https://developer.atlassian.com/cloud/bitbucket/rest/intro/)
