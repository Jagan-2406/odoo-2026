import pg8000.dbapi

try:
    conn = pg8000.dbapi.connect(
        user="postgres",
        password="odoojkmd2026",
        host="db.cupdiiseegjxdyxvmsnq.supabase.co",
        port=5432,
        database="postgres"
    )
    cursor = conn.cursor()

    print("Updating database trigger to auto-assign roles for test accounts...")
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
          WHEN new.email = 'nova@ecosphere.com' OR new.email = 'vasujagan382@gmail.com' OR new.email = 'admin@ecosphere.com' THEN 'admin'
          WHEN new.email = 'jagan@ecosphere.com' OR new.email = 'auditor@ecosphere.com' THEN 'auditor'
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
    print("SUCCESS: Trigger updated successfully!")

    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
