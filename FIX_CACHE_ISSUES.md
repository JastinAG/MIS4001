# Fixing Cache Issues After Pulling Changes

If you've pulled the latest changes but don't see updates, follow these steps:

## Quick Fix Commands

### Step 1: Stop the Development Server
Press `Ctrl+C` in the terminal where the server is running

### Step 2: Clear All Caches

**Windows PowerShell:**
```powershell
# Delete Next.js build cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Clear npm cache
npm cache clean --force
```

**Mac/Linux:**
```bash
# Delete Next.js build cache
rm -rf .next

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force
```

### Step 3: Reinstall Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 4: Restart the Development Server
```bash
npm run dev
```

### Step 5: Clear Browser Cache
- **Chrome/Edge**: Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Select "Cached images and files"
- Click "Clear data"
- Or use **Hard Refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

## Complete Reset (If Above Doesn't Work)

If you still don't see changes, do a complete reset:

```bash
# 1. Stop the server (Ctrl+C)

# 2. Delete all cache and build files
# Windows:
Remove-Item -Recurse -Force .next, node_modules, package-lock.json -ErrorAction SilentlyContinue

# Mac/Linux:
rm -rf .next node_modules package-lock.json

# 3. Clear npm cache
npm cache clean --force

# 4. Reinstall everything
npm install --legacy-peer-deps

# 5. Start fresh
npm run dev
```

## Verify You Have the Latest Code

```bash
# Check current branch
git branch

# Pull latest changes
git pull origin main

# Check what files changed
git log --oneline -5

# Verify specific files exist
# Windows:
Test-Path app/dashboard/page.tsx
Test-Path components/auth/login-form.tsx

# Mac/Linux:
ls -la app/dashboard/page.tsx
ls -la components/auth/login-form.tsx
```

## Common Issues

### Issue: Changes not showing after pull

**Solution:**
1. Make sure you're on the `main` branch: `git checkout main`
2. Pull latest: `git pull origin main`
3. Clear `.next` folder
4. Restart dev server

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Issue: Environment variables not loading

**Solution:**
1. Verify `.env.local` exists and has correct values
2. Delete `.next` folder
3. Restart dev server

### Issue: Still seeing old UI

**Solution:**
1. Hard refresh browser: `Ctrl+Shift+R` or `Cmd+Shift+R`
2. Clear browser cache completely
3. Try incognito/private window
4. Check if you're accessing the correct URL (localhost:3000)

## Verify Changes Are Present

After pulling and clearing cache, verify these files exist with recent changes:

```bash
# Check dashboard page
cat app/dashboard/page.tsx | head -20

# Check login form
cat components/auth/login-form.tsx | head -20

# Check if new files exist
ls -la SETUP_NEW_MACHINE.md
ls -la DEPLOY_VERCEL.md
ls -la scripts/07-fix-placements-rls.sql
```

## Force Rebuild

If nothing else works:

```bash
# Stop server
# Then:
rm -rf .next
npm run build  # Build the project
npm run dev    # Start dev server
```

