from flask import jsonify
from db_config import get_db_connection
import hashlib

def verify_logs():
    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)

        cur.execute("SELECT * FROM logs ORDER BY log_id ASC")
        logs = cur.fetchall()

        if len(logs) < 1:
            return jsonify({"status": "No logs found"})

        cur.execute("DELETE FROM alerts")

        prev_hash = "0"
        is_safe = True

        for log in logs:
            log_id = log['log_id']
            db_prev_hash = log['prev_hash']
            db_current_hash = log['current_hash']

            # Check chain linkage
            if db_prev_hash != prev_hash:
                is_safe = False
                cur.execute(
                    "INSERT INTO alerts (log_id, message) VALUES (%s, %s)",
                    (log_id, "Previous hash mismatch")
                )

            # Recalculate hash (MATCH add_log)
            data_string = f"{log['data']}{log['timestamp']}{prev_hash}"
            recalculated_hash = hashlib.sha256(data_string.encode()).hexdigest()

            # Check integrity
            if recalculated_hash != db_current_hash:
                is_safe = False
                cur.execute(
                    "INSERT INTO alerts (log_id, message) VALUES (%s, %s)",
                    (log_id, "Hash mismatch detected")
                )

            prev_hash = db_current_hash

        conn.commit()

        return jsonify({
            "status": "All logs are valid" if is_safe else "Tampering detected"
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500
# 🚨 GET ALERTS
def get_alerts():
    try:
        conn= get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM Alerts ORDER BY alert_id DESC")
        alerts = cur.fetchall()

        result = []

        for alert in alerts:
            result.append({
                "alert_id": alert[0],
                "log_id": alert[1],
                "message": alert[2],
                "timestamp": str(alert[3])
            })

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🧹 CLEAR ALERTS (OPTIONAL)
def clear_alerts():
    try:
        conn= get_db_connection()
        cur = conn.cursor()

        cur.execute("DELETE FROM Alerts")
        conn.commit()

        return jsonify({
            "message": "All alerts cleared successfully"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

