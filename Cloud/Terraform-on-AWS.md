# Terraform on AWS Cheatsheet

![text](https://stratusgrid.com/hubfs/AWS%20Configuration%20Recorder%20Module%20on%20Terraform.webp)

#### **1. Introduction to Terraform**

Terraform is an open-source Infrastructure as Code (IaC) tool developed by HashiCorp. It allows you to define and provision infrastructure using a high-level configuration language. Terraform is cloud-agnostic, meaning it can manage infrastructure across various cloud providers like AWS, Azure, Google Cloud, and on-premise data centers.

**Key Concepts:**

- **IaC (Infrastructure as Code):** Managing and provisioning infrastructure through code rather than manual processes.
- **HCL (HashiCorp Configuration Language):** The language used to write Terraform configurations.
- **Providers:** Plugins that interact with APIs of cloud providers and other services.
- **Resources:** The most basic building blocks of Terraform, representing infrastructure components.
- **State:** Terraform keeps track of the real-world state of your infrastructure in a state file.

---

#### **2. Terraform Basics**

**2.1. Installing Terraform**

- Terraform can be installed on various operating systems.
- Download Terraform from the [official site](https://www.terraform.io/downloads.html) and add it to your system's PATH.

**Example:**

```bash
# On Ubuntu
sudo apt-get update && sudo apt-get install -y gnupg software-properties-common
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update
sudo apt install terraform
```

**2.2. Writing Your First Terraform Configuration**

- Create a directory for your Terraform configuration files.
- Define the provider and resources in a `.tf` file.

**Example:**

```hcl
# main.tf

provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "TerraformExample"
  }
}
```

**2.3. Initializing Terraform**

- Use `terraform init` to initialize your Terraform project. This downloads the necessary provider plugins.

**Example:**

```bash
terraform init
```

**2.4. Planning and Applying Changes**

- **terraform plan:** Generates an execution plan showing what actions Terraform will take.
- **terraform apply:** Executes the actions proposed in the plan.

**Example:**

```bash
terraform plan
terraform apply
```

**2.5. Managing Terraform State**

- Terraform stores the state of your infrastructure in a file called `terraform.tfstate`.
- The state file is critical for Terraform to manage your resources accurately.

**Example:**

```bash
# To view the current state
terraform show

# To refresh the state
terraform refresh
```

---

#### **3. Intermediate Terraform**

**3.1. Variables and Outputs**

- **Variables:** Used to input dynamic values into Terraform configurations.
- **Outputs:** Used to extract information from Terraform resources after they are created.

**Example:**

```hcl
# variables.tf

variable "instance_type" {
  description = "Type of instance to create"
  default     = "t2.micro"
}

# main.tf

resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = var.instance_type

  tags = {
    Name = "TerraformExample"
  }
}

# outputs.tf

output "instance_id" {
  description = "The ID of the instance"
  value       = aws_instance.example.id
}
```

**3.2. Managing Multiple Environments**

- Use `terraform.workspace` to manage different environments like dev, staging, and production.
  
**Example:**

```bash
# Create a new workspace
terraform workspace new dev

# Switch to an existing workspace
terraform workspace select dev
```

**3.3. Terraform Modules**

- Modules are reusable pieces of Terraform code that group resources together. They promote reusability and maintainability.

**Example:**

```hcl
# Creating a module

# Directory structure
module/
  ├── main.tf
  ├── variables.tf
  └── outputs.tf

# Using a module
module "vpc" {
  source = "./module"

  vpc_name = "example-vpc"
}
```

---

#### **4. Advanced Terraform**

**4.1. Terraform Provisioners**

- Provisioners allow you to execute scripts or commands on a remote resource as part of the resource creation or destruction.

**Example:**

```hcl
resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y nginx"
    ]

    connection {
      type     = "ssh"
      user     = "ubuntu"
      private_key = file("~/.ssh/id_rsa")
      host     = self.public_ip
    }
  }

  tags = {
    Name = "TerraformExample"
  }
}
```

**4.2. Handling Secrets with Terraform**

- Use HashiCorp Vault or AWS Secrets Manager to securely manage sensitive data like passwords and API keys in your Terraform configurations.

**Example:**

```hcl
provider "vault" {
  address = "https://vault.example.com"
}

data "vault_generic_secret" "example" {
  path = "secret/myapp"
}

resource "aws_db_instance" "example" {
  engine         = "mysql"
  instance_class = "db.t2.micro"
  username       = "admin"
  password       = data.vault_generic_secret.example.data["password"]
}
```

**4.3. Remote State Management**

- Store Terraform state files remotely using backends like S3, Azure Blob Storage, or Google Cloud Storage.
  
**Example:**

```hcl
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "path/to/my/key"
    region = "us-west-2"
  }
}
```

**4.4. Terraform Enterprise**

- Terraform Enterprise provides additional features like collaboration, policy enforcement, and enhanced security for teams.

**Example:**

```hcl
# Example configuration for Terraform Cloud
terraform {
  cloud {
    organization = "my-org"

    workspaces {
      name = "my-workspace"
    }
  }
}
```

**4.5. Custom Providers and Plugins**

- You can write custom providers and plugins if Terraform’s built-in providers don’t meet your needs.
  
**Example:**

```hcl
# Example using a custom provider
provider "custom" {
  # Configuration for the custom provider
}

resource "custom_resource" "example" {
  name = "example-resource"
}
```

---

#### **5. Best Practices for Terraform**

**5.1. Version Control**

- Store your Terraform configurations in version control systems like Git. This ensures that changes are tracked and collaborative work is streamlined.

**5.2. Use of Modules**

- Break down complex infrastructure into modules. This enhances reusability and reduces code duplication.

**5.3. State Management**

- Use remote state for collaboration and ensure that state files are encrypted and secured.

**5.4. Locking State**

- Use state locking to prevent concurrent state modifications when using remote backends like S3 with DynamoDB.

**5.5. Use `terraform validate`**

- Always run `terraform validate` to check the syntax and validity of your Terraform configurations before applying them.

**5.6. Avoid Hardcoding Values**

- Use variables and environment-specific configurations to avoid hardcoding sensitive data or region-specific information.

**5.7. Implement Proper Logging and Monitoring**

- Implement logging and monitoring for your Terraform deployments to track changes, catch issues early, and maintain audit trails.

**5.8. Implement Policy as Code**

- Use tools like HashiCorp Sentinel or Open Policy Agent (OPA) to enforce policies on your Terraform configurations.
