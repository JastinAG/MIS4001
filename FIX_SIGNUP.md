# Fix Signup Issue - Service Role Key Not Loading

## The Problem

The signup is failing because the `SUPABASE_SERVICE_ROLE_KEY` environment variable is not being loaded by Next.js.

## Quick Fix: Restart the Dev Server

**The server must be restarted** for Next.js to load environment variables from `.env.local`.

### Steps:

1. **Stop the current server**:
   - Go to the terminal where `npm run dev` is running
   - Press **Ctrl+C**
   - Wait until you see the command prompt

2. **Verify .env.local exists**:
   ```powershell
   Test-Path .env.local
   ```
   Should return `True`

3. **Verify the key is in the file**:
   ```powershell
   Get-Content .env.local | Select-String "SERVICE_ROLE"
   ```
   Should show the key

4. **Start the server again**:
   ```bash
   npm run dev
   ```

5. **Test signup again**:
   - Go to `/register`
   - Try to create an account
   - Should work now!

## Verify It's Working

After restarting, check the terminal output when you try to sign up. You should see:
```
[Signup API] Environment check: { hasUrl: true, hasServiceKey: true, serviceKeyLength: 200+ }
```

Instead of:
```
[Signup API] Environment check: { hasUrl: true, hasServiceKey: false, serviceKeyLength: 0 }
```

## Alternative: Check Environment Variables

Visit `http://localhost:3000/api/check-env` after restarting. It should show:
```json
{
  "status": "ok",
  "hasServiceKey": true
}
```

## Why This Happens

Next.js loads `.env.local` **only when the server starts**. If you:
- Created `.env.local` while server was running
- Updated `.env.local` while server was running
- The server was started before `.env.local` existed

You **must restart** the server.

## Still Not Working?

1. **Clear Next.js cache**:
   ```powershell
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

2. **Check file encoding**: Make sure `.env.local` is saved as UTF-8

3. **Check for typos**: Variable name must be exactly `SUPABASE_SERVICE_ROLE_KEY`

4. **Check for spaces**: No spaces around the `=` sign

