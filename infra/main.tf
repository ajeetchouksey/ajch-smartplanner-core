terraform {
  required_version = ">= 1.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  
  # Remote state storage (optional for MVP)
  backend "azurerm" {
    resource_group_name  = "rg-smartplanner-terraform"
    storage_account_name = "smartplannerterraform"
    container_name       = "tfstate"
    key                  = "smartplanner.tfstate"
  }
}

provider "azurerm" {
  features {
    # Enable advanced features
    key_vault {
      purge_soft_delete_on_destroy    = true
      recover_soft_deleted_key_vaults = true
    }
    
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

# Local variables for consistent naming
locals {
  project_name = "smartplanner"
  environment  = var.environment
  location     = var.location
  
  # Resource naming convention
  resource_prefix = "${local.project_name}-${local.environment}"
  
  common_tags = {
    Project      = "SmartPlanner"
    Environment  = local.environment
    ManagedBy    = "Terraform"
    Repository   = "ajch-smartplanner-core"
    Owner        = "ajeet.chouksey"
    CreatedDate  = timestamp()
  }
}

# Main Resource Group
# Deployment trigger: Ready for first infrastructure deployment!
resource "azurerm_resource_group" "main" {
  name     = "rg-${local.resource_prefix}"
  location = local.location
  tags     = local.common_tags
}
