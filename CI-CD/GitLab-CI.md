# GitLab CI Cheatsheet

![](https://imgur.com/dbufti0.png)

## 1. Introduction

**GitLab CI/CD** is a core component of the GitLab platform that automates software testing, building, scanning, and deployment through a declarative configuration file called `.gitlab-ci.yml` in the root of your repository.

---

## 2. Key Architecture & Concepts

- **Pipeline**: Complete workflow executed across stages and jobs.
- **Stage**: Logical sequencing group (e.g., `.pre`, `build`, `test`, `deploy`, `.post`). Jobs within a stage execute in parallel by default.
- **Job**: The discrete execution unit containing commands (`script`), environment configs, and artifacts.
- **Runner**: The executor agent. Can be shared (GitLab SaaS), group-level, or project-specific running on Docker, Kubernetes, or VMs.
- **DAG (Directed Acyclic Graph)**: Non-linear pipelines defined with `needs:` that decouple job execution from stage boundaries.
- **Rules**: Modern conditional logic system replacing deprecated `only`/`except` directives.

---

## 3. Production `.gitlab-ci.yml` Pipeline

```yaml
stages:
  - lint
  - build
  - test
  - deploy

default:
  image: node:20-alpine
  interruptible: true # Automatically cancel outdated pipelines on new commits

variables:
  DOCKER_BUILDKIT: "1"
  NODE_ENV: "production"

# Cache dependencies across pipeline executions
cache:
  key:
    files:
      - package-lock.json
  paths:
    - .npm/
  policy: pull-push

lint-job:
  stage: lint
  before_script:
    - npm ci --cache .npm --prefer-offline
  script:
    - npm run lint
    - npm run format:check
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

build-job:
  stage: build
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run build
  artifacts:
    name: "$CI_COMMIT_REF_SLUG-build"
    paths:
      - dist/
    expire_in: 2 days
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

# DAG Pipeline: test-unit can run immediately after lint without waiting for build!
test-unit:
  stage: test
  needs: ["lint-job"]
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run test:coverage
  coverage: '/Lines \s*:\s*(\d+.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

deploy-production:
  stage: deploy
  needs: ["build-job", "test-unit"]
  environment:
    name: production
    url: https://app.example.com
  script:
    - echo "Deploying artifacts to production..."
    - ./scripts/deploy.sh
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: manual # Requires explicit human sign-off
```

---

## 4. Modern Conditional Logic (`rules`)

Replace legacy `only`/`except` with powerful `rules:` expressions:

```yaml
job-example:
  script: echo "Deploying..."
  rules:
    # Run only on default branch
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: on_success

    # Run for merge requests targeting main
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event' && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == 'main'

    # Run if specific files changed
    - if: $CI_PIPELINE_SOURCE == 'push'
      changes:
        - src/**/*
        - Dockerfile

    # Prevent execution
    - when: never
```

---

## 5. Directed Acyclic Graph (DAG) with `needs`

Speed up pipelines significantly by breaking stage dependencies:

```yaml
build:frontend:
  stage: build
  script: npm run build:frontend

build:backend:
  stage: build
  script: npm run build:backend

test:frontend:
  stage: test
  needs: ["build:frontend"] # Runs immediately when frontend build completes!
  script: npm run test:frontend

test:backend:
  stage: test
  needs: ["build:backend"] # Runs immediately when backend build completes!
  script: npm run test:backend
```

---

## 6. OpenID Connect (OIDC) & Passwordless Cloud Auth

Authenticate securely with AWS, GCP, or Vault without storing static API keys.

```yaml
deploy:aws:
  stage: deploy
  image: amazon/aws-cli:latest
  id_tokens:
    AWS_JWT:
      aud: https://sts.amazonaws.com
  variables:
    AWS_ROLE_ARN: "arn:aws:iam::123456789012:role/GitLabOIDCRole"
    AWS_DEFAULT_REGION: "us-east-1"
  before_script:
    - >
      STS_CREDENTIALS=$(aws sts assume-role-with-web-identity
      --role-arn ${AWS_ROLE_ARN}
      --role-session-name "GitLabCI-${CI_PIPELINE_ID}"
      --web-identity-token "${AWS_JWT}"
      --duration-seconds 3600
      --query "Credentials.[AccessKeyId,SecretAccessKey,SessionToken]"
      --output text)
    - export AWS_ACCESS_KEY_ID=$(echo "$STS_CREDENTIALS" | awk '{print $1}')
    - export AWS_SECRET_ACCESS_KEY=$(echo "$STS_CREDENTIALS" | awk '{print $2}')
    - export AWS_SESSION_TOKEN=$(echo "$STS_CREDENTIALS" | awk '{print $3}')
  script:
    - aws sts get-caller-identity
    - aws s3 sync dist/ s3://my-production-bucket/
```

---

## 7. GitLab CI/CD Catalog & CI Components

Modern GitLab pipelines use CI Components instead of complex monolithic YAML includes:

```yaml
include:
  # Using GitLab CI/CD Catalog Components
  - component: gitlab.com/components/secret-detection/secret-detection@1.1.0
  - component: gitlab.com/components/container-scanning/container-scanning@4.0.0
    inputs:
      image: "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"

  # Or referencing structured local files
  - local: '/.gitlab/ci/build.gitlab-ci.yml'
  - local: '/.gitlab/ci/test.gitlab-ci.yml'
```

---

## 8. Built-in Security & Supply Chain Scans

Include standard security templates managed directly by GitLab:

```yaml
include:
  - template: Jobs/SAST.gitlab-ci.yml
  - template: Jobs/Dependency-Scanning.gitlab-ci.yml
  - template: Jobs/Secret-Detection.gitlab-ci.yml
  - template: Jobs/Container-Scanning.gitlab-ci.yml

sast:
  stage: test
  variables:
    SAST_EXCLUDED_PATHS: "spec, test, tests, tmp"
```

---

## 9. Reusable YAML Blocks (`!reference` and Anchors)

### Modern `!reference` Tag (Recommended over YAML anchors)

```yaml
.setup_node:
  before_script:
    - node -v
    - npm ci

unit-test:
  before_script:
    - !reference [.setup_node, before_script]
    - echo "Running unit tests setup"
  script:
    - npm test
```

---

## 10. Production Best Practices

1. **Enable Pipeline Interruptibility**: Add `interruptible: true` to default configurations to abort stale branch pipelines on new pushes.
2. **Strict Variable Masking**: Always mark sensitive CI/CD variables as **Masked** and **Protected** in Project Settings.
3. **Use Artifact Expirations**: Set realistic `expire_in` values (e.g., `1 hour`, `2 days`) to prevent runner storage exhaustion.
4. **Prefer CI Components over Nested Anchors**: Use CI components or `!reference` tags for clean composability.
5. **Optimize Cache Paths**: Cache package manager cache directories (like `~/.npm` or `~/.cache/pip`) rather than project-local folders to avoid corrupt node_modules states.
