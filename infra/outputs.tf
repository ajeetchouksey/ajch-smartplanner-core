# Static Web App Outputs
output "static_web_app_url" {
  description = "The default URL of the static web app"
  value       = azurerm_static_site.main.default_host_name
  sensitive   = false
}

output "static_web_app_custom_domain" {
  description = "The custom domain URL (if configured)"
  value       = var.custom_domain != "" ? var.custom_domain : azurerm_static_site.main.default_host_name
  sensitive   = false
}

# Functions App Outputs
output "function_app_url" {
  description = "The URL of the Azure Functions app"
  value       = azurerm_linux_function_app.main.default_hostname
  sensitive   = false
}

output "function_app_name" {
  description = "The name of the Azure Functions app"
  value       = azurerm_linux_function_app.main.name
  sensitive   = false
}

# Cosmos DB Outputs
output "cosmos_db_endpoint" {
  description = "The endpoint for the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.endpoint
  sensitive   = false
}

output "cosmos_db_name" {
  description = "The name of the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.name
  sensitive   = false
}

# Storage Account Outputs
output "storage_account_name" {
  description = "The name of the storage account"
  value       = azurerm_storage_account.files.name
  sensitive   = false
}

output "storage_account_primary_endpoint" {
  description = "The primary blob endpoint for the storage account"
  value       = azurerm_storage_account.files.primary_blob_endpoint
  sensitive   = false
}

# Key Vault Outputs
output "key_vault_name" {
  description = "The name of the Key Vault"
  value       = azurerm_key_vault.main.name
  sensitive   = false
}

output "key_vault_uri" {
  description = "The URI of the Key Vault"
  value       = azurerm_key_vault.main.vault_uri
  sensitive   = false
}

# Application Insights Outputs
output "application_insights_name" {
  description = "The name of Application Insights"
  value       = var.enable_monitoring ? azurerm_application_insights.main[0].name : ""
  sensitive   = false
}

output "application_insights_app_id" {
  description = "The Application ID of Application Insights"
  value       = var.enable_monitoring ? azurerm_application_insights.main[0].app_id : ""
  sensitive   = false
}

output "application_insights_instrumentation_key" {
  description = "The instrumentation key of Application Insights"
  value       = var.enable_monitoring ? azurerm_application_insights.main[0].instrumentation_key : ""
  sensitive   = true
}

output "log_analytics_workspace_id" {
  description = "The ID of the Log Analytics workspace"
  value       = azurerm_log_analytics_workspace.main.id
  sensitive   = false
}

# Resource Group Output
output "resource_group_name" {
  description = "The name of the resource group"
  value       = azurerm_resource_group.main.name
  sensitive   = false
}

# OAuth Configuration Outputs for Frontend
output "oauth_redirect_uris" {
  description = "OAuth redirect URIs for the current environment"
  value       = var.oauth_redirect_uris[var.environment]
  sensitive   = false
}

output "allowed_cors_origins" {
  description = "Allowed CORS origins for the current environment"
  value       = var.allowed_cors_origins[var.environment]
  sensitive   = false
}

# Environment Configuration
output "environment" {
  description = "The current environment"
  value       = var.environment
  sensitive   = false
}

output "location" {
  description = "The Azure region"
  value       = var.location
  sensitive   = false
}

# Application Configuration for Runtime
output "app_configuration" {
  description = "Complete configuration object for the application"
  value = {
    environment = var.environment

    # API Configuration
    api = {
      base_url          = "https://${azurerm_linux_function_app.main.default_hostname}"
      function_app_name = azurerm_linux_function_app.main.name
    }

    # Frontend Configuration
    frontend = {
      url           = var.custom_domain != "" ? "https://${var.custom_domain}" : "https://${azurerm_static_site.main.default_host_name}"
      custom_domain = var.custom_domain
    }

    # OAuth Configuration
    oauth = {
      redirect_uris = var.oauth_redirect_uris[var.environment]
      cors_origins  = var.allowed_cors_origins[var.environment]
    }

    # Storage Configuration
    storage = {
      account_name  = azurerm_storage_account.files.name
      blob_endpoint = azurerm_storage_account.files.primary_blob_endpoint
      containers = {
        user_uploads     = azurerm_storage_container.user_uploads.name
        avatars          = azurerm_storage_container.avatars.name
        plan_attachments = azurerm_storage_container.plan_attachments.name
        exports          = azurerm_storage_container.exports.name
      }
    }

    # Database Configuration
    database = {
      account_name = azurerm_cosmosdb_account.main.name
      endpoint     = azurerm_cosmosdb_account.main.endpoint
      containers = {
        users     = azurerm_cosmosdb_sql_container.users.name
        plans     = azurerm_cosmosdb_sql_container.plans.name
        analytics = azurerm_cosmosdb_sql_container.analytics.name
        sessions  = azurerm_cosmosdb_sql_container.sessions.name
      }
    }

    # Security Configuration
    security = {
      key_vault_name = azurerm_key_vault.main.name
      key_vault_uri  = azurerm_key_vault.main.vault_uri
    }

    # Monitoring Configuration
    monitoring = var.enable_monitoring ? {
      application_insights = {
        name                = azurerm_application_insights.main[0].name
        app_id              = azurerm_application_insights.main[0].app_id
        instrumentation_key = azurerm_application_insights.main[0].instrumentation_key
        connection_string   = azurerm_application_insights.main[0].connection_string
      }
      log_analytics = {
        workspace_id   = azurerm_log_analytics_workspace.main.id
        workspace_name = azurerm_log_analytics_workspace.main.name
      }
    } : null
  }
  sensitive = false
}
