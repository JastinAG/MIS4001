# Deploying to Netlify - Environment Variables Setup

## For Local Development

Your `.env.local` file should have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xybnqhsqlaaocqibqhbn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjUxMTgsImV4cCI6MjA4MDA0MTExOH0.TC8NYtT0h3cx9ZZtvQBy9JcT0yHD-daiXm9MMo8zBR4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQ2NTExOCwiZXhwIjoyMDgwMDQxMTE4fQ.x6nE8dxJ2KsmDllZxHlq_A_yfk_pKmtg0jgpSj2IiZU
```

**Important**: 
- No quotes around values
- No spaces around `=`
- Save as UTF-8 encoding

## For Netlify Deployment

### Step 1: Set Environment Variables in Netlify

1. Go to your **Netlify Dashboard**
2. Select your site
3. Go to **Site settings → Environment variables**
4. Click **"Add a variable"**
5. Add these three variables:

   **Variable 1:**
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://xybnqhsqlaaocqibqhbn.supabase.co`
   - Scope: All scopes

   **Variable 2:**
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjUxMTgsImV4cCI6MjA4MDA0MTExOH0.TC8NYtT0h3cx9ZZtvQBy9JcT0yHD-daiXm9MMo8zBR4`
   - Scope: All scopes

   **Variable 3:**
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQ2NTExOCwiZXhwIjoyMDgwMDQxMTE4fQ.x6nE8dxJ2KsmDllZxHlq_A_yfk_pKmtg0jgpSj2IiZU`
   - Scope: All scopes (or Production only if you want)

### Step 2: Redeploy

After adding environment variables:
1. Go to **Deploys** tab
2. Click **"Trigger deploy" → "Clear cache and deploy site"**
3. Wait for deployment to complete

### Step 3: Verify

After deployment, test signup functionality. It should work with the environment variables set in Netlify.

## Troubleshooting Local Development

If environment variables still don't load locally:

1. **Delete .next folder**:
   ```powershell
   Remove-Item -Recurse -Force .next
   ```

2. **Verify .env.local format**:
   - Open in a text editor (not Word)
   - Make sure it's saved as plain text
   - Check there are no hidden characters

3. **Restart server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Check if loaded**:
   - Visit: `http://localhost:3000/api/check-env`
   - Should show `hasServiceKey: true`

## Security Note

- ✅ `.env.local` is in `.gitignore` (won't be committed)
- ✅ Service role key should NOT be in code
- ✅ Set environment variables in Netlify dashboard for deployment
- ✅ Never commit secrets to GitHub

