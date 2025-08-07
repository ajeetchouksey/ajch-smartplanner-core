# 🔐 GitHub Repository Secrets Guide

## 🎯 **Setting Up GitHub Repository Secrets**

### **Step 1: Navigate to Repository Settings**
1. Go to your GitHub repository: `https://github.com/ajeetchouksey/ajch-smartplanner-core`
2. Click **"Settings"** tab
3. In the left sidebar, click **"Secrets and variables"** → **"Actions"**

### **Step 2: Add Repository Secrets**
Click **"New repository secret"** and add these secrets:

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789012-abc...xyz.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-abcdefghijklmnopqrstuvwxyz` |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | `Iv1.abcdefghijklmnop` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | `ghp_abcdefghijklmnopqrstuvwxyz123456` |

### **Step 3: Access Secrets in Your Application**

#### **Option A: GitHub Actions Workflow (Automated)**
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy SmartPlanner OAuth
on:
  push:
    branches: [main]
    paths: ['oauth-standalone/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd oauth-standalone
          npm install
          
      - name: Build with secrets
        env:
          VITE_GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          VITE_GITHUB_CLIENT_ID: ${{ secrets.GITHUB_CLIENT_ID }}
        run: |
          cd oauth-standalone
          npm run build
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./oauth-standalone/dist
```

#### **Option B: Manual Access (Development)**
For local development, you'll still need a `.env` file:

```bash
# oauth-standalone/.env (local development only)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GITHUB_CLIENT_ID=your_github_client_id_here
```

## 🚀 **Accessing Secrets Without Workflows**

### **Method 1: GitHub CLI (Recommended)**
```bash
# Install GitHub CLI
gh auth login

# Get secrets (requires admin access)
gh secret list --repo ajeetchouksey/ajch-smartplanner-core

# Set secrets
gh secret set GOOGLE_CLIENT_ID --body "your_google_client_id" --repo ajeetchouksey/ajch-smartplanner-core
gh secret set GITHUB_CLIENT_ID --body "your_github_client_id" --repo ajeetchouksey/ajch-smartplanner-core
```

### **Method 2: GitHub API (Advanced)**
```bash
# Get repository secrets (requires admin access)
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
     https://api.github.com/repos/ajeetchouksey/ajch-smartplanner-core/actions/secrets

# Create/update secret
curl -X PUT \
     -H "Authorization: token YOUR_GITHUB_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"encrypted_value":"ENCRYPTED_VALUE","key_id":"KEY_ID"}' \
     https://api.github.com/repos/ajeetchouksey/ajch-smartplanner-core/actions/secrets/GOOGLE_CLIENT_ID
```

### **Method 3: Environment Variables in Codespaces**
If using GitHub Codespaces:

1. Go to **Settings** → **Codespaces**
2. Add **Repository secrets** as **Codespace secrets**
3. They'll be automatically available as environment variables

## 🔧 **Development Workflow**

### **Local Development**
```bash
# 1. Clone repository
git clone https://github.com/ajeetchouksey/ajch-smartplanner-core.git
cd ajch-smartplanner-core/oauth-standalone

# 2. Copy environment template
cp .env.example .env

# 3. Get secrets from GitHub (using GitHub CLI)
gh secret list --repo ajeetchouksey/ajch-smartplanner-core

# 4. Manually add values to .env file
# VITE_GOOGLE_CLIENT_ID=your_value_from_github_secrets
# VITE_GITHUB_CLIENT_ID=your_value_from_github_secrets

# 5. Start development
npm run dev
```

### **Production Deployment**
```bash
# Secrets are automatically injected during GitHub Actions deployment
# No manual intervention needed
```

## 🛡️ **Security Benefits of GitHub Secrets**

✅ **Encrypted at rest** - GitHub encrypts secrets using libsodium sealed box  
✅ **Encrypted in transit** - HTTPS/TLS encryption  
✅ **Access controlled** - Only repository admins can view/edit  
✅ **Audit trail** - GitHub logs all secret access  
✅ **Automatic rotation** - Easy to update when needed  
✅ **Environment isolation** - Different secrets for dev/staging/prod  

## 🚨 **Important Notes**

⚠️ **Client IDs are public** - Only client secrets need to be truly secret  
⚠️ **Local .env still needed** - For development, you'll copy values manually  
⚠️ **Admin access required** - Only repo admins can manage secrets  
⚠️ **Workflow access only** - Secrets are primarily for GitHub Actions  

## 📋 **Quick Setup Checklist**

- [ ] Add `GOOGLE_CLIENT_ID` to repository secrets
- [ ] Add `GOOGLE_CLIENT_SECRET` to repository secrets  
- [ ] Add `GITHUB_CLIENT_ID` to repository secrets
- [ ] Add `GITHUB_CLIENT_SECRET` to repository secrets
- [ ] Create GitHub Actions workflow (optional)
- [ ] Test local development with manual `.env` setup
- [ ] Verify deployment pipeline works with secrets

---

*This approach keeps your OAuth credentials secure while making them accessible for both development and automated deployment!*
