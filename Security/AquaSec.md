# 🛡️ Aqua Security Cheatsheet

![text](https://imgur.com/8MBLV6G.png)

**Aqua Security** is a leading cloud-native security platform delivering full-lifecycle security for containerized, Kubernetes, and serverless environments. Aqua combines an enterprise Cloud Native Application Protection Platform (CNAPP) with industry-standard open-source tools including **Trivy**, **Tracee**, and **Kube-bench**.

---

## **1. Core Platform Architecture**

| Component | Type | Description |
| --- | --- | --- |
| **Aqua Server / Console** | Management | Central control plane managing policies, compliance reports, and audit logs. |
| **Aqua Enforcer / MicroEnforcer** | Agent | Host/pod daemon enforcing runtime protection, container immutability, and drift prevention. |
| **Tracee** | Open-Source | eBPF-powered runtime security engine detecting malicious behaviors at the Linux kernel level. |
| **Kube-bench** | Open-Source | Automated CIS Kubernetes Benchmark audit tool. |
| **Trivy** | Open-Source | Comprehensive scanner for container images, filesystems, Git repos, and Kubernetes configs. |

---

## **2. Open-Source Ecosystem Quick Reference**

### 🔹 Kube-bench (CIS Kubernetes Benchmark)

Audit Kubernetes nodes against the Center for Internet Security (CIS) benchmarks:

```bash
# Run kube-bench inside a Docker container targeting a master node
docker run --pid=host -v /etc:/etc:ro -v /var:/var:ro -t aquasec/kube-bench:latest master

# Run kube-bench on a worker node
docker run --pid=host -v /etc:/etc:ro -v /var:/var:ro -t aquasec/kube-bench:latest node

# Run as a Kubernetes Job
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml
kubectl logs -l job-name=kube-bench
```

### 🔹 Tracee (eBPF Runtime Threat Detection)

Detect privilege escalations, rootkit attempts, and reverse shells in real time:

```bash
# Run Tracee via Docker using host kernel headers
docker run --name tracee --rm -it \
  --privileged \
  --pid=host \
  -v /lib/modules/:/lib/modules/:ro \
  -v /usr/src:/usr/src:ro \
  -v /tmp/tracee:/tmp/tracee \
  aquasec/tracee:latest

# Trace only suspicious security events (process exec, file changes)
tracee --trace event=sched_process_exec,openat

# Detect when a container escapes to the host namespace
tracee --output json --events standard_file_events
```

---

## **3. Kubernetes Admission Control**

Aqua's validating webhook intercepts `kubectl apply` requests, blocking pods that fail security policies before they are scheduled.

```plaintext
kubectl apply -f pod.yaml
          ↓
Kubernetes API Server
          ↓ (Admission Review)
[Aqua Validating Webhook]
          ↓
Decision:
├── Image contains Critical CVEs -> REJECT (403 Forbidden)
├── Running as Root / Privileged -> REJECT (Policy Violation)
└── Scanned & Compliant          -> ACCEPT (Pod Created)
```

Example Admission Policy:
* **Disallow Root Users**: Blocks any container with `runAsUser: 0`.
* **Enforce Scanned Image Pass**: Rejects images that have not been scanned and approved in the registry.
* **Block Privileged Containers**: Disallows `privileged: true` and sensitive host volume mounts (`/etc`, `/var/run/docker.sock`).

---

## **4. Runtime Protection: Drift Prevention**

Aqua Enforcer ensures **container immutability** by strictly enforcing the principle that a container should never change at runtime:

* **Executable Blacklisting**: Prevents binaries not present in the original container image from executing.
* **File Integrity Monitoring**: Alerts and blocks modifications to sensitive directories (`/etc`, `/bin`, `/usr`).
* **MicroEnforcer**: Injected directly into container pods in serverless container environments (AWS Fargate, Google Cloud Run) where host access is restricted.

---

## **5. CI/CD Pipeline Security Gate**

Integrate Aqua scanner or Trivy directly into your deployment pipeline:

### 🔹 GitHub Actions Security Gate

```yaml
name: Container Security Scan
on: [push]

jobs:
  aqua-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build container image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Run Aqua Trivy Vulnerability Scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:${{ github.sha }}'
          format: 'table'
          exit-code: '1'
          ignore-unfixed: true
          severity: 'CRITICAL,HIGH'
```

---

## **6. Enterprise Troubleshooting & Audit**

* **Audit Log Stream**: Stream security violation events directly to SIEM solutions (Splunk, Datadog, AWS Security Hub).
* **Verify Enforcer DaemonSet**:
  ```bash
  kubectl get pods -n aqua -l app=aqua-enforcer
  kubectl logs -n aqua -l app=aqua-enforcer --tail=50
  ```

---

## 📚 **Learning Resources**

* 🔗 [Aqua Security Official Documentation](https://docs.aquasec.com/)
* 🛡️ [Tracee eBPF Project](https://aquasecurity.github.io/tracee/latest/)
* 📦 [Kube-bench Repository](https://github.com/aquasecurity/kube-bench)
* 📖 [Trivy Documentation](https://aquasecurity.github.io/trivy/)
