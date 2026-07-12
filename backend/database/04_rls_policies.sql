-- ==========================================
-- EcoSphere ESG Management Platform
-- Row-Level Security (RLS) & Storage Setup (Supabase Postgres)
-- ==========================================

-- Enable Row-Level Security (RLS) on all tables and create permissive authenticated policies

-- 1. departments
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON departments;
CREATE POLICY "auth read/write" ON departments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON categories;
CREATE POLICY "auth read/write" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. emission_factors
ALTER TABLE emission_factors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON emission_factors;
CREATE POLICY "auth read/write" ON emission_factors FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. product_esg_profiles
ALTER TABLE product_esg_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON product_esg_profiles;
CREATE POLICY "auth read/write" ON product_esg_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. environmental_goals
ALTER TABLE environmental_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON environmental_goals;
CREATE POLICY "auth read/write" ON environmental_goals FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. esg_policies
ALTER TABLE esg_policies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON esg_policies;
CREATE POLICY "auth read/write" ON esg_policies FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. badges
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON badges;
CREATE POLICY "auth read/write" ON badges FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. rewards
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON rewards;
CREATE POLICY "auth read/write" ON rewards FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON settings;
CREATE POLICY "auth read/write" ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 10. employees
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON employees;
CREATE POLICY "auth read/write" ON employees FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 11. carbon_transactions
ALTER TABLE carbon_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON carbon_transactions;
CREATE POLICY "auth read/write" ON carbon_transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 12. csr_activities
ALTER TABLE csr_activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON csr_activities;
CREATE POLICY "auth read/write" ON csr_activities FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 13. employee_participation
ALTER TABLE employee_participation ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON employee_participation;
CREATE POLICY "auth read/write" ON employee_participation FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 14. challenges
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON challenges;
CREATE POLICY "auth read/write" ON challenges FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 15. challenge_participation
ALTER TABLE challenge_participation ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON challenge_participation;
CREATE POLICY "auth read/write" ON challenge_participation FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 16. policy_acknowledgements
ALTER TABLE policy_acknowledgements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON policy_acknowledgements;
CREATE POLICY "auth read/write" ON policy_acknowledgements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 17. audits
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON audits;
CREATE POLICY "auth read/write" ON audits FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 18. compliance_issues
ALTER TABLE compliance_issues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON compliance_issues;
CREATE POLICY "auth read/write" ON compliance_issues FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 19. department_scores
ALTER TABLE department_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON department_scores;
CREATE POLICY "auth read/write" ON department_scores FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 20. employee_badges
ALTER TABLE employee_badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON employee_badges;
CREATE POLICY "auth read/write" ON employee_badges FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 21. redemptions
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON redemptions;
CREATE POLICY "auth read/write" ON redemptions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 22. notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth read/write" ON notifications;
CREATE POLICY "auth read/write" ON notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==========================================
-- STORAGE BUCKETS & POLICIES SETUP
-- ==========================================

-- 1. Create proofs bucket inside storage schema
INSERT INTO storage.buckets (id, name, public) 
VALUES ('proofs', 'proofs', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable insert/upload policy for authenticated users
DROP POLICY IF EXISTS "authenticated upload proofs" ON storage.objects;
CREATE POLICY "authenticated upload proofs" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'proofs');

-- 3. Enable public read/select policy for everyone
DROP POLICY IF EXISTS "public read proofs" ON storage.objects;
CREATE POLICY "public read proofs" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'proofs');
