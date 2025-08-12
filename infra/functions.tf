# Storage Account for Azure Functions

resource "azurerm_storage_account" "functions" {
  name                     = "stfunc${local.project_name}${local.environment}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = var.storage_account_tier
  account_replication_type = "LRS"

  # Security settings
  allow_nested_items_to_be_public = false
  shared_access_key_enabled       = true

  tags = local.common_tags
}

# Azure Functions Service Plan (Consumption)
resource "azurerm_service_plan" "functions" {
  name                = "plan-${local.resource_prefix}-functions"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = "Y1" # Consumption plan (FREE tier)

  tags = local.common_tags
}

# Azure Functions App
resource "azurerm_linux_function_app" "main" {
  name                = "func-${local.resource_prefix}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  storage_account_name       = azurerm_storage_account.functions.name
  storage_account_access_key = azurerm_storage_account.functions.primary_access_key
  service_plan_id            = azurerm_service_plan.functions.id

  site_config {
    # Node.js runtime
    application_stack {
      node_version = "18"
    }

    # CORS configuration
    cors {
      allowed_origins     = var.allowed_cors_origins[var.environment]
      support_credentials = true
    }

    # Security headers
    http2_enabled = true

    # Application settings for better performance
    app_scale_limit          = var.environment == "prod" ? 10 : 5
    elastic_instance_minimum = 0
    use_32_bit_worker        = false
  }

  # Environment variables
  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"     = "node"
    "WEBSITE_NODE_DEFAULT_VERSION" = "~18"
    "AzureWebJobsDisableHomepage"  = "true"
    "FUNCTIONS_EXTENSION_VERSION"  = "~4"

    # Application Insights configuration
    "APPINSIGHTS_INSTRUMENTATIONKEY"             = var.enable_monitoring ? azurerm_application_insights.main[0].instrumentation_key : ""
    "APPLICATIONINSIGHTS_CONNECTION_STRING"      = var.enable_monitoring ? azurerm_application_insights.main[0].connection_string : ""
    "ApplicationInsightsAgent_EXTENSION_VERSION" = "~3"
    "XDT_MicrosoftApplicationInsights_Mode"      = var.enable_monitoring ? "Recommended" : "Off"
    "APPINSIGHTS_PROFILERFEATURE_VERSION"        = var.enable_monitoring ? "1.0.0" : "disabled"
    "APPINSIGHTS_SNAPSHOTFEATURE_VERSION"        = var.enable_monitoring ? "1.0.0" : "disabled"
    "DiagnosticServices_EXTENSION_VERSION"       = var.enable_monitoring ? "~3" : "disabled"
    "InstrumentationEngine_EXTENSION_VERSION"    = var.enable_monitoring ? "disabled" : "disabled" # Disabled for cost optimization

    # Application configuration
  "ENVIRONMENT"             = var.environment
  "APP_NAME"                = "SmartPlanner"
  "LOG_LEVEL"               = var.environment == "prod" ? "warn" : "debug"
  "COSMOS_DB_ENDPOINT"      = azurerm_cosmosdb_account.main.endpoint
  "COSMOS_DB_KEY"           = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.main.name};SecretName=cosmos-db-key)"
  "COSMOS_DB_DATABASE_NAME" = azurerm_cosmosdb_sql_database.main.name
    # Storage configuration
    "STORAGE_ACCOUNT_NAME" = azurerm_storage_account.files.name
    "STORAGE_ACCOUNT_KEY"  = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.main.name};SecretName=storage-account-key)"

    # OAuth configuration (stored in Key Vault)
    "GOOGLE_CLIENT_ID"        = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.main.name};SecretName=google-client-id)"
    "GOOGLE_CLIENT_SECRET"    = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.main.name};SecretName=google-client-secret)"
    "MICROSOFT_CLIENT_ID"     = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.main.name};SecretName=microsoft-client-id)"
    "MICROSOFT_CLIENT_SECRET" = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.main.name};SecretName=microsoft-client-secret)"
    "FACEBOOK_CLIENT_ID"      = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.main.name};SecretName=facebook-client-id)"
    "FACEBOOK_CLIENT_SECRET"  = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.main.name};SecretName=facebook-client-secret)"
    "GITHUB_CLIENT_ID"        = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.main.name};SecretName=github-client-id)"
    "GITHUB_CLIENT_SECRET"    = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.main.name};SecretName=github-client-secret)"

    # JWT configuration
    "JWT_SECRET" = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.main.name};SecretName=jwt-secret)"
    "JWT_EXPIRY" = "24h"

    # Application Insights
    "APPINSIGHTS_INSTRUMENTATIONKEY" = var.enable_monitoring ? azurerm_application_insights.main[0].instrumentation_key : ""

    # Feature flags
    "ENABLE_ANALYTICS"   = "true"
    "ENABLE_CACHING"     = "true"
    "RATE_LIMIT_ENABLED" = var.environment == "prod" ? "true" : "false"
  }

  # Managed Identity for Key Vault access
  identity {
    type = "SystemAssigned"
  }

  tags = local.common_tags
}
