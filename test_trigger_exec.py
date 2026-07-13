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

    print("Inserting mock user into auth.users to test triggers...")
    try:
        # UUID generated for testing
        test_uuid = "11111111-1111-1111-1111-111111111111"
        cursor.execute(f"""
            INSERT INTO auth.users (id, email, raw_user_meta_data, aud, role)
            VALUES ('{test_uuid}', 'trigger-test@ecosphere.com', '{{}}', 'authenticated', 'authenticated')
        """)
        conn.commit()
        print("SUCCESS: Trigger executed without error!")
        
        # Cleanup
        cursor.execute(f"DELETE FROM auth.users WHERE id = '{test_uuid}'")
        cursor.execute(f"DELETE FROM public.employees WHERE email = 'trigger-test@ecosphere.com'")
        conn.commit()
        print("Cleanup completed.")
    except Exception as e:
        print(f"TRIGGER FAILED: Postgres returned error:\n{e}")
        conn.rollback()

    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
