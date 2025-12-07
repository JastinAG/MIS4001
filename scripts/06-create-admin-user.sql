-- Script to create an admin user
-- Replace the placeholders with your actual values

-- Step 1: First, create the auth user in Supabase Dashboard:
-- Go to Authentication → Users → Add User
-- Set email, password, and check "Auto Confirm User"
-- Copy the user's UUID

-- Step 2: Run this script with your values:

-- Replace these values:
-- 'your-admin-email@example.com' - Your admin email
-- 'your-user-uuid-from-auth' - UUID from auth.users table

INSERT INTO users (id, email, role)
VALUES (
  'your-user-uuid-from-auth',  -- Replace with actual UUID from auth.users
  'your-admin-email@example.com',  -- Replace with your admin email
  'admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- To verify the admin was created:
SELECT id, email, role, created_at 
FROM users 
WHERE role = 'admin';

-- To convert an existing user to admin:
-- UPDATE users SET role = 'admin' WHERE email = 'existing-user@example.com';

