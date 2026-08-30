# 🔍 Trivy Cheatsheet

![text](https://imgur.com/TYu7qw7.png)

**Trivy** by Aqua Security is a comprehensive, blazing-fast security scanner for container images, file systems, Git repositories, virtual machine images, Kubernetes clusters, and AWS environments. It detects CVE vulnerabilities, infrastructure misconfigurations, exposed secrets, and license non-compliance.

---

## **1. Installation Quickstart**

### 🔹 Linux (Modern Debian / Ubuntu)

```bash
sudo apt-get install -y wget apt-transport-https gnupg
sudo mkdir -p /etc/apt/keyrings
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | sudo tee /etc/apt/keyrings/trivy.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee -a /etc/apt/sources.list.d/trivy.list

sudo apt-get update
sudo apt-get install -y trivy
```

### 🔹 macOS & Docker

```bash
# macOS via Homebrew
brew install trivy

# Run directly via Docker (no local installation)
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/Library/Caches:/root/.cache/ aquasec/trivy:latest image nginx:latest
```

---

## **2. Core Scanning Targets**

```bash
# 1. Scan a Container Image
trivy image nginx:alpine

# 2. Scan a Local Filesystem / Source Code
trivy fs /path/to/project

# 3. Scan a Remote Git Repository
trivy repo https://github.com/org/repo

# 4. Scan Infrastructure as Code (Terraform, CloudFormation, Dockerfile, K8s manifests)
trivy config ./infra/

# 5. Scan a Live Kubernetes Cluster
trivy k8s --report summary cluster
```

---

## **3. Modern Scanning Options & Filters**

> [!TIP]
> Use `--scanners` to select target engines: `vuln` (CVEs), `misconfig` (IaC compliance), `secret` (leaked tokens), and `license`.

```bash
# Scan for vulnerabilities, misconfigurations, and secrets in one run
trivy fs --scanners vuln,misconfig,secret .

# Filter by severity (HIGH and CRITICAL only)
trivy image --severity HIGH,CRITICAL python:3.11-slim

# Filter out unpatchable vulnerabilities (show only actionable fixes)
trivy image --ignore-unfixed nginx:latest

# Fail the command with exit code 1 (ideal for CI/CD pipelines)
trivy image --exit-code 1 --severity CRITICAL nginx:latest
```

---

## **4. Software Bill of Materials (SBOM)**

Trivy generates and scans industry-standard SBOM formats (SPDX and CycloneDX):

```bash
# Generate a CycloneDX SBOM in JSON
trivy image --format cyclonedx --output sbom-cyclonedx.json node:18-alpine

# Generate an SPDX SBOM in JSON
trivy image --format spdx-json --output sbom-spdx.json node:18-alpine

# Scan an existing SBOM file for newly disclosed vulnerabilities
trivy sbom sbom-cyclonedx.json
```

---

## **5. Ignoring Known / Accepted Vulnerabilities (`.trivyignore`)**

Create a `.trivyignore` file in the root of your project to suppress false positives or accepted risks:

```text
# Ignore specific CVEs with reason and expiry date
# Accepted risk until upgrade next sprint
CVE-2023-12345
CVE-2024-54321 exp:2026-10-01

# Ignore specific paths from secret scanning
path:tests/fixtures/mock_keys.pem
```

Execute scan with ignore file:

```bash
trivy image --ignorefile .trivyignore my-app:latest
```

---

## **6. CI/CD Integration Examples**

### 🔹 GitHub Actions Workflow

```yaml
name: Security Scan
on: [push, pull_request]

jobs:
  trivy-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build Container Image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Run Trivy Vulnerability Scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:${{ github.sha }}'
          format: 'table'
          exit-code: '1'
          ignore-unfixed: true
          vuln-type: 'os,library'
          severity: 'CRITICAL,HIGH'
```

### 🔹 GitLab CI (`.gitlab-ci.yml`)

```yaml
trivy_scan:
  stage: test
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  script:
    - trivy fs --exit-code 1 --severity CRITICAL --scanners vuln,secret .
```

---

## **7. Output Formats & Reporting**

```bash
# Output as JSON
trivy image -f json -o scan-results.json nginx:latest

# Output as SARIF (for GitHub Security Tab integration)
trivy image -f sarif -o results.sarif nginx:latest

# Generate an HTML report using a template
trivy image --format template --template "@contrib/html.tpl" -o report.html nginx:latest
```

---

## **8. Cache Maintenance**

Trivy automatically downloads and updates its vulnerability database. Manage disk usage with:

```bash
# Clear all cached vulnerability databases and image layers
trivy clean --all

# Clear only the vulnerability database
trivy clean --scan-cache
```

---

## 📚 **Learning Resources**

* 🔗 [Official Trivy Documentation](https://aquasecurity.github.io/trivy/latest/)
* 📦 [Trivy GitHub Repository](https://github.com/aquasecurity/trivy)
* 🛡️ [Trivy CI/CD Integration Guides](https://aquasecurity.github.io/trivy/latest/docs/integrations/github-actions/)
