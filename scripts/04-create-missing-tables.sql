-- Script to create missing tables (users, students, student_clusters)
-- Run this if these tables don't exist yet

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  kcse_index_number VARCHAR(50) NOT NULL UNIQUE,
  kcse_mean_grade DECIMAL(3, 1) NOT NULL,
  county VARCHAR(100) NOT NULL,
  cluster_score DECIMAL(5, 2),
  placement_status VARCHAR(50) DEFAULT 'pending' CHECK (placement_status IN ('pending', 'placed', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Student clusters (subject scores)
CREATE TABLE IF NOT EXISTS student_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  grade VARCHAR(5) NOT NULL CHECK (grade IN ('A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, subject)
);

-- Enable RLS on new tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_clusters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users (fixed to avoid recursion)
-- Drop existing policies first (to avoid conflicts)
DROP POLICY IF EXISTS "Users can read own record" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Service role can insert users" ON users;

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

-- Users can read their own record
CREATE POLICY "Users can read own record" ON users
  FOR SELECT USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (auth.uid() = id OR is_admin(auth.uid()));

-- Service role can insert users (for signup API)
CREATE POLICY "Service role can insert users" ON users
  FOR INSERT WITH CHECK (true);

-- RLS Policies for students
-- Drop existing policies first
DROP POLICY IF EXISTS "Students can read own data" ON students;
DROP POLICY IF EXISTS "Students can update own data" ON students;
DROP POLICY IF EXISTS "Service role can insert students" ON students;

CREATE POLICY "Students can read own data" ON students
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can insert students" ON students
  FOR INSERT WITH CHECK (true);

-- RLS Policies for student_clusters
-- Drop existing policies first
DROP POLICY IF EXISTS "Students can read own grades" ON student_clusters;
DROP POLICY IF EXISTS "Service role can insert grades" ON student_clusters;

CREATE POLICY "Students can read own grades" ON student_clusters
  FOR SELECT USING (
    student_id = auth.uid() OR EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Service role can insert grades" ON student_clusters
  FOR INSERT WITH CHECK (true);

