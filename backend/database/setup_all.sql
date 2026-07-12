-- ==========================================
-- SECTION: 01_schema.sql
-- ==========================================

-- ==========================================
-- EcoSphere ESG Management Platform
-- Database Schema Definition (Supabase Postgres)
-- ==========================================

-- ============ MASTER TABLES ============

-- 1. Departments table
CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text,
  head text,
  employee_count int DEFAULT 0,
  status text DEFAULT 'active'
);

-- 2. Categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text CHECK (type IN ('csr','challenge')),
  status text DEFAULT 'active'
);

-- 3. Emission Factors table
CREATE TABLE emission_factors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_name text NOT NULL,
  unit text,
  co2_factor numeric NOT NULL
);

-- 4. Product ESG Profiles table
CREATE TABLE product_esg_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL,
  carbon_footprint numeric,
  recyclable boolean DEFAULT false,
  sustainability_rating numeric
);

-- 5. Environmental Goals table
CREATE TABLE environmental_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_name text NOT NULL,
  description text,
  target_value numeric,
  start_date date,
  end_date date,
  status text DEFAULT 'active'
);

-- 6. ESG Policies table
CREATE TABLE esg_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  description text,
  effective_date date,
  status text DEFAULT 'active'
);

-- 7. Badges table
CREATE TABLE badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  xp_required int NOT NULL,
  icon text,
  description text
);

-- 8. Rewards table
CREATE TABLE rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  xp_cost int NOT NULL,
  description text,
  quantity int DEFAULT 0
);

-- 9. Settings table (Singleton, id must always be 1)
CREATE TABLE settings (
  id int PRIMARY KEY DEFAULT 1,
  weight_env numeric DEFAULT 0.40,
  weight_social numeric DEFAULT 0.30,
  weight_gov numeric DEFAULT 0.30,
  auto_emission boolean DEFAULT true,
  evidence_required boolean DEFAULT true,
  badge_auto_award boolean DEFAULT true,
  CONSTRAINT single_row CHECK (id = 1)
);

-- ============ TRANSACTION TABLES ============

-- 10. Employees table
CREATE TABLE employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  total_xp int DEFAULT 0,
  auth_user_id uuid
);

-- 11. Carbon Transactions table
CREATE TABLE carbon_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text CHECK (source_type IN ('purchase','expense','fleet','manufacturing')),
  reference text,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  quantity numeric NOT NULL,
  emission_factor_id uuid REFERENCES emission_factors(id) ON DELETE RESTRICT,
  calculated_co2 numeric,
  date date DEFAULT CURRENT_DATE
);

-- 12. CSR Activities table
CREATE TABLE csr_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  description text,
  start_date date,
  end_date date,
  status text DEFAULT 'active'
);

-- 13. Employee Participation (CSR activity participation) table
CREATE TABLE employee_participation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  csr_activity_id uuid REFERENCES csr_activities(id) ON DELETE CASCADE,
  proof_url text,
  approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending','approved','rejected')),
  xp_earned int DEFAULT 0
);

-- 14. Challenges table
CREATE TABLE challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  xp int DEFAULT 0,
  deadline date,
  status text DEFAULT 'active' CHECK (status IN ('draft','active','under_review','completed','archived'))
);

-- 15. Challenge Participation table
CREATE TABLE challenge_participation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE,
  progress int DEFAULT 0,
  xp_earned int DEFAULT 0,
  completion_status text DEFAULT 'in_progress' CHECK (completion_status IN ('in_progress','completed'))
);

-- 16. Policy Acknowledgements table
CREATE TABLE policy_acknowledgements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  policy_id uuid REFERENCES esg_policies(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'acknowledged',
  UNIQUE (employee_id, policy_id)
);

-- 17. Audits table
CREATE TABLE audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_name text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  auditor text,
  date date,
  findings text,
  status text DEFAULT 'open'
);

-- 18. Compliance Issues table
CREATE TABLE compliance_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_title text NOT NULL,
  description text,
  owner_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  due_date date NOT NULL,
  priority text DEFAULT 'medium',
  status text DEFAULT 'open',
  is_overdue boolean DEFAULT false
);

-- 19. Department Scores table
CREATE TABLE department_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  environmental_score numeric DEFAULT 0,
  social_score numeric DEFAULT 0,
  governance_score numeric DEFAULT 0,
  total_score numeric DEFAULT 0
);

-- 20. Employee Badges table
CREATE TABLE employee_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at timestamptz DEFAULT now(),
  UNIQUE (employee_id, badge_id)
);

