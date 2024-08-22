# GitHub Actions Cheatsheet

![](https://imgur.com/GMwRo18.png)

**1. Introduction:**

- GitHub Actions is a powerful CI/CD and automation tool integrated directly into GitHub repositories, allowing you to build, test, and deploy your code.

**2. Key Concepts:**

- **Workflow:** An automated process defined in YAML that is triggered by events like `push`, `pull_request`, etc.
- **Job:** A set of steps that runs on the same runner.
- **Step:** An individual task, such as running a script or installing a dependency.
- **Runner:** A server that runs the jobs in a workflow, can be GitHub-hosted or self-hosted.

**3. Basic Workflow Example:**

- **YAML Syntax:**

  ```yaml
  name: CI Workflow

  on:
    push:
      branches:
        - main
    pull_request:
      branches:
        - main

  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - name: Set up Node.js
          uses: actions/setup-node@v3
          with:
            node-version: '14'
        - run: npm install
        - run: npm test
  ```

**4. Common Actions:**

- **actions/checkout:** Checks out your repository under `$GITHUB_WORKSPACE`.
- **actions/setup-node:** Sets up a Node.js environment.
- **actions/upload-artifact:** Uploads build artifacts for later use.
- **actions/cache:** Caches dependencies like `node_modules` or `Maven`.

**5. Triggers:**

- **on: push:** Trigger a workflow when a push occurs.
- **on: pull_request:** Trigger a workflow when a pull request is opened.
- **on: schedule:** Schedule a workflow to run at specific times using cron syntax.

**6. Environment Variables:**

- **Set environment variables:**

  ```yaml
  env:
    NODE_ENV: production
    DEBUG: true
  ```

- **Access secrets:**

  ```yaml
  env:
    MY_SECRET: ${{ secrets.MY_SECRET }}
  ```

**7. Matrix Builds:**

- **Example:**

  ```yaml
  jobs:
    build:
      runs-on: ubuntu-latest
      strategy:
        matrix:
          node-version: [12, 14, 16]
      steps:
        - uses: actions/checkout@v3
        - name: Set up Node.js
          uses: actions/setup-node@v3
          with:
            node-version: ${{ matrix.node-version }}
        - run: npm install
        - run: npm test
  ```

**8. Artifacts and Caching:**

- **Upload Artifacts:**

  ```yaml
  - name: Upload build artifacts
    uses: actions/upload-artifact@v3
    with:
      name: my-artifact
      path: ./build
  ```

- **Caching Dependencies:**

  ```yaml
  - name: Cache Node.js modules
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-
  ```

**9. Reusable Workflows:**

- **Define a reusable workflow:**

  ```yaml
  name: Reusable CI Workflow

  on:
    workflow_call:
      inputs:
        node-version:
          required: true
          type: string

  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - name: Set up Node.js
          uses: actions/setup-node@v3
          with:
            node-version: ${{ inputs.node-version }}
        - run: npm install
        - run: npm test
  ```

- **Call a reusable workflow:**

  ```yaml
  jobs:
    call-workflow:
      uses: ./.github/workflows/reusable-workflow.yml
      with:
        node-version: '14'
  ```

**10. Best Practices:**

- **Modular Workflows:** Break down complex workflows into smaller, reusable pieces.
- **Use Environments:** Leverage environments in GitHub Actions for deployments with manual approvals.
- **Secret Management:** Always use GitHub Secrets for sensitive information and never hard-code them.
