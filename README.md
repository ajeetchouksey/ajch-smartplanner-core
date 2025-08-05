# SmartPlanner Core

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/) 
[![Author: Ajeet Kumar Chouksey](https://img.shields.io/badge/Author-Ajeet%20Kumar%20Chouksey-blue)](mailto:ajeetkchouksey@users.noreply.github.com) 
[![GitHub Stars](https://img.shields.io/github/stars/ajeetkchouksey/ajch-smartplanner-core?style=social)](https://github.com/ajeetkchouksey/ajch-smartplanner-core/stargazers) 
[![GitHub Forks](https://img.shields.io/github/forks/ajeetkchouksey/ajch-smartplanner-core?style=social)](https://github.com/ajeetkchouksey/ajch-smartplanner-core/network/members)

A modular, AI/ML-powered planner platform with strong compliance and minimal data storage principles.

## Overview

SmartPlanner Core is a monorepo containing multiple planner applications (Travel, Finance, Health, Day Planner) built with shared services and infrastructure. The platform emphasizes user privacy by storing minimal data in the cloud and keeping sensitive information on the client side.

## Architecture

### Apps
- **Travel Planner** (`/apps/travel`) - Trip planning and itinerary management
- **Finance Planner** (`/apps/finance`) - Budget tracking and financial planning
- **Health Planner** (`/apps/health`) - Health goals and wellness tracking
- **Day Planner** (`/apps/day`) - Daily task and schedule management

### Shared Services (`/shared`)
- **Authentication** - Azure AD B2C integration
- **Profile Management** - User profile and group management
- **Chatbot** - AI-powered assistant using Azure OpenAI
- **Notifications** - Multi-channel notification system
- **Analytics** - Privacy-compliant analytics
- **Data Storage** - Minimal cloud storage with client-side encryption
- **Audit Logging** - Compliance and audit trail
- **UI Library** - Shared design system and components
- **Settings** - Centralized configuration management
- **MCP** - Model Context Protocol implementation

## Technology Stack

- **Frontend:** React.js + TypeScript
- **Backend:** Azure Functions (Serverless)
- **Database:** Azure Cosmos DB (minimal data)
- **Authentication:** Azure AD B2C
- **AI/ML:** Azure OpenAI, Azure Cognitive Services
- **Storage:** Azure Blob Storage (minimal), Local Storage (primary)
- **Development:** Vite (component development)

## Development

### UI Component Development
The project includes a Vite-based component development playground for the shared UI library:

```bash
# Start the component development server
npm run dev:ui

# Build the UI library
npm run build:ui

# Preview the built UI library
npm run preview:ui
```

The component playground runs on `http://localhost:3001` and provides a development environment for creating and testing shared UI components.

### Project Structure
```
├── apps/                    # Individual planner applications
│   ├── travel/
│   ├── finance/
│   ├── health/
│   └── day/
├── shared/                  # Reusable services and components
│   ├── auth/
│   ├── profile/
│   ├── chatbot/
│   ├── notifications/
│   ├── analytics/
│   ├── data-storage/
│   ├── audit-logging/
│   ├── ui-library/          # Shared UI components with Vite playground
│   ├── settings/
│   └── mcp/
├── docs/                    # Technical documentation
├── infra/                   # Infrastructure as code
└── tests/                   # Shared testing utilities
```

## Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[CONCEPT.md](docs/CONCEPT.md)** - Project vision and principles
- **[INFRASTRUCTURE.md](docs/INFRASTRUCTURE.md)** - Infrastructure and deployment plan
- **Service Documentation:** Detailed technical specs for each shared service
- **App-specific docs:** Located in respective app folders

## Key Features

- **Privacy-First:** Minimal cloud data storage, client-side encryption
- **AI-Powered:** Intelligent recommendations and assistance
- **Modular:** Reusable services across all applications
- **Compliant:** Built with data protection regulations in mind
- **Scalable:** Serverless architecture for cost-effective scaling
- **Developer-Friendly:** Modern tooling and comprehensive documentation



## License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).

You are free to:
- **Share** — copy and redistribute the material in any medium or format  
- **Adapt** — remix, transform, and build upon the material  

Under the following terms:
- **Attribution** — You must give appropriate credit to the author.  
- **NonCommercial** — You may not use the material for commercial purposes without prior written permission.  

### Author  
**Ajeet Kumar Chouksey**  
GitHub Email: [ajeetkchouksey@users.noreply.github.com](mailto:ajeetkchouksey@users.noreply.github.com)
