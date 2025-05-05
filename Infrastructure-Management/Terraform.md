# 🧾 Terraform Cheat Sheet (Beginner → Advanced)

![text](https://imgur.com/FwmjyK1.png)

## 📘 **Introduction**

Terraform by [HashiCorp](https://www.hashicorp.com/products/terraform) is an **open-source Infrastructure as Code (IaC)** tool used to provision and manage cloud, on-prem, and SaaS infrastructure through configuration files written in **HCL (HashiCorp Configuration Language)**.

With Terraform, you define infrastructure in a **declarative format**, allowing for versioning, reusability, automation, and consistency across environments.

## 🔹 **Key Concepts**

| Term           | Description                                                            |
| -------------- | ---------------------------------------------------------------------- |
| **Providers**  | Plugin responsible for managing a specific cloud platform (e.g., AWS). |
| **Resources**  | Infrastructure components like EC2, S3, etc.                           |
| **Variables**  | Input values passed into configuration.                                |
| **Outputs**    | Values that Terraform returns after execution.                         |
| **State File** | Keeps track of resources Terraform manages.                            |

---

## 🌍 Terraform Commands

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
```

### 🔹 Apply Infrastructure Changes

```bash
terraform apply
```

### 🔹 Destroy Infrastructure

```bash
terraform destroy
```

### 🔹 Output Variables

```bash
terraform output
terraform output my_variable
```

### 🔹 Manage State

```bash
terraform state list
terraform state show <resource>
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
terraform init -backend-config="key=my-state.tfstate"
```

### 🔹 Import Existing Infrastructure

```bash
terraform import aws_instance.example i-12345678
```

### 🔹 Graph Dependency Tree

```bash
terraform graph | dot -Tpng > graph.png
```

</details>

---

## 🟢 **Beginner Commands**

### 🔹 `terraform version`

Shows the installed version of Terraform.

```bash
terraform version
```

---

### 🔹 `terraform init`

Initializes the working directory with provider plugins and backend config.

```bash
terraform init
```

💡 Run this once per project after writing your `.tf` files.

---

### 🔹 `terraform validate`

Validates your configuration files for syntax errors.

```bash
terraform validate
```

---

### 🔹 `terraform plan`

Shows what actions Terraform *will* take without applying them.

```bash
terraform plan
```

📌 Use before every `apply` to preview infrastructure changes.

---

### 🔹 `terraform apply`

Applies changes to reach the desired infrastructure state.

```bash
terraform apply
```

* You can auto-approve with:

```bash
terraform apply -auto-approve
```

---

### 🔹 `terraform destroy`

Removes infrastructure defined in the configuration files.

```bash
terraform destroy
```

* Auto-confirm with:

```bash
terraform destroy -auto-approve
```

---

### 🔹 `terraform fmt`

Automatically formats `.tf` files to canonical style.

```bash
terraform fmt
```

* Format all recursively:

```bash
terraform fmt -recursive
```

---

## 🟡 **Intermediate Commands**

### 🔹 `terraform show`

Displays human-readable output of the current or saved state.

```bash
terraform show
terraform show terraform.tfstate
```

---

### 🔹 `terraform output`

Prints the values of output variables after apply.

```bash
terraform output
terraform output instance_ip
```

---

### 🔹 `terraform state list`

Lists all resources tracked in the current state file.

```bash
terraform state list
```

---

### 🔹 `terraform state show`

Displays details about a specific resource in the state.

```bash
terraform state show aws_instance.example
```

---

### 🔹 `terraform taint`

Forces recreation of a resource on the next apply.

```bash
terraform taint aws_instance.example
```

---

### 🔹 `terraform untaint`

Removes taint from a resource.

```bash
terraform untaint aws_instance.example
```

---

### 🔹 `terraform import`

Brings existing infrastructure into Terraform state.

```bash
terraform import aws_instance.example i-0abcd1234efgh5678
```

---

### 🔹 `terraform graph`

Generates a dependency graph (in DOT format).

```bash
terraform graph | dot -Tpng > graph.png
```

---

### 🔹 `terraform providers`

Lists all providers used in the current configuration.

```bash
terraform providers
```

---

### 🔹 `terraform workspace` commands

Used to manage multiple workspaces (e.g., dev, staging, prod).

```bash
terraform workspace new dev
terraform workspace select dev
terraform workspace list
```

---

## 🔴 **Advanced Commands**

### 🔹 `terraform plan -out=tfplan`

Saves the execution plan to a file.

```bash
terraform plan -out=tfplan
```

Then apply it later:

```bash
terraform apply tfplan
```

---

### 🔹 `terraform apply -target=resource`

Apply only specific resources.

```bash
terraform apply -target=aws_instance.example
```

---

### 🔹 `terraform state mv`

Moves/renames resources in the state.

```bash
terraform state mv aws_instance.old aws_instance.new
```

---

### 🔹 `terraform state rm`

Removes resource from state (does NOT destroy it in the cloud).

```bash
terraform state rm aws_instance.example
```

---

### 🔹 `terraform console`

Opens an interactive console to evaluate HCL expressions.

```bash
terraform console
> var.instance_type
```

---

### 🔹 `terraform login`

Authenticates to Terraform Cloud or Enterprise.

```bash
terraform login
```

---

### 🔹 `terraform logout`

Logs out from Terraform Cloud.

```bash
terraform logout
```

---

### 🔹 `terraform force-unlock`

Force-unlocks a state file after a failed operation.

```bash
terraform force-unlock <LOCK_ID>
```

---

## 📌 **Common Command Workflows**

### 🛠 New Project

```bash
terraform init
terraform plan
terraform apply
```

### 🔁 Make a Change

```bash
terraform fmt
terraform validate
terraform plan
terraform apply
```

### 🧽 Destroy Infra

```bash
terraform destroy
```

Great — here’s the full version of the `Terraform.md` cheat sheet with **introductory info at the top** and **additional learning resources at the bottom**, perfect for your repo:

---

## 🧠 **Tips & Best Practices**

* Keep `.tfstate` files **secure** (use S3 + DynamoDB for remote locking)
* Use `terraform.tfvars` or `.auto.tfvars` for sensitive input variables
* Mark secrets using `sensitive = true` in outputs
* Use **modules** for reusable code
* Always run `terraform plan` before `apply`
* Version-lock providers in `required_providers`

---

## 📚 **Learning Resources**

* 🔗 [Official Docs](https://developer.hashicorp.com/terraform/docs)
* 📘 [Terraform Registry](https://registry.terraform.io/)
* 🎓 [Learn Terraform (Free)](https://learn.hashicorp.com/terraform)
* 🧪 [Checkov - IaC Scanning](https://www.checkov.io/)
* 📖 [Terraform CLI Reference](https://developer.hashicorp.com/terraform/cli)
