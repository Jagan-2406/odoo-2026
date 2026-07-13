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

print("Applying DDL SQL for Auth & Role triggers...")

queries = [
    # 1. Add role column
    "ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS role text DEFAULT 'employee' CHECK (role IN ('admin', 'employee', 'auditor'))",
    
    # 2. Create trigger function
    """
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    BEGIN
      INSERT INTO public.employees (id, name, email, department_id, total_xp, role)
      VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.email,
        (SELECT id FROM departments WHERE code='IT' LIMIT 1), -- default department
        0,
        CASE WHEN new.email = 'nova@ecosphere.com' THEN 'admin' ELSE 'employee' END
      )
      ON CONFLICT (email) DO UPDATE 
      SET id = EXCLUDED.id, role = EXCLUDED.role;
      RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    """,

    # 3. Create trigger trigger definition
    "DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users",
    "CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()"
]

for idx, q in enumerate(queries):
    try:
        cursor.execute(q)
        conn.commit()
        print(f"Executed SQL statement {idx+1} successfully.")
    except Exception as e:
        print(f"Error executing statement {idx+1}: {e}")
        conn.rollback()

# 4. Update existing seeded employees to set their roles
try:
    cursor.execute("UPDATE public.employees SET role='admin' WHERE email='nova@ecosphere.com'")
    cursor.execute("UPDATE public.employees SET role='employee' WHERE email IN ('komal@ecosphere.com', 'darun@ecosphere.com', 'moopi@ecosphere.com')")
    cursor.execute("UPDATE public.employees SET role='auditor' WHERE email='jagan@ecosphere.com'")
    conn.commit()
    print("Updated roles for existing employees successfully.")
except Exception as e:
    print(f"Error updating roles: {e}")
    conn.rollback()

cursor.close()
conn.close()
print("Migration completed.")
