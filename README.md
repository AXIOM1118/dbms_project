## Secure Log Integrity Verification System

Overview

This project is a DBMS-based secure logging system designed to ensure data integrity using a hash-chain mechanism (blockchain-inspired).

Each log entry is cryptographically linked to the previous one, making any unauthorized modification easily detectable through backend verification.


---

## Features

Core Features

1. Hash-based log integrity verification

2. Tamper detection using hash chaining

3. Backend-driven verification system

4. Automatic alert generation on mismatch

5. Repair mechanism to restore log integrity


Frontend

1. Interactive dashboard (React + Vite)

2. Real-time verification status (SAFE / UNSAFE)

3. Log visualization with hash values

4. Add / Update logs via UI


Backend

1. REST APIs using Flask

2. Secure hash generation (SHA-256)

3. Verification engine for detecting tampering

4. Alerts system for compromised logs



---

## Tech Stack

Frontend

-> React.js (Vite)

-> Tailwind CSS

-> Framer Motion


Backend

-> Python (Flask)


Database

-> MySQL


Other Tools

Git & GitHub



---

## How It Works

1. Each log stores:

data

timestamp

prev_hash

current_hash



2. Hash is generated as:



hash = SHA256(data + timestamp + prev_hash)

3. During verification:



Hash is recalculated

Compared with stored hash

If mismatch → alert generated 🚨



---

##  Project Structure
```text
dbms_project/
│── frontend/                      # React (Vite) frontend
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── assets/               # Images & static assets
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── App.jsx               # Main UI logic
│   │   ├── App.css               # Component styles
│   │   ├── index.css             # Global styles
│   │   └── main.jsx              # Entry point
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── first_draft.excalidraw    # UI wireframe (optional)
│
│── backend/                      # Flask backend
│   ├── app.py
│   ├── log_routes.py
│   ├── verification_routes.py
│   ├── db_config.py
│
│── database/
│   └── schema.sql
│
└── README.md

```
---

⚙️ Installation & Setup

1️⃣ Clone Repository
```bash
git clone <your-repo-link>
cd dbms_project

```
---

2️⃣ Backend Setup (Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs at:
```bash
http://localhost:5000
```

---

3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at:
```bash
http://localhost:5173
```

---

🔗 API Endpoints

➕ Add Log
```
POST /add_log
```
✏️ Update Log (Simulates Tampering)
```
PUT /logs/<id>
```
🔍 Verify Logs
```
POST /verify
```
🚨 Get Alerts
```
GET /alerts
```
🧹 Clear Alerts
```
DELETE /alerts/clear
```
🔧 Repair Logs
```
POST /fix_logs
```

---

🗄️ Database Schema

Logs Table
```sql
CREATE TABLE logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50),
    action VARCHAR(100),
    timestamp DATETIME,
    data TEXT,
    prev_hash TEXT,
    current_hash TEXT
);
```
Alerts Table
```sql
CREATE TABLE alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    log_id INT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

🧪 Testing Tampering
```sql
UPDATE logs SET data = 'tampered' WHERE log_id = 5;
```
Then run:
```
POST /verify
```
👉 The system will detect the mismatch and generate an alert.


---

📌 Future Enhancements

SQL triggers for automatic hash generation

Role-based authentication

Blockchain integration

Real-time monitoring system



---
