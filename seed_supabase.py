import pg8000.dbapi
import re

# Connection parameters parsed from string
# postgresql://postgres:odoojkmd2026@db.cupdiiseegjxdyxvmsnq.supabase.co:5432/postgres
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

# 1. Execute 03_seed.sql content
print("Loading 03_seed.sql...")
with open("backend/database/03_seed.sql", "r", encoding="utf-8") as f:
    sql_content = f.read()

# Remove SQL comments and split statements
statements = sql_content.split(";")
for statement in statements:
    stmt = statement.strip()
    if not stmt:
        continue
    try:
        cursor.execute(stmt)
        print(f"Executed seed statement successfully.")
    except Exception as e:
        print(f"Error executing seed statement: {e}")
        conn.rollback()

conn.commit()

# 2. Insert Default Employees
print("Seeding default employees...")
employees_sql = """
INSERT INTO employees (name, email, department_id, total_xp) VALUES
('Sarah Jenkins', 'sarah@ecosphere.com', (SELECT id FROM departments WHERE code='HR' LIMIT 1), 0),
('Alex Rivera', 'alex@ecosphere.com', (SELECT id FROM departments WHERE code='OPS' LIMIT 1), 120),
('Elena Rostova', 'elena@ecosphere.com', (SELECT id FROM departments WHERE code='IT' LIMIT 1), 0)
ON CONFLICT (email) DO NOTHING;
"""
try:
    cursor.execute(employees_sql)
    conn.commit()
    print("Seeded default employees successfully!")
except Exception as e:
    print(f"Error seeding employees: {e}")
    conn.rollback()

# 3. Seed some default CSR activities
print("Seeding default CSR activities...")
csr_sql = """
INSERT INTO csr_activities (name, category_id, description, start_date, end_date, status) VALUES
('Community Tree Planting Campaign', (SELECT id FROM categories WHERE type='csr' LIMIT 1), 'Join us to plant 500 saplings in the urban park.', '2026-07-01', '2026-07-31', 'active'),
('Beach Litter Cleanup', (SELECT id FROM categories WHERE type='csr' LIMIT 1), 'Help clean the coastal area and gather plastic waste.', '2026-07-10', '2026-07-20', 'active'),
('Annual Blood Donation Drive', (SELECT id FROM categories WHERE type='csr' LIMIT 1), 'Donate blood and save lives at the corporate office.', '2026-07-15', '2026-07-16', 'active')
ON CONFLICT DO NOTHING;
"""
try:
    cursor.execute(csr_sql)
    conn.commit()
    print("Seeded default CSR activities successfully!")
except Exception as e:
    print(f"Error seeding CSR: {e}")
    conn.rollback()

# 4. Seed some default Challenges
print("Seeding default Challenges...")
challenges_sql = """
INSERT INTO challenges (title, description, xp, deadline, status) VALUES
('Zero-Waste Challenge Week', 'Log daily items showing zero single-use plastic waste for seven consecutive days.', 400, '2026-07-31', 'active'),
('Save Grid Electricity', 'Reduce office compute power usage by turning off idle machines.', 250, '2026-08-15', 'active'),
('Walk to Office', 'Walk or use public transport for commute instead of private cars.', 300, '2026-08-30', 'active')
ON CONFLICT DO NOTHING;
"""
try:
    cursor.execute(challenges_sql)
    conn.commit()
    print("Seeded default Challenges successfully!")
except Exception as e:
    print(f"Error seeding challenges: {e}")
    conn.rollback()

# 5. Seed some initial carbon transactions so dashboard is populated
print("Seeding initial carbon transactions...")
txs_sql = """
INSERT INTO carbon_transactions (source_type, reference, department_id, quantity, emission_factor_id, date) VALUES
('fleet', 'Ref-Commute-01', (SELECT id FROM departments WHERE code='OPS' LIMIT 1), 450, (SELECT id FROM emission_factors WHERE activity_name='Petrol' LIMIT 1), '2026-07-01'),
('purchase', 'Ref-Elec-01', (SELECT id FROM departments WHERE code='IT' LIMIT 1), 12000, (SELECT id FROM emission_factors WHERE activity_name='Electricity' LIMIT 1), '2026-07-02'),
('manufacturing', 'Ref-Mfg-01', (SELECT id FROM departments WHERE code='MFG' LIMIT 1), 800, (SELECT id FROM emission_factors WHERE activity_name='Diesel' LIMIT 1), '2026-07-03')
ON CONFLICT DO NOTHING;
"""
try:
    cursor.execute(txs_sql)
    conn.commit()
    print("Seeded initial carbon transactions successfully!")
except Exception as e:
    print(f"Error seeding carbon transactions: {e}")
    conn.rollback()

cursor.close()
conn.close()
print("All tasks completed.")
