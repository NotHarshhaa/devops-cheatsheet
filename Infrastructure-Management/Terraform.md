# 🧾 Terraform Cheat Sheet (Beginner → Advanced)

![text](https://imgur.com/FwmjyK1.png)

## 📘 **Introduction**

Terraform by [HashiCorp](https://www.hashicorp.com/products/terraform) is an **open-source Infrastructure as Code (IaC)** tool used to provision and manage cloud, on-prem, and SaaS infrastructure through configuration files written in **HCL (HashiCorp Configuration Language)**.

With Terraform, you define infrastructure in a **declarative format**, allowing for versioning, reusability, automation, and consistency across environments.

> [!NOTE]
> **OpenTofu Compatibility**: OpenTofu is the open-source, community-driven fork of Terraform (Linux Foundation). Almost all CLI commands and HCL syntax (`terraform ...` ⇄ `tofu ...`) are drop-in interchangeable.

## 🔹 **Key Concepts**

| Term | Description |
| --- | --- |
| **Providers** | Plugins responsible for managing specific platforms (e.g., AWS, Azure, GCP, Kubernetes). |
| **Resources** | Infrastructure components declared to be managed (e.g., EC2, S3, VPC). |
| **Data Sources** | Read-only infrastructure queries fetching existing cloud resources outside Terraform. |
| **Variables** | Input values passed into configurations for modularity. |
| **Outputs** | Return values that Terraform displays or passes to other configurations. |
| **State File** | Tracks real-world resources mapped to configuration (`terraform.tfstate`). |
| **Modules** | Self-contained packages of Terraform configurations that create reusable components. |

---

## 🌍 Terraform Commands Quick Reference

<details>
<summary>🟢 Beginner Commands (Click to Expand)</summary>

### 🔹 Check Version

```bash
terraform version
```

### 🔹 Initialize Working Directory

```bash
terraform init
```

### 🔹 Validate Configuration

```bash
terraform validate
```

### 🔹 Format Code

```bash
terraform fmt
terraform fmt -recursive
```

### 🔹 Show Help

```bash
terraform -help
terraform plan -help
```

</details>

---

<details>
<summary>🟡 Intermediate Commands (Click to Expand)</summary>

### 🔹 Plan Infrastructure Changes

```bash
terraform plan
terraform plan -out=tfplan
```

### 🔹 Apply Infrastructure Changes

```bash
terraform apply
terraform apply -auto-approve
terraform apply tfplan
```

### 🔹 Targeted Recreation (Modern Replacement for Taint)

```bash
terraform apply -replace="aws_instance.web"
```

### 🔹 Destroy Infrastructure

```bash
terraform destroy
terraform destroy -auto-approve
```

### 🔹 Output Variables

```bash
terraform output
terraform output -json
terraform output instance_ip
```

### 🔹 Manage State

```bash
terraform state list
terraform state show <resource>
terraform state mv <old_name> <new_name>
terraform state rm <resource>
```

</details>

---

<details>
<summary>🔴 Advanced Commands (Click to Expand)</summary>

### 🔹 Target Specific Resources

```bash
terraform apply -target=aws_instance.example
terraform destroy -target=module.vpc
```

### 🔹 Work with Modules

```bash
terraform get
terraform init -upgrade
```

### 🔹 Backend Configuration

```bash
terraform init -backend-config="key=my-state.tfstate" -reconfigure
```

### 🔹 Import Existing Infrastructure (CLI & Modern Import Block)

```bash
# Classic CLI import
terraform import aws_instance.example i-12345678

# Modern Terraform 1.5+ declarative generation
terraform plan -generate-config-out=generated.tf
```

### 🔹 Native Automated Tests (Terraform 1.6+)

```bash
terraform test
terraform test -verbose
```

### 🔹 Graph Dependency Tree

```bash
terraform graph | dot -Tpng > graph.png
```

### 🔹 Force Unlock State

```bash
terraform force-unlock <LOCK_ID>
```

</details>

---

## 🟢 **Beginner Commands & Core Workflow**

### 🔹 `terraform version`

Shows the installed version of Terraform and configured provider plugins.

```bash
terraform version
```

---

### 🔹 `terraform init`

Initializes the working directory containing Terraform configuration files. Downloads required provider plugins and configures the backend.

```bash
# Standard initialization
terraform init

# Upgrade provider plugins to latest allowed versions
terraform init -upgrade

# Reconfigure backend settings (migrating state storage)
terraform init -reconfigure
```

💡 Run this once per project after writing your `.tf` files or whenever you add new providers/modules.

---

### 🔹 `terraform fmt`

Automatically rewrites Terraform configuration files to a canonical format and style.

```bash
# Format current directory
terraform fmt

# Format all files in subdirectories recursively
terraform fmt -recursive

# Check if files are formatted without modifying them (CI/CD check)
terraform fmt -check
```

---

### 🔹 `terraform validate`

Validates your configuration files syntactically and checks whether internal references and arguments are valid without accessing remote services.

```bash
terraform validate
```

---

### 🔹 `terraform plan`

Creates an execution plan, letting you preview what actions Terraform will take to reach the desired state before making changes.

```bash
# Preview changes
terraform plan

# Save the execution plan to a file (recommended for CI/CD)
terraform plan -out=tfplan

# Pass custom variable values via CLI
terraform plan -var="environment=production" -var="instance_count=3"

# Specify a custom variables file
terraform plan -var-file="prod.tfvars"
```

📌 Always run `plan` before `apply` to inspect additions (`+`), changes (`~`), and destructions (`-`).

---

### 🔹 `terraform apply`

Executes the actions proposed in a Terraform plan to create, update, or delete infrastructure.

```bash
# Apply interactively (requires confirmation prompt)
terraform apply

# Auto-approve without prompt (useful in CI/CD pipelines)
terraform apply -auto-approve

# Apply a pre-generated plan file safely
terraform apply tfplan
```

---

### 🔹 `terraform destroy`

Terminates all resources tracked by the current configuration and state.

```bash
# Destroy with confirmation prompt
terraform destroy

# Auto-confirm destruction
terraform destroy -auto-approve

# Preview destruction without deleting
terraform plan -destroy
```

---

## 🟡 **Intermediate Commands & State Operations**

### 🔹 Modern Replacement for `terraform taint` (`-replace`)

> [!WARNING]
> `terraform taint` is **deprecated** since Terraform v0.15.2 and v1.x. Use `terraform apply -replace` instead.

```bash
# Modern standard (Terraform 0.15.2+)
terraform apply -replace="aws_instance.example"

# Legacy command (retains for backwards compatibility)
terraform taint aws_instance.example
terraform untaint aws_instance.example
```

---

### 🔹 `terraform show`

Displays human-readable output of the current state or a saved plan file.

```bash
# Show current state
terraform show

# Inspect a saved plan file
terraform show tfplan

# Output state in JSON for parsing with jq
terraform show -json
```

---

### 🔹 `terraform output`

Extracts the values of output variables from the state file.

```bash
# List all outputs
terraform output

# Get a specific output
terraform output instance_ip

# Extract as raw string (strips quotes for scripting)
terraform output -raw instance_ip

# Output in JSON format
terraform output -json
```

---

### 🔹 `terraform state` Management

Directly inspect and modify the Terraform state file.

```bash
# List all resources currently tracked in state
terraform state list

# Show detailed attributes of a tracked resource
terraform state show aws_instance.web

# Move/rename a resource within state without destroying it
terraform state mv aws_instance.old_name aws_instance.new_name

# Move resource into a module
terraform state mv aws_instance.web module.web_cluster.aws_instance.web

# Remove a resource from state without destroying it in the cloud
terraform state rm aws_instance.unmanaged_resource

# Pull remote state file to stdout
terraform state pull > backup.tfstate
```

---

### 🔹 `terraform workspace`

Manages separate state instances within the same configuration directory (useful for multi-environment deployments like `dev`, `staging`, `prod`).

```bash
# List all workspaces
terraform workspace list

# Create a new workspace
terraform workspace new staging

# Switch between workspaces
terraform workspace select prod

# View current workspace
terraform workspace show

# Delete an empty workspace
terraform workspace delete staging
```

In HCL, reference the active workspace using `${terraform.workspace}`:

```hcl
locals {
  env = terraform.workspace
}
```

---

### 🔹 `terraform console`

Launches an interactive shell for evaluating expressions, testing built-in functions, and inspecting variables.

```bash
terraform console
> max(5, 12, 9)
12
> format("web-%s-%02d", "prod", 1)
"web-prod-01"
> [for s in ["apple", "banana"] : upper(s)]
[
  "APPLE",
  "BANANA",
]
> exit
```

---

## 🔴 **Advanced Concepts & Modern Features (Terraform 1.5 - 1.10+)**

### 🔹 Declarative `import` Blocks (Terraform 1.5+)

Terraform 1.5 introduced declarative imports in `.tf` code alongside automatic configuration generation.

```hcl
# In imports.tf
import {
  to = aws_instance.web
  id = "i-0123456789abcdef0"
}
```

Generate configuration automatically:

```bash
# Generates the HCL resource block into generated.tf
terraform plan -generate-config-out=generated.tf

# Apply the generated import
terraform apply
```

Traditional CLI import:

```bash
terraform import aws_instance.web i-0123456789abcdef0
```

---

### 🔹 Native Automated Testing (`terraform test`, 1.6+)

Terraform 1.6+ provides a built-in testing framework using `.tftest.hcl` files without external tools like Terratest.

```hcl
# tests/website.tftest.hcl
variables {
  bucket_name = "test-company-static-website-dev"
}

run "validate_bucket_creation" {
  command = plan

  assert {
    condition     = aws_s3_bucket.website.bucket == var.bucket_name
    error_message = "S3 bucket name did not match expected variable"
  }
}
```

Run test suites:

```bash
terraform test
terraform test -verbose
```

---

### 🔹 `check` Blocks (Continuous Validation, 1.5+)

Assert conditions in your infrastructure without failing the entire `plan` or `apply`:

```hcl
check "health_check" {
  data "http" "website_status" {
    url = "https://${aws_lb.app.dns_name}/healthz"
  }

  assert {
    condition     = data.http.website_status.status_code == 200
    error_message = "${aws_lb.app.dns_name} returned non-200 status code."
  }
}
```

---

### 🔹 Resource Lifecycle Meta-Arguments

Control how Terraform creates, updates, and deletes individual resources:

```hcl
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"

  lifecycle {
    # Create replacement resource before destroying the existing one
    create_before_destroy = true

    # Prevent accidental terraform destroy
    prevent_destroy = false

    # Ignore cloud-side changes to specific attributes (e.g. auto-scaled tags)
    ignore_changes = [
      tags["LastUpdated"],
    ]

    # Replace resource when a specific trigger condition changes
    replace_triggered_by = [
      aws_security_group.web.id
    ]
  }
}
```

---

### 🔹 `for_each` vs `count`

| Feature | `count` | `for_each` |
| --- | --- | --- |
| **Identified By** | Index integer (`[0]`, `[1]`) | Map key or string set (`["web"]`, `["api"]`) |
| **Shift Risk** | Removing middle items causes recreation of subsequent items | Safe removal; only the targeted key is destroyed |
| **Use Case** | Identical copies | Distinct resources with unique names/keys |

```hcl
# Example with for_each:
variable "subnets" {
  type = map(string)
  default = {
    us-east-1a = "10.0.1.0/24"
    us-east-1b = "10.0.2.0/24"
  }
}

resource "aws_subnet" "main" {
  for_each          = var.subnets
  vpc_id            = aws_vpc.main.id
  availability_zone = each.key
  cidr_block        = each.value

  tags = {
    Name = "subnet-${each.key}"
  }
}
```

---

### 🔹 `dynamic` Blocks

Generate nested configuration blocks dynamically from maps or lists:

```hcl
variable "ingress_ports" {
  type    = list(number)
  default = [80, 443, 8080]
}

resource "aws_security_group" "web" {
  name = "web-sg"

  dynamic "ingress" {
    for_each = var.ingress_ports
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
}
```

---

### 🔹 Remote Backend & State Locking (S3 + DynamoDB)

Store state files centrally with concurrency locking to prevent state corruption:

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "my-company-terraform-state-prod"
    key            = "networking/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```

> [!TIP]
> **Terraform 1.10+ Native S3 Locking**: Terraform 1.10+ supports native S3 conditional writes, allowing state locking directly on S3 without needing a DynamoDB table!

---

### 🔹 Sensitive Values & Secret Protection

Mask passwords and credentials in CLI logs and plan outputs:

```hcl
variable "db_password" {
  type      = string
  sensitive = true
}

output "database_url" {
  value     = "postgresql://admin:${var.db_password}@${aws_db_instance.main.endpoint}/app"
  sensitive = true
}
```

View sensitive output explicitly when needed:

```bash
terraform output -raw database_url
```

---

## 🛠 Useful Environment Variables

| Variable | Description |
| --- | --- |
| `TF_LOG=TRACE\|DEBUG\|INFO\|WARN\|ERROR` | Configures logging verbosity for debugging |
| `TF_LOG_PATH=terraform.log` | Writes logs to a file instead of stdout |
| `TF_VAR_name=value` | Sets variable values via shell environment |
| `TF_CLI_ARGS` | Appends default arguments to all CLI commands |
| `TF_IN_AUTOMATION=1` | Adjusts output formatting for automated CI/CD runs |

---

## 🧠 **Tips & Production Best Practices**

1. **Protect Your State**: Always use a remote backend (S3, GCS, Azure Blob, Terraform Cloud) with encryption enabled and state locking.
2. **Never Commit State Files or Secrets**: Keep `.tfstate`, `*.tfvars`, and `.terraform/` in `.gitignore`.
3. **Prefer `for_each` Over `count`**: Using `for_each` prevents cascading resource recreation when list order changes.
4. **Pin Provider and Terraform Versions**: Lock versions in `required_providers` and `required_version` to prevent breaking changes across team members.
5. **Enforce Modular Architecture**: Split large monolithic configs into small, decoupled modules (e.g. `networking`, `database`, `compute`).
6. **Integrate Security Scanners in CI/CD**: Run static analysis tools like `checkov`, `tfsec`, or `trivy` before `terraform apply`.

---

## 📚 **Learning Resources**

* 🔗 [Official Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
* 📘 [Terraform Registry](https://registry.terraform.io/)
* 🎓 [HashiCorp Developer Tutorials](https://developer.hashicorp.com/terraform/tutorials)
* 📖 [Terraform CLI Command Reference](https://developer.hashicorp.com/terraform/cli)
* 🛡️ [OpenTofu Documentation](https://opentofu.org/docs/)
* 🧪 [Checkov - Static Analysis for IaC](https://www.checkov.io/)
