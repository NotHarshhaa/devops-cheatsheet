# 🦊 GitLab CI Cheatsheet

![](https://imgur.com/dbufti0.png)

**GitLab CI/CD** is an enterprise-grade continuous integration and delivery platform configured through `.gitlab-ci.yml`. It supports Directed Acyclic Graph (DAG) pipelines, auto-scaling runners, built-in container registries, and native DevSecOps templates.

---

## **1. Key Architecture & Concepts**

| Concept | Description |
| --- | --- |
| **Pipeline** | The complete workflow consisting of stages and jobs. |
| **Stage** | Logical ordering gate (e.g. `lint`, `build`, `test`, `deploy`). Jobs within the same stage run concurrently. |
| **Job** | Discrete unit of work running bash/powershell scripts inside a container or VM. |
| **Runner** | The execution daemon running on Docker, Kubernetes, or bare-metal. |
| **DAG (`needs`)** | Decouples jobs from stage ordering, executing tasks immediately when prerequisites finish. |
| **Rules** | Powerful condition engine controlling job inclusion, failure handling, and execution modes. |

---

## **2. Predefined CI/CD Variables Quick Reference**

GitLab automatically injects essential context variables into every job:

| Variable | Description | Example |
| --- | --- | --- |
| `$CI_COMMIT_SHA` | Full 40-character commit hash | `1a2b3c4d5e...` |
| `$CI_COMMIT_SHORT_SHA` | Short 8-character commit hash | `1a2b3c4d` |
| `$CI_COMMIT_REF_SLUG` | URL-safe branch or tag name | `feature-login-page` |
| `$CI_DEFAULT_BRANCH` | Project's default branch | `main` |
| `$CI_PIPELINE_SOURCE` | What triggered the pipeline | `push`, `merge_request_event`, `schedule` |
| `$CI_REGISTRY_IMAGE` | Base address of project container registry | `registry.gitlab.com/group/project` |
| `$CI_JOB_TOKEN` | Short-lived token for authenticating against GitLab API/registry | `glcbt-64_...` |

---

## **3. Production `.gitlab-ci.yml` Pipeline**

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

# DAG Pipeline: test-unit runs immediately after lint without waiting for build!
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

## **4. Directed Acyclic Graph (DAG) with `needs`**

Break stage bottlenecks and execute microservice pipelines in parallel:

```yaml
build:frontend:
  stage: build
  script: npm run build:frontend

build:backend:
  stage: build
  script: npm run build:backend

test:frontend:
  stage: test
  needs: ["build:frontend"] # Starts immediately when frontend build completes
  script: npm run test:frontend

test:backend:
  stage: test
  needs: ["build:backend"] # Starts immediately when backend build completes
  script: npm run test:backend
```

---

## **5. Multi-Project & Downstream Pipelines (`trigger`)**

Trigger child pipelines or downstream repository deployments:

```yaml
trigger-e2e-tests:
  stage: test
  trigger:
    project: my-org/e2e-integration-tests
    branch: main
    strategy: depend # Wait for downstream pipeline to succeed before completing
```

---

## **6. GitLab Runner Configuration (`config.toml`)**

Tune self-hosted Docker and Kubernetes runner performance:

```toml
concurrent = 10
check_interval = 0

[session_server]
  session_timeout = 1800

[[runners]]
  name = "k8s-production-runner"
  url = "https://gitlab.com/"
  id = 123456
  token = "glrt-XXXXX"
  executor = "docker"
  [runners.custom_build_dir]
  [runners.docker]
    tls_verify = false
    image = "alpine:latest"
    privileged = false
    pull_policy = ["if-not-present"]
    volumes = ["/cache", "/var/run/docker.sock:/var/run/docker.sock"]
    shm_size = 2147483648
```

---

## **7. Modern Cloud Authentication: OpenID Connect (OIDC)**

Assume cloud IAM roles with short-lived tokens without storing static secrets:

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
```

---

## **8. Production Best Practices**

1. **Enable Pipeline Interruptibility**: Add `interruptible: true` to prevent wasting runner minutes on stale branch commits.
2. **Mask and Protect Variables**: Always mark sensitive credentials as **Masked** and **Protected** in **Settings** → **CI/CD** → **Variables**.
3. **Use Artifact Expirations**: Always declare `expire_in` to prevent disk storage bloat on your GitLab instance.
4. **Use DAG (`needs:`)**: Significantly reduce total pipeline duration by allowing jobs to run as soon as dependencies are ready.

---

## 📚 **Learning Resources**

* 🔗 [Official GitLab CI Documentation](https://docs.gitlab.com/ee/ci/)
* 📜 [GitLab CI/CD Keyword Reference](https://docs.gitlab.com/ee/ci/yaml/)
* 💻 [GitLab Runner Configuration](https://docs.gitlab.com/runner/configuration/)
