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

    # 1. Get column info for employees table
    cursor.execute("""
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'employees' AND table_schema = 'public'
    """)
    columns = cursor.fetchall()
    print("--- employees Columns ---")
    for col in columns:
        print(f"Name: {col[0]}, Type: {col[1]}, Nullable: {col[2]}")

    # 2. Get department codes to check if 'IT' exists
    cursor.execute("SELECT id, name, code FROM public.departments")
    depts = cursor.fetchall()
    print("\n--- departments ---")
    for d in depts:
        print(f"ID: {d[0]}, Name: {d[1]}, Code: {d[2]}")

    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
