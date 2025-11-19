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
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Student preferences
CREATE TABLE student_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  preference_order INTEGER NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id),
  created_at TIMESTAMP DEFAULT NOW()
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

-- RLS Policies for students (can only see their own data)
CREATE POLICY "Students can read own data" ON students
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for placements
CREATE POLICY "Students can read own placements" ON placements
  FOR SELECT USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- RLS Policies for admission letters
CREATE POLICY "Students can read own letters" ON admission_letters
  FOR SELECT USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));
