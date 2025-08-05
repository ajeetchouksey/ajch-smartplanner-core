# GitHub Copilot Instructions

This document provides essential context and instructions for GitHub Copilot when working on the SmartPlanner Core project.

## Project Overview

SmartPlanner Core is a **modular, AI/ML-powered planner platform** with strong emphasis on:
- **Privacy-first design** - Minimal cloud data storage, client-side data retention
- **Compliance** - Built with data protection regulations in mind
- **Modularity** - Reusable services across multiple planner applications
- **AI Integration** - Azure OpenAI powered recommendations and chatbot assistance

## Architecture Principles

### Core Design Patterns
1. **Monorepo Structure** - All apps and shared services in unified repository
2. **Service-Oriented Architecture** - Independent, reusable services
3. **Client-Side Data Strategy** - Store sensitive data locally, sync minimal aggregated data
4. **Serverless-First** - Azure Functions for scalable, cost-effective backend
5. **TypeScript Everything** - Strong typing across frontend and backend

### Technology Stack
- **Frontend:** React.js + TypeScript + Vite
- **Backend:** Azure Functions (Node.js + TypeScript)
- **Database:** Azure Cosmos DB (NoSQL, minimal data)
- **Authentication:** Azure AD B2C
- **AI/ML:** Azure OpenAI, Azure Cognitive Services
- **Storage:** Azure Blob Storage (minimal) + Local Storage (primary)
- **Deployment:** GitHub Actions + Azure DevOps

## Development Guidelines

### File Organization
```
├── apps/                    # Individual planner applications
│   ├── travel/             # Trip planning and itinerary management
│   ├── finance/            # Budget tracking and financial planning
│   ├── health/             # Health goals and wellness tracking
│   └── day/                # Daily task and schedule management
├── shared/                  # Reusable services and components
│   ├── auth/               # Azure AD B2C integration
│   ├── profile/            # User profile and group management
│   ├── chatbot/            # AI-powered assistant using Azure OpenAI
│   ├── notifications/      # Multi-channel notification system
│   ├── analytics/          # Privacy-compliant analytics
│   ├── data-storage/       # Minimal cloud storage + client-side encryption
│   ├── audit-logging/      # Compliance and audit trail
│   ├── ui-library/         # Shared design system and components
│   ├── settings/           # Centralized configuration management
│   └── mcp/                # Model Context Protocol implementation
```

### Coding Standards

