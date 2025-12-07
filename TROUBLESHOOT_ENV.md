# Troubleshooting Environment Variables Not Loading

## Current Issue

The terminal shows:
```
[Signup API] Environment check: { hasUrl: true, hasServiceKey: false, serviceKeyLength: 0 }
envKeys: []
```

This means Next.js is **not loading** the `SUPABASE_SERVICE_ROLE_KEY` from `.env.local`.

## Possible Causes & Solutions

### 1. Server Not Restarted Properly

**Solution:**
1. **Completely stop** the server:
   - Press `Ctrl+C` in the terminal
   - Wait until you see the command prompt
   - If it doesn't stop, close the terminal window

2. **Clear Next.js cache:**
   ```powershell
   Remove-Item -Recurse -Force .next
   ```

3. **Start fresh:**
   ```bash
   npm run dev
   ```

### 2. File Encoding Issue

The `.env.local` file might have encoding issues.

**Solution:**
1. Delete the current `.env.local` file
2. Create a new one with this exact content (copy-paste):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xybnqhsqlaaocqibqhbn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjUxMTgsImV4cCI6MjA4MDA0MTExOH0.TC8NYtT0h3cx9ZZtvQBy9JcT0yHD-daiXm9MMo8zBR4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQ2NTExOCwiZXhwIjoyMDgwMDQxMTE4fQ.x6nE8dxJ2KsmDllZxHlq_A_yfk_pKmtg0jgpSj2IiZU
```

**Important:**
- No quotes around values
- No spaces around `=`
- No trailing spaces
- Save as UTF-8 encoding

### 3. File Location Wrong

**Verify:**
The `.env.local` file must be in the **project root** (same folder as `package.json`):

```
C:\Users\HomePC\Downloads\student-placement-system\.env.local
```

Check with:
```powershell
Test-Path .env.local
Get-Item .env.local | Select-Object FullName
```

### 4. Next.js Not Reading Server-Side Variables

**Test:**
1. After restarting, visit: `http://localhost:3000/api/check-env`
2. Check what it reports

**If still not working:**
Try using a different variable name temporarily to test:
```env
NEXT_PUBLIC_TEST_KEY=test123
```

Then check if `process.env.NEXT_PUBLIC_TEST_KEY` is available (it should be since it starts with `NEXT_PUBLIC_`).

### 5. Hardcode Temporarily (For Testing Only)

As a last resort, you can temporarily hardcode it in the signup route to verify everything else works:

```typescript
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQ2NTExOCwiZXhwIjoyMDgwMDQxMTE4fQ.x6nE8dxJ2KsmDllZxHlq_A_yfk_pKmtg0jgpSj2IiZU'
```

**⚠️ WARNING:** Remove this hardcode before deploying to production!

## Step-by-Step Fix

1. **Stop server completely** (Ctrl+C, wait for prompt)
2. **Delete .next folder**: `Remove-Item -Recurse -Force .next`
3. **Verify .env.local exists**: `Test-Path .env.local`
4. **Recreate .env.local** with exact content above (no quotes, no spaces)
5. **Start server**: `npm run dev`
6. **Check terminal** for debug output when signup is called
7. **Visit** `http://localhost:3000/api/check-env` to verify

## Expected Terminal Output After Fix

When you try to sign up, you should see:
```
[Signup API] Environment check: { hasUrl: true, hasServiceKey: true, serviceKeyLength: 200+ }
```

Instead of:
```
[Signup API] Environment check: { hasUrl: true, hasServiceKey: false, serviceKeyLength: 0 }
```

