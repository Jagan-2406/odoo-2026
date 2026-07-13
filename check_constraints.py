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

    # Get unique constraints and indexes for employees
    cursor.execute("""
        SELECT indexname, indexdef 
        FROM pg_indexes 
        WHERE tablename = 'employees' AND schemaname = 'public'
    """)
    indexes = cursor.fetchall()
    print("--- employees Indexes ---")
    for idx in indexes:
        print(f"Index Name: {idx[0]}, Def: {idx[1]}")

    # Check if there is already a record with vasujagan382@gmail.com
    cursor.execute("SELECT id, name, email, role FROM public.employees WHERE email = 'vasujagan382@gmail.com'")
    rows = cursor.fetchall()
    print("\n--- Matching Employees ---")
    for r in rows:
        print(f"ID: {r[0]}, Name: {r[1]}, Email: {r[2]}, Role: {r[3]}")

    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
