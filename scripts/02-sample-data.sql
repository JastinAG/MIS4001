-- Insert sample universities
INSERT INTO universities (name, code) VALUES
  ('University of Nairobi', 'UON'),
  ('Kenyatta University', 'KU'),
  ('Jomo Kenyatta University of Agriculture and Technology', 'JKUAT'),
  ('Moi University', 'MU'),
  ('Strathmore University', 'SU')
ON CONFLICT DO NOTHING;

-- Insert sample courses
INSERT INTO courses (university_id, name, min_cluster_score, intake_capacity)
SELECT id, 'Computer Science', 60, 100 FROM universities WHERE code = 'UON'
UNION ALL
SELECT id, 'Engineering', 65, 80 FROM universities WHERE code = 'UON'
UNION ALL
SELECT id, 'Medicine', 70, 50 FROM universities WHERE code = 'KU'
UNION ALL
SELECT id, 'Business Administration', 50, 150 FROM universities WHERE code = 'KU'
UNION ALL
SELECT id, 'Agriculture', 45, 120 FROM universities WHERE code = 'JKUAT'
UNION ALL
SELECT id, 'Civil Engineering', 62, 90 FROM universities WHERE code = 'JKUAT'
ON CONFLICT DO NOTHING;
