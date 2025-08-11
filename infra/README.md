# SmartPlanner Azure Infrastructure

This directory contains Terraform configurations for deploying the SmartPlanner application infrastructure on Microsoft Azure.

## 🏗️ Architecture Overview

The infrastructure includes:

- **Azure Static Web Apps** - Hosts the React frontend applications
- **Azure Functions** - Serverless backend APIs (Node.js 18)
- **Azure Cosmos DB** - NoSQL database for user data and analytics
- **Azure Storage Account** - File storage with multiple containers
- **Azure Key Vault** - Secure secrets management
- **Application Insights** - Monitoring and logging
- **Log Analytics Workspace** - Centralized logging

## 📁 File Structure

```
infra/
├── main.tf                    # Core Terraform configuration
├── variables.tf               # Variable definitions
├── outputs.tf                 # Output values
├── static-web-app.tf         # Frontend hosting configuration
├── functions.tf              # Backend API configuration
├── cosmos-db.tf              # Database configuration
├── storage.tf                # File storage configuration
├── key-vault.tf              # Secrets management
├── monitoring.tf             # Logging and alerts
├── terraform.tfvars.example  # Configuration template
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

1. **Azure CLI** installed and authenticated
   ```bash
   az login
   az account set --subscription "your-subscription-id"
   ```

2. **Terraform** installed (version 1.0+)
   ```bash
   terraform --version
   ```

3. **OAuth Provider Setup** (see Configuration section)

### Deployment Steps

1. **Clone and navigate to infrastructure directory**
   ```bash
   cd infra/
   ```

2. **Create configuration file**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your configuration
   ```

3. **Initialize Terraform**
   ```bash
   terraform init
   ```

4. **Plan deployment**
   ```bash
   terraform plan
   ```

5. **Deploy infrastructure**
   ```bash
   terraform apply
   ```

6. **Note the outputs**
   ```bash
   terraform output
   ```

## ⚙️ Configuration

### Required Variables

Copy `terraform.tfvars.example` to `terraform.tfvars` and configure:

| Variable | Description | Required |
|----------|-------------|----------|
| `environment` | Environment name (dev/staging/prod) | ✅ |
| `location` | Azure region | ✅ |
| `microsoft_client_id` | Microsoft OAuth Client ID | ✅ |
| `microsoft_client_secret` | Microsoft OAuth Client Secret | ✅ |
| `google_client_id` | Google OAuth Client ID | ✅ |
| `google_client_secret` | Google OAuth Client Secret | ✅ |
| `facebook_app_id` | Facebook App ID | ✅ |
| `facebook_app_secret` | Facebook App Secret | ✅ |
| `jwt_secret` | JWT signing secret | ✅ |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `custom_domain` | Custom domain name | `""` |
| `enable_monitoring` | Enable Application Insights | `true` |
| `cosmos_db_throughput` | Cosmos DB RU/s | `400` |
| `storage_account_tier` | Storage performance tier | `"Standard"` |

## 🔐 OAuth Provider Setup

### Microsoft OAuth

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Configure redirect URIs based on your environment
5. Create a client secret
6. Copy Client ID and Client Secret

### Google OAuth

1. Go to [Google Developers Console](https://console.developers.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Create **OAuth 2.0 credentials**
5. Set authorized redirect URIs
6. Copy Client ID and Client Secret

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create a new app
3. Add **Facebook Login** product
4. Set Valid OAuth Redirect URIs
5. Copy App ID and App Secret

## 🌍 Environment Configuration

### Development
```hcl
environment = "dev"
oauth_redirect_uris = {
  dev = [
    "http://localhost:3000/auth/callback",
    "http://localhost:3001/auth/callback",
    "http://localhost:3003/auth/callback"
  ]
}
```

### Staging
```hcl
environment = "staging"
oauth_redirect_uris = {
  staging = [
    "https://smartplanner-staging.azurestaticapps.net/auth/callback"
  ]
}
```

### Production
```hcl
environment = "prod"
custom_domain = "smartplanner.app"
oauth_redirect_uris = {
  prod = [
    "https://smartplanner.app/auth/callback",
    "https://app.smartplanner.com/auth/callback"
  ]
}
```

## 💰 Cost Optimization

The infrastructure is designed to use Azure free tiers:

- **Static Web Apps**: Free tier includes 100GB bandwidth
- **Functions**: 1M requests/month free
- **Cosmos DB**: 400 RU/s and 5GB free
- **Storage**: First 5GB free for 12 months
- **Key Vault**: 10,000 operations free
- **Application Insights**: 5GB data free

### Cost Control Features

- Free tier options enabled by default
- Budget alerts for production environments
- Minimal resource provisioning
- Pay-per-use serverless architecture

## 📊 Monitoring

### Application Insights
- Automatic application monitoring
- Custom telemetry and metrics
- Performance tracking
- Error monitoring

### Log Analytics
- Centralized logging
- Query and analysis capabilities
- Custom dashboards
- Alert rules

### Diagnostic Settings
- Key Vault audit logs
- Storage operation logs
- Cosmos DB performance metrics
- Function execution logs

## 🛡️ Security

### Key Vault Features
- OAuth secrets stored securely
- RBAC-based access control
- Soft delete protection
- Audit logging

### Network Security
- CORS configuration per environment
- HTTPS enforcement
- Managed identity authentication
- Private endpoints (can be enabled)

### Access Control
- Function app managed identity
- Key Vault access policies
- Resource group isolation
- Environment-based separation

## 🔄 CI/CD Integration

### GitHub Actions Variables

Set these secrets in your GitHub repository:

```yaml
# Azure Credentials
AZURE_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
AZURE_CLIENT_SECRET: ${{ secrets.AZURE_CLIENT_SECRET }}
AZURE_SUBSCRIPTION_ID: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
AZURE_TENANT_ID: ${{ secrets.AZURE_TENANT_ID }}

# OAuth Configuration
MICROSOFT_CLIENT_ID: ${{ secrets.MICROSOFT_CLIENT_ID }}
MICROSOFT_CLIENT_SECRET: ${{ secrets.MICROSOFT_CLIENT_SECRET }}
GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
GOOGLE_CLIENT_SECRET: ${{ secrets.GOOGLE_CLIENT_SECRET }}
FACEBOOK_APP_ID: ${{ secrets.FACEBOOK_APP_ID }}
FACEBOOK_APP_SECRET: ${{ secrets.FACEBOOK_APP_SECRET }}
JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

## 🗂️ Resource Naming

Resources follow this naming convention:
- Resource Group: `rg-smartplanner-{environment}`
- Static Web App: `swa-smartplanner-{environment}`
- Function App: `func-smartplanner-{environment}`
- Cosmos DB: `cosmos-smartplanner-{environment}`
- Storage Account: `stsmartplanner{environment}`
- Key Vault: `kv-smartplanner-{environment}`

## 🧹 Cleanup

To destroy all resources:

```bash
terraform destroy
```

⚠️ **Warning**: This will permanently delete all data and resources.

## 📝 Troubleshooting

### Common Issues

1. **Resource name conflicts**
   - Solution: Change `environment` variable or add suffix

2. **OAuth redirect URI mismatch**
   - Solution: Update OAuth provider settings to match outputs

3. **Key Vault access denied**
   - Solution: Ensure proper Azure CLI authentication

4. **Cosmos DB quota exceeded**
   - Solution: Check Azure subscription limits

### Getting Help

1. Check Terraform plan output for errors
2. Review Azure portal for resource status
3. Check Application Insights for runtime errors
4. Review Key Vault access policies

## 📚 Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

---

For questions or issues, please refer to the main project documentation or create an issue in the repository.
