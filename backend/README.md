# 🌍 EcoSphere ESG Backend Documentation

Welcome to the backend of the **EcoSphere ESG Management Platform**. This folder contains the complete database schemas, triggers, seed data, RLS security policies, and Vercel serverless functions required to run the platform.

---

## 🏗️ Architecture Overview

The backend uses a modern, serverless architecture:
1. **Database, Auth & Storage (Supabase/Postgres)**: Holds all relational data, executes real-time business logic triggers, handles image/document storage, and controls row-level security.
2. **Serverless Functions (Python on Vercel)**: A lightweight Python API to generate beautifully formatted PDF and Excel exports.

---

## 🗄️ Database Setup

To set up the database, log into your Supabase dashboard, open the **SQL Editor**, and copy-paste the entire contents of the combined setup file:
* 🔗 **[setup_all.sql](database/setup_all.sql)**

Alternatively, you can run the modular SQL scripts in the following order:
1. 🔗 **[01_schema.sql](database/01_schema.sql)** - Tables and foreign keys (22 tables total).
2. 🔗 **[02_triggers.sql](database/02_triggers.sql)** - Functions, triggers, and views (all business logic).
3. 🔗 **[03_seed.sql](database/03_seed.sql)** - Seed data (departments, emission factors, badges, rewards, etc.).
4. 🔗 **[04_rls_policies.sql](database/04_rls_policies.sql)** - Row-Level Security and `proofs` storage bucket setup.

---

## 🧠 Business Logic & Triggers

To prevent integration conflicts, the database handles core calculations and integrity checks automatically. Here is how they behave:

### 1. Environmental Scoring
* **CO₂ Calculations**: Whenever a `carbon_transactions` row is inserted or updated, the database trigger `trg_calc_co2` automatically lookup the `co2_factor` in `emission_factors` and sets `calculated_co2 = quantity * co2_factor`.
* **Department Total Score**: The `trg_dept_total_score` trigger automatically computes a department's total ESG score in `department_scores` using weight settings from the `settings` table:
  $$\text{Total Score} = (\text{Env Score} \times W_{env}) + (\text{Soc Score} \times W_{soc}) + (\text{Gov Score} \times W_{gov})$$
* **Company ESG Score**: The `v_company_esg_score` view calculates a weighted overall company ESG score based on department scores weighted by employee counts.

### 2. Gamification & XP Economy
* **CSR Participation**: When an admin updates `employee_participation.approval_status` to `'approved'`, the trigger `trg_csr_approved` executes:
  - Validates that `proof_url` is not null (raises an error if evidence is missing and required).
  - Updates the employee's `total_xp` by adding `xp_earned`.
  - Automatically awards any badges matching the new `total_xp` that the employee hasn't unlocked yet, and inserts notifications.
* **Challenge Completion**: When `challenge_participation.completion_status` is updated to `'completed'`, the trigger `trg_challenge_completed` executes:
  - Updates the employee's `total_xp` with the challenge's XP value.
  - Checks for and awards any newly unlocked badges.
* **Reward Redemption**: When inserting a row into `redemptions`, the trigger `trg_redeem` executes:
  - Validates that the reward is in stock (`quantity > 0`).
  - Validates that the employee has enough XP (`total_xp >= reward.xp_cost`).
  - Deducts the XP from `employees.total_xp` and decrements `rewards.quantity` by 1.

### 3. Compliance & Governance
* **Overdue Flags**: Calling the function `fn_flag_overdue()` will update all `compliance_issues` where `due_date < current_date` and `status = 'open'` to `is_overdue = true`, and issues a single notification to the owner.
* **Policy Acknowledgements**: Adding a new policy automatically sends a policy acknowledgement reminder notification to all active employees.

---

## 🎨 Vercel Serverless Export API

The Vercel function `api/report.py` handles PDF and Excel file downloads.

* **Endpoint**: `/api/report`
* **Method**: `POST`
* **Headers**:
  * `Content-Type: application/json`
* **JSON Payload Format**:
  ```json
  {
    "format": "pdf" | "xlsx",
    "title": "Operations Carbon Report",
    "rows": [
      {
        "Date": "2026-07-12",
        "Source Type": "fleet",
        "Reference": "Fuel receipt #412",
        "Quantity (L)": "50",
        "CO2 (kg)": "134.0"
      }
    ]
  }
  ```

* **Responses**:
  * `format = "pdf"`: Returns a dynamically compiled, styled A4 PDF table (`application/pdf`).
  * `format = "xlsx"`: Returns a styled spreadsheet with gridlines and autowidths (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).

---

## 🤝 Frontend Integration Guide (For Your Teammate)

To connect the React frontend with the backend seamlessly:

1. **Supabase Client Connection**:
   You can query all tables directly using the standard `@supabase/supabase-js` client.
   ```javascript
   import { createClient } from '@supabase/supabase-js'
   export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
   ```

2. **Handle Database Exceptions**:
   When writing to the database (e.g. redeeming a reward or approving a CSR activity), catch errors and display them directly to the user. The database will raise explicit messages:
   * `'Insufficient XP'` (on redemption)
   * `'Reward out of stock'` (on redemption)
   * `'Proof upload required before approval'` (on CSR approval)
   
   Example handler:
   ```javascript
   const { error } = await supabase.from('redemptions').insert({ employee_id, reward_id })
   if (error) {
     alert(error.message) // Will display "Insufficient XP" or "Reward out of stock"
   }
   ```

3. **Storage Uploads**:
   Upload evidence for CSR participation to the public `proofs` storage bucket. Make sure the authenticated user gets the public URL and saves it into `employee_participation.proof_url`.
