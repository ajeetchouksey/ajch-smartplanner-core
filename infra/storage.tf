# Storage Account for Files
resource "azurerm_storage_account" "files" {
  name                     = "st${local.project_name}${local.environment}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = var.storage_account_tier
  account_replication_type = "LRS"
  
  # Security settings
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = false
  shared_access_key_enabled       = true
  
  # CORS configuration for direct uploads
  cross_tenant_replication_enabled = false
  
  # Blob properties
  blob_properties {
    # Enable versioning for production
    versioning_enabled = var.environment == "prod"
    
    # Lifecycle management
    delete_retention_policy {
      days = var.environment == "prod" ? 30 : 7
    }
    
    container_delete_retention_policy {
      days = var.environment == "prod" ? 30 : 7
    }
  }
  
  tags = local.common_tags
}

# Container for user uploads
resource "azurerm_storage_container" "user_uploads" {
  name                  = "user-uploads"
  storage_account_id    = azurerm_storage_account.files.id
  container_access_type = "private"
}

# Container for user avatars
resource "azurerm_storage_container" "avatars" {
  name                  = "avatars"
  storage_account_id    = azurerm_storage_account.files.id
  container_access_type = "blob" # Public read for avatars
}

# Container for plan attachments
resource "azurerm_storage_container" "plan_attachments" {
  name                  = "plan-attachments"
  storage_account_id    = azurerm_storage_account.files.id
  container_access_type = "private"
}

# Container for exports
resource "azurerm_storage_container" "exports" {
  name                  = "exports"
  storage_account_id    = azurerm_storage_account.files.id
  container_access_type = "private"
}

# Storage Queue for background processing
resource "azurerm_storage_queue" "file_processing" {
  name                 = "file-processing"
  storage_account_name = azurerm_storage_account.files.name
}

# Storage Table for lightweight data
resource "azurerm_storage_table" "app_config" {
  name                 = "appconfig"
  storage_account_name = azurerm_storage_account.files.name
}