-- 21. Redemptions table
CREATE TABLE redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  reward_id uuid REFERENCES rewards(id) ON DELETE CASCADE,
  xp_spent int,
  redeemed_at timestamptz DEFAULT now()
);

-- 22. Notifications table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  type text,
  message text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);


-- ==========================================
-- SECTION: 02_triggers.sql
-- ==========================================

-- ==========================================
-- EcoSphere ESG Management Platform
-- Triggers, Functions & Views (Supabase Postgres)
-- ==========================================

-- 1) Auto-calculate CO2 on carbon transaction
CREATE OR REPLACE FUNCTION fn_calc_co2() 
RETURNS trigger AS $$
BEGIN
  SELECT ef.co2_factor * NEW.quantity INTO NEW.calculated_co2
  FROM emission_factors ef 
  WHERE ef.id = NEW.emission_factor_id;
  RETURN NEW;
END; 
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calc_co2 ON carbon_transactions;
CREATE TRIGGER trg_calc_co2 
BEFORE INSERT OR UPDATE ON carbon_transactions
FOR EACH ROW 
EXECUTE FUNCTION fn_calc_co2();


-- 2) Award XP + auto-badges when CSR participation approved
-- Optimized to prevent spamming duplicate notifications for existing badges
CREATE OR REPLACE FUNCTION fn_csr_approved() 
RETURNS trigger AS $$
DECLARE 
  xp_val int; 
  b record;
BEGIN
  IF NEW.approval_status = 'approved' AND COALESCE(OLD.approval_status,'') <> 'approved' THEN
    -- Check if evidence is required by settings and proof_url is null
    IF (SELECT evidence_required FROM settings WHERE id = 1) AND NEW.proof_url IS NULL THEN
      RAISE EXCEPTION 'Proof upload required before approval';
    END IF;
    
    xp_val := COALESCE(NEW.xp_earned, 50);
    NEW.xp_earned := xp_val;
    
    -- Increment total_xp on the employee record
    UPDATE employees SET total_xp = total_xp + xp_val WHERE id = NEW.employee_id;
 
    -- Award badges newly reached by total_xp, checking for existing badges to prevent double notification
    FOR b IN 
      SELECT * FROM badges 
      WHERE xp_required <= (SELECT total_xp FROM employees WHERE id = NEW.employee_id)
        AND id NOT IN (SELECT badge_id FROM employee_badges WHERE employee_id = NEW.employee_id)
    LOOP
      INSERT INTO employee_badges (employee_id, badge_id) VALUES (NEW.employee_id, b.id) ON CONFLICT DO NOTHING;
      INSERT INTO notifications (employee_id, type, message)
        VALUES (NEW.employee_id, 'badge', 'Badge unlocked: ' || b.name);
    END LOOP;
 
    -- Send approval notification
    INSERT INTO notifications (employee_id, type, message)
      VALUES (NEW.employee_id, 'approval', 'Your CSR participation was approved (+' || xp_val || ' XP)');
  END IF;
  RETURN NEW;
END; 
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_csr_approved ON employee_participation;
CREATE TRIGGER trg_csr_approved 
BEFORE UPDATE ON employee_participation
FOR EACH ROW 
EXECUTE FUNCTION fn_csr_approved();


-- 3) Redeem reward: deduct XP, decrement stock
CREATE OR REPLACE FUNCTION fn_redeem() 
RETURNS trigger AS $$
DECLARE 
  cost int; 
  bal int; 
  stock int;
BEGIN
  SELECT xp_cost, quantity INTO cost, stock FROM rewards WHERE id = NEW.reward_id;
  SELECT total_xp INTO bal FROM employees WHERE id = NEW.employee_id;
  
  IF stock IS NULL OR stock <= 0 THEN 
    RAISE EXCEPTION 'Reward out of stock'; 
  END IF;
  
  IF bal IS NULL OR bal < cost THEN 
    RAISE EXCEPTION 'Insufficient XP'; 
  END IF;
  
  NEW.xp_spent := cost;
  
  -- Deduct employee XP and decrement reward stock
  UPDATE employees SET total_xp = total_xp - cost WHERE id = NEW.employee_id;
  UPDATE rewards SET quantity = quantity - 1 WHERE id = NEW.reward_id;
  
  RETURN NEW;
END; 
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_redeem ON redemptions;
CREATE TRIGGER trg_redeem 
BEFORE INSERT ON redemptions
FOR EACH ROW 
EXECUTE FUNCTION fn_redeem();


