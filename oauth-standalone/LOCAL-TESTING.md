# 🚀 Local Testing with .env File

## ✅ **Quick Setup for Local Development**

### **Step 1: Create your .env file**
```bash
cp .env.example .env
```

### **Step 2: Choose Your Testing Mode**

#### **Option A: Mock OAuth (No setup required)**
Keep the placeholder values in your `.env`:
```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GITHUB_CLIENT_ID=your_github_client_id_here
```
✅ **Works immediately** - No OAuth setup needed!

#### **Option B: Real OAuth Testing**
Replace with actual credentials in your `.env`:
```bash
VITE_GOOGLE_CLIENT_ID=123456789012-abc123.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz789
VITE_GITHUB_CLIENT_ID=Iv1.abc123def456
VITE_GITHUB_CLIENT_SECRET=abc123def456xyz789
```

### **Step 3: Start Development**
```bash
npm run dev
```

## 🎯 **How It Works**

### **Smart Detection**
The app automatically detects whether you have:
- 🧪 **Mock credentials** → Uses fake OAuth for testing
- 🔐 **Real credentials** → Ready for actual OAuth (when implemented)

### **What You'll See**
- **Mock Mode**: User names show "(Mock)"
- **Real OAuth Ready**: User names show "(Real OAuth Ready)"
- **Console Logs**: Show credential status and OAuth flow type

## 🔧 **Quick OAuth Setup (Optional)**

### **Google OAuth** (2 minutes):
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → Enable Google+ API
3. Create OAuth client ID
4. Add redirect: `http://localhost:3010/auth/google/callback`
5. Copy Client ID & Secret to `.env`

### **GitHub OAuth** (1 minute):
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. New OAuth App
3. Callback URL: `http://localhost:3010/auth/github/callback`
4. Copy Client ID & Secret to `.env`

## 🧪 **Testing Scenarios**

### **Mock Testing (Default)**
- ✅ No OAuth setup required
- ✅ Instant testing of UI flows
- ✅ Perfect for development
- ✅ Works offline

### **Real OAuth Testing**
- ✅ Test actual OAuth flows
- ✅ Validate redirects and callbacks
- ✅ Real user data integration
- ✅ Production-ready validation

## 📋 **Troubleshooting**

### **Issue: TypeScript errors about import.meta.env**
✅ **Fixed**: Added `vite-env.d.ts` with proper types

### **Issue: OAuth not working**
- Check console logs for credential status
- Verify `.env` file is loaded (restart server)
- Ensure no typos in environment variable names

### **Issue: Redirect URI mismatch**
- Make sure callback URLs match exactly
- Check for trailing slashes
- Use `http://localhost:3010` (not 127.0.0.1)

---

**💡 Pro Tip**: Start with mock OAuth for UI testing, then add real credentials when you need to test the complete flow!
