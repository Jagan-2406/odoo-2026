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

cursor.execute("SELECT id, name, email, total_xp FROM employees")
rows = cursor.fetchall()
print("Employees in database:")
for r in rows:
    print(f"ID: {r[0]}, Name: {r[1]}, Email: {r[2]}, XP: {r[3]}")

cursor.close()
conn.close()
