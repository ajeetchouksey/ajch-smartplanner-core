# 🔐 OAuth Credential Storage Guide

## 🎯 **Quick Setup for Git Repository Hosting**

### **Step 1: Clone and Setup**
```bash
git clone your-repo-url
cd oauth-standalone
cp .env.example .env
```

### **Step 2: Add Your Real Credentials**
Edit `.env` file with your actual OAuth credentials:

```bash
# Google OAuth - Get from Google Cloud Console
VITE_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnop.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz

# GitHub OAuth - Get from GitHub Developer Settings  
VITE_GITHUB_CLIENT_ID=Iv1.abcdefghijklmnop
VITE_GITHUB_CLIENT_SECRET=abcdefghijklmnopqrstuvwxyz1234567890

# App Configuration
VITE_APP_URL=http://localhost:3010
```

## 🛡️ **Security Best Practices**

### **✅ Safe for Git Repository:**
- `.env.example` (template file)
- `README.md` with setup instructions
- Documentation files
- Source code files
- Configuration templates

### **❌ NEVER Commit to Git:**
- `.env` files with real values
- Client secrets
- API keys
- Production credentials
- Any file with actual OAuth secrets

## 🚀 **How to Get OAuth Credentials**

### **Google OAuth Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Set authorized redirect URIs:
   - `http://localhost:3010/auth/google/callback`
6. Copy Client ID and Client Secret

### **GitHub OAuth Setup:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in details:
   - Application name: `SmartPlanner`
   - Homepage URL: `http://localhost:3010`
   - Authorization callback URL: `http://localhost:3010/auth/github/callback`
4. Copy Client ID and Client Secret

## 🔧 **Environment Management**

### **Development:**
```bash
VITE_APP_URL=http://localhost:3010
```

### **Production:**
```bash
VITE_APP_URL=https://yourdomain.com
```

## 🚨 **Emergency: If Credentials are Exposed**

1. **Immediately revoke** the exposed credentials in provider console
2. **Generate new** client ID and secret
3. **Update your local** `.env` file
4. **Never commit** the exposure fix

## 📋 **Team Setup Checklist**

- [ ] Clone repository
- [ ] Copy `.env.example` to `.env`
- [ ] Get Google OAuth credentials
- [ ] Get GitHub OAuth credentials
- [ ] Add credentials to `.env` file
- [ ] Start development server: `npm run dev`
- [ ] Test OAuth flows

---

*Remember: The `.env` file is in `.gitignore` - it will never be committed to Git, keeping your secrets safe!*
