# 🐙 GitHub Cheatsheet

![text](https://imgur.com/c189VXy.png)

**GitHub** is the world's leading cloud-based Git repository hosting, collaboration, and DevOps platform. It combines Git version control with **GitHub Actions** (CI/CD), **GitHub Packages**, **Dependabot**, **CodeQL**, and project management tools.

---

## **1. Core Platform Architecture**

| Feature | Description |
| --- | --- |
| **GitHub Actions** | Native CI/CD workflow automation platform running on cloud-hosted or self-hosted runners. |
| **GitHub Packages (ghcr.io)** | Package and OCI-compliant container registry hosting Docker images, npm, Maven, and NuGet packages. |
| **Dependabot** | Automated dependency updates and security vulnerability PRs. |
| **CodeQL & Secret Scanning** | Semantic static code analysis (SAST) and real-time push protection against leaked credentials. |
| **GitHub CLI (`gh`)** | The official command-line interface bringing pull requests, issues, releases, and actions to your terminal. |

---

## **2. SSH Keys & Authentication**

### 🔹 Generate Modern Ed25519 Key

Ed25519 is the modern cryptographic standard, providing faster operations and stronger security than legacy RSA:

```bash
# Generate Ed25519 SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Add your public key (`cat ~/.ssh/id_ed25519.pub`) to GitHub:
1. Go to **Settings** → **SSH and GPG keys** → **New SSH key**.
2. Test authentication:
   ```bash
   ssh -T git@github.com
   ```

---

## **3. Modern Git Commands & Daily Workflows**

Git 2.23+ introduced modern porcelain commands that replace overloaded legacy `git checkout`:

```bash
# Clone a repository
git clone git@github.com:owner/repo.git
cd repo

# Switch to or create a new branch (modern syntax)
git switch -c feature/auth-service

# Switch back to main
git switch main

# Discard uncommitted changes in working directory (modern syntax)
git restore src/index.ts

# Unstage a file without resetting working copy
git restore --staged src/index.ts

# Interactive rebase of the last 3 commits
git rebase -i HEAD~3

# Stash current work including untracked files
git stash push -u -m "WIP on auth"
git stash pop
```

---

## **4. GitHub Actions (Modern CI/CD Workflows)**

Workflows reside under `.github/workflows/*.yml`.

### 🔹 Production Workflow: Matrix Builds, Caching & Concurrency

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Cancel in-flight runs on the same branch when a new commit is pushed
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    name: Test on Node ${{ matrix.node-version }} - ${{ matrix.os }}
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest]
        node-version: [18.x, 20.x, 22.x]

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js with Native Caching
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter
        run: npm run lint

      - name: Run Test Suite
        run: npm test -- --coverage

      - name: Upload Test Coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-${{ matrix.node-version }}
          path: coverage/
```

### 🔹 Deployment with Environments & Approvals

```yaml
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://my-app.example.com
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Cloud
        env:
          API_SECRET: ${{ secrets.PROD_API_KEY }}
        run: ./scripts/deploy.sh
```

---

## **5. GitHub Container Registry (ghcr.io)**

Build and push OCI container images directly within GitHub Actions using the automatic `GITHUB_TOKEN`:

```yaml
- name: Log in to GHCR
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Build and Push Docker Image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: ghcr.io/${{ github.repository }}:${{ github.sha }},ghcr.io/${{ github.repository }}:latest
```

---

## **6. GitHub CLI (`gh`) Everyday Workflows**

```bash
# 1. Authenticate with GitHub CLI
gh auth login

# 2. Clone a repository
gh repo clone owner/repository

# 3. Create a Pull Request interactively or via browser
gh pr create --title "feat: Add billing service" --body "Fixes #45"
gh pr create --web

# 4. Checkout a Pull Request locally for code review
gh pr checkout 102

# 5. Review and approve a Pull Request
gh pr review --approve -b "LGTM!"

# 6. Merge a Pull Request with squash
gh pr merge 102 --squash --delete-branch

# 7. Watch a running GitHub Actions pipeline in real time
gh run watch

# 8. Set an action secret in the repository
gh secret set AWS_SECRET_KEY --body "supersecret123"

# 9. Create a new GitHub Release with release notes
gh release create v1.2.0 --generate-notes
```

---

## **7. Security: CodeQL, Secret Scanning & Dependabot**

### 🔹 Automated Dependency Updates (`.github/dependabot.yml`)

```yaml
version: 2
updates:
  # Maintain npm dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "devops-team"

  # Maintain GitHub Actions versions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
```

### 🔹 Secret Scanning & Push Protection

* **Secret Scanning**: Scans commits for exposed API keys, private certificates, and tokens.
* **Push Protection**: Blocks developers from pushing commits containing known secret formats directly to GitHub.

### 🔹 CodeQL SAST Analysis

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v3
  with:
    languages: 'javascript-typescript'

- name: Perform CodeQL Analysis
  uses: github/codeql-action/analyze@v3
```

---

## **8. Production Best Practices**

1. **Enforce Branch Protection Rules / Rulesets**:
   * Require pull request reviews before merging (minimum 1-2 approvals).
   * Require status checks to pass (CI tests, CodeQL, linting).
   * Require signed commits (`git commit -S`).
   * Require linear history (Squash or Rebase merges).
2. **Use Fine-Grained Personal Access Tokens (PATs)**: Scope access to specific repositories and minimal permissions.
3. **Pin GitHub Actions to Full Commit SHAs**: Prevent supply chain attacks by pinning third-party actions:
   ```yaml
   uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
   ```
4. **Use PR Issue Closing Keywords**: Use `Fixes #12` or `Closes #12` in PR descriptions to automatically close linked issues upon merge.

---

## 📚 **Learning Resources**

* 🔗 [Official GitHub Documentation](https://docs.github.com/)
* 📦 [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
* 💻 [GitHub CLI (`gh`) Manual](https://cli.github.com/manual/)
* 🛡️ [GitHub Advanced Security Overview](https://docs.github.com/en/code-security)
