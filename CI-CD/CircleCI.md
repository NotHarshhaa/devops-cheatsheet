# CircleCI Cheatsheet

![](https://imgur.com/s6aXKl9.png)

**1. Introduction:**

- CircleCI is a continuous integration and delivery platform that automates the build, test, and deploy processes, allowing for quick and efficient development workflows.

**2. Key Concepts:**

- **Job:** A collection of steps to be executed in a build.
- **Step:** A single command or script within a job.
- **Workflow:** Defines the order of jobs and their dependencies.
- **Executor:** Specifies the environment in which the job runs (e.g., Docker, Linux VM, macOS).

**3. Basic `.circleci/config.yml` Example:**

- **YAML Syntax:**

  ```yaml
  version: 2.1

  jobs:
    build:
      docker:
        - image: circleci/node:14
      steps:
        - checkout
        - run: npm install
        - run: npm test

    deploy:
      docker:
        - image: circleci/node:14
      steps:
        - checkout
        - run: npm run deploy

  workflows:
    version: 2
    build_and_deploy:
      jobs:
        - build
        - deploy
  ```

**4. Executors:**

- **Docker:** Run jobs in Docker containers.

  ```yaml
  docker:
    - image: circleci/node:14
  ```

- **Machine:** Run jobs in a Linux VM.

  ```yaml
  machine:
    image: ubuntu-2004:202101-01
  ```

- **macOS:** Run jobs on macOS for iOS builds.

  ```yaml
  macos:
    xcode: "12.4.0"
  ```

**5. Reusable Configurations:**

- **Commands:** Reuse steps across multiple jobs.

  ```yaml
  commands:
    setup:
      steps:
        - checkout
        - run: npm install

  jobs:
    build:
      docker:
        - image: circleci/node:14
      steps:
        - setup
        - run: npm test
  ```

- **Executors:** Reuse the environment configuration.

  ```yaml
  executors:
    node-executor:
      docker:
        - image: circleci/node:14

  jobs:
    build:
      executor: node-executor
      steps:
        - checkout
        - run: npm install
  ```

**6. Caching and Artifacts:**

- **Caching:** Speed up builds by caching dependencies.

  ```yaml
  - restore_cache:
      keys:
        - v1-dependencies-{{ checksum "package-lock.json" }}
  - save_cache:
      paths:
        - node_modules
      key: v1-dependencies-{{ checksum "package-lock.json" }}
  ```

- **Artifacts:** Save build outputs and other data for later use.

  ```yaml
  - store_artifacts:
      path: ./build
      destination: build_output
  ```

**7. Workflows:**

- **Sequential Jobs:** Define jobs that run in sequence.

  ```yaml
  workflows:
    version: 2
    build_and_deploy:
      jobs:
        - build
        - deploy
  ```

- **Parallel Jobs:** Run jobs in parallel to speed up pipeline execution.

  ```yaml
  workflows:
    version: 2
    test-and-deploy:
      jobs:
        - test
        - deploy
  ```

**8. Environment Variables:**

- **Project-level Variables:** Set environment variables in the CircleCI project settings.
- **Context Variables:** Use contexts to securely store and manage environment variables.
- **Job-level Variables:**

  ```yaml
  jobs:
    build:
      docker:
        - image: circleci/node:14
      environment:
        NODE_ENV: production
  ```

**9. Advanced CircleCI Features:**

- **Orbs:** Reusable packages of CircleCI configuration that make it easy to integrate with third-party tools.

  ```yaml
  orbs:
    aws-s3: circleci/aws-s3@4.2.0

  jobs:
    deploy:
      steps:
        - aws-s3/copy:
            from: "build/"
            to: "s3://my-bucket/"
  ```

- **Conditional Steps:** Run steps conditionally based on the success or failure of previous steps.

  ```yaml
  - run:
      name: Deploy only if tests pass
      command: ./deploy.sh
      when: on_success
  ```

**10. Best Practices:**

- **Parallelism:** Use parallelism to reduce build times by running tests and other tasks simultaneously.
- **Modular Configurations:** Break down your CircleCI configuration into reusable components with orbs, commands, and executors.
- **Effective Caching:** Cache dependencies effectively to reduce build times, but remember to invalidate caches when necessary to avoid stale dependencies.
