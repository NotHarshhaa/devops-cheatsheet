# 📊 SonarQube Cheatsheet

![text](https://imgur.com/l49w71S.png)

**SonarQube** is the industry-leading platform for continuous code quality and Static Application Security Testing (SAST). It detects bugs, vulnerabilities, and code smells across 30+ programming languages, enforcing the **"Clean as You Code"** methodology to keep technical debt out of production.

---

## **1. Core Concepts & Terminology**

| Concept | Description |
| --- | --- |
| **Clean as You Code** | Focuses on maintaining high standards on **New Code** rather than remediating legacy debt. |
| **Quality Gate** | A pass/fail condition enforced in CI/CD pipelines before code is merged into main branches. |
| **Quality Profile** | The collection of active static analysis rules applied to a specific programming language. |
| **Security Hotspots** | Security-sensitive code areas requiring human review before approval. |
| **Vulnerabilities** | Confirmed flaws that compromise software security (OWASP Top 10, CWE, SANS). |

---

## **2. Installation & Quickstart**

### 🔹 Run with Docker (Community Edition)

```bash
docker run -d \
  --name sonarqube \
  -p 9000:9000 \
  -e SONAR_JDBC_URL=jdbc:postgresql://postgres:5432/sonar \
  -e SONAR_JDBC_USERNAME=sonar \
  -e SONAR_JDBC_PASSWORD=sonar \
  sonarqube:community
```

Default credentials: `admin` / `admin` (forced change on first login).

> [!IMPORTANT]
> **Supported Databases**: SonarQube supports **PostgreSQL**, **Microsoft SQL Server**, and **Oracle**. *(MySQL support was discontinued in SonarQube 7.9+).*

### 🔹 Linux Host Kernel Requirements

Because SonarQube embeds Elasticsearch, you must increase the virtual memory map count on the host:

```bash
# Set runtime parameter
sudo sysctl -w vm.max_map_count=262144

# Persist across reboots in /etc/sysctl.conf
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf
```

---

## **3. Scanner Configuration (`sonar-project.properties`)**

Place `sonar-project.properties` in your repository root:

```properties
# Project identification
sonar.projectKey=my-org_my-service
sonar.projectName=My Microservice
sonar.projectVersion=1.0.0

# Source and test directories
sonar.sources=src
sonar.tests=test
sonar.sourceEncoding=UTF-8

# Exclusions
sonar.exclusions=**/node_modules/**,**/build/**,**/dist/**,**/*.spec.ts

# Test coverage reports (Jest / Istanbul example)
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Clean Code Quality Gate parameter
sonar.qualitygate.wait=true
```

---

## **4. Running Scans via CLI**

> [!NOTE]
> Modern SonarQube (v9.x/10.x+) uses **Analysis Tokens** (`sonar.token`) instead of username/password.

```bash
# Using modern sonar-scanner CLI
sonar-scanner \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=sqa_0123456789abcdef0123456789abcdef01234567

# Using Maven (Java)
mvn clean verify sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=$SONAR_TOKEN

# Using Gradle (Java/Kotlin)
./gradlew sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=$SONAR_TOKEN
```

---

## **5. CI/CD Pipeline Integrations**

### 🔹 GitHub Actions Workflow

```yaml
name: SonarQube Analysis
on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history is required for accurate blame info

      - name: Run SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}

      - name: Enforce Quality Gate Status
        uses: SonarSource/sonarqube-quality-gate-action@master
        timeout-minutes: 5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### 🔹 GitLab CI Pipeline (`.gitlab-ci.yml`)

```yaml
stages:
  - test
  - sonarqube

sonarqube-check:
  stage: sonarqube
  image:
    name: sonarsource/sonar-scanner-cli:latest
    entrypoint: [""]
  variables:
    SONAR_USER_HOME: "${CI_PROJECT_DIR}/.sonar"
    GIT_DEPTH: "0"
  cache:
    key: "${CI_JOB_NAME}"
    paths:
      - .sonar/cache
  script:
    - sonar-scanner -Dsonar.qualitygate.wait=true
  only:
    - merge_requests
    - main
```

---

## **6. Quality Gates & "Clean as You Code"**

A standard production Quality Gate enforces the following on **New Code**:

1. **0 New Security Vulnerabilities**
2. **0 New Bugs**
3. **Security Hotspots Reviewed**: 100%
4. **Code Coverage on New Code**: ≥ 80.0%
5. **Duplicated Lines on New Code**: ≤ 3.0%

Failing any of these conditions causes `-Dsonar.qualitygate.wait=true` to exit with an error code, automatically blocking the PR from merging.

---

## **7. IDE Integration: SonarLint**

Install the **SonarLint** extension in VS Code, IntelliJ, or Eclipse:

* **Connected Mode**: Syncs your local IDE rules with the central SonarQube server's active Quality Profile.
* **Instant Detection**: Highlights bugs, code smells, and security hotspots as you type before committing to Git.

---

## 📚 **Learning Resources**

* 🔗 [Official SonarQube Documentation](https://docs.sonarsource.com/sonarqube/latest/)
* 📦 [SonarQube Scanner CLI](https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/scanners/sonar-scanner/)
* 🛡️ [Clean as You Code Principles](https://www.sonarsource.com/clean-code/clean-as-you-code/)
