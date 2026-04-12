import React, { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ShieldCheck,
  FileCheck2,
  ChevronRight,
  Sparkles,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Activity,
  Pencil,
} from "lucide-react";

const API_BASE = "http://localhost:5000";

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API Error");
  }

  return res.json();
}

function StatusDot({ safe }) {
  return (
    <span
      className={`inline-block h-3 w-3 rounded-full ${
        safe ? "bg-green-400" : "bg-red-400"
      }`}
    />
  );
}

function FloatingOrb({ className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, -20, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute rounded-full blur-3xl ${className}`}
    />
  );
}

function SkeletonBlock({ className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white/8 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

function SkeletonScreen() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#070b16] text-white">
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_25%),linear-gradient(to_bottom,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.08]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-5 w-56" />
              </div>
            </div>
            <div className="flex gap-3">
              <SkeletonBlock className="h-10 w-40 rounded-full" />
              <SkeletonBlock className="h-10 w-36 rounded-full" />
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-white/[0.06] p-7 backdrop-blur-2xl">
            <SkeletonBlock className="mb-6 h-8 w-48 rounded-full" />
            <SkeletonBlock className="mb-4 h-16 w-full max-w-2xl" />
            <SkeletonBlock className="mb-3 h-16 w-5/6 max-w-2xl" />
            <SkeletonBlock className="mb-8 h-6 w-3/4 max-w-xl" />
            <div className="mb-10 flex gap-3">
              <SkeletonBlock className="h-14 w-44" />
              <SkeletonBlock className="h-14 w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Navbar({ totalAlerts, lastScan }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="sticky top-4 z-50 mt-6 mb-6 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-black/20 px-5 py-4 backdrop-blur-2xl md:flex-row md:items-center md:justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_40px_rgba(56,189,248,0.25)]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-white/45">DBMS Project</p>
          <h1 className="text-xl font-semibold tracking-wide">SecureLog Integrity System</h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/85">
          Last scan: {lastScan || "Not yet"}
        </div>
        <div className="rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-300">
          Alerts: {totalAlerts}
        </div>
      </div>
    </motion.header>
  );
}

function HeroScene({ onVerify, verifying, totalLogs, systemHealth }) {
  const { scrollYProgress } = useScroll();
  const bgScale = useTransform(scrollYProgress, [0, 0.18], [1, 1.16]);
  const bgY = useTransform(scrollYProgress, [0, 0.18], [0, 120]);
  const titleY = useTransform(scrollYProgress, [0, 0.18], [0, -40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.82]);

  const reveal = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.16 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative min-h-[120vh] overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.04]">
      <motion.div style={{ scale: bgScale, y: bgY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.20),transparent_20%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.22),transparent_20%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.18),transparent_25%),linear-gradient(135deg,#070b16_0%,#0a1020_35%,#111827_100%)]" />
        <div className="absolute inset-0 bg-black/35" />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#070b16] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070b16] to-transparent" />

      <motion.div style={{ opacity: contentOpacity }} className="relative z-10 px-6 py-16 md:px-10 md:py-24">
        <motion.div
          variants={reveal}
          initial="hidden"
          animate="show"
          style={{ y: titleY }}
          className="max-w-5xl"
        >
          <motion.div
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.26em] text-white/60"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Log Verification Dashboard
          </motion.div>

          <motion.h2 className="max-w-5xl text-5xl font-semibold leading-[0.95] text-white sm:text-6xl md:text-7xl lg:text-[6.5rem]">
            <motion.span variants={item} className="block">
              VERIFY
            </motion.span>
            <motion.span variants={item} className="block">
              INTEGRITY
            </motion.span>
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg"
          >
            Backend-driven log verification dashboard with database-based alerts, add log,
            update log, and live verdict rendering.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onVerify}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-4 text-sm font-medium text-slate-950 shadow-[0_20px_60px_rgba(99,102,241,0.35)]"
            >
              {verifying ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <FileCheck2 className="h-4 w-4" />}
              {verifying ? "Checking..." : "Verify Logs"}
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </motion.button>
          </motion.div>

          <motion.div variants={item} className="mt-12 grid gap-4 sm:grid-cols-3">
            <motion.div whileHover={{ y: -8 }} className="rounded-[26px] border border-white/10 bg-white/8 p-5 backdrop-blur-2xl">
              <p className="text-sm text-white/55">Total Logs</p>
              <h3 className="mt-2 text-3xl font-semibold text-white">{totalLogs}</h3>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="rounded-[26px] border border-white/10 bg-white/8 p-5 backdrop-blur-2xl">
              <p className="text-sm text-white/55">System Health</p>
              <h3 className="mt-2 text-3xl font-semibold text-white">{systemHealth}%</h3>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="rounded-[26px] border border-white/10 bg-white/8 p-5 backdrop-blur-2xl">
              <p className="text-sm text-white/55">Data Source</p>
              <h3 className="mt-2 text-3xl font-semibold text-white">Backend API</h3>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function LogForm({ form, setForm, onSubmit, submitting, editingId }) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
      <div className="mb-5">
        <p className="text-sm text-white/45">Log management</p>
        <h3 className="mt-1 text-xl font-semibold">
          {editingId ? "Update Log" : "Add Log"}
        </h3>
      </div>

      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Log label"
          value={form.label}
          onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
          className="rounded-2xl border border-white/10 bg-[#0d1324]/80 px-4 py-3 text-white outline-none placeholder:text-white/35"
        />

        <input
          type="text"
          placeholder="Status"
          value={form.status}
          onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
          className="rounded-2xl border border-white/10 bg-[#0d1324]/80 px-4 py-3 text-white outline-none placeholder:text-white/35"
        />

        <select
          value={String(form.safe)}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, safe: e.target.value === "true" }))
          }
          className="rounded-2xl border border-white/10 bg-[#0d1324]/80 px-4 py-3 text-white outline-none"
        >
          <option value="true">Safe</option>
          <option value="false">Not Safe</option>
        </select>

        <button
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-900 transition hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Saving..." : editingId ? "Update Log" : "Add Log"}
        </button>
      </div>
    </div>
  );
}

function LogsTable({ logs, onEdit }) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
      <div className="mb-5">
        <p className="text-sm text-white/45">Database logs</p>
        <h3 className="mt-1 text-xl font-semibold">Recent log activity</h3>
      </div>

      <div className="space-y-3">
        {logs.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: 30, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            whileHover={{ y: -2, scale: 1.01 }}
            className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#0e1426]/80 px-4 py-3"
          >
            <StatusDot safe={item.safe} />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-white/90">{item.label}</p>
                <span className="text-xs text-white/35">{item.time}</span>
              </div>

              <p className={`mt-1 text-xs ${item.safe ? "text-emerald-300" : "text-rose-300"}`}>
                {item.status}
              </p>

              <p className="mt-1 break-all text-[11px] text-white/35">
                Hash: {item.hash_value}
              </p>

              <p className="mt-1 break-all text-[11px] text-white/30">
                Previous: {item.previous_hash}
              </p>
            </div>

            <button
              onClick={() => onEdit(item)}
              className="rounded-xl border border-white/10 bg-white/8 p-2 text-white/80 transition hover:bg-white/12"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function VerificationPanel({ verdictData, VerdictIcon, onVerify, verifying }) {
  return (
    <motion.div
      key={verdictData.badge}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45 }}
      className={`relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br ${verdictData.bg} p-5 ring-1 ${verdictData.ring} backdrop-blur-2xl`}
    >
      <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-white/6 blur-3xl" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white/50">Verification engine</p>
          <h3 className="mt-1 text-xl font-semibold">{verdictData.title}</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/65">
            {verdictData.subtitle}
          </p>
        </div>

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className={`rounded-2xl border border-white/10 bg-white/10 p-3 ${verdictData.text}`}
        >
          <VerdictIcon className="h-6 w-6" />
        </motion.div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-[24px] border border-white/10 bg-[#0b1020]/60 px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/35">Current verdict</p>
          <motion.p
            key={verdictData.badge}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-2 text-lg font-semibold ${verdictData.text}`}
          >
            {verdictData.badge}
          </motion.p>
        </div>

        <button
          onClick={onVerify}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/90 transition hover:bg-white/15"
        >
          {verifying ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
          {verifying ? "Checking..." : verdictData.buttonText}
        </button>
      </div>
    </motion.div>
  );
}

