import pg8000.dbapi

connection_string = "postgresql://postgres:odoojkmd2026@db.cupdiiseegjxdyxvmsnq.supabase.co:5432/postgres"

print("Connecting to Supabase PostgreSQL database...")
conn = pg8000.dbapi.connect(
    user="postgres",
    password="odoojkmd2026",
    host="db.cupdiiseegjxdyxvmsnq.supabase.co",
    port=5432,
    database="postgres"
)
cursor = conn.cursor()

print("Deleting Aria Green...")
try:
    cursor.execute("DELETE FROM employees WHERE email = 'aria@ecosphere.com'")
    conn.commit()
    print("Deleted successfully.")
except Exception as e:
    print(f"Error: {e}")
    conn.rollback()

cursor.close()
conn.close()
