# 🔐 OAuth Provider Setup Guide

## 📋 **Complete Setup Instructions for Microsoft, Google, and Facebook OAuth**

This guide provides detailed step-by-step instructions for configuring OAuth authentication with major providers for the SmartPlanner application.

## 🎯 **Prerequisites**

Before starting, ensure you have:
- [ ] A development environment with the SmartPlanner project
- [ ] Admin access to create applications on provider platforms
- [ ] Valid email addresses for each provider platform
- [ ] Domain or localhost setup for testing

---

## 🔵 **Microsoft OAuth Setup**

### **Step 1: Create Azure App Registration**

1. **Navigate to Azure Portal**
   - Go to [Azure Portal](https://portal.azure.com)
   - Sign in with your Microsoft account

2. **Access Azure Active Directory**
   - Search for "Azure Active Directory" in the search bar
   - Select "Azure Active Directory" from results

3. **Create New App Registration**
   - Click "App registrations" in the left sidebar
   - Click "New registration" button
   - Fill in the application details:

```
Application Name: SmartPlanner OAuth
Supported account types: Accounts in any organizational directory and personal Microsoft accounts
Redirect URI: 
  - Type: Web
  - URI: http://localhost:3010/auth/microsoft/callback (for development)
  - URI: https://yourdomain.com/auth/microsoft/callback (for production)
```

4. **Click "Register"** to create the application

### **Step 2: Configure Application Settings**

1. **Note Application Details**
   - Copy the **Application (client) ID** - you'll need this as `MICROSOFT_CLIENT_ID`
   - Copy the **Directory (tenant) ID** - you'll need this for advanced configurations

2. **Create Client Secret**
   - Go to "Certificates & secrets" in the left sidebar
   - Click "New client secret"
   - Add description: "SmartPlanner OAuth Secret"
   - Set expiration: "24 months" (recommended)
   - Click "Add"
   - **Important**: Copy the secret value immediately (you won't see it again)
   - This is your `MICROSOFT_CLIENT_SECRET`

3. **Configure API Permissions**
   - Go to "API permissions" in the left sidebar
   - Click "Add a permission"
   - Select "Microsoft Graph"
   - Select "Delegated permissions"
   - Add these permissions:
     - `openid` (Sign users in)
     - `profile` (View users' basic profile)
     - `email` (View users' email address)
   - Click "Add permissions"
   - Click "Grant admin consent" (if you have admin rights)

### **Step 3: Configure Redirect URIs**

1. **Go to Authentication**
   - Click "Authentication" in the left sidebar
   - Under "Platform configurations", click "Add a platform"
   - Select "Web"
   - Add redirect URIs:

```
Development: http://localhost:3010/auth/microsoft/callback
Production: https://yourdomain.com/auth/microsoft/callback
```

2. **Configure Advanced Settings**
   - Enable "Access tokens" (used for implicit flows)
   - Enable "ID tokens" (used for hybrid flows)
   - Click "Save"

### **Step 4: Environment Configuration**

Add these to your `.env` file:

```bash
MICROSOFT_CLIENT_ID=your_application_client_id_here
MICROSOFT_CLIENT_SECRET=your_client_secret_here
MICROSOFT_TENANT_ID=common  # Use 'common' for multi-tenant, or specific tenant ID
```

---

## 🔴 **Google OAuth Setup**

### **Step 1: Create Google Cloud Project**

1. **Navigate to Google Cloud Console**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Sign in with your Google account

2. **Create New Project**
   - Click the project dropdown at the top
   - Click "New Project"
   - Enter project details:

```
Project Name: SmartPlanner OAuth
Organization: (Select your organization or leave blank)
Location: (Select appropriate location)
```

3. **Click "Create"** and wait for project creation

### **Step 2: Enable Google+ API**

1. **Navigate to APIs & Services**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click on "Google+ API"
   - Click "Enable"

2. **Enable Additional APIs** (if needed)
   - Also enable "Gmail API" if you need email access
   - Enable "People API" for enhanced profile information

### **Step 3: Configure OAuth Consent Screen**

1. **Go to OAuth Consent Screen**
   - Navigate to "APIs & Services" > "OAuth consent screen"
   - Select "External" user type (for public applications)
   - Click "Create"

2. **Fill App Information**

```
App name: SmartPlanner
User support email: your-email@example.com
App domain: yourdomain.com (optional for development)
Developer contact information: your-email@example.com
```

3. **Configure Scopes**
   - Click "Add or Remove Scopes"
   - Add these scopes:
     - `../auth/userinfo.email`
     - `../auth/userinfo.profile`
     - `openid`
   - Click "Update"

4. **Add Test Users** (for development)
   - Add your email and other developer emails
   - Click "Save and Continue"

### **Step 4: Create OAuth Credentials**

1. **Go to Credentials**
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"

2. **Configure OAuth Client**

```
Application type: Web application
Name: SmartPlanner OAuth Client

Authorized JavaScript origins:
- http://localhost:3010 (for development)
- https://yourdomain.com (for production)

Authorized redirect URIs:
- http://localhost:3010/auth/google/callback (for development)
- https://yourdomain.com/auth/google/callback (for production)
```

3. **Save and Copy Credentials**
   - Click "Create"
   - Copy the **Client ID** - this is your `GOOGLE_CLIENT_ID`
   - Copy the **Client Secret** - this is your `GOOGLE_CLIENT_SECRET`

### **Step 5: Environment Configuration**

Add these to your `.env` file:

```bash
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

---

## 🔵 **Facebook OAuth Setup**

### **Step 1: Create Facebook App**

1. **Navigate to Facebook Developers**
   - Go to [Facebook Developers](https://developers.facebook.com)
   - Sign in with your Facebook account

2. **Create New App**
   - Click "My Apps" in the top right
   - Click "Create App"
   - Select "Build Connected Experiences"
   - Click "Continue"

3. **Fill App Details**

```
Display Name: SmartPlanner
App Contact Email: your-email@example.com
App Purpose: Yourself or your own business
```

4. **Click "Create App"** and complete any security checks

### **Step 2: Configure Facebook Login**

1. **Add Facebook Login Product**
   - In your app dashboard, click "Add Product"
   - Find "Facebook Login" and click "Set Up"

2. **Configure Quickstart** (Optional)
   - Select "Web" platform
   - Enter your site URL: `http://localhost:3010` (for development)
   - Follow the quickstart guide or skip to manual configuration

### **Step 3: Configure OAuth Settings**

1. **Go to Facebook Login Settings**
   - Navigate to "Products" > "Facebook Login" > "Settings"

2. **Configure Valid OAuth Redirect URIs**

```
Development: http://localhost:3010/auth/facebook/callback
Production: https://yourdomain.com/auth/facebook/callback
```

3. **Configure Additional Settings**
   - Enable "Client OAuth Login": Yes
   - Enable "Web OAuth Login": Yes
   - Enable "Enforce HTTPS": No (for development), Yes (for production)

### **Step 4: Get App Credentials**

1. **Navigate to App Settings**
   - Go to "Settings" > "Basic"
   - Copy the **App ID** - this is your `FACEBOOK_CLIENT_ID`
   - Click "Show" next to App Secret
   - Copy the **App Secret** - this is your `FACEBOOK_CLIENT_SECRET`

2. **Configure App Domains** (for production)
   - Add your domain: `yourdomain.com`
   - Add Privacy Policy URL: `https://yourdomain.com/privacy`
   - Add Terms of Service URL: `https://yourdomain.com/terms`

### **Step 5: Configure Permissions**

1. **Set Up App Review** (for production)
   - Go to "App Review" > "Permissions and Features"
   - Request these permissions:
     - `email` (to access user's email)
     - `public_profile` (to access basic profile info)

### **Step 6: Environment Configuration**

Add these to your `.env` file:

```bash
FACEBOOK_CLIENT_ID=your_facebook_app_id_here
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret_here
```

---

## 🛠️ **Complete Environment Configuration**

### **Final .env File Structure**

Create or update your `.env` file with all OAuth credentials:

```bash
# Application Configuration
BASE_URL=http://localhost:3010
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_here

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret_here
MICROSOFT_TENANT_ID=common

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Facebook OAuth
FACEBOOK_CLIENT_ID=your_facebook_app_id_here
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret_here

# Security Configuration
CSRF_SECRET=your_csrf_secret_here
RATE_LIMIT_WINDOW=3600000
RATE_LIMIT_MAX=100

# Database Configuration (if applicable)
DATABASE_URL=your_database_connection_string
REDIS_URL=redis://localhost:6379
```

---

## 🧪 **Testing Your OAuth Setup**

### **Step 1: Start Your Application**

```bash
cd oauth-standalone
npm run dev
```

### **Step 2: Test Each Provider**

1. **Navigate to OAuth Interface**
   - Open `http://localhost:3010` in your browser

2. **Test Microsoft Login**
   - Click "Sign in with Microsoft"
   - Verify redirect to Microsoft login
   - Complete authentication flow
   - Verify successful callback

3. **Test Google Login**
   - Click "Sign in with Google"
   - Verify redirect to Google login
   - Complete authentication flow
   - Verify successful callback

4. **Test Facebook Login**
   - Click "Sign in with Facebook"
   - Verify redirect to Facebook login
   - Complete authentication flow
   - Verify successful callback

### **Step 3: Troubleshooting Common Issues**

#### **Microsoft Issues**
- **Redirect URI mismatch**: Ensure exact match in Azure app registration
- **Invalid client**: Verify client ID and secret are correct
- **Consent required**: Grant admin consent for API permissions

#### **Google Issues**
- **Unauthorized origin**: Add your domain to authorized origins
- **Access blocked**: Ensure app is published or add test users
- **Invalid client**: Verify OAuth client configuration

#### **Facebook Issues**
- **Invalid redirect URI**: Check Facebook Login settings
- **App not live**: Publish app or add test users
- **Invalid scopes**: Ensure required permissions are approved

---

## 🔒 **Security Best Practices**

### **Environment Security**
- Never commit `.env` files to version control
- Use different credentials for development and production
- Regularly rotate client secrets
- Use HTTPS in production

### **Application Security**
- Implement CSRF protection
- Use secure session storage
- Validate all OAuth responses
- Implement proper error handling

### **Monitoring and Logging**
- Log authentication events
- Monitor for failed login attempts
- Set up alerts for unusual activity
- Regularly audit OAuth applications

---

## 📊 **Production Deployment Checklist**

### **Before Going Live**
- [ ] All OAuth apps configured for production domains
- [ ] HTTPS enabled and SSL certificates installed
- [ ] Environment variables properly configured
- [ ] Security headers implemented
- [ ] Error handling and logging in place
- [ ] Rate limiting configured
- [ ] Monitoring and alerting set up

### **Provider-Specific Production Steps**

#### **Microsoft**
- [ ] App registration updated with production redirect URIs
- [ ] Admin consent granted for production tenant
- [ ] Privacy policy and terms of service links added

#### **Google**
- [ ] OAuth consent screen fully configured
- [ ] App published and verified
- [ ] Scopes reviewed and approved
- [ ] Domain verification completed

#### **Facebook**
- [ ] App review completed for required permissions
- [ ] App switched to live mode
- [ ] Privacy policy and terms of service published
- [ ] Data use checkup completed

---

*This comprehensive setup guide ensures your SmartPlanner OAuth authentication is properly configured with enterprise-grade security and reliability across all major providers.*
