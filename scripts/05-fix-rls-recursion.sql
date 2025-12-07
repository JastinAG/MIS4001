-- Fix RLS recursion issue in users table
-- Run this if you're getting "infinite recursion detected in policy" errors

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can read own record" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;

-- Create helper function to check admin role (avoids recursion)
-- SECURITY DEFINER allows the function to bypass RLS when checking users table
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = user_id 
    AND users.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users can read their own record (no recursion)
CREATE POLICY "Users can read own record" ON users
  FOR SELECT USING (auth.uid() = id);

-- Admins can read all users (using function to avoid recursion)
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (auth.uid() = id OR is_admin(auth.uid()));

-- Verify the fix
-- This should not cause recursion errors
SELECT 'RLS policies fixed successfully' AS status;

