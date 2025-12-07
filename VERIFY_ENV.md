# Verify Environment Variables Are Loaded

## Quick Check

The service role key exists in `.env.local`, but Next.js needs to be restarted to load it.

## Step-by-Step Fix

### 1. Stop the Server
- Find the terminal window running `npm run dev`
- Press **Ctrl+C** to stop it
- Wait for it to fully stop (you should see the prompt return)

### 2. Verify .env.local
Run this command to verify the file exists and has the key:
```powershell
Get-Content .env.local | Select-String "SERVICE_ROLE"
```
You should see: `SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Start the Server Fresh
```bash
npm run dev
```

### 4. Check Terminal Output
When the server starts, you should see:
- No errors about missing environment variables
- The server starting on `http://localhost:3000`
- If you look at the terminal when the signup API is called, you should see debug output like:
  ```
  [Signup API] Environment check: { hasUrl: true, hasServiceKey: true, serviceKeyLength: 200+ }
  ```

### 5. Test Again
- Go to `http://localhost:3000/test`
- Click "Run All Tests"
- All tests should pass

## If Still Not Working

### Check File Location
The `.env.local` file MUST be in the project root:
```
C:\Users\HomePC\Downloads\student-placement-system\.env.local
```
(Same folder as `package.json`)

### Check File Format
The file should have NO quotes around values:
```env
# ✅ CORRECT
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ❌ WRONG
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Check for Extra Spaces
Make sure there are no spaces around the `=`:
```env
# ✅ CORRECT
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ❌ WRONG
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Force Reload
If the server still doesn't pick it up:
1. Stop the server completely
2. Delete `.next` folder: `Remove-Item -Recurse -Force .next`
3. Start server again: `npm run dev`

## Debug Output

The signup route now includes debug logging. When you try to sign up, check the terminal where `npm run dev` is running. You should see:
```
[Signup API] Environment check: { hasUrl: true, hasServiceKey: true, serviceKeyLength: 200+ }
```

If you see `hasServiceKey: false`, the environment variable is not being loaded.

