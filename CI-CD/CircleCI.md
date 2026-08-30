# CircleCI Cheatsheet

![](https://imgur.com/s6aXKl9.png)

## 1. Introduction

**CircleCI** is a modern cloud-native and self-hosted CI/CD automation platform designed for rapid testing, building, and delivering software across Docker, Linux, macOS, and Windows environments.

---

## 2. Key Architecture & Concepts

- **Workflow**: Orchestration graph managing jobs, dependencies, approval gates, and schedules.
- **Job**: Set of steps executed inside a defined executor environment.
- **Step**: Individual executable directive (`checkout`, `run`, `save_cache`, `store_test_results`).
- **Executor**: Environment runtime:
  - **Docker (`cimg/*`)**: Next-gen container-based execution (lightweight, rapid startup).
  - **Machine**: Dedicated Linux VM with complete systemd, Docker, and kernel access.
  - **macOS**: Dedicated Apple silicon / Xcode environments for iOS/macOS apps.
  - **Windows**: Dedicated Windows Server VMs.
- **Orbs**: Shareable, versioned packages of reusable CircleCI configuration.
- **Contexts**: Organization-wide secure environment variable containers secured by user groups.

---

## 3. Modern Production `.circleci/config.yml`

```yaml
version: 2.1

orbs:
  node: circleci/node@5.2.0
  aws-cli: circleci/aws-cli@5.1.0

# Reusable executor configuration
executors:
  node-executor:
    docker:
      - image: cimg/node:20.18.0
    resource_class: medium # Options: small, medium, medium+, large, xlarge, 2xlarge

jobs:
  build-and-test:
    executor: node-executor
    parallelism: 4 # Run across 4 parallel executor nodes
    steps:
      - checkout

      # Restore dependency cache
      - restore_cache:
          keys:
            - v1-deps-{{ checksum "package-lock.json" }}
            - v1-deps-

      - run:
          name: Install Dependencies
          command: npm ci

      - save_cache:
          paths:
            - ~/.npm
          key: v1-deps-{{ checksum "package-lock.json" }}

      - run:
          name: Run Linting
          command: npm run lint

      # Test splitting across parallel nodes by historical timing data
      - run:
          name: Run Split Unit Tests
          command: |
            TEST_FILES=$(circleci tests glob "src/**/*.test.ts" | circleci tests split --split-by=timings)
            npm test -- $TEST_FILES

      - store_test_results:
          path: junit.xml

      - store_artifacts:
          path: coverage
          destination: coverage-report

  deploy-staging:
    executor: aws-cli/default
    steps:
      - checkout
      - aws-cli/setup:
          role_arn: arn:aws:iam::123456789012:role/CircleCIOIDCRole
          region: us-east-1
      - run:
          name: Deploy to Staging
          command: |
            echo "Deploying application to AWS using short-lived OIDC session..."
            aws sts get-caller-identity

workflows:
  build-test-deploy:
    jobs:
      - build-and-test:
          filters:
            branches:
              ignore: gh-pages

      - hold-approval:
          type: approval
          requires:
            - build-and-test
          filters:
            branches:
              only: main

      - deploy-staging:
          requires:
            - hold-approval
          context:
            - aws-production-context
```

---

## 4. Modern Executors (`cimg/*` vs Legacy Images)

> [!WARNING]
> Legacy `circleci/*` images (e.g. `circleci/node`, `circleci/python`) are deprecated and no longer updated. Always use official next-generation **`cimg/*`** images:

| Language / Stack | Modern Image |
| :--- | :--- |
| **Node.js** | `cimg/node:20.18.0` / `cimg/node:22.11.0` |
| **Python** | `cimg/python:3.12.7` |
| **Go** | `cimg/go:1.23.2` |
| **Java / OpenJDK** | `cimg/openjdk:21.0.4` |
| **Base Ubuntu** | `cimg/base:2024.01` |
| **Rust** | `cimg/rust:1.82.0` |

---

## 5. Test Splitting & Parallelism

Accelerate test execution linearly across multiple runner instances:

```yaml
jobs:
  test:
    docker:
      - image: cimg/node:20.18.0
    parallelism: 4
    steps:
      - checkout
      - run:
          name: Run split tests
          command: |
            TESTS=$(circleci tests glob "tests/**/*.test.js" | circleci tests split --split-by=timings)
            npm test -- $TESTS
      - store_test_results:
          path: test-results
```

---

## 6. OpenID Connect (OIDC) Passwordless Cloud Access

Authenticate directly with cloud providers via JSON Web Tokens (JWT) using `CIRCLE_OIDC_TOKEN_V2`:

```yaml
jobs:
  aws-oidc-auth:
    docker:
      - image: cimg/aws:2024.03
    steps:
      - run:
          name: Assume AWS Role with OIDC
          command: |
            STS_CREDENTIALS=$(aws sts assume-role-with-web-identity \
              --role-arn "arn:aws:iam::123456789012:role/CircleCI-Role" \
              --role-session-name "circleci-session" \
              --web-identity-token "$CIRCLE_OIDC_TOKEN_V2" \
              --duration-seconds 3600 \
              --query "Credentials.[AccessKeyId,SecretAccessKey,SessionToken]" \
              --output text)
            echo "Successfully authenticated without permanent credentials."
```

---

## 7. Dynamic Config & Path Filtering

Split monorepos or multi-service projects dynamically using setup workflows:

```yaml
# In .circleci/config.yml
version: 2.1
setup: true # Marks this as a setup workflow

orbs:
  path-filtering: circleci/path-filtering@1.1.0

workflows:
  setup-pipeline:
    jobs:
      - path-filtering/filter:
          base-revision: main
          mapping: |
            services/frontend/.* frontend-workflow true
            services/backend/.*  backend-workflow true
          config-path: .circleci/continue_config.yml
```

---

## 8. Docker Layer Caching (DLC)

Speed up container builds within machine or remote Docker executors:

```yaml
jobs:
  build-image:
    machine:
      image: ubuntu-2404:2024.05.1
      docker_layer_caching: true # Reuses unchanged image layers between builds
    steps:
      - checkout
      - run: docker build -t my-app:$CIRCLE_SHA1 .
```

---

## 9. Best Practices

1. **Use Resource Classes**: Scale CPU and RAM to match workload needs (`resource_class: arm.medium` offers cost-effective ARM builds).
2. **Secure Variables with Contexts**: Group environment variables into restricted Contexts requiring security team approvals.
3. **Use Granular Cache Keys**: Include OS, lockfile checksums, and fallback prefixes. Cache package manager global caches (e.g. `~/.npm`) rather than root folders.
4. **Leverage Timed Test Splitting**: Always feed test result XML to `store_test_results` so CircleCI can calculate optimal timing partitions.
