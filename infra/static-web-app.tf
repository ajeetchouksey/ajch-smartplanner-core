# Azure Static Web Apps for Frontend Hosting
resource "azurerm_static_web_app" "main" {
  name                = "stapp-${local.resource_prefix}"
  resource_group_name = azurerm_resource_group.main.name
  location            = "East US 2" # Static Web Apps have limited region availability
  sku_tier            = "Free"
  sku_size            = "Free"

  tags = local.common_tags
}

# Custom domain (optional for production)
resource "azurerm_static_web_app_custom_domain" "main" {
  count              = var.custom_domain != "" ? 1 : 0
  static_web_app_id  = azurerm_static_web_app.main.id
  domain_name        = var.custom_domain
  validation_type    = "dns-txt-token"
}
