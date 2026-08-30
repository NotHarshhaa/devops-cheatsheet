# 👨‍✈️ Jenkins Cheatsheet

![](https://imgur.com/jWGs9lH.png)

**Jenkins** is an open-source automation server enabling developers worldwide to reliably build, test, and deploy software. With thousands of plugins and native support for dynamic Kubernetes agents, Jenkins orchestrates complex enterprise CI/CD workflows at scale.

---

## **1. Modern Installation (Java 17/21 LTS)**

> [!IMPORTANT]
> Modern Jenkins requires **Java 17 or Java 21 LTS**. Support for Java 8 and Java 11 has been retired. Deprecated `apt-key add` has been replaced by the official `/etc/apt/keyrings` workflow.

### 🔹 Running with Docker (Recommended)

```bash
docker run -d \
  --name jenkins \
  --restart=unless-stopped \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts-jdk17
```

### 🔹 Ubuntu / Debian (Modern Keyring Method)

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

## **2. Declarative vs Scripted Pipeline Comparison**

| Feature | Declarative Pipeline (`pipeline { ... }`) | Scripted Pipeline (`node { ... }`) |
| --- | --- | --- |
| **Syntax** | Strict, structured, validated pre-execution | Groovy-based, dynamic, programmatic |
| **Learning Curve** | Gentle, standardized across teams | Steep, requires Groovy fluency |
| **Error Handling** | Built-in `post` blocks (`always`, `failure`) | Groovy `try-catch-finally` |
| **Recommendation** | **Industry Standard** for modern pipelines | Legacy or advanced conditional flows |

### 🔹 Using the `script` Block Escape Hatch in Declarative

When complex procedural logic (loops, dynamic maps) is unavoidable, use the `script` block:

```groovy
stage('Dynamic Deployment') {
    steps {
        script {
            def servers = ['web-1', 'web-2', 'web-3']
            for (server in servers) {
                echo "Deploying to ${server}..."
                sh "./deploy.sh ${server}"
            }
        }
    }
}
```

---

## **3. Production Declarative Pipeline (`Jenkinsfile`)**

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
            echo "Pipeline failed! Sending alert notification..."
        }
    }
}
```

---

## **4. Kubernetes Dynamic Pod Agents (with Daemonless Kaniko Builds)**

Build container images inside ephemeral Kubernetes agents without exposing `/var/run/docker.sock`:

```groovy
pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins-agent: kaniko-build
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
    volumeMounts:
    - name: kaniko-secret
      mountPath: /kaniko/.docker
  volumes:
  - name: kaniko-secret
    secret:
      secretName: docker-registry-credentials
      items:
      - key: .dockerconfigjson
        path: config.json
'''
        }
    }

    stages {
        stage('Compile') {
            steps {
                container('node') {
                    sh 'npm ci && npm run build'
                }
            }
        }
        stage('Build & Push Container with Kaniko') {
            steps {
                container('kaniko') {
                    sh '/kaniko/executor --context=dir://. --destination=ghcr.io/my-org/my-app:latest'
                }
            }
        }
    }
}
```

---

## **5. Jenkins Configuration as Code (JCasC)**

Declaratively manage Jenkins configuration via version-controlled YAML (`jenkins.yaml`):

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

## **6. Multibranch Pipelines & GitHub Webhooks**

* **Multibranch Pipeline**: Automatically creates and removes Jenkins jobs for every branch or Pull Request containing a `Jenkinsfile`.
* **Webhook URL**: Configure GitHub repository webhooks to trigger instant builds:
  ```plaintext
  Payload URL: https://jenkins.example.com/github-webhook/
  Content type: application/json
  Events: Push, Pull Request
  ```

---

## **7. Backup & Disaster Recovery**

Back up `JENKINS_HOME` while omitting temporary caches and build workspaces:

```bash
# Automated backup script
tar -czvf jenkins_backup_$(date +%F).tar.gz \
  --exclude="var/jenkins_home/workspace" \
  --exclude="var/jenkins_home/caches" \
  --exclude="var/jenkins_home/war" \
  /var/jenkins_home/
```

---

## 📚 **Learning Resources**

* 🔗 [Official Jenkins Documentation](https://www.jenkins.io/doc/)
* 📦 [Jenkins Plugin Index](https://plugins.jenkins.io/)
* 📜 [Jenkins Pipeline Syntax Reference](https://www.jenkins.io/doc/book/pipeline/syntax/)
