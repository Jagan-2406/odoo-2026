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

    # Get foreign key constraints
    cursor.execute("""
        SELECT
            tc.constraint_name, 
            tc.table_name, 
            kcu.column_name, 
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name 
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='employees';
    """)
    fks = cursor.fetchall()
    print("--- Foreign Keys ---")
    for fk in fks:
        print(f"Constraint: {fk[0]}, Column: {fk[2]} -> {fk[3]}({fk[4]})")

    # Let's inspect the exact error by manually running a transaction that simulates the trigger!
    # We can try to insert a dummy user into employees directly to see if any constraint fails.
    print("\n--- Testing manual insert with dummy UUID ---")
    try:
        dummy_uuid = "00000000-0000-0000-0000-000000000000"
        cursor.execute(f"""
            INSERT INTO public.employees (id, name, email, total_xp, role)
            VALUES ('{dummy_uuid}', 'Test User', 'test@test.com', 0, 'employee')
        """)
        conn.commit()
        print("Manual insert succeeded! Deleting test record...")
        cursor.execute(f"DELETE FROM public.employees WHERE id = '{dummy_uuid}'")
        conn.commit()
    except Exception as e:
        print(f"Manual insert failed: {e}")
        conn.rollback()

    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
