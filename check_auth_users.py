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

    # Query auth.users
    cursor.execute("SELECT id, email, created_at FROM auth.users WHERE email = 'vasujagan382@gmail.com'")
    rows = cursor.fetchall()
    print("--- auth.users ---")
    for r in rows:
        print(f"ID: {r[0]}, Email: {r[1]}, Created At: {r[2]}")

    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
