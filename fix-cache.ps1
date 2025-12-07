# Quick fix script for Windows PowerShell
# Run this after pulling changes to clear all caches

Write-Host "Stopping any running processes..." -ForegroundColor Yellow
# Note: You need to manually stop the dev server (Ctrl+C)

Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

Write-Host "Clearing node_modules..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "Reinstalling dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

Write-Host "Done! Now run: npm run dev" -ForegroundColor Green

