# Azure Cosmos DB Account
resource "azurerm_cosmosdb_account" "main" {
  name                = "cosmos-${local.resource_prefix}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  
  # Free tier for development
  free_tier_enabled = var.environment == "dev" ? true : false
  
  # Consistency policy
  consistency_policy {
    consistency_level       = "Session"
    max_interval_in_seconds = 10
    max_staleness_prefix    = 200
  }
  
  # Geographic locations
  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
    zone_redundant    = false
  }
  
  # Backup policy
  backup {
    type                = "Periodic"
    interval_in_minutes = 1440  # Daily
    retention_in_hours  = 720   # 30 days
    storage_redundancy  = "Local"
  }
  
  # Network access
  public_network_access_enabled = true
  ip_range_filter              = "" # Allow all IPs for now
  
  # Capabilities
  capabilities {
    name = "EnableServerless"
  }
  
  tags = local.common_tags
}

# Main Database
resource "azurerm_cosmosdb_sql_database" "main" {
  name                = "smartplanner"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  
  # Throughput settings
  throughput = var.environment == "dev" ? var.cosmos_db_throughput : null
  
  # Auto-scaling for non-dev environments
  dynamic "autoscale_settings" {
    for_each = var.environment != "dev" ? [1] : []
    content {
      max_throughput = 1000
    }
  }
}

# Users Container
resource "azurerm_cosmosdb_sql_container" "users" {
  name                = "users"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.main.name
  partition_key_paths = ["/userId"]
  
  # Indexing policy for user queries
  indexing_policy {
    indexing_mode = "consistent"
    
    included_path {
      path = "/*"
    }
    
    included_path {
      path = "/email/?"
    }
    
    excluded_path {
      path = "/\"_etag\"/?"
    }
  }
  
  # Unique key policy for email uniqueness
  unique_key {
    paths = ["/email"]
  }
}

# Plans Container
resource "azurerm_cosmosdb_sql_container" "plans" {
  name                = "plans"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.main.name
  partition_key_paths = ["/userId"]
  
  # TTL for plan data (optional)
  default_ttl = -1 # Disabled
  
  indexing_policy {
    indexing_mode = "consistent"
    
    included_path {
      path = "/*"
    }
    
    included_path {
      path = "/planType/?"
    }
    
    included_path {
      path = "/createdDate/?"
    }
    
    excluded_path {
      path = "/\"_etag\"/?"
    }
  }
}

# Analytics Container
resource "azurerm_cosmosdb_sql_container" "analytics" {
  name                = "analytics"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.main.name
  partition_key_paths = ["/date"]
  
  # TTL for analytics data (90 days)
  default_ttl = 7776000 # 90 days in seconds
  
  indexing_policy {
    indexing_mode = "consistent"
    
    included_path {
      path = "/date/?"
    }
    
    included_path {
      path = "/userId/?"
    }
    
    excluded_path {
      path = "/*"
    }
  }
}

# Sessions Container (for OAuth state management)
resource "azurerm_cosmosdb_sql_container" "sessions" {
  name                = "sessions"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.main.name
  partition_key_paths = ["/sessionId"]
  
  # TTL for session data (24 hours)
  default_ttl = 86400 # 24 hours
  
  indexing_policy {
    indexing_mode = "consistent"
    
    included_path {
      path = "/sessionId/?"
    }
    
    excluded_path {
      path = "/*"
    }
  }
}
