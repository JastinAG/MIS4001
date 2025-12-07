-- Migration script to add missing RLS policies
-- Run this if you already have the tables created from the initial schema
-- This script is idempotent - it will drop and recreate policies if they already exist

-- Drop existing policies if they exist (to avoid conflicts)
-- This includes both old and new policy names
DROP POLICY IF EXISTS "Users can read own record" ON users;
DROP POLICY IF EXISTS "Service role can insert users" ON users;
DROP POLICY IF EXISTS "Service role can insert students" ON students;
DROP POLICY IF EXISTS "Students can read own grades" ON student_clusters;
DROP POLICY IF EXISTS "Service role can insert grades" ON student_clusters;
DROP POLICY IF EXISTS "Anyone can read universities" ON universities;
DROP POLICY IF EXISTS "Admins can insert universities" ON universities;
DROP POLICY IF EXISTS "Admins can update universities" ON universities;
DROP POLICY IF EXISTS "Anyone can read courses" ON courses;
DROP POLICY IF EXISTS "Admins can insert courses" ON courses;
DROP POLICY IF EXISTS "Admins can update courses" ON courses;
DROP POLICY IF EXISTS "Students can read own preferences" ON student_preferences;
DROP POLICY IF EXISTS "Students can insert own preferences" ON student_preferences;
DROP POLICY IF EXISTS "Admins can insert placements" ON placements;
DROP POLICY IF EXISTS "Students can read own data" ON students;
DROP POLICY IF EXISTS "Students can update own data" ON students;
DROP POLICY IF EXISTS "Students can read own placements" ON placements;
DROP POLICY IF EXISTS "Students can read own letters" ON admission_letters;

-- RLS Policies for users (fixed to avoid recursion)
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can read own record" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;

-- Users can read their own record (no recursion)
CREATE POLICY "Users can read own record" ON users
  FOR SELECT USING (auth.uid() = id);

-- Create helper function to check admin role (avoids recursion)
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

-- Admins can read all users (using function to avoid recursion)
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (auth.uid() = id OR is_admin(auth.uid()));

CREATE POLICY "Service role can insert users" ON users
  FOR INSERT WITH CHECK (true);

-- RLS Policies for student_clusters
CREATE POLICY "Students can read own grades" ON student_clusters
  FOR SELECT USING (
    student_id = auth.uid() OR EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Service role can insert grades" ON student_clusters
  FOR INSERT WITH CHECK (true);

-- RLS Policies for universities (public read, admin write)
CREATE POLICY "Anyone can read universities" ON universities
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert universities" ON universities
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

CREATE POLICY "Admins can update universities" ON universities
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- RLS Policies for courses (public read, admin write)
CREATE POLICY "Anyone can read courses" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert courses" ON courses
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

CREATE POLICY "Admins can update courses" ON courses
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- RLS Policies for student_preferences
CREATE POLICY "Students can read own preferences" ON student_preferences
  FOR SELECT USING (
    student_id = auth.uid() OR EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Students can insert own preferences" ON student_preferences
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- RLS Policies for students (recreate to ensure they exist)
CREATE POLICY "Students can read own data" ON students
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can insert students" ON students
  FOR INSERT WITH CHECK (true);

-- RLS Policies for placements
CREATE POLICY "Students can read own placements" ON placements
  FOR SELECT USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Admins can insert placements" ON placements
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- RLS Policies for admission letters
CREATE POLICY "Students can read own letters" ON admission_letters
  FOR SELECT USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Verify RLS is enabled on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_letters ENABLE ROW LEVEL SECURITY;