function StatsScene({ totalLogs, totalAlerts, systemHealth }) {
  const cards = [
    {
      title: "Total Logs",
      value: totalLogs,
      change: "From database",
    },
    {
      title: "Total Alerts",
      value: totalAlerts,
      change: "Unsafe entries",
    },
    {
      title: "System Health",
      value: `${systemHealth}%`,
      change: "Backend calculated",
    },
  ];

  return (
    <section className="py-24">
      <p className="text-sm uppercase tracking-[0.3em] text-white/45">System chapter</p>
      <h2 className="mt-3 text-4xl font-semibold text-white md:text-6xl">SYSTEM STATUS</h2>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {cards.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
            whileHover={{ y: -10, scale: 1.01 }}
            className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl"
          >
            <p className="text-sm text-white/55">{item.title}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <h3 className="text-3xl font-semibold text-white">{item.value}</h3>
              <span className="text-xs text-white/55">{item.change}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalLogs: 0,
    totalAlerts: 0,
    systemHealth: 0,
  });
  const [lastScan, setLastScan] = useState("");
  const [verdict, setVerdict] = useState("safe");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    label: "",
    status: "",
    safe: true,
  });

  const loadDashboard = async () => {
    try {
      const data = await fetchJSON(`${API_BASE}/logs`);

      const mappedLogs = data.map((log) => ({
        _id: log.id,
        label: log.log_message,
        status: log.status,
        safe: log.status === "valid",
        hash_value: log.hash_value,
        previous_hash: log.previous_hash,
        created_at: log.created_at,
        time: log.created_at
          ? new Date(log.created_at).toLocaleTimeString()
          : "No time",
      }));

      setLogs(mappedLogs);

      const totalLogs = mappedLogs.length;
      const totalAlerts = mappedLogs.filter((l) => !l.safe).length;
      const systemHealth =
        totalLogs === 0 ? 100 : Math.round(((totalLogs - totalAlerts) / totalLogs) * 100);

      setStats({
        totalLogs,
        totalAlerts,
        systemHealth,
      });

      setLastScan(new Date().toLocaleString());
      setVerdict(totalAlerts === 0 ? "safe" : "unsafe");
    } catch (error) {
      console.error("Dashboard load error:", error);
      alert("Failed to load dashboard");
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await loadDashboard();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const verdictData = useMemo(() => {
    if (verdict === "safe") {
      return {
        title: "System Integrity: SAFE",
        subtitle:
          "Hash chain is valid, anomaly threshold is normal, and no critical log mutation was found.",
        badge: "SAFE",
        text: "text-emerald-300",
        ring: "ring-emerald-400/30",
        bg: "from-emerald-500/20 via-cyan-500/10 to-transparent",
        icon: CheckCircle2,
        buttonText: "Run Verification",
      };
    }

    return {
      title: "Threat Detected: NOT SAFE",
      subtitle:
        "Potential tampering detected. Review the flagged log cluster and trigger containment protocol.",
      badge: "NOT SAFE",
      text: "text-rose-300",
      ring: "ring-rose-400/30",
      bg: "from-rose-500/20 via-orange-500/10 to-transparent",
      icon: XCircle,
      buttonText: "Re-Run Scan",
    };
  }, [verdict]);

  const VerdictIcon = verdictData.icon;

  const handleVerify = async () => {
    try {
      setVerifying(true);

      const verifiedLogs = await Promise.all(
        logs.map(async (log) => {
          try {
            const res = await fetchJSON(`${API_BASE}/verify-log/${log._id}`);
            return {
              ...log,
              safe: res.status === "valid",
              status: res.status,
            };
          } catch (error) {
            console.error(`Verification failed for log ${log._id}:`, error);
            return {
              ...log,
              safe: false,
              status: "tampered",
            };
          }
        })
      );

      setLogs(verifiedLogs);

      const totalLogs = verifiedLogs.length;
      const totalAlerts = verifiedLogs.filter((l) => !l.safe).length;
      const systemHealth =
        totalLogs === 0 ? 100 : Math.round(((totalLogs - totalAlerts) / totalLogs) * 100);

      setStats({
        totalLogs,
        totalAlerts,
        systemHealth,
      });

      setLastScan(new Date().toLocaleString());
      setVerdict(totalAlerts === 0 ? "safe" : "unsafe");
    } catch (error) {
      console.error("Verify error:", error);
      alert("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleAddOrUpdate = async () => {
    try {
      if (!form.label.trim() || !form.status.trim()) {
        alert("Please fill all fields");
        return;
      }

      setSubmitting(true);

      if (editingId) {
        await fetchJSON(`${API_BASE}/logs/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({
            logMessage: form.label,
          }),
        });

        alert("Log updated successfully");
      } else {
        await fetchJSON(`${API_BASE}/add-log`, {
          method: "POST",
          body: JSON.stringify({
            logMessage: form.label,
          }),
        });

        alert("Log added successfully");
      }

      setForm({
        label: "",
        status: "",
        safe: true,
      });
      setEditingId(null);

      await loadDashboard();
    } catch (err) {
      console.error(err);
      alert("Failed to save log");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (log) => {
    setEditingId(log._id);
    setForm({
      label: log.label || "",
      status: log.status || "",
      safe: !!log.safe,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <SkeletonScreen />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070b16] text-white">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_25%),linear-gradient(to_bottom,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.06]" />

      <FloatingOrb className="left-[-100px] top-16 h-80 w-80 bg-fuchsia-600/20" delay={0.2} />
      <FloatingOrb className="right-[-60px] top-10 h-96 w-96 bg-cyan-500/20" delay={0.7} />
      <FloatingOrb className="bottom-10 left-1/3 h-72 w-72 bg-violet-500/20" delay={1.2} />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <Navbar totalAlerts={stats.totalAlerts} lastScan={lastScan} />

        <HeroScene
          onVerify={handleVerify}
          verifying={verifying}
          totalLogs={stats.totalLogs}
          systemHealth={stats.systemHealth}
        />

        <section className="py-20 grid gap-6 lg:grid-cols-2">
          <LogForm
            form={form}
            setForm={setForm}
            onSubmit={handleAddOrUpdate}
            submitting={submitting}
            editingId={editingId}
          />

          <VerificationPanel
            verdictData={verdictData}
            VerdictIcon={VerdictIcon}
            onVerify={handleVerify}
            verifying={verifying}
          />
        </section>

        <section className="py-10">
          <LogsTable logs={logs} onEdit={handleEdit} />
        </section>

        <StatsScene
          totalLogs={stats.totalLogs}
          totalAlerts={stats.totalAlerts}
          systemHealth={stats.systemHealth}
        />
      </div>
    </div>
  );
}