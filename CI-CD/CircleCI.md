# ⭕ CircleCI Cheatsheet

![](https://imgur.com/s6aXKl9.png)

**CircleCI** is a modern cloud-native and self-hosted CI/CD automation platform designed for rapid testing, building, and delivering software across Docker, Linux, macOS, and Windows environments.

---

## **1. Key Architecture & Concepts**

| Concept | Description |
| --- | --- |
| **Workflow** | Orchestration graph managing jobs, dependencies, approval gates, and schedules. |
| **Job** | Set of steps executed inside a defined executor environment. |
| **Step** | Individual executable directive (`checkout`, `run`, `save_cache`, `store_test_results`). |
| **Executor** | Runtime environment: **Docker (`cimg/*`)**, **Machine** (VM), **macOS**, or **Windows**. |
| **Orbs** | Shareable, versioned packages of reusable CircleCI configuration. |
| **Contexts** | Organization-wide secure environment variable containers secured by user groups. |

---

## **2. CircleCI CLI Quick Reference**

The CircleCI CLI allows you to validate configurations, process orbs, and execute jobs locally before pushing commits:

```bash
# Install CircleCI CLI (macOS / Linux via Homebrew or install script)
curl -fLSs https://raw.githubusercontent.com/CircleCI-Public/circleci-cli/master/install.sh | bash

# Authenticate with your CircleCI API token
circleci setup

# Validate .circleci/config.yml syntax locally
circleci config validate

# Expand orbs and view fully compiled configuration
circleci config process .circleci/config.yml

# Execute a single job locally using Docker (rapid debugging)
circleci local execute -j build-and-test
```

---

## **3. Production `.circleci/config.yml` Example**

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
    resource_class: medium # small, medium, medium+, large, xlarge, 2xlarge

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

## **4. Matrix Jobs (Parameterized Workflows)**

Execute the same job across multiple language versions or operating systems using matrix expansion:

```yaml
jobs:
  test-node:
    parameters:
      version:
        type: string
      os:
        type: executor
    executor: << parameters.os >>
    steps:
      - checkout
      - run: node -v && npm test

workflows:
  matrix-workflow:
    jobs:
      - test-node:
          matrix:
            parameters:
              version: ["18.20.0", "20.18.0", "22.11.0"]
              os: [node-linux, node-macos]
```

---

## **5. Modern Executors (`cimg/*` vs Legacy Images)**

> [!WARNING]
> Legacy `circleci/*` images are deprecated. Always use official next-generation **`cimg/*`** images:

| Language / Stack | Modern Image |
| :--- | :--- |
| **Node.js** | `cimg/node:20.18.0` / `cimg/node:22.11.0` |
| **Python** | `cimg/python:3.12.7` |
| **Go** | `cimg/go:1.23.2` |
| **Java / OpenJDK** | `cimg/openjdk:21.0.4` |
| **Base Ubuntu** | `cimg/base:2024.01` |
| **Rust** | `cimg/rust:1.82.0` |

---

## **6. OpenID Connect (OIDC) Passwordless Cloud Access**

Authenticate directly with AWS, GCP, or Azure via temporary JSON Web Tokens (JWT) using `CIRCLE_OIDC_TOKEN_V2`:

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

## **7. Self-Hosted Runners (`circleci-runner`)**

Execute jobs on your own bare metal, Kubernetes clusters, or private VPC instances:

```bash
# Install circleci-runner daemon on Linux
curl -s https://packagecloud.io/install/repositories/circleci/runner/script.deb.sh | sudo bash
sudo apt install circleci-runner

# Configure runner token and resource class in /etc/circleci-runner/circleci-runner.yml
sudo systemctl enable --now circleci-runner
```

Usage in `.circleci/config.yml`:

```yaml
jobs:
  private-build:
    machine: true
    resource_class: my-org/private-vpc-runner
    steps:
      - checkout
      - run: ./deploy-internal.sh
```

---

## **8. Best Practices**

1. **Use Resource Classes**: Match CPU and RAM to workload requirements (`resource_class: arm.medium` offers cost-effective ARM builds).
2. **Secure Variables with Contexts**: Group environment variables into restricted Contexts requiring security team approvals.
3. **Use Granular Cache Keys**: Include OS, lockfile checksums, and fallback prefixes. Cache package manager global caches (e.g. `~/.npm`) rather than root folders.
4. **Leverage Timed Test Splitting**: Always feed test result XML to `store_test_results` so CircleCI can calculate optimal timing partitions.

---

## 📚 **Learning Resources**

* 🔗 [Official CircleCI Documentation](https://circleci.com/docs/)
* 📦 [CircleCI Orbs Registry](https://circleci.com/developer/orbs)
* 💻 [CircleCI CLI Documentation](https://circleci-public.github.io/circleci-cli/)
