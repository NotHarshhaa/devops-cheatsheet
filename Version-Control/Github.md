# Github Cheatsheet

![text](https://imgur.com/c189VXy.png)

**GitHub** is a powerful platform for version control, collaboration, CI/CD automation, and DevOps workflows. This cheatsheet provides an in-depth guide to using GitHub, covering basic operations to advanced features.

---

## 1. **Introduction to GitHub**

### What is GitHub?

GitHub is a web-based platform that uses Git for version control and provides tools for:

- Collaborative software development
- CI/CD automation
- Project management
- Code review and DevOps integration

### Key Features

- **Git Repositories**: Centralized code hosting with Git.
- **Collaboration**: Pull requests, code reviews, and discussions.
- **Actions**: Automate workflows with GitHub Actions.
- **Project Management**: Boards, issues, and milestones for agile workflows.
- **Security**: Dependabot alerts and code scanning for vulnerabilities.

---

## 2. **Getting Started**

### Creating an Account

1. Sign up at [GitHub](https://github.com/).
2. Create or join an organization for team collaboration.

### Adding SSH Keys

1. Generate an SSH key:

   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```

2. Add the key to your GitHub account:
   - Go to **Settings** → **SSH and GPG keys** → Add Key.

### Creating a Repository

1. Go to **Repositories** → **New**.
2. Configure repository name, description, and visibility.
3. Add a `.gitignore` file or license if needed.

---

## 3. **Basic GitHub Operations**

### Cloning a Repository

```bash
git clone git@github.com:username/repository.git
```

### Committing and Pushing Changes

```bash
# Stage changes
git add .
# Commit changes
git commit -m "Initial commit"
# Push changes
git push origin main
```

### Pulling Changes

```bash
git pull origin main
```

---

## 4. **Branching and Merging**

### Creating and Switching Branches

```bash
# Create a new branch
git checkout -b feature-branch
# Switch to an existing branch
git checkout main
```

### Pushing a Branch

```bash
git push origin feature-branch
```

### Merging Branches

1. Open a **Pull Request** on GitHub:
   - Navigate to the repository → **Pull Requests** → **New Pull Request**.
2. Review and merge changes.

### Deleting a Branch

```bash
# Delete locally
git branch -d feature-branch
# Delete on remote
git push origin --delete feature-branch
```

---

## 5. **GitHub Issues and Project Boards**

### Creating an Issue

1. Go to **Issues** → **New Issue**.
2. Add title, description, and assign labels or assignees.

### Automating Project Boards

- **Add Issues Automatically**:
  1. Go to the project board.
  2. Set up automation rules like "Add issues in progress."

### Linking Pull Requests to Issues

Use keywords in PR descriptions:

```text
Fixes #issue_number
Closes #issue_number
```

---

## 6. **GitHub Actions (CI/CD)**

GitHub Actions is a workflow automation tool for CI/CD.

### Basics of `.github/workflows/<workflow>.yml`

#### Example Workflow:

```yaml
name: CI Pipeline

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      - name: Install Dependencies
        run: npm install
      - name: Run Tests
        run: npm test
```

### Workflow Triggers

- **push**: Runs the workflow when a commit is pushed.
- **pull_request**: Triggers on pull requests.
- **schedule**: Triggers on a cron schedule.

### Managing Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**.
2. Add variables like `AWS_ACCESS_KEY_ID` or `DOCKER_PASSWORD`.

### Example with Secrets

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AWS
        run: aws s3 sync ./build s3://my-bucket
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

---

## 7. **GitHub Packages**

### Using GitHub as a Docker Registry

1. Authenticate:

   ```bash
   docker login ghcr.io -u USERNAME -p TOKEN
   ```

2. Build and Push:

   ```bash
   docker build -t ghcr.io/username/image-name:tag .
   docker push ghcr.io/username/image-name:tag
   ```

### Installing from GitHub Packages

- Add dependency in `package.json` (Node.js):

  ```json
  "dependencies": {
    "package-name": "github:username/repository"
  }
  ```

---

## 8. **Advanced GitHub Features**

### Protecting Branches

1. Go to **Settings** → **Branches**.
2. Enable branch protection rules (e.g., prevent force-pushes, require PR reviews).

### Code Review Automation

- Use GitHub Apps like **CodeCov** or **LGTM** for automated code review.

### Dependency Management with Dependabot

1. Enable Dependabot under **Insights** → **Dependency Graph**.
2. Dependabot creates pull requests to update outdated dependencies.

---

## 9. **GitHub Security**

### Code Scanning

1. Enable **Code Scanning Alerts** under **Security**.
2. Include scanning actions in workflows:

   ```yaml
   - name: CodeQL Analysis
     uses: github/codeql-action/analyze@v2
   ```

### Secret Scanning

- GitHub scans public repositories for leaked secrets and alerts the repository owner.

### Enabling 2FA

1. Go to **Settings** → **Account Security** → Enable Two-Factor Authentication.

---

## 10. **GitHub CLI (gh)**

### Installing GitHub CLI

```bash
brew install gh  # macOS
sudo apt install gh  # Linux
```

### Authenticating

```bash
gh auth login
```

### Common Commands

- Clone a Repository:

  ```bash
  gh repo clone username/repository
  ```

- Create a Pull Request:

  ```bash
  gh pr create --title "Feature Update" --body "Details of PR"
  ```

- List Issues:

  ```bash
  gh issue list
  ```

---

## 11. **GitHub API**

### Using the API

Authenticate using a personal access token:

```bash
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user/repos
```

### Example: Creating an Issue

```bash
curl -X POST -H "Authorization: token YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{"title": "Bug Report", "body": "Description of the bug"}' \
https://api.github.com/repos/username/repository/issues
```

---

## 12. **GitHub Best Practices**

- **Use Descriptive Commit Messages**:

  ```text
  Fix bug in login page #123
  ```

- **Enable Branch Protections** to enforce review processes.
- **Automate Testing** using GitHub Actions for pull requests.
- **Use Issues and Labels** for effective project tracking.

---

## References and Resources

1. [GitHub Documentation](https://docs.github.com/)
2. [GitHub CLI Documentation](https://cli.github.com/manual/)
3. [GitHub Actions Guide](https://docs.github.com/en/actions)
