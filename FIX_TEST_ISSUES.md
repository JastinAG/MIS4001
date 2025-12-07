# Fixing Test Issues

Based on your test results, here are the fixes needed:

## Issue 1: Missing Tables ❌

**Problem**: Tables `users`, `students`, `student_clusters` don't exist.

**Solution**:
1. Go to Supabase SQL Editor
2. Run `scripts/04-create-missing-tables.sql`
3. This will create the missing tables with proper RLS policies

## Issue 2: Missing Service Role Key ❌

**Problem**: `SUPABASE_SERVICE_ROLE_KEY` is not set in environment variables.

**Solution**:
1. Go to your Supabase Dashboard
2. Navigate to: **Settings → API**
3. Find the **service_role key** (it's a secret key, different from anon key)
4. Copy it
5. Open your `.env.local` file in the project root
6. Add or update this line:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
7. **Restart your dev server** after updating `.env.local`

**Important**: The service role key is required for:
- User signup (creating auth users)
- Inserting user/student records
- Bypassing RLS for admin operations

## Issue 3: RLS Policy Recursion ❌

**Problem**: Infinite recursion in users table policy.

**Solution** (Choose one):

### Option A: Use the Fix Script (Recommended)
1. Go to Supabase SQL Editor
2. Run `scripts/05-fix-rls-recursion.sql`
3. This creates a helper function that avoids recursion

### Option B: Simple Fix (No Function)
1. Go to Supabase SQL Editor
2. Run this:

```sql
-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can read own record" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;

-- Simple policy: users can only read their own record
-- Admins will need to use service role key for admin operations
CREATE POLICY "Users can read own record" ON users
  FOR SELECT USING (auth.uid() = id);
```

**Note**: With Option B, admin users won't be able to read all users through RLS, but the service role key will still work for admin operations.

## Complete Fix Steps

### Step 1: Create Missing Tables
1. Go to Supabase SQL Editor
2. Run `scripts/04-create-missing-tables.sql`
3. This creates: `users`, `students`, `student_clusters` tables

### Step 2: Fix RLS Recursion Issue
1. Go to Supabase SQL Editor
2. Run `scripts/05-fix-rls-recursion.sql`
3. This fixes the infinite recursion error in users table policies

### Step 3: Add Service Role Key
1. Get service role key from Supabase Dashboard → Settings → API
2. Add to `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
   ```
3. Restart dev server: `npm run dev`

### Step 4: Re-run Tests
1. Go to `http://localhost:3000/test`
2. Click "Run All Tests"
3. All tests should now pass ✅

## Verification

After applying fixes, verify:

1. **Tables exist**: Check Supabase Table Editor - you should see:
   - ✅ `users`
   - ✅ `students`
   - ✅ `student_clusters`
   - ✅ `universities`
   - ✅ `courses`

2. **Environment variable**: Check that `.env.local` has:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xybnqhsqlaaocqibqhbn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. **RLS policies**: In Supabase Dashboard → Authentication → Policies, check that:
   - Users table has policies without recursion
   - All tables have appropriate policies

## Expected Test Results After Fix

- ✅ Backend Connection - Pass
- ✅ Database Tables - Pass (all 5 tables exist)
- ✅ User Signup - Pass (creates user + student + grades)
- ✅ User Login - Pass
- ✅ Data Fetching - Pass
- ✅ RLS Policies - Pass (no recursion errors)

## Still Having Issues?

1. **Check browser console** (F12) for detailed errors
2. **Verify Supabase project** is active and not paused
3. **Check network tab** to see API requests/responses
4. **Verify service role key** is correct (it's different from anon key)
5. **Restart dev server** after any `.env.local` changes

