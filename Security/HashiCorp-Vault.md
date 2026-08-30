# 🔐 HashiCorp Vault Cheatsheet

![text](https://imgur.com/322q6Pi.png)

**HashiCorp Vault** is the industry standard for identity-based secrets management and data encryption. It secures, stores, and tightly controls access to tokens, passwords, certificates, and encryption keys across dynamic cloud and container infrastructures.

---

## **1. Core Concepts & Architecture**

| Concept | Description |
| --- | --- |
| **Storage Backend** | Where encrypted data is persisted. **Integrated Storage (Raft)** is the recommended standard for HA. |
| **Seal / Unseal** | When sealed, Vault cannot decrypt data. Unsealing reconstructs the master key via Shamir's Secret Sharing or Cloud KMS. |
| **Secrets Engines** | Plugins that store, generate, or encrypt data (KV, Database, AWS, PKI, Transit). |
| **Auth Methods** | Mechanisms used to authenticate clients (Kubernetes, AppRole, JWT/OIDC, Userpass). |
| **Leases & TTL** | All dynamic secrets and tokens have a Time-To-Live (TTL) and must be renewed or they expire automatically. |

---

## **2. Installation & CLI Quick Reference**

### 🔹 Local Development Server

```bash
# Start an in-memory dev server with root token "root"
vault server -dev -dev-listen-address="0.0.0.0:8200"

# Set environment variables for the CLI
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN='root'

# Check server status
vault status
```

---

## **3. Initialization, Shamir Unseal & Auto-Unseal**

### 🔹 Manual Initialization & Shamir Unsealing

```bash
# Initialize Vault (generates unseal keys and initial root token)
vault operator init -key-shares=5 -key-threshold=3

# Unseal using 3 of the 5 keys
vault operator unseal <unseal-key-1>
vault operator unseal <unseal-key-2>
vault operator unseal <unseal-key-3>
```

### 🔹 Auto-Unseal (Production Best Practice)

In production, avoid manual unsealing by configuring cloud KMS auto-unseal in `config.hcl`:

```hcl
seal "awskms" {
  region     = "us-east-1"
  kms_key_id = "12345678-abcd-1234-abcd-1234567890ab"
}

storage "raft" {
  path    = "/vault/data"
  node_id = "node1"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 0
  tls_cert_file = "/etc/vault/tls/vault.crt"
  tls_key_file  = "/etc/vault/tls/vault.key"
}
```

---

## **4. KV Version 2 (Key-Value Engine)**

KV v2 is enabled by default at `secret/`, providing automatic versioning, soft deletion, and undeletion.

```bash
# Write a secret (creates version 1)
vault kv put secret/payment-service api_key="secret123" db_pass="pass456"

# Read the latest version of a secret
vault kv get secret/payment-service

# Read specific field directly
vault kv get -field=api_key secret/payment-service

# Update secret (creates version 2)
vault kv put secret/payment-service api_key="newsecret789" db_pass="pass456"

# Read a specific older version
vault kv get -version=1 secret/payment-service

# View version metadata and timestamps
vault kv metadata get secret/payment-service

# Soft-delete a specific version
vault kv delete -versions=2 secret/payment-service

# Undelete a soft-deleted version
vault kv undelete -versions=2 secret/payment-service

# Permanently destroy a version
vault kv destroy -versions=1 secret/payment-service
```

---

## **5. Dynamic Secrets: Database & PKI Engines**

Dynamic secrets are generated on-demand and destroyed when their lease expires.

### 🔹 Dynamic PostgreSQL Credentials

```bash
# Enable the database secrets engine
vault secrets enable database

# Configure database connection
vault write database/config/my-postgres \
  plugin_name=postgresql-database-plugin \
  allowed_roles="read-only-role" \
  connection_url="postgresql://{{username}}:{{password}}@postgres:5432/mydb?sslmode=disable" \
  username="vault_admin" \
  password="admin_password"

# Create a dynamic role generating temporary accounts with 1 hour TTL
vault write database/roles/read-only-role \
  db_name=my-postgres \
  creation_statements="CREATE ROLE \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT SELECT ON ALL TABLES IN SCHEMA public TO \"{{name}}\";" \
  default_ttl="1h" \
  max_ttl="24h"

# Generate new dynamic credentials
vault read database/creds/read-only-role
```

### 🔹 Dynamic TLS Certificates (PKI Engine)

```bash
# Enable PKI secrets engine
vault secrets enable pki

# Configure intermediate CA role to issue certificates valid for 72h
vault write pki/roles/web-cert \
  allowed_domains="example.com" \
  allow_subdomains=true \
  max_ttl="72h"

# Request a new certificate and private key
vault write pki/issue/web-cert common_name="api.example.com"
```

---

## **6. Policies & Access Control (HCL)**

Vault policies follow the principle of least privilege. In KV v2, distinguish between `data/` and `metadata/` paths:

File: `app-policy.hcl`:

```hcl
# Allow reading secrets under secret/data/payment-service
path "secret/data/payment-service" {
  capabilities = ["read"]
}

# Allow listing keys
path "secret/metadata/*" {
  capabilities = ["list"]
}

# Allow requesting dynamic database credentials
path "database/creds/read-only-role" {
  capabilities = ["read"]
}
```

Apply the policy:

```bash
vault policy write payment-service-policy app-policy.hcl
```

---

## **7. Authentication Methods**

### 🔹 AppRole (Automated CI/CD & Systems)

```bash
# Enable AppRole
vault auth enable approle

# Create AppRole tied to policy
vault write auth/approle/role/ci-role \
  token_policies="payment-service-policy" \
  token_ttl=1h \
  token_max_ttl=4h

# Retrieve Role ID
vault read auth/approle/role/ci-role/role-id

# Generate Secret ID
vault write -f auth/approle/role/ci-role/secret-id

# Authenticate and receive client token
vault write auth/approle/login \
  role_id="<ROLE_ID>" \
  secret_id="<SECRET_ID>"
```

---

## **8. Kubernetes Sidecar Injection (Zero-Code Secrets)**

Inject secrets directly into pod memory via the Vault Agent Sidecar Injector:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-app
spec:
  template:
    metadata:
      annotations:
        vault.hashicorp.com/agent-inject: "true"
        vault.hashicorp.com/role: "payment-role"
        vault.hashicorp.com/agent-inject-secret-config.txt: "secret/data/payment-service"
        vault.hashicorp.com/agent-inject-template-config.txt: |
          {{- with secret "secret/data/payment-service" -}}
          API_KEY={{ .Data.data.api_key }}
          DB_PASS={{ .Data.data.db_pass }}
          {{- end -}}
    spec:
      serviceAccountName: payment-service-account
      containers:
        - name: app
          image: payment-app:v1
```

The secrets are rendered in-memory inside the pod at `/vault/secrets/config.txt`.

---

## **9. Audit Logging & Security**

> [!IMPORTANT]
> Always enable audit devices in production. If all audit devices fail, Vault halts all operations to prevent unlogged actions.

```bash
# Enable file-based audit device
vault audit enable file file_path=/var/log/vault_audit.log

# List active audit devices
vault audit list
```

---

## 📚 **Learning Resources**

* 🔗 [Official Vault Documentation](https://developer.hashicorp.com/vault/docs)
* 🎓 [HashiCorp Developer Tutorials](https://developer.hashicorp.com/vault/tutorials)
* 📦 [Vault Helm Chart for Kubernetes](https://developer.hashicorp.com/vault/docs/platform/k8s/helm)
