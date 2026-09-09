# ast_swarm.py
# Local AST parser + IBM Bob integration

from ibm_bob_sdk import BobClient
import sqlite3

# Initialize Bob client
bob = BobClient(api_key="YOUR_API_KEY")

def run_bob_agent(agent_name, code):
    """Run IBM Bob agent on given code snippet."""
    response = bob.run(agent_name=agent_name, input_code=code)
    return response.output

# Create local SQLite database
conn = sqlite3.connect("users.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
)
""")

cursor.execute("INSERT INTO users (username, password) VALUES ('admin', '1234')")
cursor.execute("INSERT INTO users (username, password) VALUES ('guest', 'abcd')")

conn.commit()
conn.close()

print("✅ Database and table created successfully!")
