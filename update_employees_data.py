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

# 1. Clear old default employees (will cascade delete related participation and logs)
print("Clearing old employee records...")
try:
    cursor.execute("DELETE FROM employees WHERE email IN ('sarah@ecosphere.com', 'alex@ecosphere.com', 'elena@ecosphere.com')")
    conn.commit()
    print("Cleared old employees successfully!")
except Exception as e:
    print(f"Error clearing employees: {e}")
    conn.rollback()

# 2. Insert new employees requested by the user
print("Inserting new employees (Nova, Komal, darun, Moopi, Jagan)...")
employees_sql = """
INSERT INTO employees (name, email, department_id, total_xp) VALUES
('Nova', 'nova@ecosphere.com', (SELECT id FROM departments WHERE code='HR' LIMIT 1), 0),
('Komal', 'komal@ecosphere.com', (SELECT id FROM departments WHERE code='IT' LIMIT 1), 400),
('darun', 'darun@ecosphere.com', (SELECT id FROM departments WHERE code='OPS' LIMIT 1), 120),
('Moopi', 'moopi@ecosphere.com', (SELECT id FROM departments WHERE code='MFG' LIMIT 1), 50),
('Jagan', 'jagan@ecosphere.com', (SELECT id FROM departments WHERE code='OPS' LIMIT 1), 250)
ON CONFLICT (email) DO NOTHING;
"""
try:
    cursor.execute(employees_sql)
    conn.commit()
    print("Inserted new employees successfully!")
except Exception as e:
    print(f"Error inserting employees: {e}")
    conn.rollback()

cursor.close()
conn.close()
print("All tasks completed.")
