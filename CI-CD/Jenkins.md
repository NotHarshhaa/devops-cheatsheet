# Jenkins Cheatsheet

![](https://imgur.com/jWGs9lH.png)

**1. Introduction:**

- Jenkins is an open-source automation server that helps automate parts of software development related to building, testing, and deploying, facilitating continuous integration and delivery.

**2. Installation:**

- **Docker Installation:**

  ```bash
  docker run -d -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts
  ```

- **Direct Installation:**

  - **For Ubuntu/Debian:**

    ```bash
    wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
    sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
    sudo apt update
    sudo apt install jenkins
    ```

  - **For CentOS/RHEL:**

    ```bash
    sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
    sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
    sudo yum install jenkins
    ```

- **Access Jenkins:**
  - Visit `http://localhost:8080` in your web browser.

**3. Jenkins Pipeline:**

- **Declarative Pipeline:**

  ```groovy
  pipeline {
      agent any
      environment {
          MY_VAR = "value"
      }
      stages {
          stage('Checkout') {
              steps {
                  checkout scm
              }
          }
          stage('Build') {
              steps {
                  sh 'make'
              }
          }
          stage('Test') {
              steps {
                  sh 'make test'
              }
          }
          stage('Deploy') {
              steps {
                  sh 'make deploy'
              }
          }
      }
      post {
          success {
              echo 'Pipeline completed successfully!'
          }
          failure {
              echo 'Pipeline failed.'
          }
      }
  }
  ```

- **Scripted Pipeline:**

  ```groovy
  node {
      stage('Checkout') {
          checkout scm
      }
      stage('Build') {
          sh 'make'
      }
      stage('Test') {
          sh 'make test'
      }
      stage('Deploy') {
          sh 'make deploy'
      }
  }
  ```

**4. Common Jenkins Commands:**

- **Restart Jenkins:**

  ```bash
  sudo systemctl restart jenkins
  ```

- **Manage Jenkins from CLI:**

  ```bash
  java -jar jenkins-cli.jar -s http://localhost:8080/ list-jobs
  ```

**5. Useful Jenkins Plugins:**

- **Blue Ocean:** Modern UI for Jenkins pipelines.
- **Git:** Integrate Git version control into Jenkins.
- **Pipeline:** Enables Pipeline as Code.
- **Credentials Binding:** Securely manage credentials.
- **SonarQube Scanner:** Integrate code quality checks.
- **Slack Notification:** Send pipeline status notifications to Slack.

**6. Best Practices:**

- **Pipeline as Code:** Always use Jenkins Pipelines defined in `Jenkinsfile` for consistent and version-controlled builds.
- **Use Parameters:** Use parameters to make your pipelines flexible and reusable.

  ```groovy
  parameters {
      string(name: 'ENV', defaultValue: 'dev', description: 'Environment')
  }
  ```

- **Secure Jenkins:** Regularly update plugins, use RBAC, and secure the Jenkins instance with HTTPS.

**7. Jenkins Configuration:**

- **Manage Jenkins:**
  - Manage and configure global settings from the Jenkins dashboard under **Manage Jenkins**.
- **Configure Tools:** Set up JDK, Maven, and other tools globally in **Global Tool Configuration**.
- **Jenkinsfile Configuration:**
  - Define your pipeline stages, environment, and agents within a `Jenkinsfile` stored in your repository.

**8. Advanced Jenkins:**

- **Parallel Stages:**

  ```groovy
  pipeline {
      agent any
      stages {
          stage('Parallel') {
              parallel {
                  stage('Unit Tests') {
                      steps {
                          sh 'make test'
                      }
                  }
                  stage('Integration Tests') {
                      steps {
                          sh 'make integration-test'
                      }
                  }
              }
          }
      }
  }
  ```

- **Shared Libraries:** Centralize and reuse pipeline code across projects using Shared Libraries.

## **Troubleshooting**

### **Common Issues**

1. **Jenkins Won't Start**
   ```bash
   # Check logs
   sudo tail -f /var/log/jenkins/jenkins.log
   
   # Check permissions
   sudo chown -R jenkins:jenkins /var/lib/jenkins
   ```

2. **Pipeline Failure**
   ```groovy
   // Add error handling
   pipeline {
       agent any
       stages {
           stage('Build') {
               steps {
                   script {
                       try {
                           sh 'make build'
                       } catch (exc) {
                           echo 'Build failed!'
                           throw exc
                       }
                   }
               }
           }
       }
   }
   ```

3. **Plugin Issues**
   - Clear plugin cache:
     ```bash
     rm -rf $JENKINS_HOME/plugins/*.jpi
     rm -rf $JENKINS_HOME/plugins/*.hpi
     ```
   - Restart Jenkins after plugin updates

## **Useful Plugins**

1. **Pipeline**
   - Pipeline Graph View
   - Pipeline Stage View
   - Blue Ocean

2. **Source Control**
   - Git
   - GitHub Integration
   - BitBucket Integration

3. **Build Tools**
   - Maven Integration
   - Gradle
   - NodeJS

4. **Testing**
   - JUnit
   - Cobertura
   - SonarQube Scanner

5. **Deployment**
   - Docker
   - Kubernetes
   - AWS
