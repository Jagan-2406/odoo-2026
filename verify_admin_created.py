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

    cursor.execute("SELECT id, email FROM auth.users WHERE email = 'admin@ecosphere.com'")
    auth_user = cursor.fetchone()
    print("--- auth.users ---")
    if auth_user:
        print(f"User exists! ID: {auth_user[0]}, Email: {auth_user[1]}")
    else:
        print("User does not exist in auth.users!")

    cursor.execute("SELECT id, name, email, role FROM public.employees WHERE email = 'admin@ecosphere.com'")
    emp = cursor.fetchone()
    print("\n--- public.employees ---")
    if emp:
        print(f"Employee exists! ID: {emp[0]}, Name: {emp[1]}, Email: {emp[2]}, Role: {emp[3]}")
    else:
        print("Employee does not exist in public.employees!")

    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
