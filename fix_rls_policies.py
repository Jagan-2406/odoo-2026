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

tables = [
    "departments",
    "categories",
    "emission_factors",
    "product_esg_profiles",
    "environmental_goals",
    "esg_policies",
    "badges",
    "rewards",
    "settings",
    "employees",
    "carbon_transactions",
    "csr_activities",
    "employee_participation",
    "challenges",
    "challenge_participation",
    "policy_acknowledgements",
    "audits",
    "compliance_issues",
    "department_scores",
    "employee_badges",
    "redemptions",
    "notifications"
]

print("Redefining RLS policies to allow anon and authenticated roles...")

for t in tables:
    try:
        # Drop existing policy
        cursor.execute(f'DROP POLICY IF EXISTS "auth read/write" ON {t}')
        # Create new policy for both anon and authenticated users
        cursor.execute(f'CREATE POLICY "auth read/write" ON {t} FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)')
        print(f"Updated policy for table '{t}' successfully.")
    except Exception as e:
        print(f"Failed to update policy for table '{t}': {e}")
        conn.rollback()

# Redefine storage policies
try:
    cursor.execute('DROP POLICY IF EXISTS "authenticated upload proofs" ON storage.objects')
    cursor.execute('CREATE POLICY "authenticated upload proofs" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = \'proofs\')')
    print("Updated storage upload policy successfully.")
except Exception as e:
    print(f"Failed to update storage upload policy: {e}")
    conn.rollback()

conn.commit()
cursor.close()
conn.close()
print("All policies fixed.")
