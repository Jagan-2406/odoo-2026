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

    print("Dropping on_auth_user_created trigger temporarily to bypass errors...")
    cursor.execute("DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users")
    conn.commit()
    print("SUCCESS: Trigger dropped. Signup/Login transaction will bypass trigger logic now.")

    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
