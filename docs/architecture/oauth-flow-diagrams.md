# OAuth Authentication Flow Diagrams

## 🔄 **Complete OAuth Flow Overview**

### **Standard OAuth 2.0 Authorization Code Flow**

```mermaid
sequenceDiagram
    participant User
    participant SmartPlanner as SmartPlanner App
    participant Provider as OAuth Provider
    participant Backend as SmartPlanner Backend
    
    User->>SmartPlanner: Click "Sign in with [Provider]"
    SmartPlanner->>Provider: Redirect to authorization URL
    Note over Provider: User logs in and grants permissions
    Provider->>SmartPlanner: Redirect with authorization code
    SmartPlanner->>Backend: Send authorization code
    Backend->>Provider: Exchange code for access token
    Provider->>Backend: Return access token & user info
    Backend->>SmartPlanner: Return JWT token & user data
    SmartPlanner->>User: Show authenticated interface
```

### **Microsoft OAuth Flow Details**

```mermaid
graph TB
    A[User clicks 'Sign in with Microsoft'] --> B[Redirect to login.microsoftonline.com]
    B --> C{User authenticates?}
    C -->|Yes| D[Microsoft shows consent screen]
    C -->|No| E[Show error message]
    D --> F{User grants permissions?}
    F -->|Yes| G[Redirect to callback with auth code]
    F -->|No| H[User denies access]
    G --> I[Exchange code for tokens]
    I --> J[Get user profile from Microsoft Graph]
    J --> K[Create/update user in SmartPlanner]
    K --> L[Generate JWT token]
    L --> M[Redirect to dashboard]
    
    E --> N[Return to login screen]
    H --> N
```

### **Google OAuth Flow Details**

```mermaid
graph TB
    A[User clicks 'Sign in with Google'] --> B[Redirect to accounts.google.com]
    B --> C{User authenticates?}
    C -->|Yes| D[Google shows consent screen]
    C -->|No| E[Show error message]
    D --> F{User grants permissions?}
    F -->|Yes| G[Redirect to callback with auth code]
    F -->|No| H[User denies access]
    G --> I[Exchange code for tokens]
    I --> J[Get user profile from Google API]
    J --> K[Create/update user in SmartPlanner]
    K --> L[Generate JWT token]
    L --> M[Redirect to dashboard]
    
    E --> N[Return to login screen]
    H --> N
```

### **Facebook OAuth Flow Details**

```mermaid
graph TB
    A[User clicks 'Sign in with Facebook'] --> B[Redirect to facebook.com/dialog/oauth]
    B --> C{User authenticates?}
    C -->|Yes| D[Facebook shows consent screen]
    C -->|No| E[Show error message]
    D --> F{User grants permissions?}
    F -->|Yes| G[Redirect to callback with auth code]
    F -->|No| H[User denies access]
    G --> I[Exchange code for tokens]
    I --> J[Get user profile from Facebook Graph API]
    J --> K[Create/update user in SmartPlanner]
    K --> L[Generate JWT token]
    L --> M[Redirect to dashboard]
    
    E --> N[Return to login screen]
    H --> N
```

### **Error Handling Flow**

```mermaid
graph TB
    A[OAuth Process Starts] --> B{Provider Available?}
    B -->|No| C[Show Provider Unavailable Error]
    B -->|Yes| D[Redirect to Provider]
    D --> E{User Authenticates?}
    E -->|No| F[Show Authentication Failed Error]
    E -->|Yes| G{Token Exchange Success?}
    G -->|No| H[Show Token Exchange Error]
    G -->|Yes| I{User Profile Retrieved?}
    I -->|No| J[Show Profile Access Error]
    I -->|Yes| K[Success - Continue to App]
    
    C --> L[Log Error & Show Retry Option]
    F --> L
    H --> L
    J --> L
    L --> M[Return to Login Screen]
```

### **Token Refresh Flow**

```mermaid
sequenceDiagram
    participant Client
    participant Backend
    participant Provider
    
    Client->>Backend: API Request with Access Token
    Backend->>Backend: Validate Token
    
    alt Token Valid
        Backend->>Client: Return Requested Data
    else Token Expired
        Backend->>Provider: Refresh Token Request
        alt Refresh Successful
            Provider->>Backend: New Access Token
            Backend->>Backend: Update Stored Token
            Backend->>Client: Return Data + New Token
        else Refresh Failed
            Backend->>Client: Authentication Required (401)
            Client->>Client: Redirect to Login
        end
    end
```

### **Security Considerations Flow**

```mermaid
graph TB
    A[OAuth Request Initiated] --> B[Generate State Parameter]
    B --> C[Store State in Session]
    C --> D[Redirect to Provider with State]
    D --> E[Provider Redirects Back]
    E --> F{State Parameter Matches?}
    F -->|No| G[Reject Request - CSRF Attack]
    F -->|Yes| H[Validate Authorization Code]
    H --> I{Code Valid?}
    I -->|No| J[Reject Request - Invalid Code]
    I -->|Yes| K[Exchange for Access Token]
    K --> L{Token Valid?}
    L -->|No| M[Reject Request - Invalid Token]
    L -->|Yes| N[Proceed with Authentication]
    
    G --> O[Log Security Event]
    J --> O
    M --> O
    O --> P[Return Error to User]
```

---

## 🔧 **Implementation Architecture**

### **SmartPlanner OAuth Architecture**

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[OAuth Login Interface]
        Buttons[Provider Login Buttons]
        Callback[Callback Handler]
    end
    
    subgraph "Authentication Layer"
        Router[OAuth Router]
        Microsoft[Microsoft OAuth Handler]
        Google[Google OAuth Handler]
        Facebook[Facebook OAuth Handler]
        TokenMgr[Token Manager]
    end
    
    subgraph "Security Layer"
        CSRF[CSRF Protection]
        Session[Session Management]
        RateLimit[Rate Limiting]
        Validation[Token Validation]
    end
    
    subgraph "Data Layer"
        UserDB[(User Database)]
        TokenStore[(Token Storage)]
        SessionStore[(Session Storage)]
    end
    
    subgraph "External Providers"
        MSGraph[Microsoft Graph API]
        GoogleAPI[Google People API]
        FacebookAPI[Facebook Graph API]
    end
    
    UI --> Buttons
    Buttons --> Router
    Router --> Microsoft
    Router --> Google
    Router --> Facebook
    
    Microsoft --> CSRF
    Google --> CSRF
    Facebook --> CSRF
    
    CSRF --> Session
    Session --> RateLimit
    RateLimit --> Validation
    
    Validation --> TokenMgr
    TokenMgr --> UserDB
    TokenMgr --> TokenStore
    Session --> SessionStore
    
    Microsoft -.-> MSGraph
    Google -.-> GoogleAPI
    Facebook -.-> FacebookAPI
    
    Callback --> Router
```

---

*These flow diagrams provide a comprehensive visual understanding of the OAuth authentication process in SmartPlanner, including security considerations and error handling patterns.*