-- 4) Flag overdue compliance issues
-- Optimized with CTE to only alert for issues that newly transition to overdue
CREATE OR REPLACE FUNCTION fn_flag_overdue() 
RETURNS void AS $$
BEGIN
  WITH updated AS (
    UPDATE compliance_issues
    SET is_overdue = true
    WHERE due_date < CURRENT_DATE 
      AND status = 'open' 
      AND is_overdue = false
    RETURNING owner_id, issue_title
  )
  INSERT INTO notifications (employee_id, type, message)
    SELECT owner_id, 'compliance', 'Compliance issue overdue: ' || issue_title
    FROM updated;
END; 
$$ LANGUAGE plpgsql;


-- 5) Award XP + auto-badges when a challenge is marked completed
-- Optimized to prevent spamming duplicate notifications for existing badges
CREATE OR REPLACE FUNCTION fn_challenge_completed() 
RETURNS trigger AS $$
DECLARE 
  xp_val int; 
  b record; 
  challenge_xp int;
BEGIN
  IF NEW.completion_status = 'completed' AND COALESCE(OLD.completion_status,'') <> 'completed' THEN
    SELECT xp INTO challenge_xp FROM challenges WHERE id = NEW.challenge_id;
    xp_val := COALESCE(challenge_xp, 0);
    NEW.xp_earned := xp_val;
    
    -- Increment total_xp on the employee record
    UPDATE employees SET total_xp = total_xp + xp_val WHERE id = NEW.employee_id;
 
    -- Award badges newly reached by total_xp, checking for existing badges to prevent double notification
    FOR b IN 
      SELECT * FROM badges 
      WHERE xp_required <= (SELECT total_xp FROM employees WHERE id = NEW.employee_id)
        AND id NOT IN (SELECT badge_id FROM employee_badges WHERE employee_id = NEW.employee_id)
    LOOP
      INSERT INTO employee_badges (employee_id, badge_id) VALUES (NEW.employee_id, b.id) ON CONFLICT DO NOTHING;
      INSERT INTO notifications (employee_id, type, message)
        VALUES (NEW.employee_id, 'badge', 'Badge unlocked: ' || b.name);
    END LOOP;
 
    -- Send challenge completion notification
    INSERT INTO notifications (employee_id, type, message)
      VALUES (NEW.employee_id, 'approval', 'Challenge completed (+' || xp_val || ' XP)');
  END IF;
  RETURN NEW;
END; 
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_challenge_completed ON challenge_participation;
CREATE TRIGGER trg_challenge_completed 
BEFORE UPDATE ON challenge_participation
FOR EACH ROW 
EXECUTE FUNCTION fn_challenge_completed();


-- 6) Notify employee on new policy so they know to acknowledge it
CREATE OR REPLACE FUNCTION fn_policy_reminder() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO notifications (employee_id, type, message)
    SELECT id, 'policy', 'New policy to acknowledge: ' || NEW.policy_name
    from employees;
  RETURN NEW;
END; 
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_policy_reminder ON esg_policies;
CREATE TRIGGER trg_policy_reminder 
AFTER INSERT ON esg_policies
FOR EACH ROW 
EXECUTE FUNCTION fn_policy_reminder();


-- 7) Recompute department total_score whenever a score row is written
CREATE OR REPLACE FUNCTION fn_dept_total_score() 
RETURNS trigger AS $$
DECLARE 
  w_env numeric; 
  w_soc numeric; 
  w_gov numeric;
BEGIN
  SELECT weight_env, weight_social, weight_gov INTO w_env, w_soc, w_gov 
  FROM settings 
  WHERE id = 1;
  
  NEW.total_score := (COALESCE(NEW.environmental_score, 0) * w_env)
                    + (COALESCE(NEW.social_score, 0) * w_soc)
                    + (COALESCE(NEW.governance_score, 0) * w_gov);
  RETURN NEW;
END; 
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_dept_total_score ON department_scores;
CREATE TRIGGER trg_dept_total_score 
BEFORE INSERT OR UPDATE ON department_scores
FOR EACH ROW 
EXECUTE FUNCTION fn_dept_total_score();


-- 8) View: company-wide ESG score, weighted by department employee_count
CREATE OR REPLACE VIEW v_company_esg_score AS
SELECT
  CASE WHEN SUM(d.employee_count) > 0
    THEN ROUND(SUM(ds.total_score * d.employee_count) / SUM(d.employee_count), 2)
    ELSE ROUND(AVG(ds.total_score), 2)
  END as overall_score
FROM department_scores ds
JOIN departments d ON d.id = ds.department_id;


-- ==========================================
-- SECTION: 03_seed.sql
-- ==========================================

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


-- ==========================================
-- SECTION: 04_rls_policies.sql
-- ==========================================

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
