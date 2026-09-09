
import sqlite3

conn = sqlite3.connect("users.db")
cursor = conn.cursor()

username = input("Enter username: ")
password = input("Enter password: ")

# ❌ Vulnerable query (string concatenation)
query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
cursor.execute(query)
result = cursor.fetchall()

if result:
    print("✅ Login successful (but vulnerable!)")
else:
    print("❌ Login failed")

conn.close()
