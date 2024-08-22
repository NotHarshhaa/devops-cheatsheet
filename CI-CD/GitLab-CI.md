# GitLab CI Cheatsheet

![](https://imgur.com/dbufti0.png)

**1. Introduction:**

- GitLab CI/CD is a part of GitLab, a complete DevOps platform, allowing you to define CI/CD pipelines directly within your GitLab repository using the `.gitlab-ci.yml` file.

**2. Key Concepts:**

- **Pipeline:** A series of stages that run jobs sequentially or in parallel.
- **Job:** An individual unit of work, such as running tests or deploying code.
- **Stage:** A group of jobs that run in parallel.
- **Runner:** The agent that executes jobs, can be GitLab-hosted or self-hosted.

**3. Basic `.gitlab-ci.yml` Example:**

- **YAML Syntax:**

  ```yaml
  stages:
    - build
    - test
    - deploy

  build-job:
    stage: build
    script:
      - echo "Building the project..."
      - make

  test-job:
    stage: test


    script:
      - echo "Running tests..."
      - make test

  deploy-job:
    stage: deploy
    script:
      - echo "Deploying the project..."
      - make deploy
  ```

**4. Runners:**

- **Shared Runners:** Provided by GitLab and available to all projects.
- **Specific Runners:** Custom runners registered to a specific project or group.
- **Tags:** Use tags to specify which runner should execute a job.

**5. Artifacts and Caching:**

- **Artifacts:** Save job outputs and make them available to subsequent jobs.

  ```yaml
  artifacts:
    paths:
      - build/
    expire_in: 1 week
  ```

- **Caching:** Speed up jobs by reusing previously downloaded dependencies.

  ```yaml
  cache:
    paths:
      - node_modules/
  ```

**6. Environments and Deployments:**

- **Environments:** Define environments to organize and manage deployments.

  ```yaml
  deploy-job:
    stage: deploy
    environment:
      name: production
      url: https://myapp.com
    script:
      - echo "Deploying to production..."
      - ./deploy.sh
  ```

- **Manual Deployments:** Require manual approval before a job runs.

  ```yaml
  deploy-job:
    stage: deploy
    script:
      - ./deploy.sh
    when: manual
  ```

**7. Advanced `.gitlab-ci.yml` Features:**

- **YAML Anchors:** Reuse parts of your YAML configuration.

  ```yaml
  .default-job: &default-job
    script:
      - echo "Default job script"

  job1:
    <<: *default-job

  job2:
    <<: *default-job
  ```

- **Includes:** Include other YAML files to organize your configuration.

  ```yaml
  include:
    - local: '/templates/.gitlab-ci-template.yml'
  ```

**8. Security and Compliance:**

- **Secret Variables:** Store sensitive data securely in GitLab CI/CD.

  ```yaml
  deploy-job:
    script:
      - deploy --token $CI_DEPLOY_TOKEN
  ```

- **Protected Branches:** Restrict certain jobs to run only on protected branches.

**9. Troubleshooting:**

- **Pipeline Logs:** Access detailed logs for each job to troubleshoot failures.
- **Retrying Jobs:** Use the GitLab UI to manually retry failed jobs.

**10. Best Practices:**

- **Modular Pipelines:** Break down your pipeline into stages for better organization.
- **Use CI/CD Templates:** Leverage GitLab’s built-in templates for common CI/CD tasks.
- **Optimize Runner Usage:** Use caching, artifacts, and parallel jobs to reduce pipeline runtime.
