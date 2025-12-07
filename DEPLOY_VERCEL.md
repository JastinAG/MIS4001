# Deploying to Vercel - Environment Variables Setup

## Required Environment Variables

Your Vercel deployment needs these three environment variables:

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY`

## Step 1: Set Environment Variables in Vercel

1. Go to your **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these three variables:

   **Variable 1:**
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://xybnqhsqlaaocqibqhbn.supabase.co`
   - Environment: Production, Preview, Development (select all)

   **Variable 2:**
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjUxMTgsImV4cCI6MjA4MDA0MTExOH0.TC8NYtT0h3cx9ZZtvQBy9JcT0yHD-daiXm9MMo8zBR4`
   - Environment: Production, Preview, Development (select all)

   **Variable 3 (CRITICAL for signup):**
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQ2NTExOCwiZXhwIjoyMDgwMDQxMTE4fQ.x6nE8dxJ2KsmDllZxHlq_A_yfk_pKmtg0jgpSj2IiZU`
   - Environment: Production, Preview, Development (select all)
   - **Important**: This is required for user signup to work

## Step 2: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Select **"Redeploy"**
4. Or push a new commit to trigger a new deployment

**Note**: Vercel will automatically rebuild with the new environment variables.

## Step 3: Verify

After deployment:

1. Test the signup functionality
2. Check Vercel logs if there are any issues
3. Visit your deployed site and try creating an account

## Troubleshooting

### If signup still fails:

1. **Check Vercel Logs**:
   - Go to your deployment
   - Click on the deployment
   - Check the "Functions" tab for any errors

2. **Verify Environment Variables**:
   - Go to Settings → Environment Variables
   - Make sure all three variables are set
   - Make sure `SUPABASE_SERVICE_ROLE_KEY` is set (this is the most common issue)

3. **Check Variable Names**:
   - Must be exactly: `SUPABASE_SERVICE_ROLE_KEY` (case-sensitive)
   - No spaces or extra characters

4. **Redeploy After Adding Variables**:
   - Environment variables are only available after redeployment
   - Simply adding them won't affect existing deployments

## Security Note

- ✅ Service role key is server-side only (not exposed to client)
- ✅ Environment variables in Vercel are encrypted
- ✅ Never commit secrets to GitHub
- ✅ Service role key should only be used in API routes

## Quick Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` set in Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in Vercel
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set in Vercel (CRITICAL)
- [ ] All variables set for Production, Preview, and Development
- [ ] Redeployed after adding variables
- [ ] Tested signup functionality

