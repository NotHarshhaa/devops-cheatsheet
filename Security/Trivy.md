# Trivy Cheatsheet

![text](https://imgur.com/TYu7qw7.png)

**1. Introduction:**

- **Trivy** is a comprehensive and easy-to-use security scanner for container images, file systems, and Git repositories, detecting vulnerabilities, misconfigurations, and secrets.

**2. Installation:**

- **Installing Trivy:**
  - On macOS using Homebrew:

    ```bash
    brew install aquasecurity/trivy/trivy
    ```

  - On Linux:

    ```bash
    sudo apt-get install wget apt-transport-https gnupg lsb-release
    wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
    echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list
    sudo apt-get update
    sudo apt-get install trivy
    ```

  - On Windows:
    - Download the binary from the [GitHub releases](https://github.com/aquasecurity/trivy/releases).

**3. Basic Usage:**

- **Scanning a Docker Image:**

  ```bash
  trivy image nginx:latest
  ```

  - This command scans the `nginx:latest` Docker image for known vulnerabilities.

- **Scanning a File System:**

  ```bash
  trivy fs /path/to/directory
  ```

  - This command scans the specified directory for vulnerabilities and misconfigurations.

- **Scanning a Git Repository:**

  ```bash
  trivy repo https://github.com/user/repository
  ```

  - This command scans the entire GitHub repository for vulnerabilities.

**4. Scanning Options:**

- **Severity Levels:**
  - Filter results based on severity:

    ```bash
    trivy image --severity HIGH,CRITICAL nginx:latest
    ```

  - This command limits the output to high and critical vulnerabilities only.

- **Ignore Unfixed Vulnerabilities:**

  ```bash
  trivy image --ignore-unfixed nginx:latest
  ```

  - Excludes vulnerabilities that have no known fixes.

- **Output Formats:**
  - JSON:

    ```bash
    trivy image -f json -o results.json nginx:latest
    ```

  - Table (default):

    ```bash
    trivy image -f table nginx:latest
    ```

**5. Advanced Usage:**

- **Customizing Vulnerability Database Update:**

  ```bash
  trivy image --skip-update nginx:latest
  ```

  - Skips updating the vulnerability database before scanning.

- **Using Trivy with Docker:**
  - Running Trivy as a Docker container:

    ```bash
    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image nginx:latest
    ```

  - Scanning an image by directly pulling it from a registry:

    ```bash
    trivy image --docker-username <username> --docker-password <password> myregistry.com/myimage:tag
    ```

- **Trivy in CI/CD Pipelines:**
  - Integrate Trivy into CI/CD workflows to automate vulnerability scanning during build stages.

**6. Trivy Misconfiguration Detection:**

- **Scanning for Misconfigurations:**

  ```bash
  trivy config /path/to/configuration/files
  ```

  - Scans configuration files (e.g., Kubernetes, Terraform) for security misconfigurations.

**7. Trivy and Secrets Detection:**

- **Scanning for Secrets:**

  ```bash
  trivy fs --security-checks secrets /path/to/code
  ```

  - Detects hardcoded secrets like passwords, API keys, and tokens within the codebase.

**8. Integration with Other Tools:**

- **Trivy and Harbor:**
  - Trivy can be used as a vulnerability scanner within [Harbor](https://goharbor.io/), a cloud-native registry.

- **Trivy and Kubernetes:**
  - Trivy can scan Kubernetes resources for vulnerabilities and misconfigurations.

**9. Trivy Reports:**

- **Generating Reports:**
  - HTML Report:

    ```bash
    trivy image -f json -o report.json nginx:latest
    trivy report --input report.json --format html --output report.html
    ```

  - Detailed Reports with Severity Breakdown:

    ```bash
    trivy image --severity HIGH,CRITICAL --format table nginx:latest
    ```

**10. Troubleshooting Trivy:**

- **Common Issues:**
  - **Slow Scans:** Consider skipping database updates if they are not necessary.
  - **Network Issues:** Ensure your network allows access to Trivy’s vulnerability database.

- **Debugging:**
  - Use the `--debug` flag to see detailed logs:

    ```bash
    trivy image --debug nginx:latest
    ```
