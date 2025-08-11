# Environment Configuration
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "East US"
}

# Domain Configuration
variable "custom_domain" {
  description = "Custom domain for the application"
  type        = string
  default     = ""
}

# OAuth Configuration
variable "oauth_redirect_uris" {
  description = "OAuth redirect URIs for different environments"
  type        = map(list(string))
  default = {
    dev = [
      "http://localhost:3000/auth/callback",
      "http://localhost:3001/auth/callback",
      "http://localhost:3003/auth/callback"
    ]
    staging = [
      "https://smartplanner-staging.azurestaticapps.net/auth/callback"
    ]
    prod = [
      "https://smartplanner.app/auth/callback",
      "https://app.smartplanner.com/auth/callback"
    ]
  }
}

# CORS Configuration
variable "allowed_cors_origins" {
  description = "Allowed CORS origins for API calls"
  type        = map(list(string))
  default = {
    dev = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3003"
    ]
    staging = [
      "https://smartplanner-staging.azurestaticapps.net"
    ]
    prod = [
      "https://smartplanner.app",
      "https://app.smartplanner.com"
    ]
  }
}

# Cost Control
variable "enable_monitoring" {
  description = "Enable Application Insights monitoring"
  type        = bool
  default     = true
}

variable "cosmos_db_throughput" {
  description = "Cosmos DB throughput (RU/s)"
  type        = number
  default     = 400 # Free tier
}

variable "storage_account_tier" {
  description = "Storage account performance tier"
  type        = string
  default     = "Standard"

  validation {
    condition     = contains(["Standard", "Premium"], var.storage_account_tier)
    error_message = "Storage tier must be Standard or Premium."
  }
}

# OAuth Secrets - These will be set via GitHub Secrets or manually
variable "microsoft_client_id" {
  description = "Microsoft OAuth Client ID"
  type        = string
  default     = ""
  sensitive   = true
}

variable "microsoft_client_secret" {
  description = "Microsoft OAuth Client Secret"
  type        = string
  default     = ""
  sensitive   = true
}

variable "google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
  default     = ""
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth Client Secret"
  type        = string
  default     = ""
  sensitive   = true
}

variable "facebook_app_id" {
  description = "Facebook App ID"
  type        = string
  default     = ""
  sensitive   = true
}

variable "facebook_app_secret" {
  description = "Facebook App Secret"
  type        = string
  default     = ""
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  default     = ""
  sensitive   = true
}
