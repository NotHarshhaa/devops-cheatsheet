# Jenkins Cheatsheet

![](https://imgur.com/jWGs9lH.png)

## 1. Introduction

**Jenkins** is an open-source automation server enabling developers around the world to reliably build, test, and deploy their software. With thousands of plugins, Jenkins is widely utilized for orchestrating complex enterprise CI/CD pipelines.

---

## 2. Modern Installation

> [!IMPORTANT]
> Modern Jenkins requires **Java 17 or Java 21 LTS**. Support for Java 8 and Java 11 has been retired. Deprecated `apt-key add` has been replaced by the official `/etc/apt/keyrings` workflow.

### Running with Docker (Recommended)

```bash
docker run -d \
  --name jenkins \
  --restart=unless-stopped \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts-jdk17
```

### Ubuntu / Debian (Modern Keyring Method)

```bash
# Install Java 17 LTS
sudo apt update && sudo apt install -y fontconfig openjdk-17-jre curl

# Import official Jenkins GPG key into keyrings
sudo mkdir -p /etc/apt/keyrings
sudo curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /etc/apt/keyrings/jenkins-keyring.asc > /dev/null

# Add Jenkins repository
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install & start service
sudo apt update
sudo apt install -y jenkins
sudo systemctl enable --now jenkins
```

---

## 3. Declarative Pipeline (`Jenkinsfile`)

Declarative syntax provides a clean, robust, and version-controlled structure with built-in validation.

```groovy
pipeline {
    agent any

    options {
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '30'))
        timestamps()
    }

    environment {
        APP_NAME    = 'order-service'
        DOCKER_REG  = 'ghcr.io/my-org'
        IMAGE_TAG   = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
    }

    parameters {
        choice(name: 'ENVIRONMENT', choices: ['staging', 'production'], description: 'Deploy target')
        booleanParam(name: 'RUN_INTEGRATION_TESTS', defaultValue: true, description: 'Execute integration suite?')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Unit Test') {
            steps {
                sh 'npm ci'
                sh 'npm run test:ci'
            }
            post {
                always {
                    junit 'junit.xml'
                }
            }
        }

        stage('Parallel Quality Checks') {
            parallel {
                stage('Code Linter') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('Security Audit') {
                    steps {
                        sh 'npm audit --audit-level=high'
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-registry-creds',
                                                  usernameVariable: 'REG_USER',
                                                  passwordVariable: 'REG_PASS')]) {
                    sh '''
                        echo "$REG_PASS" | docker login "$DOCKER_REG" -u "$REG_USER" --password-stdin
                        docker build -t "$DOCKER_REG/$APP_NAME:$IMAGE_TAG" .
                        docker push "$DOCKER_REG/$APP_NAME:$IMAGE_TAG"
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            when {
                beforeAgent true
                branch 'main'
                expression { params.ENVIRONMENT == 'production' }
            }
            input {
                message 'Approve production deployment?'
                ok 'Deploy!'
            }
            steps {
                sh "./scripts/deploy.sh production ${DOCKER_REG}/${APP_NAME}:${IMAGE_TAG}"
            }
        }
    }

    post {
        always {
            cleanWs deleteDirs: true, notFailBuild: true
        }
        success {
            echo "Pipeline succeeded! Built image: ${IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed! Sending notification..."
        }
    }
}
```

---

## 4. Kubernetes Dynamic Pod Agents

Run CI/CD stages inside ephemeral Kubernetes pods that spin up on demand and terminate immediately upon stage completion:

```groovy
pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins-agent: node-build
spec:
  containers:
  - name: node
    image: node:20-alpine
    command: ['cat']
    tty: true
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command: ['cat']
    tty: true
'''
        }
    }

    stages {
        stage('Compile') {
            steps {
                container('node') {
                    sh 'node -v && npm ci && npm run build'
                }
            }
        }
    }
}
```

---

## 5. Jenkins Configuration as Code (JCasC)

Manage your entire Jenkins controller configuration via a version-controlled YAML file (`jenkins.yaml`):

```yaml
jenkins:
  systemMessage: "Managed by Infrastructure as Code (JCasC)"
  numExecutors: 0 # Controller does not execute builds directly
  mode: EXCLUSIVE
  securityRealm:
    local:
      allowsSignup: false
      users:
        - id: "admin"
          password: "${ADMIN_PASSWORD}"
  authorizationStrategy:
    roleBased:
      roles:
        global:
          - name: "admin"
            description: "Jenkins administrators"
            permissions:
              - "Overall/Administer"
            assignments:
              - "admin"

security:
  crumbIssuer:
    standard:
      excludeClientIPFromCrumb: false # Strict CSRF Protection

unclassified:
  location:
    url: "https://jenkins.example.com/"
    adminAddress: "devops-admin@example.com"
```

---

## 6. Shared Libraries

Centralize and share pipeline code across multiple repositories:

```groovy
// In Jenkinsfile: Load shared library
@Library('pipeline-library@v2.1.0') _

standardNodePipeline {
    appName = 'payment-service'
    nodeVersion = '20'
    sonarProjectKey = 'my-org_payment-service'
}
```

---

## 7. Security Hardening & Troubleshooting

### Security Essentials
- **CSRF Protection**: Always enable default Crumb Issuer with IP check.
- **Never Log Secrets**: Use `withCredentials` block to securely bind and mask tokens.
- **Run Controlller as Non-Root**: Never run the Jenkins controller container as the root user.
- **Agent-to-Controller Security**: Isolate agents so build jobs cannot read or manipulate the Jenkins controller's internal filesystem.

### CLI Commands & Troubleshooting
```bash
# Inspect Jenkins service status
sudo systemctl status jenkins

# View live system logs
sudo journalctl -u jenkins -f

# Download and use Jenkins CLI with token authentication
curl -O http://localhost:8080/jnlpJars/jenkins-cli.jar
java -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:API_TOKEN list-jobs

# Safely restart Jenkins when active jobs complete
java -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:API_TOKEN safe-restart
```
