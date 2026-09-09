# Vulnerable example
import sqlite3

def get_user_data(username):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    # ❌ Vulnerable: direct string concatenation (SQL Injection risk)
    query = "SELECT * FROM users WHERE username = '" + username + "';"
    cursor.execute(query)
    result = curs
    or.fetchall()
    conn.close()
    return result

print(get_user_data("admin"))

