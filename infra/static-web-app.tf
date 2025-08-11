# Azure Static Web Apps for Frontend Hosting
resource "azurerm_static_site" "main" {
  name                = "stapp-${local.resource_prefix}"
  resource_group_name = azurerm_resource_group.main.name
  location            = "East US 2" # Static Web Apps have limited region availability
  sku_tier            = "Free"
  sku_size            = "Free"

  tags = local.common_tags
}

# Custom domain (optional for production)
resource "azurerm_static_site_custom_domain" "main" {
  count           = var.custom_domain != "" ? 1 : 0
  static_site_id  = azurerm_static_site.main.id
  domain_name     = var.custom_domain
  validation_type = "dns-txt-token"
}

# Static Web App Configuration
resource "azurerm_static_site_function_app_registration" "main" {
  static_site_id  = azurerm_static_site.main.id
  function_app_id = azurerm_linux_function_app.main.id
}
