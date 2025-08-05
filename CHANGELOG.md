# Changelog

All notable changes to the SmartPlanner Core project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-08-05

### Added
- Comprehensive documentation system (CHANGELOG.md, COPILOT_INSTRUCTIONS.md)
- Vite-based component development playground for UI library
- Enhanced Button component with multiple variants (primary, secondary, disabled)
- App-specific documentation structure for Travel and Finance planners
- Infrastructure planning documentation with Azure services
- Complete project architecture with shared services design
- Proper .gitignore for Node.js projects
- Organized UI library structure within src/ directory

### Changed
- **BREAKING CHANGE:** Replaced Storybook with Vite-based component development environment
- Reorganized documentation structure for better maintainability
- Updated README.md with comprehensive project overview
- Moved app-specific documentation to respective app folders
- Fixed import paths and file organization for proper module resolution
- Updated package.json version to 2.0.0

### Removed
- All Storybook-related configurations and dependencies
- Duplicate infrastructure planning files
- Unused debug logs and temporary files

## [1.0.0] - 2025-08-05

### Added
- Initial project setup and repository structure
- Core monorepo architecture with apps and shared services
- Technology stack selection and documentation
- License and author information (CC BY-NC 4.0)

### Project Structure
```
├── apps/                    # Individual planner applications
│   ├── travel/             # Travel planning app
│   ├── finance/            # Finance planning app  
│   ├── health/             # Health planning app
│   └── day/                # Day planning app
├── shared/                  # Reusable services and components
│   ├── auth/               # Authentication service
│   ├── profile/            # Profile management
│   ├── chatbot/            # AI chatbot service
│   ├── notifications/      # Notification system
│   ├── analytics/          # Analytics service
│   ├── data-storage/       # Data storage abstraction
│   ├── audit-logging/      # Audit and compliance logging
│   ├── ui-library/         # Shared UI components
│   ├── settings/           # Settings management
│   └── mcp/                # Model Context Protocol
├── docs/                   # Technical documentation
├── infra/                  # Infrastructure as code
└── tests/                  # Shared testing utilities
```

### Technology Decisions
- **Frontend:** React.js + TypeScript
- **Backend:** Azure Functions (Serverless)
- **Database:** Azure Cosmos DB (minimal data)
- **Authentication:** Azure AD B2C
- **AI/ML:** Azure OpenAI, Azure Cognitive Services
- **Development:** Vite for component development
- **Deployment:** GitHub Actions CI/CD

### Core Principles Established
- **Privacy-First:** Minimal cloud data storage
- **AI-Powered:** Intelligent recommendations and assistance
- **Modular:** Reusable services across all applications
- **Compliant:** Built with data protection regulations in mind
- **Scalable:** Serverless architecture for cost-effective scaling

---

## Version History Notes

### Versioning Strategy
- **Major versions (x.0.0):** Breaking changes, major feature releases
- **Minor versions (0.x.0):** New features, significant enhancements
- **Patch versions (0.0.x):** Bug fixes, documentation updates, minor improvements

### Change Categories
- **Added:** New features, files, or capabilities
- **Changed:** Modifications to existing functionality
- **Deprecated:** Features that will be removed in future versions
- **Removed:** Features or files that have been deleted
- **Fixed:** Bug fixes and error corrections
- **Security:** Security-related improvements or fixes

### Documentation Standards
All changes should include:
- Clear description of what changed
- Impact on existing functionality
- Migration notes if applicable
- Links to relevant documentation or issues
