# Get current Azure AD user for Key Vault access
data "azurerm_client_config" "current" {}

# Key Vault for secrets management
resource "azurerm_key_vault" "main" {
  name                = "kv-${local.project_name}-${local.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  # Security settings
  soft_delete_retention_days = 7
  purge_protection_enabled   = var.environment == "prod" ? true : false

  # Network access
  public_network_access_enabled = true

  # RBAC enabled for modern access control
  enable_rbac_authorization = true

  tags = local.common_tags
}

# Key Vault access policy for current user (deployment)
resource "azurerm_key_vault_access_policy" "deployer" {
  key_vault_id = azurerm_key_vault.main.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  secret_permissions = [
    "Get",
    "List",
    "Set",
    "Delete",
    "Recover",
    "Backup",
    "Restore",
    "Purge"
  ]

  certificate_permissions = [
    "Get",
    "List",
    "Create",
    "Import",
    "Delete",
    "Recover",
    "Backup",
    "Restore",
    "ManageContacts",
    "ManageIssuers",
    "GetIssuers",
    "ListIssuers",
    "SetIssuers",
    "DeleteIssuers",
    "Purge"
  ]
}

# Key Vault access policy for Functions app
resource "azurerm_key_vault_access_policy" "functions" {
  key_vault_id = azurerm_key_vault.main.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_linux_function_app.main.identity[0].principal_id

  secret_permissions = [
    "Get",
    "List"
  ]

  depends_on = [azurerm_linux_function_app.main]
}

# OAuth secrets - these will be set manually or via GitHub Actions
resource "azurerm_key_vault_secret" "microsoft_client_id" {
  name         = "MICROSOFT-CLIENT-ID"
  value        = var.microsoft_client_id != "" ? var.microsoft_client_id : "placeholder"
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [azurerm_key_vault_access_policy.deployer]

  lifecycle {
    ignore_changes = [value]
  }
}

resource "azurerm_key_vault_secret" "microsoft_client_secret" {
  name         = "MICROSOFT-CLIENT-SECRET"
  value        = var.microsoft_client_secret != "" ? var.microsoft_client_secret : "placeholder"
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [azurerm_key_vault_access_policy.deployer]

  lifecycle {
    ignore_changes = [value]
  }
}

resource "azurerm_key_vault_secret" "google_client_id" {
  name         = "GOOGLE-CLIENT-ID"
  value        = var.google_client_id != "" ? var.google_client_id : "placeholder"
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [azurerm_key_vault_access_policy.deployer]

  lifecycle {
    ignore_changes = [value]
  }
}

resource "azurerm_key_vault_secret" "google_client_secret" {
  name         = "GOOGLE-CLIENT-SECRET"
  value        = var.google_client_secret != "" ? var.google_client_secret : "placeholder"
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [azurerm_key_vault_access_policy.deployer]

  lifecycle {
    ignore_changes = [value]
  }
}

resource "azurerm_key_vault_secret" "facebook_app_id" {
  name         = "FACEBOOK-APP-ID"
  value        = var.facebook_app_id != "" ? var.facebook_app_id : "placeholder"
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [azurerm_key_vault_access_policy.deployer]

  lifecycle {
    ignore_changes = [value]
  }
}

resource "azurerm_key_vault_secret" "facebook_app_secret" {
  name         = "FACEBOOK-APP-SECRET"
  value        = var.facebook_app_secret != "" ? var.facebook_app_secret : "placeholder"
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [azurerm_key_vault_access_policy.deployer]

  lifecycle {
    ignore_changes = [value]
  }
}

# JWT secret for token signing
resource "azurerm_key_vault_secret" "jwt_secret" {
  name         = "JWT-SECRET"
  value        = var.jwt_secret != "" ? var.jwt_secret : "placeholder-change-in-production"
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [azurerm_key_vault_access_policy.deployer]

  lifecycle {
    ignore_changes = [value]
  }
}

# Database connection string
resource "azurerm_key_vault_secret" "cosmos_connection_string" {
  name         = "COSMOS-CONNECTION-STRING"
  value        = azurerm_cosmosdb_account.main.connection_strings[0]
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [azurerm_key_vault_access_policy.deployer]
}

# Storage connection string
resource "azurerm_key_vault_secret" "storage_connection_string" {
  name         = "STORAGE-CONNECTION-STRING"
  value        = azurerm_storage_account.files.primary_connection_string
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [azurerm_key_vault_access_policy.deployer]
}
