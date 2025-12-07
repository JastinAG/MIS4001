# Supabase Connection Verification Guide

This document helps you verify that your application is properly connected to Supabase and that login, signup, and data storage are working correctly.

## Quick Test (Recommended)

**Use the automated test page** to quickly verify everything:

1. Start your development server: `npm run dev`
2. Navigate to `/test` in your browser
3. Click "Run All Tests" to test:
   - Backend connection
   - Database tables
   - User signup
   - User login
   - Data fetching
   - RLS policies

The test page will show you detailed results for each test and provide troubleshooting tips if anything fails.

## Prerequisites Checklist

- [ ] Supabase project created at https://supabase.com
- [ ] Database schema executed (`scripts/01-schema.sql` or `scripts/03-add-missing-rls-policies.sql`)
- [ ] Sample data inserted (`scripts/02-sample-data.sql`)
- [ ] `.env.local` file created with correct credentials
- [ ] Service role key obtained from Supabase dashboard

## Environment Variables Setup

Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xybnqhsqlaaocqibqhbn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjUxMTgsImV4cCI6MjA4MDA0MTExOH0.TC8NYtT0h3cx9ZZtvQBy9JcT0yHD-daiXm9MMo8zBR4
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important**: Get the `SUPABASE_SERVICE_ROLE_KEY` from:
- Supabase Dashboard → Settings → API → service_role key (secret)

## Testing Signup Flow

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to** `/register`

3. **Fill in the registration form**:
   - Email: `test@example.com`
   - Password: `password123` (minimum 6 characters)
   - Confirm Password: `password123`

4. **Submit the form**

5. **Expected behavior**:
   - Account is created in Supabase Auth
   - User record inserted into `users` table with `role = 'student'`
   - Student record created in `students` table with:
     - Full name derived from email
     - Random KCSE index number
     - Random county
     - Random subject grades (8 subjects)
     - Calculated cluster score
   - Grades inserted into `student_clusters` table
   - User is automatically logged in
   - Redirected to `/dashboard`

6. **Verify in Supabase Dashboard**:
   - Go to Authentication → Users → Should see the new user
   - Go to Table Editor → `users` → Should see the user record
   - Go to Table Editor → `students` → Should see the student record
   - Go to Table Editor → `student_clusters` → Should see 8 grade records

## Testing Login Flow

1. **Navigate to** `/login`

2. **Select role**: Choose "Student" or "Admin" from dropdown

3. **Enter credentials**:
   - Email: The email you used during signup
   - Password: The password you used during signup

4. **Submit the form**

5. **Expected behavior**:
   - If role matches user's role in database → Login successful, redirected to appropriate dashboard
   - If role doesn't match → Error message: "Access denied. This account is registered as [role], not [selected role]."

6. **Verify session**:
   - Check browser console for any errors
   - User should see their dashboard with data loaded

## Testing Data Storage

### Student Dashboard Data

1. **After logging in as a student**, navigate to `/dashboard`

2. **Expected data to be displayed**:
   - Full Name (from `students.full_name`)
   - KCSE Index Number (from `students.kcse_index_number`)
   - Cluster Points (from `students.cluster_score`)
   - Subject Grades (from `student_clusters` table)

3. **If data doesn't load**:
   - Check browser console for errors
   - Verify RLS policies allow the user to read their own data
   - Check that the user has a record in `students` table

### Course Selection

1. **Navigate to** `/dashboard?view=courses`

2. **Expected behavior**:
   - Courses are loaded from `courses` table
   - Courses are filtered by cluster points
   - Recommended courses are shown first
   - Courses include university information

3. **If courses don't load**:
   - Verify `courses` table has data (run `scripts/02-sample-data.sql`)
   - Check that `universities` table has data
   - Verify RLS policies allow reading courses

### Admin Dashboard

1. **Log in as admin** (you need to manually create an admin user - see below)

2. **Navigate to** `/admin`

3. **Expected metrics**:
   - Total Students (from `students` table)
   - Placed Students (from `students.placement_status = 'placed'`)
   - Total Universities (from `universities` table)
   - Total Courses (from `courses` table)
   - University-wise statistics (from `placements` table)

### Admin - View Students

1. **Navigate to** `/admin/students`

2. **Expected behavior**:
   - List of all students from `students` table
   - Search functionality by name, KCSE index, or county
   - Student details displayed in a table

3. **If students don't load**:
   - Verify RLS policies allow admins to read all student data
   - Check that admin user has `role = 'admin'` in `users` table

### Admin - Add Universities

1. **Navigate to** `/admin/universities`

2. **Click "Add" button**

3. **Fill in the form**:
   - University Name: e.g., "Mount Kenya University"
   - Code: e.g., "MKU"

4. **Submit the form**

5. **Expected behavior**:
   - University is inserted into `universities` table
   - University appears in the list immediately
   - Form resets

6. **Verify in Supabase**:
   - Go to Table Editor → `universities` → Should see the new university

## Creating an Admin User

To test admin features, you need to create an admin user:

1. **Sign up as a regular user** through the UI (this creates a student)

2. **Go to Supabase Dashboard** → Table Editor → `users`

3. **Find the user you just created** and update their `role` to `'admin'`:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
   ```

4. **Now you can log in as admin** using the same credentials

## Troubleshooting

### Error: "Missing Supabase configuration"
- **Solution**: Check that `.env.local` exists and has all three variables set
- Restart the dev server after creating/updating `.env.local`

### Error: "Failed to create user record"
- **Solution**: Check that `users` table exists and RLS policies allow inserts
- Verify service role key is correct

### Error: "Access denied" during login
- **Solution**: Verify the user's role in `users` table matches the selected role in login form

### Data not loading on dashboard
- **Solution**: 
  - Check browser console for specific errors
  - Verify RLS policies allow the user to read their data
  - Check that data exists in Supabase tables
  - Verify the user has a record in `students` table (for students)

### RLS Policy Errors
- **Solution**: Run `scripts/01-schema.sql` again to ensure all policies are created
- Check Supabase logs for specific policy violations

## Database Schema Verification

Run these queries in Supabase SQL Editor to verify tables exist:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'students', 'student_clusters', 'universities', 'courses', 'placements', 'admission_letters');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'students', 'student_clusters', 'universities', 'courses');
```

All tables should have `rowsecurity = true`.

## Next Steps

Once everything is verified:
1. ✅ Signup creates users with student data
2. ✅ Login works for both students and admins
3. ✅ Student dashboard loads data from Supabase
4. ✅ Admin can view all students
5. ✅ Admin can add universities
6. ✅ Courses are loaded from Supabase
7. ✅ Data persists across sessions

Your application is now fully connected to Supabase! 🎉

