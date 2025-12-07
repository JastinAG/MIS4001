-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
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
CREATE TABLE student_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  grade VARCHAR(5) NOT NULL CHECK (grade IN ('A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, subject)
);

-- Universities table
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  min_cluster_score DECIMAL(5, 2) NOT NULL,
  intake_capacity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Student preferences (depends on courses, so defined after)
CREATE TABLE student_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  preference_order INTEGER NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Placements table
CREATE TABLE placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id),
  university_id UUID NOT NULL REFERENCES universities(id),
  placement_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admission letters table
CREATE TABLE admission_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placement_id UUID NOT NULL REFERENCES placements(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id),
  university_id UUID NOT NULL REFERENCES universities(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  letter_date TIMESTAMP DEFAULT NOW(),
  admission_date DATE NOT NULL,
  pdf_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_letters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users (fixed to avoid recursion)
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

-- RLS Policies for students (can only see their own data)
CREATE POLICY "Students can read own data" ON students
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can insert students" ON students
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

-- RLS Policies for placements
CREATE POLICY "Students can read own placements" ON placements
  FOR SELECT USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Students can insert own placements" ON placements
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own placements" ON placements
  FOR UPDATE USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can insert placements" ON placements
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- RLS Policies for admission letters
CREATE POLICY "Students can read own letters" ON admission_letters
  FOR SELECT USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Students can insert own letters" ON admission_letters
  FOR INSERT WITH CHECK (student_id = auth.uid());
