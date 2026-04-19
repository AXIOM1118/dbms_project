from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
from datetime import datetime
from db_config import get_db_connection
from log_routes import log_routes
import verification_routes

app = Flask(__name__)
CORS(app,supports_credentials=True)

app.add_url_rule('/verify', 'verify_logs', verification_routes.verify_logs, methods=['POST'])
app.add_url_rule('/alerts', 'get_alerts', verification_routes.get_alerts, methods=['GET'])
app.add_url_rule('/alerts/clear', 'clear_alerts', verification_routes.clear_alerts, methods=['DELETE'])


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response

app.register_blueprint(log_routes)
@app.route('/')
def home():
    return "Backend is running 🚀"

# 🔐 Hash function
def generate_hash(data, timestamp, prev_hash):
    value = f"{data}{timestamp}{prev_hash}"
    return hashlib.sha256(value.encode()).hexdigest()


# 🔹 Get last hash from DB
def get_last_hash():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT current_hash FROM logs ORDER BY log_id DESC LIMIT 1")
    result = cursor.fetchone()

    conn.close()

    return result[0] if result else "0"


# 🔹 Insert log into DB
def insert_log(user_id, action, timestamp, data, prev_hash, current_hash):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO logs (user_id, action, timestamp, data, prev_hash, current_hash)
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    cursor.execute(query, (user_id, action, timestamp, data, prev_hash, current_hash))
    conn.commit()
    conn.close()


# ✅ ADD LOG API (FINAL)
@app.route('/add_log', methods=['POST'])
def add_log():
    try:
        req = request.get_json()

        # 🔴 Validate input
        if not req:
            return jsonify({"error": "Request body is missing"}), 400

        user_id = req.get("user_id")
        action = req.get("action")
        data = req.get("data", "")

        if not user_id or not action:
            return jsonify({"error": "user_id and action are required"}), 400

        # 🔹 Step 1: Get previous hash
        prev_hash = get_last_hash()

        # 🔹 Step 2: Generate timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        current_hash = generate_hash(data, timestamp, prev_hash)

        # 🔹 Step 4: Insert into DB
        insert_log(user_id, action, timestamp, data, prev_hash, current_hash)

        return jsonify({
            "message": "Log added securely",
            "prev_hash": prev_hash,
            "current_hash": current_hash
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ▶️ Run server
if __name__ == '__main__':
    app.run(debug=True)
