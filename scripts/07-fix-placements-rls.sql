-- Fix RLS policies for placements and admission_letters tables
-- Allow students to insert their own placements when applying for courses
-- Allow students to insert their own admission letters when placements are created

-- ============================================
-- PLACEMENTS TABLE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Students can insert own placements" ON placements;
DROP POLICY IF EXISTS "Students can update own placements" ON placements;

-- Students can insert their own placements
CREATE POLICY "Students can insert own placements" ON placements
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Students can update their own placements (for accepting admission)
CREATE POLICY "Students can update own placements" ON placements
  FOR UPDATE USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Admins can still insert placements (keep existing policy)
-- Note: If this policy doesn't exist, it will be created by the main schema script

-- ============================================
-- ADMISSION_LETTERS TABLE POLICIES
-- ============================================

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Students can insert own letters" ON admission_letters;
DROP POLICY IF EXISTS "Service role can insert letters" ON admission_letters;

-- Students can insert their own admission letters
CREATE POLICY "Students can insert own letters" ON admission_letters
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Service role can insert letters (for automated creation)
CREATE POLICY "Service role can insert letters" ON admission_letters
  FOR INSERT WITH CHECK (true);

-- Verify the policies
SELECT 'Placements and admission_letters RLS policies updated successfully' AS status;

