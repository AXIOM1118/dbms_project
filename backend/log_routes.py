from flask import Blueprint, jsonify
from log_model import get_all_logs
from flask import request
from db_config import get_db_connection
log_routes = Blueprint('log_routes', __name__)

@log_routes.route('/logs/<int:log_id>', methods=['PUT', 'OPTIONS'])
def update_log(log_id):

    # Handle preflight (CORS)
    if request.method == 'OPTIONS':
        return '', 200

    try:
        req = request.get_json()

        user_id = req.get("user_id")
        action = req.get("action")
        data = req.get("data")

        conn = get_db_connection()
        cursor = conn.cursor()

        # ❌ DO NOT update hashes (this simulates tampering)
        cursor.execute("""
            UPDATE logs
            SET user_id=%s, action=%s, data=%s
            WHERE log_id=%s
        """, (user_id, action, data, log_id))

        conn.commit()
        conn.close()

        return jsonify({"message": "Log updated (tampered)"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# ✅ GET LOGS API
@log_routes.route('/logs', methods=['GET'])
def get_logs():
    try:
        logs = get_all_logs()

        return jsonify({
            "count": len(logs),
            "logs": logs
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
