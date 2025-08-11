# Development Landing Page Preview Script
# This bypasses authentication to show the landing page design

Write-Host "🚀 Starting SmartPlanner Landing Page Development Server..." -ForegroundColor Green
Write-Host "📍 This will show you how the landing page looks AFTER successful login" -ForegroundColor Yellow
Write-Host "🔧 Authentication is bypassed for design purposes" -ForegroundColor Cyan
Write-Host ""

# Navigate to the project root
Set-Location "c:\Users\ajeet.k.chouksey\Documents\Code\ajch-smartplanner-core"

# Start the development server with the custom config
Write-Host "⚡ Starting Vite development server..." -ForegroundColor Blue
npm run dev -- --config vite.dev.config.js

Write-Host ""
Write-Host "🎯 The landing page should open automatically at http://localhost:3002/landing-page-dev.html" -ForegroundColor Green
Write-Host "👤 You'll see a mock logged-in user: Alex Johnson" -ForegroundColor Yellow
Write-Host "📱 This is exactly how the page will look after OAuth authentication" -ForegroundColor Cyan
