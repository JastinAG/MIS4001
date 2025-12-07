#!/bin/bash
# Quick fix script for Mac/Linux
# Run this after pulling changes to clear all caches

echo "⚠️  Make sure to stop the dev server first (Ctrl+C)"
read -p "Press Enter to continue..."

echo "🧹 Clearing Next.js cache..."
rm -rf .next

echo "🧹 Clearing node_modules..."
rm -rf node_modules package-lock.json

echo "🧹 Clearing npm cache..."
npm cache clean --force

echo "📦 Reinstalling dependencies..."
npm install --legacy-peer-deps

echo "✅ Done! Now run: npm run dev"

