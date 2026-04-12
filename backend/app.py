import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import mysql.connector
from pathlib import Path
load_dotenv(Path(__file__).with_name(".env"))

print("DB_PASSWORD from env:", os.getenv("DB_PASSWORD"))
app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password=os.getenv("DB_PASSWORD"),
        database="log_integrity_db"
    )

def generate_hash(data):
    return hashlib.sha256(data.encode()).hexdigest()

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Backend running"})

@app.route("/add-log", methods=["POST"])
def add_log():
    data = request.get_json()
    log_message = data.get("logMessage")

    if not log_message:
        return jsonify({"error": "logMessage is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT hash_value FROM logs ORDER BY id DESC LIMIT 1")
    last_log = cursor.fetchone()

    previous_hash = last_log["hash_value"] if last_log else "GENESIS"
    hash_input = log_message + previous_hash
    hash_value = generate_hash(hash_input)

    cursor.execute(
        "INSERT INTO logs (log_message, hash_value, previous_hash, status) VALUES (%s, %s, %s, %s)",
        (log_message, hash_value, previous_hash, "valid")
    )
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Log added successfully",
        "hash": hash_value,
        "previous_hash": previous_hash
    }), 201

@app.route("/logs", methods=["GET"])
def get_logs():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM logs ORDER BY id DESC")
    logs = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(logs)

@app.route("/verify-log/<int:log_id>", methods=["GET"])
def verify_log(log_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM logs WHERE id = %s", (log_id,))
    log = cursor.fetchone()

    if not log:
        cursor.close()
        conn.close()
        return jsonify({"error": "Log not found"}), 404

    previous_hash = log["previous_hash"]
    expected_hash = generate_hash(log["log_message"] + previous_hash)
    is_valid = expected_hash == log["hash_value"]

    cursor.close()
    conn.close()

    return jsonify({
        "id": log["id"],
        "stored_hash": log["hash_value"],
        "expected_hash": expected_hash,
        "status": "valid" if is_valid else "tampered"
    })

@app.route("/logs/<int:log_id>", methods=["PUT"])
def update_log(log_id):
    data = request.get_json()
    log_message = data.get("logMessage")

    if not log_message:
        return jsonify({"error": "logMessage is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM logs WHERE id = %s", (log_id,))
    log = cursor.fetchone()

    if not log:
        cursor.close()
        conn.close()
        return jsonify({"error": "Log not found"}), 404

    previous_hash = log["previous_hash"]
    new_hash = generate_hash(log_message + previous_hash)

    cursor.execute(
        "UPDATE logs SET log_message=%s, hash_value=%s, status=%s WHERE id=%s",
        (log_message, new_hash, "valid", log_id)
    )
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Log updated successfully"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
