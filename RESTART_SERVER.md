# ⚠️ IMPORTANT: Restart Your Dev Server

## The Issue

Your `.env.local` file has been created with the service role key, but **Next.js only loads environment variables when the server starts**.

The errors you're seeing:
- "Supabase service role key is not configured"
- Signup/Login tests failing

This is because the dev server is still running with the old environment (before `.env.local` was created).

## ✅ Solution: Restart the Server

### Step 1: Stop the Current Server

1. Go to your terminal where `npm run dev` is running
2. Press **Ctrl+C** to stop the server

### Step 2: Verify .env.local Exists

The file should be in your project root: `C:\Users\HomePC\Downloads\student-placement-system\.env.local`

It should contain:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xybnqhsqlaaocqibqhbn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Start the Server Again

```bash
npm run dev
```

### Step 4: Re-run Tests

1. Go to `http://localhost:3000/test`
2. Click **"Run All Tests"**
3. All 6 tests should now pass ✅

## Why This Happens

Next.js loads environment variables from `.env.local` **only when the server starts**. If you:
- Create `.env.local` while the server is running
- Update `.env.local` while the server is running
- Add new variables to `.env.local`

You **must restart** the server for the changes to take effect.

## Verification

After restarting, check the terminal output. You should see:
- No errors about missing environment variables
- The server starting successfully
- The signup API should work (check `/api/auth/signup`)

## Still Not Working?

If after restarting you still see errors:

1. **Check the file name**: Must be exactly `.env.local` (not `.env.local.txt`)
2. **Check the location**: Must be in the project root (same folder as `package.json`)
3. **Check for typos**: Variable names must match exactly:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. **Check for quotes**: Don't wrap values in quotes unless they contain spaces
5. **Check terminal output**: Look for any error messages when the server starts

## Quick Test

After restarting, you can verify the environment variable is loaded by checking the server logs. The signup route now includes debug logging that will show if the service key is detected.

