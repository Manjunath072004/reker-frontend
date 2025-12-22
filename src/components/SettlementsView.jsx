import { useEffect, useState, useContext, useMemo } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  Wallet,
  Search,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default function SettlementsView() {
  const { token } = useContext(AuthContext);
  const [settlements, setSettlements] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  /* ---------- FETCH ---------- */
  const fetchSettlements = () => {
    API.get("/settlements/list/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setSettlements(res.data || []))
      .catch((err) =>
        console.error("Settlement fetch error:", err)
      );
  };

  useEffect(() => {
    if (!token) return;
    fetchSettlements();
    const interval = setInterval(fetchSettlements, 5000);
    return () => clearInterval(interval);
  }, [token]);

  /* ---------- FILTER ---------- */
  const filtered = useMemo(() => {
    return settlements.filter((s) => {
      const matchQuery =
        s.id.toLowerCase().includes(query.toLowerCase()) ||
        String(s.amount).includes(query);

      const matchStatus =
        status === "ALL" ? true : s.status === status;

      return matchQuery && matchStatus;
    });
  }, [settlements, query, status]);

  /* ---------- STATS ---------- */
  const stats = useMemo(() => {
    const paid = settlements.filter(s => s.status === "PAID");
    const pending = settlements.filter(s => s.status === "PENDING");
    const failed = settlements.filter(s => s.status === "FAILED");

    return {
      total: settlements.length,
      paid: paid.reduce((sum, s) => sum + Number(s.amount || 0), 0),
      pending: pending.reduce((sum, s) => sum + Number(s.amount || 0), 0),
      failed: failed.length
    };
  }, [settlements]);

  /* ---------- CHART DATA ---------- */
  const chartData = useMemo(() => {
    const map = {};

    settlements.forEach((s) => {
      if (!s.settlement_date) return;
      const date = new Date(s.settlement_date).toLocaleDateString("en-IN");

      if (!map[date]) {
        map[date] = { date, amount: 0 };
      }

      if (s.status === "PAID") {
        map[date].amount += Number(s.amount || 0);
      }
    });

    return Object.values(map);
  }, [settlements]);

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold tracking-tight">
            Settlements
          </h3>
          <p className="text-sm text-gray-500">
            Track payouts processed to your bank account
          </p>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ID or amount"
              className="pl-9 pr-4 py-2 rounded-xl border text-sm w-64
                focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border text-sm
              focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="ALL">All</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Settlements" value={stats.total} />
        <StatCard title="Paid Amount" value={`₹${stats.paid}`} color="green" />
        <StatCard title="Pending Amount" value={`₹${stats.pending}`} color="yellow" />
        <StatCard title="Failed Count" value={stats.failed} color="red" />
      </div>

      {/* ================= ANALYTICS ================= */}
      {chartData.length > 0 && (
        <div className="bg-white/80 backdrop-blur-xl border rounded-2xl shadow-lg p-6">
          <h4 className="text-lg font-semibold mb-4">
            Settlement Analytics
          </h4>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="settle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(v) => [`₹${v}`, "Settled Amount"]} />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#22c55e"
                fill="url(#settle)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/80 backdrop-blur-xl border border-gray-100
          rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-green-50 to-yellow-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">Settlement</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-500">
                    No settlements found
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <motion.tr
                    key={s.id}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    className="transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-50 text-green-600">
                          <Wallet size={16} />
                        </div>
                        <span className="font-medium">{s.id}</span>
                      </div>
                    </td>

                    <td className="p-4 font-semibold">
                      ₹{s.amount}
                    </td>

                    <td className="p-4 text-gray-600">
                      {new Date(s.settlement_date).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={s.status} />
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, color = "gray" }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border rounded-2xl p-5 shadow">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h4 className={`text-2xl font-bold text-${color}-600`}>
        {value}
      </h4>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    PAID: { bg: "bg-green-100", text: "text-green-700", icon: <CheckCircle size={14} /> },
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", icon: <Clock size={14} /> },
    FAILED: { bg: "bg-red-100", text: "text-red-700", icon: <XCircle size={14} /> }
  };

  const s = map[status] || map.PENDING;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full
      text-xs font-semibold ${s.bg} ${s.text}`}>
      {s.icon}
      {status}
    </span>
  );
}
