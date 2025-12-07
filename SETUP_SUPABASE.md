# Supabase Setup Guide

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project

## Database Setup

### Option A: Fresh Installation (No Existing Tables)

If you're setting up for the first time or want to start fresh:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/01-schema.sql`
4. Run the SQL script to create all tables and policies
5. Copy and paste the contents of `scripts/02-sample-data.sql`
6. Run the script to insert sample universities and courses

### Option B: Existing Database (Tables Already Created)

If you already ran the initial schema and just need to add missing RLS policies:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/03-add-missing-rls-policies.sql`
4. Run the migration script - this will add the missing policies without recreating tables

**Note**: This migration script is safe to run multiple times - it will drop and recreate policies if they already exist.

### Option C: Reset Everything (⚠️ WARNING: Deletes All Data)

If you want to completely reset your database and start over:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/00-reset-database.sql`
4. Run the script to drop all tables
5. Then follow **Option A** above to recreate everything

## Environment Variables

1. In your Supabase project dashboard, go to Settings > API
2. Copy the following values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

3. Create a `.env.local` file in the root of your project:
```env
# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://xybnqhsqlaaocqibqhbn.supabase.co

# Your Supabase anon/public key (safe to expose in client-side code)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjUxMTgsImV4cCI6MjA4MDA0MTExOH0.TC8NYtT0h3cx9ZZtvQBy9JcT0yHD-daiXm9MMo8zBR4

# Your Supabase service role key (KEEP SECRET - only used server-side)
# Get this from: Supabase Dashboard > Settings > API > service_role key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important**: The service role key is required for the signup API to work. Get it from your Supabase dashboard under Settings > API.

## Authentication Setup

1. Go to Authentication > Settings in Supabase dashboard
2. Enable Email provider
3. Configure email templates if needed

## Row Level Security (RLS)

The schema includes RLS policies that:
- Allow students to view/update only their own data
- Allow admins to view all student data
- Restrict access to placements and admission letters based on user role

## Testing

### Create Test Users

1. Go to Authentication > Users in Supabase dashboard (for administration only).
2. Students should sign up through the app UI. The `/api/auth/signup` endpoint uses the service
   role key to:
   - Create the auth user (auto-confirmed)
   - Insert a record into the `users` table (role = `student`)
   - Insert a record into `students`
   - Seed subject grades in `student_clusters`

3. To create an **admin/super admin** user:
   - Add the auth user in Supabase dashboard (Auth > Users)
   - Insert a record into `users` table with `role = 'admin'`
   - (Optional) Create a row in `students` if the admin also needs a learner profile

## Troubleshooting

1. **RLS Policy Errors**: Make sure RLS policies are created correctly
2. **Connection Issues**: Verify environment variables are set correctly
3. **Authentication Errors**: Check that email provider is enabled
4. **Data Not Loading**: Verify user has correct role in `users` table



