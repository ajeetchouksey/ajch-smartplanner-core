# Log Analytics Workspace for Application Insights
resource "azurerm_log_analytics_workspace" "main" {
  name                = "log-${local.project_name}-${local.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = var.environment == "prod" ? 30 : 7 # Free tier: 7 days

  tags = local.common_tags
}

# Application Insights for monitoring
resource "azurerm_application_insights" "main" {
  count               = var.enable_monitoring ? 1 : 0
  name                = "appi-${local.project_name}-${local.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  workspace_id        = azurerm_log_analytics_workspace.main.id
  application_type    = "web"

  # Free tier settings
  retention_in_days   = var.environment == "prod" ? 90 : 30
  sampling_percentage = var.environment == "prod" ? 100 : 50 # Reduce sampling for cost

  tags = local.common_tags
}

# Application Insights API Key for Functions
resource "azurerm_application_insights_api_key" "main" {
  count                   = var.enable_monitoring ? 1 : 0
  name                    = "api-key-functions"
  application_insights_id = azurerm_application_insights.main[0].id
  read_permissions        = ["aggregate", "api", "draft", "extendqueries", "search"]
  write_permissions       = ["annotations"]
}

# Diagnostic Settings for Key Vault
resource "azurerm_monitor_diagnostic_setting" "key_vault" {
  count                      = var.enable_monitoring ? 1 : 0
  name                       = "diag-key-vault"
  target_resource_id         = azurerm_key_vault.main.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  enabled_log {
    category = "AuditEvent"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}

# Diagnostic Settings for Storage Account
resource "azurerm_monitor_diagnostic_setting" "storage" {
  count                      = var.enable_monitoring ? 1 : 0
  name                       = "diag-storage"
  target_resource_id         = azurerm_storage_account.files.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  enabled_log {
    category = "StorageRead"
  }

  enabled_log {
    category = "StorageWrite"
  }

  enabled_log {
    category = "StorageDelete"
  }

  metric {
    category = "Transaction"
    enabled  = true
  }

  metric {
    category = "Capacity"
    enabled  = true
  }
}

# Diagnostic Settings for Cosmos DB
resource "azurerm_monitor_diagnostic_setting" "cosmos_db" {
  count                      = var.enable_monitoring ? 1 : 0
  name                       = "diag-cosmos-db"
  target_resource_id         = azurerm_cosmosdb_account.main.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  enabled_log {
    category = "DataPlaneRequests"
  }

  enabled_log {
    category = "QueryRuntimeStatistics"
  }

  enabled_log {
    category = "PartitionKeyStatistics"
  }

  metric {
    category = "Requests"
    enabled  = true
  }
}

# Action Group for Alerts (Email notifications)
resource "azurerm_monitor_action_group" "main" {
  count               = var.enable_monitoring ? 1 : 0
  name                = "ag-${local.project_name}-${local.environment}"
  resource_group_name = azurerm_resource_group.main.name
  short_name          = "smartplan"

  # Email notifications can be added later via Azure Portal
  # or set via variables if needed

  tags = local.common_tags
}

# Application Insights Alert Rules
resource "azurerm_monitor_metric_alert" "function_failures" {
  count               = var.enable_monitoring ? 1 : 0
  name                = "alert-function-failures-${local.environment}"
  resource_group_name = azurerm_resource_group.main.name
  scopes              = [azurerm_linux_function_app.main.id]
  description         = "Alert when function failure rate is high"

  criteria {
    metric_namespace = "Microsoft.Web/sites"
    metric_name      = "Http5xx"
    aggregation      = "Count"
    operator         = "GreaterThan"
    threshold        = 5

    dimension {
      name     = "Instance"
      operator = "Include"
      values   = ["*"]
    }
  }

  window_size = "PT5M"
  frequency   = "PT1M"
  severity    = 2

  action {
    action_group_id = azurerm_monitor_action_group.main[0].id
  }

  tags = local.common_tags
}

resource "azurerm_monitor_metric_alert" "response_time" {
  count               = var.enable_monitoring ? 1 : 0
  name                = "alert-response-time-${local.environment}"
  resource_group_name = azurerm_resource_group.main.name
  scopes              = [azurerm_application_insights.main[0].id]
  description         = "Alert when average response time is high"

  criteria {
    metric_namespace = "Microsoft.Insights/components"
    metric_name      = "requests/duration"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 5000 # 5 seconds
  }

  window_size = "PT15M"
  frequency   = "PT5M"
  severity    = 3

  action {
    action_group_id = azurerm_monitor_action_group.main[0].id
  }

  tags = local.common_tags
}

# Budget Alert for Cost Management
resource "azurerm_consumption_budget_resource_group" "main" {
  count             = var.environment == "prod" ? 1 : 0
  name              = "budget-${local.project_name}-${local.environment}"
  resource_group_id = azurerm_resource_group.main.id

  amount     = 50 # $50 USD monthly budget
  time_grain = "Monthly"

  time_period {
    start_date = formatdate("YYYY-MM-01", timestamp())
    end_date   = formatdate("YYYY-MM-01", timeadd(timestamp(), "8760h")) # 1 year from now
  }

  filter {
    dimension {
      name   = "ResourceGroupName"
      values = [azurerm_resource_group.main.name]
    }
  }

  notification {
    enabled        = true
    threshold      = 80 # Alert at 80% of budget
    operator       = "GreaterThan"
    threshold_type = "Actual"

    contact_emails = [
      # Email addresses can be added via variables if needed
    ]
  }

  notification {
    enabled        = true
    threshold      = 100 # Alert at 100% of budget
    operator       = "GreaterThan"
    threshold_type = "Forecasted"

    contact_emails = [
      # Email addresses can be added via variables if needed
    ]
  }
}

# Application Insights Workbook for monitoring dashboard
resource "azurerm_application_insights_workbook" "main" {
  count               = var.enable_monitoring ? 1 : 0
  name                = "workbook--"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  display_name        = "SmartPlanner Monitoring Dashboard"

  data_json = jsonencode({
    version = "Notebook/1.0"
    items = [
      {
        type = 1
        content = {
          json = "# SmartPlanner Application Monitoring\n\nOverview of application performance and health metrics."
        }
      },
      {
        type = 3
        content = {
          version = "KqlItem/1.0"
          query   = "requests | summarize RequestCount = count() by bin(timestamp, 5m) | render timechart"
          size    = 0
          title   = "Request Rate Over Time"
          timeContext = {
            durationMs = 3600000
          }
          queryType    = 0
          resourceType = "microsoft.insights/components"
        }
      },
      {
        type = 3
        content = {
          version = "KqlItem/1.0"
          query   = "requests | summarize AvgDuration = avg(duration) by bin(timestamp, 5m) | render timechart"
          size    = 0
          title   = "Average Response Time"
          timeContext = {
            durationMs = 3600000
          }
          queryType    = 0
          resourceType = "microsoft.insights/components"
        }
      },
      {
        type = 3
        content = {
          version = "KqlItem/1.0"
          query   = "exceptions | summarize ExceptionCount = count() by bin(timestamp, 5m) | render timechart"
          size    = 0
          title   = "Exception Rate"
          timeContext = {
            durationMs = 3600000
          }
          queryType    = 0
          resourceType = "microsoft.insights/components"
        }
      }
    ]
  })

  source_id = azurerm_application_insights.main[0].id

  tags = local.common_tags
}
