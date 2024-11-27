# BitBucket Cheatsheet

![text](https://imgur.com/7PDN0aZ.png)

Bitbucket, developed by Atlassian, is a Git-based source code repository hosting service. It is designed for teams and provides strong integration with other Atlassian tools like Jira, Trello, and Confluence. This cheatsheet provides a detailed guide for mastering Bitbucket from basic operations to advanced features.

---

## **1. Introduction to Bitbucket**

### What is Bitbucket?

- Bitbucket is a Git-based platform for version control, CI/CD pipelines, and project collaboration.
- It supports both **private** and **public repositories**.
- Known for its seamless integration with Atlassian tools (e.g., Jira) and in-built CI/CD pipelines.

### Key Features

- Git repository hosting
- In-built CI/CD via **Bitbucket Pipelines**
- Jira integration for issue tracking
- Branch permissions and code review tools
- Supports Mercurial (deprecated)

---

## **2. Getting Started**

### Creating a Bitbucket Account

1. Go to [Bitbucket](https://bitbucket.org/) and sign up for an account.
2. Optionally, link your Atlassian account for better integration.

### Setting Up SSH Keys

1. Generate an SSH key:

   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```

2. Add the public key to Bitbucket:
   - Navigate to **Personal Settings** → **SSH Keys** → **Add Key**.

### Creating a Repository

1. Log in to Bitbucket.
2. Go to **Repositories** → **Create Repository**.
3. Configure:
   - Repository Name
   - Access level (Private/Public)
   - Repository Type (Git)

---

## **3. Basic Operations**

### Cloning a Repository

```bash
git clone git@bitbucket.org:username/repository.git
```

### Staging, Committing, and Pushing

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

## **4. Branching and Merging**

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

### Creating a Pull Request (PR)

1. Open Bitbucket and navigate to **Pull Requests**.
2. Click **Create Pull Request**.
3. Select branches, add reviewers, and provide a description.

### Merging Pull Requests

1. Approve the PR.
2. Merge using the options:
   - **Merge Commit**: Keeps all commits intact.
   - **Squash Merge**: Combines all commits into one.
   - **Rebase**: Rewrites commit history.

---

## **5. Bitbucket Pipelines (CI/CD)**

### Overview

Bitbucket Pipelines is an integrated CI/CD service to automate builds, tests, and deployments.

### Enabling Pipelines

1. Go to the repository settings → **Pipelines**.
2. Enable Pipelines and configure the `.bitbucket-pipelines.yml` file.

### Sample Pipeline Configuration

```yaml
pipelines:
  default:
    - step:
        name: Build and Test
        image: node:14
        script:
          - npm install
          - npm test
    - step:
        name: Deploy to Production
        script:
          - echo "Deploying to production..."
```

### Key Triggers

- **default**: Runs on any branch when pushed.
- **branches**: Customizes triggers for specific branches.
- **tags**: Automates deployment for version tags.

### Variables and Secrets

1. Go to **Repository Settings** → **Pipelines** → **Environment Variables**.
2. Add sensitive variables like `AWS_ACCESS_KEY`.

#### Using Variables in Pipelines

```yaml
script:
  - echo "Using secret: $AWS_ACCESS_KEY"
```

---

## **6. Branch Permissions and Access Control**

### Branch Permissions

1. Go to **Repository Settings** → **Branch Permissions**.
2. Add rules such as:
   - Prevent direct pushes to `main`.
   - Require at least 2 code reviews before merging.

### User Roles

- **Admin**: Full control over repositories and permissions.
- **Write**: Can push and pull code.
- **Read**: Read-only access to repositories.

---

## **7. Integration with Jira**

### Linking a Repository to Jira

1. Go to **Repository Settings** → **Jira Settings**.
2. Connect the repository to a Jira project.

### Automating Issue Tracking

- Add Jira issue keys in commit messages:

  ```text
  PROJ-123: Fix login page bug
  ```

- Jira automatically links commits, pull requests, and deployments.

---

## **8. Code Review and Quality**

### Using Pull Requests for Code Review

1. Assign reviewers while creating a pull request.
2. Add comments inline to highlight issues.

### Integrating Code Quality Tools

- Add tools like **SonarCloud** or **CodeClimate** to your pipelines for static code analysis.
- Example: Adding SonarCloud to Bitbucket Pipelines:

  ```yaml
  - pipe: sonarsource/sonarcloud-scan:1.4.0
    variables:
      SONAR_TOKEN: $SONAR_TOKEN
  ```

---

## **9. Bitbucket API**

### Authenticating

Generate a personal access token:

1. Go to **Personal Settings** → **Access Management** → **Create App Password**.

Use the token in API calls:

```bash
curl -u username:app_password https://api.bitbucket.org/2.0/repositories
```

### Common API Endpoints

- List repositories:

  ```bash
  curl -X GET https://api.bitbucket.org/2.0/repositories/{username}
  ```

- Create an issue:

  ```bash
  curl -X POST -u username:app_password \
  -H "Content-Type: application/json" \
  -d '{"title": "Bug in Login Page", "content": {"raw": "Description"}}' \
  https://api.bitbucket.org/2.0/repositories/{username}/{repo}/issues
  ```

---

## **10. Advanced Features**

### Deployments with Bitbucket Pipelines

Track deployment environments:

1. Go to **Deployments** → Configure environments (e.g., Dev, Staging, Prod).

Add deployment steps in `.bitbucket-pipelines.yml`:

```yaml
pipelines:
  branches:
    main:
      - step:
          name: Deploy to Staging
          deployment: staging
          script:
            - ./deploy.sh staging
```

### Monorepo Support

Host multiple services in one repository:

- Use Pipelines for individual service builds:

  ```yaml
  pipelines:
    default:
      - step:
          name: Build Service A
          script:
            - cd services/service-a && npm install && npm test
  ```

### Mirror Repositories

Mirror a repository between Bitbucket and GitHub:

```bash
git remote add bitbucket git@bitbucket.org:username/repo.git
git push bitbucket --mirror
```

---

## **11. Security and Best Practices**

### Enforcing Two-Factor Authentication (2FA)

1. Go to **Personal Settings** → **Security** → Enable 2FA.

### Secret Scanning

Bitbucket scans for hard-coded credentials and alerts users.

### Dependency Scanning

Use Atlassian tools like **Snyk** or **Dependabot** to identify vulnerabilities.

---

## **12. Best Practices**

1. **Branch Naming Convention**:
   - Use prefixes like `feature/`, `bugfix/`, and `release/`.

   ```text
   feature/add-login-form
   bugfix/fix-authentication-error
   ```

2. **Commit Messages**:
   - Follow a format like:

     ```text
     [PROJ-123] Fix bug in login functionality
     ```

   - Reference Jira issues in commit messages.

3. **Automate Everything**:
   - Use Pipelines for CI/CD.
   - Automate linting, testing, and deployment.

4. **Use Pull Request Templates**:
   - Add `.bitbucket/pull_request_template.md` to standardize PR descriptions.

---

## **13. References and Resources**

- [Bitbucket Documentation](https://bitbucket.org/product/)
- [Bitbucket API Documentation](https://developer.atlassian.com/bitbucket/api/2/reference/)
- [Pipelines Guide](https://bitbucket.org/product/features/pipelines)
