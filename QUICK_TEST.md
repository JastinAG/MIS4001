# Quick Test Guide

## 🚀 Fastest Way to Test Everything

### Step 1: Start the Server
```bash
npm run dev
```

### Step 2: Open Test Page
Navigate to: **http://localhost:3000/test**

### Step 3: Run Tests
Click the **"Run All Tests"** button

### Step 4: Review Results
- ✅ Green = Working
- ❌ Red = Needs fixing
- Click "View Details" for more info

## What Gets Tested

1. ✅ **Backend Connection** - Can we connect to Supabase?
2. ✅ **Database Tables** - Do all required tables exist?
3. ✅ **User Signup** - Can we create new users with student data?
4. ✅ **User Login** - Can users authenticate?
5. ✅ **Data Fetching** - Can we read universities, courses, and student data?
6. ✅ **RLS Policies** - Are security policies working?

## If Tests Fail

1. Check the error message in the test result
2. Review the troubleshooting tips shown
3. Verify your `.env.local` file has all three variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Make sure you've run the database migration:
   - `scripts/03-add-missing-rls-policies.sql` (if tables exist)
   - OR `scripts/01-schema.sql` (if starting fresh)
5. Check browser console (F12) for detailed errors

## Manual Testing Alternative

If you prefer to test manually:

1. **Test Signup**: Go to `/register` and create an account
2. **Test Login**: Go to `/login` and sign in
3. **Test Dashboard**: After login, check `/dashboard` for your data
4. **Test Admin**: Create admin user in Supabase, then log in as admin

See `TESTING_GUIDE.md` for detailed manual testing steps.

