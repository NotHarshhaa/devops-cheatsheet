# 🔷 Azure Cheatsheet

![text](https://imgur.com/f7RWwnx.png)

**Microsoft Azure** is an enterprise cloud computing platform offering hundreds of integrated services across compute, analytics, storage, networking, AI, and security.

---

## **1. CLI Setup & Authentication**

```bash
# Log in interactively via browser
az login

# Set active subscription
az account set --subscription "My-Subscription-ID"

# List resource groups in table format
az group list --output table
```

---

## **2. Core Compute Services**

### 🔹 Azure Virtual Machines (VMs)

```bash
# Create a Resource Group
az group create --name rg-production --location eastus

# Deploy an Ubuntu Linux VM with SSH key generation
az vm create \
  --resource-group rg-production \
  --name web-vm-01 \
  --image Ubuntu2204 \
  --size Standard_B2s \
  --admin-username azureuser \
  --generate-ssh-keys

# Open HTTP port in Network Security Group (NSG)
az vm open-port --resource-group rg-production --name web-vm-01 --port 80
```

### 🔹 Azure Container Apps (Serverless Containers)

Built on Kubernetes, KEDA, and Envoy. Run microservices and background jobs without managing Kubernetes clusters:

```bash
# Create container apps managed environment
az containerapp env create \
  --name my-env \
  --resource-group rg-production \
  --location eastus

# Deploy a serverless container with external HTTP ingress
az containerapp create \
  --name api-service \
  --resource-group rg-production \
  --environment my-env \
  --image mcr.microsoft.com/azuredocs/aci-helloworld:latest \
  --target-port 80 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 10
```

### 🔹 Azure Kubernetes Service (AKS)

```bash
# Create an AKS cluster with managed system identity and Azure CNI
az aks create \
  --resource-group rg-production \
  --name prod-aks-cluster \
  --node-count 3 \
  --node-vm-size Standard_D2s_v5 \
  --enable-managed-identity \
  --network-plugin azure \
  --generate-ssh-keys

# Get credentials for kubectl
az aks get-credentials --resource-group rg-production --name prod-aks-cluster
```

---

## **3. Storage Services**

### 🔹 Azure Blob Storage

Scalable object storage for unstructured data:

```bash
# Create a storage account with TLS 1.2 minimum
az storage account create \
  --name mystorageacct2026 \
  --resource-group rg-production \
  --location eastus \
  --sku Standard_LRS \
  --min-tls-version TLS1_2

# Create container
az storage container create \
  --name app-backups \
  --account-name mystorageacct2026 \
  --auth-mode login

# Upload a blob using Entra ID authentication
az storage blob upload \
  --account-name mystorageacct2026 \
  --container-name app-backups \
  --name backup.tar.gz \
  --file /tmp/backup.tar.gz \
  --auth-mode login
```

---

## **4. Managed Databases**

### 🔹 Azure Database for PostgreSQL / MySQL (Flexible Server)

> [!IMPORTANT]
> **Architecture Note**: Azure Single Server is retired. Always deploy **Flexible Server** for zone-redundant high availability, burstable compute, and custom maintenance windows.

```bash
# Create PostgreSQL Flexible Server
az postgres flexible-server create \
  --resource-group rg-production \
  --name pg-prod-flex \
  --location eastus \
  --tier GeneralPurpose \
  --sku-name Standard_D2ds_v4 \
  --storage-size 128 \
  --version 16 \
  --admin-user dbadmin \
  --admin-password "StrongP@ssw0rd123!"
```

### 🔹 Azure Cosmos DB (Multi-Model Globally Distributed DB)

```bash
# Create Cosmos DB account with serverless capacity mode
az cosmosdb create \
  --name cosmos-app-prod \
  --resource-group rg-production \
  --capabilities EnableServerless \
  --default-consistency-level Session \
  --locations regionName=eastus
```

---

## **5. Networking: VNet, Peering & Load Balancing**

```bash
# Create Virtual Network with custom subnets
az network vnet create \
  --resource-group rg-production \
  --name prod-vnet \
  --address-prefix 10.0.0.0/16 \
  --subnet-name web-subnet \
  --subnet-prefix 10.0.1.0/24

# Create Network Security Group (NSG) and allow HTTPS
az network nsg create --resource-group rg-production --name web-nsg
az network nsg rule create \
  --resource-group rg-production \
  --nsg-name web-nsg \
  --name AllowHTTPS \
  --priority 100 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --destination-port-ranges 443
```

---

## **6. Identity, Security & Governance**

### 🔹 Microsoft Entra ID (Formerly Azure Active Directory / AAD)

Microsoft's enterprise cloud identity and access management service.

```bash
# Create a new user
az ad user create \
  --display-name "Jane DevOps" \
  --user-principal-name "jane@mydomain.onmicrosoft.com" \
  --password "SecureP@ssw0rd!"

# Assign Contributor role to a managed identity on a resource group
az role assignment create \
  --assignee "<MANAGED_IDENTITY_PRINCIPAL_ID>" \
  --role "Contributor" \
  --resource-group rg-production
```

### 🔹 Managed Identities (Zero Credential Leaks)

Enable a System-Assigned Managed Identity on a VM so it can access Azure Key Vault without hardcoded credentials:

```bash
# Enable system-assigned identity on VM
az vm identity assign --resource-group rg-production --name web-vm-01

# Grant VM identity access to read Key Vault secrets
az keyvault set-policy \
  --name prod-keyvault \
  --object-id $(az vm show -g rg-production -n web-vm-01 --query identity.principalId -o tsv) \
  --secret-permissions get list
```

### 🔹 Microsoft Defender for Cloud (Formerly Azure Security Center)

Continuously assesses cloud resource posture and generates Secure Score recommendations.

---

## **7. Infrastructure as Code: Bicep & ARM**

Azure Bicep is the modern, clean domain-specific language replacing verbose ARM JSON templates.

File: `main.bicep`:

```bicep
param location string = resourceGroup().location
param storageAccountName string = 'stg${uniqueString(resourceGroup().id)}'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

output storageId string = storageAccount.id
```

Deploy Bicep file:

```bash
az deployment group create \
  --resource-group rg-production \
  --template-file main.bicep
```

---

## **8. Monitoring & Cost Budgets**

```bash
# Create a monthly spending budget with email notifications
az consumption budget create \
  --name MonthlyDevOpsBudget \
  --resource-group rg-production \
  --amount 1000 \
  --time-grain Monthly \
  --start-date 2026-01-01 \
  --end-date 2026-12-31
```

---

## 📚 **Learning Resources**

* 🔗 [Official Microsoft Azure Documentation](https://learn.microsoft.com/azure/)
* 📦 [Azure Architecture Center](https://learn.microsoft.com/azure/architecture/)
* 💻 [Azure CLI Command Reference](https://learn.microsoft.com/cli/azure/)
* 🔷 [Azure Bicep Documentation](https://learn.microsoft.com/azure/azure-resource-manager/bicep/)
