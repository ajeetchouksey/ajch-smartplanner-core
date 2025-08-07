#!/usr/bin/env node

/**
 * GitHub Secrets Access Script
 * This script helps you fetch secrets from GitHub and set up your local .env file
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO = 'ajeetchouksey/ajch-smartplanner-core';
const SECRETS = ['GOOGLE_CLIENT_ID', 'GITHUB_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GITHUB_CLIENT_SECRET'];

console.log('🔐 GitHub Secrets Setup for SmartPlanner OAuth\n');

// Check if GitHub CLI is installed
try {
  execSync('gh --version', { stdio: 'ignore' });
  console.log('✅ GitHub CLI is installed');
} catch (error) {
  console.log('❌ GitHub CLI is not installed');
  console.log('📥 Install it from: https://cli.github.com/');
  process.exit(1);
}

// Check if user is authenticated
try {
  execSync('gh auth status', { stdio: 'ignore' });
  console.log('✅ GitHub CLI is authenticated');
} catch (error) {
  console.log('❌ GitHub CLI is not authenticated');
  console.log('🔑 Run: gh auth login');
  process.exit(1);
}

// Function to safely get secret (won't expose the actual value)
function checkSecret(secretName) {
  try {
    const result = execSync(`gh secret list --repo ${REPO}`, { encoding: 'utf8' });
    return result.includes(secretName);
  } catch (error) {
    return false;
  }
}

// Check which secrets exist
console.log('\n🔍 Checking GitHub repository secrets...\n');
const secretStatus = {};

SECRETS.forEach(secret => {
  const exists = checkSecret(secret);
  secretStatus[secret] = exists;
  console.log(`${exists ? '✅' : '❌'} ${secret}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
});

// Generate .env file template
console.log('\n📝 Generating .env template...\n');

const envTemplate = `# OAuth Configuration for SmartPlanner
# Copy this template and fill in the actual values from GitHub Secrets

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=\${GOOGLE_CLIENT_ID}
VITE_GOOGLE_CLIENT_SECRET=\${GOOGLE_CLIENT_SECRET}

# GitHub OAuth Configuration  
VITE_GITHUB_CLIENT_ID=\${GITHUB_CLIENT_ID}
VITE_GITHUB_CLIENT_SECRET=\${GITHUB_CLIENT_SECRET}

# App Configuration
VITE_APP_URL=http://localhost:3010

# Instructions:
# 1. Go to GitHub repository settings
# 2. Navigate to Secrets and variables > Actions  
# 3. Copy the secret values manually to replace \${SECRET_NAME} placeholders above
# 4. Save this file as .env (without the .template extension)
`;

const envPath = path.join(__dirname, '.env.template');
fs.writeFileSync(envPath, envTemplate);
console.log(`✅ Created: ${envPath}`);

// Provide instructions
console.log('\n🚀 Next Steps:\n');
console.log('1. Go to your GitHub repository:');
console.log(`   https://github.com/${REPO}/settings/secrets/actions`);
console.log('\n2. Add missing secrets:');
SECRETS.forEach(secret => {
  if (!secretStatus[secret]) {
    console.log(`   - Add: ${secret}`);
  }
});
console.log('\n3. Copy .env.template to .env and fill in the actual values');
console.log('4. Run: npm run dev');

console.log('\n📚 For detailed setup instructions, see:');
console.log('   - GITHUB-SECRETS-SETUP.md');
console.log('   - CREDENTIALS-SETUP.md');
