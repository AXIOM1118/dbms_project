from db_config import get_db_connection

# 🔹 Fetch all logs
def get_all_logs():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM logs ORDER BY log_id ASC"
    cursor.execute(query)

    logs = cursor.fetchall()

    conn.close()

    return logs
