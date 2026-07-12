import pg8000.dbapi

connection_string = "postgresql://postgres:odoojkmd2026@db.cupdiiseegjxdyxvmsnq.supabase.co:5432/postgres"

print("Connecting to Supabase PostgreSQL database...")
conn = pg8000.dbapi.connect(
    user="postgres",
    password="odoojkmd2026",
    host="db.cupdiiseegjxdyxvmsnq.supabase.co",
    port=5432,
    database="postgres"
)
cursor = conn.cursor()

# 1. Seed esg_policies
print("Seeding esg_policies...")
policies_sql = """
INSERT INTO esg_policies (policy_name, description, effective_date, status) VALUES
('Anti-Corruption and Bribery Protocol', 'Strict guidelines regarding corporate integrity and third-party interactions across all global offices.', '2026-01-01', 'active'),
('Zero-Waste & Resource Conservation Policy', 'Policy governing recycling, single-use plastic limits, energy offsets, and resource efficiency targets.', '2026-02-15', 'active'),
('Fair Labor & Equal Opportunities Code', 'Standard guidelines on workplace diversity, equality, zero discrimination, and safe working environments.', '2026-03-10', 'active')
ON CONFLICT DO NOTHING;
"""
try:
    cursor.execute(policies_sql)
    conn.commit()
    print("Seeded policies successfully!")
except Exception as e:
    print(f"Error seeding policies: {e}")
    conn.rollback()

# 2. Seed audits
print("Seeding audits...")
audits_sql = """
INSERT INTO audits (audit_name, department_id, auditor, date, findings, status) VALUES
('ISO 14001 Environmental Audit', (SELECT id FROM departments WHERE code='OPS' LIMIT 1), 'Bureau Veritas', '2026-06-25', 'Excellent waste categorization, slight compliance delay in HVAC filtering checks.', 'completed'),
('Corporate Governance Pre-check', (SELECT id FROM departments WHERE code='HR' LIMIT 1), 'SGS Group', '2026-07-12', 'High compliance signoff rate, minor discrepancies in training logs.', 'in-progress')
ON CONFLICT DO NOTHING;
"""
try:
    cursor.execute(audits_sql)
    conn.commit()
    print("Seeded audits successfully!")
except Exception as e:
    print(f"Error seeding audits: {e}")
    conn.rollback()

# 3. Seed compliance issues
print("Seeding compliance issues...")
issues_sql = """
INSERT INTO compliance_issues (issue_title, description, owner_id, due_date, priority, status) VALUES
('HVAC filtering compliance check delayed', 'The monthly air quality audit reported delayed carbon filter cleanups in operations hall.', (SELECT id FROM employees WHERE email='alex@ecosphere.com' LIMIT 1), '2026-08-15', 'high', 'open'),
('Incomplete training logs submission', 'HR department training logs for anti-bribery protocols are missing signatures.', (SELECT id FROM employees WHERE email='sarah@ecosphere.com' LIMIT 1), '2026-08-30', 'medium', 'open')
ON CONFLICT DO NOTHING;
"""
try:
    cursor.execute(issues_sql)
    conn.commit()
    print("Seeded compliance issues successfully!")
except Exception as e:
    print(f"Error seeding compliance issues: {e}")
    conn.rollback()

cursor.close()
conn.close()
print("Governance seeding completed.")
