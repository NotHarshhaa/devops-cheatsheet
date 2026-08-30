# 🐙 GitHub Actions Cheatsheet

![](https://imgur.com/GMwRo18.png)

**GitHub Actions** is a continuous integration, continuous delivery (CI/CD), and workflow automation platform natively integrated into GitHub. It allows you to automate build, test, package, release, and deployment pipelines directly triggered by repository events.

---

## **1. Key Architecture & Concepts**

| Concept | Description |
| --- | --- |
| **Workflow** | Automated process defined in YAML under `.github/workflows/`. Triggered by events, schedules, or manual webhooks. |
| **Job** | A set of steps executed sequentially on the same runner instance. Jobs run in parallel by default unless ordered with `needs`. |
| **Step** | Individual task executing either shell commands (`run`) or an action (`uses`). |
| **Runner** | Server hosting the job: GitHub-hosted (`ubuntu-latest`, `windows-latest`, `macos-latest`) or self-hosted. |
| **Action** | Reusable extension component written in Docker, JavaScript/Node.js, or Composite syntax. |
| **Environment** | Deployment target with protection rules (manual approvals, wait timers) and environment-specific secrets. |

---

## **2. Production CI/CD Workflow Example**

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

      - name: Generate Job Summary Report
        run: |
          echo "### 📊 Test Results Summary" >> $GITHUB_STEP_SUMMARY
          echo "| Metric | Status |" >> $GITHUB_STEP_SUMMARY
          echo "| --- | --- |" >> $GITHUB_STEP_SUMMARY
          echo "| Unit Tests | ✅ Passed |" >> $GITHUB_STEP_SUMMARY
          echo "| Commit SHA | \`${{ github.sha }}\` |" >> $GITHUB_STEP_SUMMARY
          echo "| Triggered By | @${{ github.actor }} |" >> $GITHUB_STEP_SUMMARY

      - name: Upload Test Coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 7
```

---

## **3. Contexts & Expressions Reference**

Expressions access workflow information using `${{ <expression> }}`:

| Context | Description | Example |
| --- | --- | --- |
| `github` | Metadata about the workflow run and event | `${{ github.sha }}`, `${{ github.ref_name }}` |
| `env` | Environment variables set in workflow or job | `${{ env.DATABASE_URL }}` |
| `vars` | Non-sensitive configuration variables | `${{ vars.APP_PORT }}` |
| `secrets` | Encrypted repository or environment secrets | `${{ secrets.PROD_API_KEY }}` |
| `steps` | Outputs and outcomes of previous steps | `${{ steps.build.outputs.image_tag }}` |
| `runner` | Information about the runner operating system | `${{ runner.os }}`, `${{ runner.arch }}` |

---

## **4. Modern Cloud Authentication: OpenID Connect (OIDC)**

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

## **5. Matrix Builds & Dynamic Matrix Generation**

### 🔹 Static Matrix Build

```yaml
jobs:
  test-matrix:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest]
        node-version: [20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

### 🔹 Dynamic Matrix via `fromJSON()`

Calculate the matrix dynamically based on changed directories or API responses:

```yaml
jobs:
  generate-matrix:
    runs-on: ubuntu-latest
    outputs:
      services: ${{ steps.set-matrix.outputs.services }}
    steps:
      - id: set-matrix
        run: echo 'services=["auth", "billing", "frontend"]' >> $GITHUB_OUTPUT

  build:
    needs: generate-matrix
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: ${{ fromJSON(needs.generate-matrix.outputs.services) }}
    steps:
      - run: echo "Building service: ${{ matrix.service }}"
```

---

## **6. Caching & Artifact Management (v4)**

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

## **7. Reusable Workflows vs. Composite Actions**

### Reusable Workflow (`.github/workflows/reusable-deploy.yml`)

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
      - run: echo "Deploying to ${{ inputs.environment }}"
```

### Composite Action (`.github/actions/setup-project/action.yml`)

```yaml
name: 'Setup Project'
description: 'Check out code and prepare toolchains'
runs:
  using: 'composite'
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'
    - run: npm ci
      shell: bash
```

---

## **8. Security Hardening & Best Practices**

1. **Explicit Permissions**: Always declare minimal top-level `permissions: contents: read` to prevent privilege escalation.
2. **Pin Actions to Full Commit SHAs**: Prevent supply-chain tampering:
   ```yaml
   uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
   ```
3. **Prevent Script Injection**: Never evaluate user-controlled inputs in inline scripts. Pass variables via `env`:
   ```yaml
   env:
     TITLE: ${{ github.event.issue.title }}
   run: echo "$TITLE"
   ```

---

## 📚 **Learning Resources**

* 🔗 [Official GitHub Actions Documentation](https://docs.github.com/en/actions)
* 📦 [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
* 🛡️ [Security Hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
