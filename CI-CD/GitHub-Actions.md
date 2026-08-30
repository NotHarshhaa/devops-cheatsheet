# GitHub Actions Cheatsheet

![](https://imgur.com/GMwRo18.png)

## 1. Introduction

**GitHub Actions** is a continuous integration and continuous delivery (CI/CD) and workflow automation platform integrated directly into GitHub repositories. It allows you to automate build, test, package, release, and deployment pipelines directly from repository events.

---

## 2. Key Architecture & Concepts

- **Workflow**: Automated process defined in YAML under `.github/workflows/`. Triggered by repository events, schedules, or manual webhooks.
- **Job**: A set of steps executed sequentially on the same runner instance. Jobs run in parallel by default unless ordered with `needs`.
- **Step**: Individual task executing either shell commands (`run`) or an action (`uses`).
- **Runner**: Server hosting the job execution. Can be GitHub-hosted (`ubuntu-latest`, `windows-latest`, `macos-latest`, or ARM-based runners) or self-hosted.
- **Action**: Reusable extension component written in Docker, JavaScript/Node.js, or Composite syntax.
- **Environment**: Deployment target with protection rules (manual approvals, wait timers) and environment-specific secrets.

---

## 3. Production CI/CD Workflow Example

```yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      deploy_target:
        description: 'Target environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

# Principle of least privilege: default to minimal permissions
permissions:
  contents: read

# Concurrency control: automatically cancel outdated in-progress runs
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-test:
    name: Lint & Run Unit Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js (Active LTS)
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter & Typecheck
        run: |
          npm run lint
          npm run typecheck

      - name: Run Tests with Coverage
        run: npm test -- --coverage

      - name: Upload Test Coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 7
```

---

## 4. Modern Cloud Authentication: OpenID Connect (OIDC)

> [!TIP]
> Never store permanent long-lived cloud credentials (like `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`) in GitHub Secrets. Use GitHub's built-in OIDC token provider to assume temporary roles with short-lived tokens.

```yaml
jobs:
  deploy-aws:
    name: Deploy via AWS OIDC
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Required for requesting the JWT OIDC token
      contents: read
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Configure AWS Credentials with OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsWorkflowRole
          aws-region: us-east-1

      - name: Verify AWS Identity
        run: aws sts get-caller-identity
```

---

## 5. Matrix Builds & Modern Strategy

Run jobs across multiple operating systems, languages, or browser versions concurrently.

```yaml
jobs:
  test-matrix:
    name: Test on Node ${{ matrix.node-version }} - ${{ matrix.os }}
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false # Do not cancel other matrix jobs if one fails
      matrix:
        os: [ubuntu-latest, macos-latest]
        node-version: [20, 22]
        include:
          # Add an experimental build or canary flag
          - os: ubuntu-latest
            node-version: 22
            experimental: true
        exclude:
          - os: macos-latest
            node-version: 20
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
        continue-on-error: ${{ matrix.experimental || false }}
```

---

## 6. Caching & Artifact Management (v4)

### Caching Dependencies

```yaml
- name: Cache Node Modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Artifact Upload & Download (v4 Architecture)

```yaml
# In Job 1: Build & Upload
- name: Upload Build Output
  uses: actions/upload-artifact@v4
  with:
    name: dist-files
    path: dist/
    compression-level: 6 # 1-9 (default 6)
    overwrite: true

# In Job 2: Download & Deploy
- name: Download Artifacts
  uses: actions/download-artifact@v4
  with:
    name: dist-files
    path: build-artifacts/
```

---

## 7. Reusable Workflows vs. Composite Actions

### Reusable Workflow (`.github/workflows/reusable-deploy.yml`)

Allows cross-repository or cross-team pipeline standardization with inputs, secrets, and outputs.

```yaml
name: Reusable Deploy
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      API_TOKEN:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - run: echo "Deploying to ${{ inputs.environment }} using token"
```

**Invoking the Reusable Workflow:**

```yaml
jobs:
  call-deploy:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: production
    secrets:
      API_TOKEN: ${{ secrets.PROD_API_TOKEN }}
```

### Composite Action (`.github/actions/setup-project/action.yml`)

Combines multiple workflow steps into a single reusable action step.

```yaml
name: 'Setup Project'
description: 'Check out code and prepare toolchains'
inputs:
  node-version:
    description: 'Node version'
    required: false
    default: '20'
runs:
  using: 'composite'
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: 'npm'
    - run: npm ci
      shell: bash
```

---

## 8. Security Hardening & Best Practices

1. **Explicit Permissions**: Never leave default repository permissions open. Use top-level or job-level `permissions: contents: read` and explicitly specify privileges like `id-token: write` or `pull-requests: write`.
2. **Pin Actions to Full Commit SHAs**:
   ```yaml
   uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
   ```
3. **Use Environment Protection Rules**: Configure manual sign-offs and branch restrictions on target environments (`staging`, `production`) in repository settings.
4. **Prevent Script Injection**: Never evaluate untrusted user input directly in inline bash scripts. Pass inputs via environment variables:
   ```yaml
   # Vulnerable:
   # run: echo "Title was ${{ github.event.issue.title }}"
   # Secure:
   env:
     ISSUE_TITLE: ${{ github.event.issue.title }}
   run: echo "Title was $ISSUE_TITLE"
   ```
5. **Supply Chain Security**:
   - Run security auditing: `npm audit`, `trivy`, or GitHub CodeQL (`github/codeql-action`).
   - Generate Software Bill of Materials (SBOM) and sign release artifacts using Sigstore/Cosign.