#### React Components
```typescript
// Use functional components with TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  disabled = false, 
  onClick, 
  children 
}) => {
  return (
    <button 
      className={`btn btn-${variant} ${disabled ? 'btn-disabled' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

#### Azure Functions
```typescript
// Use Azure Functions v4 programming model
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

export async function httpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    
    // Minimal data processing - respect privacy principles
    const body = await request.text();
    
    return { 
        status: 200,
        jsonBody: { message: 'Success' }
    };
}

app.http('httpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'function',
    handler: httpTrigger
});
```

#### Data Storage Patterns
```typescript
// Client-side data with minimal cloud sync
interface UserData {
  // Local-only sensitive data
  localData: {
    personalDetails: PersonalInfo;
    preferences: UserPreferences;
    documents: Document[];
  };
  
  // Minimal cloud sync (aggregated, anonymized)
  cloudSync: {
    userId: string;
    lastSync: Date;
    aggregatedMetrics: AnalyticsData;
  };
}

// Always encrypt before cloud storage
const encryptedData = await encryptClientSide(sensitiveData);
```

### Privacy & Compliance Requirements

#### Data Handling
- **Never store** personally identifiable information (PII) in cloud without explicit consent
- **Always encrypt** sensitive data at rest and in transit
- **Implement** data retention policies and right to deletion
- **Log minimal** information for audit trails

#### AI/ML Integration
- **Process locally** when possible before sending to Azure OpenAI
- **Anonymize** data sent to AI services
- **Implement** content filtering and safety measures
- **Respect** usage limits and cost optimization

### Component Development

#### UI Library Structure
```
shared/ui-library/
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── themes/             # Theme definitions
│   └── types/              # TypeScript type definitions
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies and scripts
```

#### Development Commands
```bash
# Start component development playground
npm run dev:ui

# Build UI library
npm run build:ui

# Preview built UI library
npm run preview:ui
```

### Service Integration Patterns

#### Authentication Flow
```typescript
// Use Azure AD B2C for all authentication
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID,
    authority: process.env.REACT_APP_AUTHORITY,
    redirectUri: window.location.origin
  }
};

const msalInstance = new PublicClientApplication(msalConfig);
```

#### MCP Integration
```typescript
// Model Context Protocol for AI traceability
interface MCPContext {
  sessionId: string;
  modelVersion: string;
  inputContext: string;
  outputMetadata: ModelMetadata;
  complianceFlags: ComplianceFlag[];
}
```

## Testing Strategy

### Unit Testing
- **Jest** for JavaScript/TypeScript testing
- **React Testing Library** for component testing
- **Azure Functions Core Tools** for local function testing

### Integration Testing
- **Playwright** for end-to-end testing
- **Azure CLI** for infrastructure testing
- **Postman/Newman** for API testing

### Testing Patterns
```typescript
// Component testing
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

test('button handles click events', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Deployment Guidelines

### Environment Strategy
- **Development:** Local development with Azure Function emulator
- **Staging:** Azure Functions + Cosmos DB free tier
- **Production:** Full Azure infrastructure with monitoring

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy SmartPlanner
on:
  push:
    branches: [main]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build and deploy
        run: npm run deploy
```

## Common Patterns & Best Practices

### Error Handling
```typescript
// Standardized error handling
interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
  userId?: string; // Only if safe to log
}

const handleError = (error: unknown): AppError => ({
  code: 'GENERIC_ERROR',
  message: error instanceof Error ? error.message : 'Unknown error',
  timestamp: new Date()
});
```

### Performance Optimization
- **Lazy load** components and routes
- **Memoize** expensive calculations
- **Debounce** user inputs
- **Cache** API responses appropriately

### Security Checklist
- [ ] All API endpoints have proper authentication
- [ ] Input validation on both client and server
- [ ] HTTPS everywhere
- [ ] No sensitive data in logs
- [ ] Regular dependency updates
- [ ] Content Security Policy implemented

## Documentation Standards

### Code Comments
- **Why** over **what** - explain business logic and decisions
- **Link** to relevant documentation
- **Update** comments when code changes

### API Documentation
- **OpenAPI/Swagger** specifications for all endpoints
- **Example** requests and responses
- **Error codes** and handling instructions

## Future Considerations

### Scalability Planning
- **Database sharding** strategy for growth
- **CDN integration** for global performance
- **Microservices migration** path if needed

### Feature Roadmap
- **Offline-first** capabilities
- **Progressive Web App** features
- **Mobile app** development
- **Advanced AI** integrations

---

## Quick Reference

### Essential Commands
```bash
# Start development
npm run dev:ui                    # UI component playground
npm run dev:api                   # Azure Functions local

# Testing
npm test                          # Run all tests
npm run test:watch                # Watch mode testing
npm run test:e2e                  # End-to-end tests

# Building
npm run build:ui                  # Build UI library
npm run build:api                 # Build Azure Functions
npm run build:all                 # Build everything

# Deployment
npm run deploy:staging            # Deploy to staging
npm run deploy:prod               # Deploy to production
```

### Key Files to Reference
- `docs/CONCEPT.md` - Project vision and principles
- `docs/INFRASTRUCTURE.md` - Azure architecture details
- `docs/[SERVICE].md` - Individual service specifications
- `CHANGELOG.md` - Version history and changes

Remember: **Privacy first, AI-powered, modular, and compliant** - these are the core principles that should guide all development decisions.
