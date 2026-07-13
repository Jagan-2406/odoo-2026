import pg8000.dbapi

connection_string = "postgresql://postgres:odoojkmd2026@db.cupdiiseegjxdyxvmsnq.supabase.co:5432/postgres"

try:
    print("Connecting to database...")
    conn = pg8000.dbapi.connect(
        user="postgres",
        password="odoojkmd2026",
        host="db.cupdiiseegjxdyxvmsnq.supabase.co",
        port=5432,
        database="postgres"
    )
    cursor = conn.cursor()

    # 1. Update existing email if it already exists
    print("Updating existing user profiles to admin...")
    cursor.execute("UPDATE public.employees SET role='admin' WHERE email='vasujagan382@gmail.com'")
    conn.commit()

    # 2. Modify trigger function to auto-assign admin role on new signups for both emails
    print("Modifying database trigger to assign Admin role on new registrations...")
    trigger_sql = """
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
        CASE 
          WHEN new.email = 'nova@ecosphere.com' OR new.email = 'vasujagan382@gmail.com' THEN 'admin' 
          ELSE 'employee' 
        END
      )
      ON CONFLICT (email) DO UPDATE 
      SET id = EXCLUDED.id, role = EXCLUDED.role;
      RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    """
    cursor.execute(trigger_sql)
    conn.commit()
    
    print("SUCCESS: Database triggers updated. You will login/signup as Admin automatically.")
    cursor.close()
    conn.close()

except Exception as e:
    print(f"ERROR: Failed to run database updates:\n{e}")
