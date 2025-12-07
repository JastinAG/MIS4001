# Testing Guide - Supabase Connection

This guide provides step-by-step instructions for testing your Supabase backend connection.

## Method 1: Automated Test Page (Easiest)

### Steps:

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the test page**:
   - Open your browser and go to: `http://localhost:3000/test`

3. **Run the tests**:
   - Click "Run All Tests" to test everything at once
   - Or click individual test buttons to test specific features

4. **Review the results**:
   - ✅ Green = Test passed
   - ❌ Red = Test failed
   - 🔄 Blue = Test in progress

### What Gets Tested:

1. **Backend Connection**
   - Verifies Supabase client can connect
   - Tests basic database access

2. **Database Tables**
   - Checks if all required tables exist
   - Lists any missing tables

3. **User Signup**
   - Tests the signup API endpoint
   - Verifies user, student, and grades are created
   - Checks data integrity

4. **User Login**
   - Tests authentication flow
   - Verifies session management
   - Checks role assignment

5. **Data Fetching**
   - Tests reading universities
   - Tests reading courses
   - Tests reading student data (if logged in)

6. **RLS Policies**
   - Verifies Row Level Security is working
   - Tests access controls
   - Verifies public data access

## Method 2: Manual Testing

### Test 1: Backend Connection

1. Open browser console (F12)
2. Navigate to any page
3. Check for errors in console
4. Should see no Supabase connection errors

### Test 2: User Signup

1. Go to `/register`
2. Fill in:
   - Email: `test-${Date.now()}@example.com` (use unique email)
   - Password: `testpassword123`
   - Confirm Password: `testpassword123`
3. Click "Create Account"
4. **Expected**: Redirected to dashboard, no errors

**Verify in Supabase Dashboard**:
- Go to Authentication → Users → Should see new user
- Go to Table Editor → `users` → Should see user record
- Go to Table Editor → `students` → Should see student record
- Go to Table Editor → `student_clusters` → Should see 8 grade records

### Test 3: User Login

1. Go to `/login`
2. Select role: "Student"
3. Enter the email and password you used for signup
4. Click "Sign In"
5. **Expected**: Redirected to dashboard, logged in

**Verify**:
- Check browser console for errors
- User should see their dashboard with data
- URL should be `/dashboard`

### Test 4: Data Fetching (Student Dashboard)

1. Log in as a student
2. Go to `/dashboard`
3. **Expected to see**:
   - Full Name
   - KCSE Index Number
   - Cluster Points
   - Subject Grades (8 subjects)

**If data doesn't load**:
- Check browser console for errors
- Verify RLS policies allow reading own data
- Check that student record exists in Supabase

### Test 5: Data Fetching (Course Selection)

1. While logged in as student, go to `/dashboard?view=courses`
2. **Expected to see**:
   - List of available courses
   - Courses filtered by cluster points
   - Recommended courses highlighted

**If courses don't load**:
- Verify `courses` table has data (run `scripts/02-sample-data.sql`)
- Check that `universities` table has data
- Verify RLS policies allow reading courses

### Test 6: Admin Features

1. **Create an admin user**:
   - Sign up as a regular user
   - Go to Supabase Dashboard → Table Editor → `users`
   - Find your user and change `role` to `'admin'`

2. **Log in as admin**:
   - Go to `/login`
   - Select role: "Admin"
   - Enter your credentials
   - **Expected**: Redirected to `/admin`

3. **Test admin dashboard**:
   - Should see statistics:
     - Total Students
     - Placed Students
     - Total Universities
     - Total Courses
     - University-wise statistics

4. **Test viewing students**:
   - Go to `/admin/students`
   - **Expected**: See list of all registered students

5. **Test adding universities**:
   - Go to `/admin/universities`
   - Click "Add"
   - Fill in:
     - Name: "Test University"
     - Code: "TU"
   - Click "Save"
   - **Expected**: University appears in list

**Verify in Supabase**:
- Go to Table Editor → `universities` → Should see new university

## Common Issues and Solutions

### Issue: "Missing Supabase configuration"

**Solution**:
- Check that `.env.local` exists in project root
- Verify all three environment variables are set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Restart the dev server after creating/updating `.env.local`

### Issue: "Failed to create user record"

**Solution**:
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check that `users` table exists
- Verify RLS policies allow service role to insert

### Issue: "Access denied" during login

**Solution**:
- Check user's role in `users` table matches selected role
- Verify RLS policies are set up correctly
- Check that user record exists in `users` table

### Issue: Data not loading on dashboard

**Solution**:
- Check browser console for specific errors
- Verify RLS policies allow user to read their data
- Check that data exists in Supabase tables
- Verify user has a record in `students` table

### Issue: "Cannot read universities/courses"

**Solution**:
- Run `scripts/03-add-missing-rls-policies.sql` to add missing policies
- Verify RLS policies allow public read for universities and courses
- Check that tables have data (run `scripts/02-sample-data.sql`)

## Verification Checklist

After running all tests, verify:

- [ ] Backend connection works
- [ ] All database tables exist
- [ ] User signup creates auth user, user record, student record, and grades
- [ ] User login works for both students and admins
- [ ] Student dashboard loads data from Supabase
- [ ] Course selection loads courses from Supabase
- [ ] Admin can view all students
- [ ] Admin can add universities
- [ ] Admin dashboard shows real-time statistics
- [ ] RLS policies are working correctly

## Next Steps

Once all tests pass:

1. ✅ Your Supabase connection is working
2. ✅ Authentication is set up correctly
3. ✅ Data storage and retrieval is functional
4. ✅ RLS policies are protecting data appropriately

You can now use the application with confidence that everything is connected properly!

