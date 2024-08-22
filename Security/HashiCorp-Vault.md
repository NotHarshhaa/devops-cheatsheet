# HashiCorp Vault Cheatsheet

![text](https://imgur.com/322q6Pi.png)

**1. Introduction:**

- **HashiCorp Vault** is a tool designed to securely store and access secrets. It can manage sensitive data such as passwords, API keys, and certificates.

**2. Installation:**

- **Installing Vault:**
  - On macOS using Homebrew:

    ```bash
    brew install vault
    ```

  - On Linux:

    ```bash
    wget https://releases.hashicorp.com/vault/1.9.0/vault_1.9.0_linux_amd64.zip
    unzip vault_1.9.0_linux_amd64.zip
    sudo mv vault /usr/local/bin/
    ```

  - On Windows:
    - Download the binary from the [official HashiCorp releases](https://www.vaultproject.io/downloads).

**3. Basic Usage:**

- **Initializing Vault:**

  ```bash
  vault operator init
  ```

  - This command initializes the Vault server, generating unseal keys and a root token.

- **Unsealing Vault:**

  ```bash
  vault operator unseal <unseal-key-1>
  vault operator unseal <unseal-key-2>
  vault operator unseal <unseal-key-3>
  ```

  - Unseal Vault using the keys provided during initialization.

- **Storing Secrets:**

  ```bash
  vault kv put secret/my-secret password="mypassword"
  ```

  - This command stores a secret in Vault at the path `secret/my-secret`.

- **Retrieving Secrets:**

  ```bash
  vault kv get secret/my-secret
  ```

  - Retrieves the secret stored at `secret/my-secret`.

**4. Advanced Usage:**

- **Dynamic Secrets:**
  - Vault can generate secrets dynamically, such as database credentials that are created on-demand.
  - Example: Generating MySQL credentials:

    ```bash
    vault write database/roles/my-role db_name=mydb creation_statements="CREATE USER '{{name}}'@'%' IDENTIFIED BY '{{password}}';" default_ttl="1h" max_ttl="24h"
    vault read database/creds/my-role
    ```

- **Secret Engines:**
  - Vault supports multiple secret engines like KV, AWS, GCP, and more.
  - Enable a secrets engine:

    ```bash
    vault secrets enable aws
    ```

  - Configure and use the AWS secrets engine:

    ```bash
    vault write aws/config/root access_key=<AWS_ACCESS_KEY> secret_key=<AWS_SECRET_KEY>
    vault write aws/roles/my-role credential_type=iam_user policy_arns=arn:aws:iam::aws:policy/ReadOnlyAccess
    ```

**5. Authentication Methods:**

- **Enabling Authentication Methods:**
  - Vault supports various authentication methods, including AppRole, LDAP, and AWS.
  - Enable an authentication method:

    ```bash
    vault auth enable approle
    ```

- **Configuring AppRole Authentication:**
  - Create a role:

    ```bash
    vault write auth/approle/role/my-role token_policies="default" token_ttl=1h token_max_ttl=4h
    ```

  - Retrieve the role ID and secret ID:

    ```bash
    vault read auth/approle/role/my-role/role-id
    vault write -f auth/approle/role/my-role/secret-id
    ```

**6. Policies and Access Control:**

- **Creating Policies:**
  - Define a policy to control access to secrets:

    ```hcl
    path "secret/data/*" {
      capabilities = ["create", "read", "update", "delete", "list"]
    }
    ```

  - Apply the policy:

    ```bash
    vault policy write my-policy my-policy.hcl
    ```

**7. Vault in Production:**

- **High Availability (HA):**
  - Vault supports HA configurations using storage backends like Consul.
  - Example Consul configuration:

    ```bash
    storage "consul" {
      address = "127.0.0.1:8500"
      path    = "vault/"
    }
    ```

- **Performance Replication:**
  - Vault Enterprise supports performance replication for scaling reads.

**8. Integrations and Automation:**

- **Terraform Integration:**
  - Use the [Terraform Vault provider](https://registry.terraform.io/providers/hashicorp/vault/latest/docs) to manage Vault resources.
  - Example Terraform configuration:

    ```hcl
    provider "vault" {}

    resource "vault_generic_secret" "example" {
      path = "secret/example"
      data_json = <<EOT
    {
      "password": "mypassword"
    }
    EOT
    }
    ```

- **CI/CD Integration:**
  - Integrate Vault with CI/CD pipelines to inject secrets dynamically into build processes.

**9. Monitoring and Auditing:**

- **Enabling Audit Devices:**
  - Enable an audit device:

    ```bash
    vault audit enable file file_path=/var/log/vault_audit.log
    ```

- **Monitoring Vault:**
  - Monitor Vault health and performance using tools like Prometheus and Grafana.

**10. Troubleshooting Vault:**

- **Common Issues:**
  - **Unseal Keys Lost:** If unseal keys are lost, Vault data is irrecoverable unless backups are available.
  - **Token Expiry:** Ensure tokens used for authentication have appropriate TTL settings to avoid expiration during use.

- **Debugging:**
  - Enable detailed logging by setting the `VAULT_LOG_LEVEL` environment variable:

    ```bash
    export VAULT_LOG_LEVEL=debug
    ```
