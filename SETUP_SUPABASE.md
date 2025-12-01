# Supabase Setup Guide

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project

## Database Setup

### 1. Run the Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/01-schema.sql`
4. Run the SQL script to create all tables and policies

### 2. Insert Sample Data
1. In the SQL Editor, copy and paste the contents of `scripts/02-sample-data.sql`
2. Run the script to insert sample universities and courses

## Environment Variables

1. In your Supabase project dashboard, go to Settings > API
2. Copy the following values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

3. Create a `.env.local` file in the root of your project:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

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

1. Go to Authentication > Users in Supabase dashboard
2. Create a test student user:
   - Email: student@test.com
   - Password: (set a password)
   - After creation, manually insert into `users` table with role='student'
   - Insert into `students` table with student details

3. Create a test admin user:
   - Email: admin@test.com
   - Password: (set a password)
   - After creation, manually insert into `users` table with role='admin'

### Sample Student Data

To create a complete student record, you'll need to:
1. Create auth user
2. Insert into `users` table
3. Insert into `students` table with:
   - full_name
   - kcse_index_number
   - kcse_mean_grade
   - county
4. Insert into `student_clusters` table with subject grades

Example SQL:
```sql
-- After creating auth user, get the user ID
-- Then insert into users table
INSERT INTO users (id, email, role) 
VALUES ('user-uuid-here', 'student@test.com', 'student');

-- Insert student record
INSERT INTO students (id, full_name, kcse_index_number, kcse_mean_grade, county)
VALUES ('user-uuid-here', 'Wanjiku Kamau', '12345678001', 10.5, 'Nairobi');

-- Insert grades
INSERT INTO student_clusters (student_id, subject, grade) VALUES
('user-uuid-here', 'Mathematics', 'A'),
('user-uuid-here', 'English', 'B+'),
('user-uuid-here', 'Kiswahili', 'B'),
('user-uuid-here', 'Chemistry', 'A-'),
('user-uuid-here', 'Biology', 'B+'),
('user-uuid-here', 'Physics', 'B'),
('user-uuid-here', 'History', 'C+');
```

## Troubleshooting

1. **RLS Policy Errors**: Make sure RLS policies are created correctly
2. **Connection Issues**: Verify environment variables are set correctly
3. **Authentication Errors**: Check that email provider is enabled
4. **Data Not Loading**: Verify user has correct role in `users` table



