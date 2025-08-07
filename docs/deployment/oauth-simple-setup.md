# 🚀 Simple OAuth Setup - Google & GitHub Only

## ✅ **Why Start with Google & GitHub?**

- **Google OAuth**: Well-documented, huge user base, generous free limits
- **GitHub OAuth**: Super simple setup, developer-friendly, unlimited free usage
- **No Azure complexity**: Skip Microsoft OAuth for now
- **Quick to implement**: Both can be set up in under 10 minutes each

---

## 🔴 **Google OAuth Setup**

### **Step 1: Create Google Cloud Project**

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Sign in with your Google account

2. **Create New Project**
   - Click "Select a project" dropdown at the top
   - Click "New Project"
   - Project name: `SmartPlanner OAuth`
   - Click "Create"

### **Step 2: Enable Google+ API**

1. **Enable APIs & Services**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click on it and click "Enable"

2. **Also Enable (Optional but Recommended)**
   - "Google People API" - for better profile data
   - "Gmail API" - if you want email access later

### **Step 3: Create OAuth Credentials**

1. **Go to Credentials**
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"

2. **Configure OAuth Consent Screen** (if prompted)
   - User Type: "External" (for public apps)
   - App name: `SmartPlanner`
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue" through all steps

3. **Create OAuth Client ID**
   - Application type: "Web application"
   - Name: `SmartPlanner Web Client`
   - Authorized redirect URIs:
     ```
     http://localhost:3010/auth/google/callback
     http://localhost:3000/auth/google/callback
     https://yourdomain.com/auth/google/callback (for production)
     ```
   - Click "Create"

4. **Copy Your Credentials**
   - Copy the **Client ID** → This is your `GOOGLE_CLIENT_ID`
   - Copy the **Client Secret** → This is your `GOOGLE_CLIENT_SECRET`

---

## ⚫ **GitHub OAuth Setup**

### **Step 1: Create GitHub OAuth App**

1. **Go to GitHub Settings**
   - Visit [github.com/settings/applications/new](https://github.com/settings/applications/new)
   - Or: GitHub → Settings → Developer settings → OAuth Apps → New OAuth App

2. **Fill Application Details**
   ```
   Application name: SmartPlanner
   Homepage URL: http://localhost:3010 (or your domain)
   Application description: SmartPlanner OAuth Authentication
   Authorization callback URL: http://localhost:3010/auth/github/callback
   ```

3. **Register Application**
   - Click "Register application"
   - You'll see your app details page

4. **Get Your Credentials**
   - Copy the **Client ID** → This is your `GITHUB_CLIENT_ID`
   - Click "Generate a new client secret"
   - Copy the **Client Secret** → This is your `GITHUB_CLIENT_SECRET`

---

## 🔧 **Environment Configuration**

Create or update your `.env` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth  
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# App Configuration
PORT=3010
NODE_ENV=development
```

---

## 🧪 **Testing Your Setup**

### **Test URLs**

1. **Google OAuth Test URL**:
   ```
   https://accounts.google.com/oauth2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=http://localhost:3010/auth/google/callback&scope=openid%20email%20profile&response_type=code
   ```

2. **GitHub OAuth Test URL**:
   ```
   https://github.com/login/oauth/authorize?client_id=YOUR_GITHUB_CLIENT_ID&redirect_uri=http://localhost:3010/auth/github/callback&scope=user:email
   ```

### **Quick Test Checklist**

- [ ] Google OAuth: App registration created and configured
- [ ] GitHub OAuth: OAuth app created and configured  
- [ ] Environment variables set correctly
- [ ] Redirect URIs match exactly
- [ ] Application starts without errors
- [ ] Both OAuth providers work in browser testing

---

## 🛠️ **Implementation Code Snippets**

### **Google OAuth Flow**

```javascript
// OAuth URL
const googleOAuthUrl = `https://accounts.google.com/oauth2/auth?` +
  `client_id=${GOOGLE_CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(redirectUri)}&` +
  `scope=openid email profile&` +
  `response_type=code`;

// Token exchange
const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    code: authCode,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri
  })
});

// Get user info
const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
  headers: { Authorization: `Bearer ${accessToken}` }
});
```

### **GitHub OAuth Flow**

```javascript
// OAuth URL
const githubOAuthUrl = `https://github.com/login/oauth/authorize?` +
  `client_id=${GITHUB_CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(redirectUri)}&` +
  `scope=user:email`;

// Token exchange
const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
  method: 'POST',
  headers: { 
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    code: authCode
  })
});

// Get user info
const userResponse = await fetch('https://api.github.com/user', {
  headers: { Authorization: `Bearer ${accessToken}` }
});
```

---

## 🚀 **Quick Start Commands**

```bash
# Clone or navigate to your project
cd your-smartplanner-project

# Install dependencies (if needed)
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Google and GitHub credentials

# Start development server
npm run dev

# Test OAuth flows
# Visit: http://localhost:3010
```

---

## 🎯 **Next Steps**

1. **Test both OAuth flows** with the credentials you just created
2. **Implement the OAuth handlers** in your SmartPlanner app
3. **Add Microsoft OAuth later** when you're ready for the extra complexity
4. **Deploy to production** with proper domain redirect URIs

---

## ⚡ **Why This Approach Works Better**

- ✅ **Faster setup**: Google and GitHub are much simpler
- ✅ **Better documentation**: Both have excellent developer docs
- ✅ **No Azure confusion**: Avoid Microsoft's complex platform
- ✅ **Great user coverage**: Most developers have GitHub, most users have Google
- ✅ **Easy testing**: Both work immediately with localhost
- ✅ **Free forever**: No usage limits for basic OAuth

---

*Start with these two providers and add Microsoft OAuth later when you're comfortable with the OAuth flow!*
