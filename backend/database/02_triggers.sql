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
