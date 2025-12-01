-- Insert sample universities
INSERT INTO universities (name, code) VALUES
  ('University of Nairobi', 'UON'),
  ('Kenyatta University', 'KU'),
  ('Jomo Kenyatta University of Agriculture and Technology', 'JKUAT'),
  ('Moi University', 'MU'),
  ('Strathmore University', 'SU'),
  ('Daystar University', 'DU'),
  ('Egerton University', 'EU'),
  ('Technical University of Kenya', 'TUK')
ON CONFLICT DO NOTHING;

-- Insert sample courses
INSERT INTO courses (university_id, name, min_cluster_score, intake_capacity)
SELECT id, 'Bachelor of Science in Computer Science', 42, 100 FROM universities WHERE code = 'UON'
UNION ALL
SELECT id, 'Bachelor of Engineering (Electrical)', 65, 80 FROM universities WHERE code = 'UON'
UNION ALL
SELECT id, 'Bachelor of Medicine and Surgery', 70, 50 FROM universities WHERE code = 'KU'
UNION ALL
SELECT id, 'Bachelor of Education (Science)', 35, 150 FROM universities WHERE code = 'KU'
UNION ALL
SELECT id, 'Bachelor of Science in Agriculture', 30, 120 FROM universities WHERE code = 'JKUAT'
UNION ALL
SELECT id, 'Bachelor of Science in Information Technology', 38, 90 FROM universities WHERE code = 'JKUAT'
UNION ALL
SELECT id, 'Bachelor of Business Information Technology', 40, 60 FROM universities WHERE code = 'SU'
UNION ALL
SELECT id, 'Bachelor of Arts in Communication', 36, 70 FROM universities WHERE code = 'DU'
UNION ALL
SELECT id, 'Bachelor of Business Administration', 38, 85 FROM universities WHERE code = 'DU'
UNION ALL
SELECT id, 'Bachelor of Science in Information Technology', 37, 60 FROM universities WHERE code = 'DU'
UNION ALL
SELECT id, 'Bachelor of Engineering (Electrical)', 41, 45 FROM universities WHERE code = 'TUK'
ON CONFLICT DO NOTHING;
