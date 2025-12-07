-- WARNING: This script will DROP ALL TABLES and recreate them
-- Only use this if you want to start fresh and don't mind losing all data
-- Run this BEFORE running 01-schema.sql if you want a clean slate

-- Drop all tables in reverse order of dependencies
DROP TABLE IF EXISTS admission_letters CASCADE;
DROP TABLE IF EXISTS placements CASCADE;
DROP TABLE IF EXISTS student_preferences CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS universities CASCADE;
DROP TABLE IF EXISTS student_clusters CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Note: auth.users is managed by Supabase Auth and should not be dropped
-- After running this, execute scripts/01-schema.sql to recreate everything

