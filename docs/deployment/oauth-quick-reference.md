# OAuth Configuration Quick Reference

## 🚀 **Quick Setup Summary**

### **URLs You'll Need**

#### **Development URLs**
```
Base URL: http://localhost:3010
Microsoft Callback: http://localhost:3010/auth/microsoft/callback
Google Callback: http://localhost:3010/auth/google/callback
Facebook Callback: http://localhost:3010/auth/facebook/callback
```

#### **Production URLs**
```
Base URL: https://yourdomain.com
Microsoft Callback: https://yourdomain.com/auth/microsoft/callback
Google Callback: https://yourdomain.com/auth/google/callback
Facebook Callback: https://yourdomain.com/auth/facebook/callback
```

### **Required Scopes/Permissions**

#### **Microsoft**
- `openid` - Sign users in
- `profile` - View users' basic profile
- `email` - View users' email address

#### **Google**
- `openid` - OpenID Connect
- `profile` - Basic profile information
- `email` - Email address

#### **Facebook**
- `email` - Access to user's email
- `public_profile` - Basic profile information

### **Environment Variables Template**

```bash
# Copy this to your .env file and replace with actual values

# Application
BASE_URL=http://localhost:3010
JWT_SECRET=generate_random_string_here
SESSION_SECRET=generate_random_string_here

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
MICROSOFT_TENANT_ID=common

# Google OAuth  
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

# Security
CSRF_SECRET=generate_random_string_here
RATE_LIMIT_WINDOW=3600000
RATE_LIMIT_MAX=100
```

### **Testing Checklist**

- [ ] Microsoft OAuth: App registration created and configured
- [ ] Google OAuth: Cloud project created, APIs enabled, credentials configured
- [ ] Facebook OAuth: App created, Facebook Login product added
- [ ] All redirect URIs properly configured
- [ ] Environment variables set correctly
- [ ] Application starts without errors
- [ ] All three OAuth providers work in browser testing

### **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| "Redirect URI mismatch" | Check exact match in provider configuration |
| "Invalid client" | Verify client ID and secret are correct |
| "Access denied" | Check app permissions and scopes |
| "App not approved" | Complete app review process for production |
| "HTTPS required" | Use ngrok for local testing or deploy to HTTPS domain |

### **Quick Commands**

```bash
# Start development server
cd oauth-standalone
npm run dev

# Generate random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test OAuth endpoints
curl http://localhost:3010/auth/microsoft
curl http://localhost:3010/auth/google  
curl http://localhost:3010/auth/facebook
```
