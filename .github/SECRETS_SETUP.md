# GitHub Secrets Setup Guide

This guide explains how to configure the required secrets and variables for the SmartPlanner CI/CD pipeline.

## Required GitHub Secrets

Configure these secrets in your repository settings (`Settings` → `Secrets and variables` → `Actions`):

### Azure Authentication Secrets ✅ CONFIGURED
```
AZURE_CLIENT_ID          # Service Principal Client ID ✅
AZURE_TENANT_ID          # Azure Tenant ID ✅ 
AZURE_SUBSCRIPTION_ID    # Azure Subscription ID ✅
```

### OAuth Provider Secrets (Active Providers Only)
```
GH_CLIENT_ID             # GitHub OAuth App Client ID ✅
GH_CLIENT_SECRET         # GitHub OAuth App Client Secret ✅
GOOGLE_CLIENT_ID         # Google OAuth App Client ID ✅
GOOGLE_CLIENT_SECRET     # Google OAuth App Client Secret ✅
```

### Application Secrets (Dummy Values for Now)
```
# These will use dummy values until you're ready to implement them:
# - Facebook OAuth (disabled for now)
# - JWT Authentication (using dummy key)
```

## Required GitHub Variables

Configure these variables in your repository settings (`Settings` → `Secrets and variables` → `Actions` → `Variables` tab):

**✅ USE YOUR EXISTING STORAGE ACCOUNT:**
```
TF_STATE_STORAGE_ACCOUNT = devagenticprodstg
TF_STATE_RESOURCE_GROUP  = dev-agentic-prod-rg
```

## Status Summary

✅ **CONFIGURED:** Azure authentication secrets  
✅ **CONFIGURED:** GitHub OAuth secrets  
✅ **CONFIGURED:** Google OAuth secrets  
✅ **FOUND:** Existing Azure storage account for Terraform state
❗ **FINAL STEP:** Add the 2 GitHub variables above  
⏳ **OPTIONAL:** Microsoft/Facebook OAuth (for future use)

## Azure Service Principal Setup

1. **Create a Service Principal:**
   ```bash
   az ad sp create-for-rbac --name "smartplanner-github-actions" \
     --role "Contributor" \
     --scopes /subscriptions/YOUR_SUBSCRIPTION_ID \
     --json-auth
   ```

2. **Note the output values:**
   - `clientId` → `AZURE_CLIENT_ID`
   - `tenantId` → `AZURE_TENANT_ID`
   - `subscriptionId` → `AZURE_SUBSCRIPTION_ID`

3. **Configure OIDC (recommended):**
   ```bash
   # Add federated credentials for GitHub Actions
   az ad app federated-credential create \
     --id YOUR_CLIENT_ID \
     --parameters '{
       "name": "smartplanner-main-branch",
       "issuer": "https://token.actions.githubusercontent.com",
       "subject": "repo:YOUR_USERNAME/YOUR_REPO:ref:refs/heads/main",
       "description": "GitHub Actions main branch",
       "audiences": ["api://AzureADTokenExchange"]
     }'
   ```

## Terraform State Storage Setup

Create a storage account for Terraform state (run once):

```bash
# Set variables
RESOURCE_GROUP_NAME="smartplanner-tfstate-rg"
STORAGE_ACCOUNT_NAME="smartplannertfstate$(date +%s)"
LOCATION="East US"

# Create resource group
az group create --name $RESOURCE_GROUP_NAME --location "$LOCATION"

# Create storage account
az storage account create \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $STORAGE_ACCOUNT_NAME \
  --sku Standard_LRS \
  --encryption-services blob

# Create container
az storage container create \
  --name tfstate \
  --account-name $STORAGE_ACCOUNT_NAME
```

## OAuth Provider Setup

### GitHub OAuth App ✅ CONFIGURED
Your GitHub OAuth app is already configured! The `GH_CLIENT_ID` and `GH_CLIENT_SECRET` are set.

### Google OAuth App ✅ CONFIGURED  
Your Google OAuth app is already configured! The `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.

### Disabled Providers (For Future Use)
- **Microsoft OAuth**: Will be configured later when needed
- **Facebook OAuth**: Will be configured later when needed

## Environment Configuration

The pipeline supports three environments with manual approval gates:

- **dev**: Auto-deploys on main branch push
- **staging**: Requires manual approval after dev deployment
- **prod**: Requires manual approval after staging deployment

Configure environment protection rules in `Settings` → `Environments`.

## Security Best Practices

1. **Use OIDC** instead of service principal secrets when possible
2. **Enable secret scanning** in repository settings
3. **Rotate secrets regularly** (every 90 days)
4. **Use environment-specific secrets** if values differ per environment
5. **Enable branch protection** on main branch
6. **Require status checks** before merging

## Verification

After setup, test the pipeline:

1. Make a change to infrastructure files
2. Create a pull request (triggers validation and planning)
3. Merge to main (triggers deployment to dev)
4. Approve staging deployment when ready
5. Approve production deployment when ready

## Troubleshooting

### Common Issues

1. **Secret not found**: Verify secret name matches exactly (case-sensitive)
2. **Azure authentication fails**: Check service principal permissions
3. **Terraform state issues**: Verify storage account access permissions
4. **OAuth errors**: Check redirect URIs match deployed app URLs

### Debug Commands

```bash
# Test Azure authentication
az account show

# Check service principal permissions
az role assignment list --assignee YOUR_CLIENT_ID

# Verify storage account access
az storage container list --account-name YOUR_STORAGE_ACCOUNT
```
