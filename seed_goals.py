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

# Seed environmental_goals
print("Seeding environmental_goals...")
goals_sql = """
INSERT INTO environmental_goals (goal_name, description, target_value, start_date, end_date, status) VALUES
('Reduce Scope 1 Fleet Petrol', 'Minimize direct emissions from fleet vehicles.', 15000, '2026-01-01', '2026-12-31', 'active'),
('Reduce Scope 2 Grid Electricity', 'Cut electricity consumption in facilities.', 25000, '2026-01-01', '2026-12-31', 'active'),
('Scope 3 Travel Reductions', 'Reduce business flights and commuting offsets.', 10000, '2026-01-01', '2026-12-31', 'active')
ON CONFLICT DO NOTHING;
"""
try:
    cursor.execute(goals_sql)
    conn.commit()
    print("Seeded environmental goals successfully!")
except Exception as e:
    print(f"Error seeding environmental goals: {e}")
    conn.rollback()

cursor.close()
conn.close()
print("Environmental goals seeding completed.")
