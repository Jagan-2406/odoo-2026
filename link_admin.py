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

    # 1. Fetch the user UUID from auth.users
    cursor.execute("SELECT id FROM auth.users WHERE email = 'vasujagan382@gmail.com'")
    user_row = cursor.fetchone()
    
    if not user_row:
        print("ERROR: User vasujagan382@gmail.com not found in auth.users!")
    else:
        user_uuid = user_row[0]
        print(f"Found authenticated user UUID: {user_uuid}")

        # 2. Insert/Update the employee profile with Admin role
        cursor.execute(f"""
            INSERT INTO public.employees (id, name, email, department_id, total_xp, role)
            VALUES (
                '{user_uuid}',
                'Jagan',
                'vasujagan382@gmail.com',
                (SELECT id FROM departments WHERE code='IT' LIMIT 1),
                0,
                'admin'
            )
            ON CONFLICT (email) DO UPDATE 
            SET id = EXCLUDED.id, role = 'admin';
        """)
        conn.commit()
        print("SUCCESS: Profile linked. Role 'admin' assigned successfully!")

    # 3. Restore the auth triggers
    print("Restoring database trigger for future user registrations...")
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
    cursor.execute("DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users")
    cursor.execute("CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()")
    conn.commit()
    print("SUCCESS: Database triggers restored.")

    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
