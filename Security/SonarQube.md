# SonarQube Cheatsheet

![text](https://imgur.com/l49w71S.png)

**1. Introduction:**

- **SonarQube** is a popular open-source platform for continuous inspection of code quality, performing automatic reviews with static analysis of code to detect bugs, code smells, and security vulnerabilities.

**2. Installation:**

- **Installing SonarQube:**
  - On Docker:

    ```bash
    docker run -d --name sonarqube -p 9000:9000 sonarqube
    ```

  - Manual Installation on Linux:

    ```bash
    wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-8.9.0.43852.zip
    unzip sonarqube-8.9.0.43852.zip
    cd sonarqube-8.9.0.43852/bin/linux-x86-64
    ./sonar.sh start
    ```

- **Starting SonarQube:**
  - Access SonarQube at `http://localhost:9000`.
  - Default credentials: `admin/admin`.

**3. Configuring SonarQube:**

- **Database Configuration:**
  - SonarQube requires a database like PostgreSQL, MySQL, or Oracle.
  - Configure the database connection in the `sonar.properties` file:

    ```properties
    sonar.jdbc.url=jdbc:postgresql://localhost/sonarqube
    sonar.jdbc.username=sonar
    sonar.jdbc.password=sonar
    ```

- **Configuring Quality Profiles:**
  - Quality profiles define the set of rules SonarQube uses for code analysis.
  - Create or customize profiles in the **Quality Profiles** section of the UI.

**4. Running Analysis:**

- **Using SonarQube Scanner:**
  - Install the scanner:

    ```bash
    npm install -g sonarqube-scanner
    ```

  - Run a scan:

    ```bash
    sonar-scanner \
      -Dsonar.projectKey=my-project \
      -Dsonar.sources=. \
      -Dsonar.host.url=http://localhost:9000 \
      -Dsonar.login=admin \
      -Dsonar.password=admin
    ```

- **Integrating with CI/CD:**
  - Integrate SonarQube with Jenkins, GitLab CI, or other CI/CD tools to automate code analysis.

**5. SonarQube Plugins:**

- **Installing Plugins:**
  - Navigate to **Administration > Marketplace** in SonarQube and search for plugins.
  - Popular plugins include SonarLint, SonarCSS, and SonarTS.

- **SonarQube and IDE Integration:**
  - **SonarLint** is a plugin that integrates with IDEs like IntelliJ, Eclipse, and VS Code for real-time code quality feedback.

**6. Advanced Features:**

- **Code Coverage:**
  - SonarQube integrates with code coverage tools like Jacoco for Java and Istanbul for JavaScript to report on test coverage.

- **Security Vulnerabilities:**
  - SonarQube detects vulnerabilities and provides remediation guidance based on OWASP and SANS standards.

**7. Managing Users and Permissions:**

- **User Management:**
  - Add users and groups in the **Security** section.
  - Assign roles such as **Admin**, **User**, or **Code Viewer**.

- **LDAP/SSO Integration:**
  - Configure LDAP or SSO in `sonar.properties` for centralized user authentication.

**8. Monitoring and Reporting:**

- **Project Dashboards:**
  - SonarQube provides detailed dashboards for each project, showing metrics like code coverage, duplications, and issues over time.

- **Custom Reports:**
  - Generate custom reports with detailed metrics and trends for management or compliance purposes.

**9. Scaling SonarQube:**

- **High Availability:**
  - Run SonarQube in a cluster mode by configuring multiple nodes and a load balancer.
  - Configure the cluster settings in the `sonar.properties` file.

- **Optimizing Performance:**
  - Use a separate database for larger SonarQube deployments and allocate sufficient resources to the server.

**10. Troubleshooting SonarQube:**

- **Common Issues:**
  - **Out of Memory:** Increase JVM heap size in `sonar.properties`.
  - **Failed Scans:** Check the logs in `logs/` directory for detailed error messages.

- **Debugging:**
  - Enable debug logging in `sonar.properties`:

    ```properties
    sonar.log.level=DEBUG
    ```
