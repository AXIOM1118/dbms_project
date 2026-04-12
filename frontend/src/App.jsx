import React, { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ShieldCheck,
  FileCheck2,
  ChevronRight,
  Sparkles,
  Database,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Activity,
  Pencil,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error("API Error");
  return res.json();
}

function StatusDot({ safe }) {
  return (
    <span className={`h-3 w-3 rounded-full ${safe ? "bg-green-400" : "bg-red-400"}`} />
  );
}
function HeroScene({ onVerify, verifying, totalLogs, systemHealth }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  return (
    <section className="min-h-screen relative flex items-center">
      <motion.div style={{ y }} className="px-10">
        <p className="text-white/50 mb-4">Log Verification Dashboard</p>

        <h1 className="text-6xl font-bold text-white">
          VERIFY <br /> INTEGRITY
        </h1>

        <p className="text-white/60 mt-4 max-w-xl">
          Backend-driven secure log system with real-time verification and alerts.
        </p>

        <button
          onClick={onVerify}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-xl"
        >
          {verifying ? "Verifying..." : "Verify Logs"}
        </button>

        <div className="mt-10 flex gap-6">
          <div>Total Logs: {totalLogs}</div>
          <div>Health: {systemHealth}%</div>
        </div>
      </motion.div>
    </section>
  );
}
function LogForm({ form, setForm, onSubmit, editingId }) {
  return (
    <div className="p-6 bg-[#111827] rounded-xl">
      <h2>{editingId ? "Update Log" : "Add Log"}</h2>

      <input
        placeholder="Label"
        value={form.label}
        onChange={(e) => setForm({ ...form, label: e.target.value })}
      />

      <input
        placeholder="Status"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      />

      <select
        value={form.safe}
        onChange={(e) => setForm({ ...form, safe: e.target.value === "true" })}
      >
        <option value="true">Safe</option>
        <option value="false">Unsafe</option>
      </select>

      <button onClick={onSubmit}>
        {editingId ? "Update Log" : "Add Log"}
      </button>
    </div>
  );
}
function LogsTable({ logs, onEdit }) {
  return (
    <div>
      {logs.map((log, i) => (
        <motion.div
          key={log._id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex justify-between p-4 border-b border-white/10"
        >
          <div>
            <StatusDot safe={log.safe} /> {log.label}
          </div>

          <button onClick={() => onEdit(log)}>
            <Pencil />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
function VerificationPanel({ verdict, onVerify }) {
  return (
    <motion.div
      key={verdict}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-xl bg-[#111827]"
    >
      <h2>{verdict === "safe" ? "SAFE" : "NOT SAFE"}</h2>

      <button onClick={onVerify}>Run Verification</button>
    </motion.div>
  );
}
export default function App() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [verdict, setVerdict] = useState("safe");
  const [verifying, setVerifying] = useState(false);

  const [form, setForm] = useState({
    label: "",
    status: "",
    safe: true,
  });

  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    const data = await fetchJSON(`${API_BASE}/dashboard`);
    setLogs(data.logs);
    setStats(data.stats);
    setVerdict(data.verdict);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    const res = await fetchJSON(`${API_BASE}/logs/verify`, { method: "POST" });
    setVerdict(res.verdict);
    setStats(res.stats);
    setVerifying(false);
  };

  const handleSubmit = async () => {
    if (editingId) {
      await fetchJSON(`${API_BASE}/logs/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
    } else {
      await fetchJSON(`${API_BASE}/logs`, {
        method: "POST",
        body: JSON.stringify(form),
      });
    }

    setForm({ label: "", status: "", safe: true });
    setEditingId(null);
    loadData();
  };

  const handleEdit = (log) => {
    setEditingId(log._id);
    setForm(log);
  };

  return (
    <div className="text-white p-6">
      <HeroScene
        onVerify={handleVerify}
        verifying={verifying}
        totalLogs={stats.totalLogs}
        systemHealth={stats.systemHealth}
      />

      <LogForm
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        editingId={editingId}
      />

      <LogsTable logs={logs} onEdit={handleEdit} />

      <VerificationPanel verdict={verdict} onVerify={handleVerify} />
    </div>
  );
}