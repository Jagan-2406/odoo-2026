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
