import pg8000.dbapi

try:
    print("Connecting to Supabase PostgreSQL database...")
    conn = pg8000.dbapi.connect(
        user="postgres",
        password="odoojkmd2026",
        host="db.cupdiiseegjxdyxvmsnq.supabase.co",
        port=5432,
        database="postgres"
    )
    cursor = conn.cursor()

    # 1. Ensure pgcrypto extension is installed
    cursor.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions")
    conn.commit()

    # 2. Delete existing admin@ecosphere.com to avoid conflicts
    print("Deleting existing admin@ecosphere.com records from auth and public public tables...")
    cursor.execute("DELETE FROM auth.users WHERE email = 'admin@ecosphere.com'")
    cursor.execute("DELETE FROM public.employees WHERE email = 'admin@ecosphere.com'")
    conn.commit()

    # 3. Insert user in auth.users
    print("Inserting admin@ecosphere.com into auth.users...")
    insert_auth_user_sql = """
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, 
      email_confirmed_at, recovery_sent_at, last_sign_in_at, 
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      '22222222-2222-2222-2222-222222222222',
      'authenticated',
      'authenticated',
      'admin@ecosphere.com',
      extensions.crypt('Password123', extensions.gen_salt('bf')),
      now(),
      null,
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin Demo"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
    """
    cursor.execute(insert_auth_user_sql)
    conn.commit()

    # 4. Insert profile in public.employees
    print("Linking profile to public.employees...")
    insert_profile_sql = """
    INSERT INTO public.employees (id, name, email, department_id, total_xp, role)
    VALUES (
      '22222222-2222-2222-2222-222222222222',
      'Admin Demo',
      'admin@ecosphere.com',
      (SELECT id FROM departments WHERE code='IT' LIMIT 1),
      0,
      'admin'
    )
    """
    cursor.execute(insert_profile_sql)
    conn.commit()

    # 5. Cleanup other mock accounts
    print("Cleaning up other mock accounts...")
    cursor.execute("DELETE FROM auth.users WHERE email IN ('employee@ecosphere.com', 'auditor@ecosphere.com')")
    cursor.execute("DELETE FROM public.employees WHERE email IN ('employee@ecosphere.com', 'auditor@ecosphere.com')")
    conn.commit()

    print("SUCCESS: Admin Demo user successfully created and profiles cleaned up!")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
