-- ==========================================
-- EcoSphere ESG Management Platform
-- Seed Data (Supabase Postgres)
-- ==========================================

-- 1. Seed settings table (default weights & flags)
INSERT INTO settings (id, weight_env, weight_social, weight_gov, auto_emission, evidence_required, badge_auto_award)
VALUES (1, 0.40, 0.30, 0.30, true, true, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed departments table
INSERT INTO departments (name, code, head, employee_count) VALUES
('Operations', 'OPS', 'Asha Rao', 40),
('Manufacturing', 'MFG', 'Vikram Singh', 80),
('IT', 'IT', 'Priya Nair', 25),
('HR', 'HR', 'Rahul Das', 15);

-- 3. Seed emission factors table
INSERT INTO emission_factors (activity_name, unit, co2_factor) VALUES
('Diesel', 'liter', 2.68),
('Electricity', 'unit', 0.82),
('Petrol', 'liter', 2.31),
('Natural Gas', 'm3', 2.03);

-- 4. Seed badges table
INSERT INTO badges (name, xp_required, icon, description) VALUES
('Green Beginner', 100, '🌱', 'First steps in sustainability'),
('Eco Hero', 500, '🌿', 'Consistent green contributor'),
('ESG Champion', 1000, '🏆', 'Top ESG performer');

-- 5. Seed rewards table
INSERT INTO rewards (name, xp_cost, description, quantity) VALUES
('Eco Water Bottle', 150, 'Reusable steel bottle', 20),
('Extra Day Off', 800, 'One paid leave day', 5),
('Plant a Tree Kit', 200, 'Grow your own sapling', 30);

-- 6. Seed categories table
INSERT INTO categories (name, type) VALUES
('Tree Plantation', 'csr'),
('Blood Donation', 'csr'),
('Save Electricity', 'challenge'),
('Walk to Office', 'challenge');

-- 7. Seed department_scores (so dashboard is populated initially)
-- It joins back to departments to generate initial records.
INSERT INTO department_scores (department_id, environmental_score, social_score, governance_score)
SELECT id, 70, 65, 60 
FROM departments;
