# Terraform State Storage Setup Commands

## Step 1: Login to Azure (with the correct subscription)
```bash
# Try logging in with your subscription tenant
az login --tenant YOUR_TENANT_ID

# Or if you need to use a different account
az login --allow-no-subscriptions
az account set --subscription YOUR_SUBSCRIPTION_ID
```

## Step 2: Create Terraform State Storage
```bash
# Set variables
RESOURCE_GROUP_NAME="smartplanner-tfstate-rg"
STORAGE_ACCOUNT_NAME="smartplannertfstate$(date +%s)"
LOCATION="East US"

# Create resource group
az group create --name $RESOURCE_GROUP_NAME --location "$LOCATION"

# Create storage account (note the name - you'll need it for GitHub variables)
az storage account create \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $STORAGE_ACCOUNT_NAME \
  --sku Standard_LRS \
  --encryption-services blob

# Create container for Terraform state
az storage container create \
  --name tfstate \
  --account-name $STORAGE_ACCOUNT_NAME

# Display the values you need for GitHub
echo "=== GitHub Variables Needed ==="
echo "TF_STATE_STORAGE_ACCOUNT: $STORAGE_ACCOUNT_NAME"
echo "TF_STATE_RESOURCE_GROUP: $RESOURCE_GROUP_NAME"
```

## Step 3: Configure GitHub Variables

1. Go to your repository: `https://github.com/ajeetchouksey/ajch-smartplanner-core`
2. Navigate to: **Settings** → **Secrets and variables** → **Actions** → **Variables** tab
3. Click **"New repository variable"** and add:

   - **Name**: `TF_STATE_STORAGE_ACCOUNT`
   - **Value**: `[the storage account name from step 2]`

   - **Name**: `TF_STATE_RESOURCE_GROUP`  
   - **Value**: `smartplanner-tfstate-rg`

## Step 4: Test Your Pipeline

Once the variables are set:

1. **Make a small change** to any file in the `infra/` folder
2. **Commit and push** to main branch
3. **Watch the GitHub Actions** run automatically
4. **Approve deployments** for staging and production when ready

## Current Status ✅

- ✅ Azure authentication secrets configured
- ✅ GitHub & Google OAuth configured  
- ✅ CI/CD pipeline ready
- ⏳ Terraform state storage (run commands above)
- ⏳ GitHub variables setup

You're one step away from live deployment! 🚀
