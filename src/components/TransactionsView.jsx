import { motion } from "framer-motion";
import {
  CreditCard,
  Search,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { useMemo, useState } from "react";
import TransactionAnalytics from "./TransactionAnalytics";


export default function TransactionsView({ transactions = [] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  /* ---------- FILTER ---------- */
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchQuery =
        t.id.toLowerCase().includes(query.toLowerCase()) ||
        String(t.amount).includes(query) ||
        t.status.toLowerCase().includes(query.toLowerCase());

      const matchStatus =
        status === "ALL" ? true : t.status === status;

      return matchQuery && matchStatus;
    });
  }, [transactions, query, status]);

  /* ---------- STATS ---------- */
  const stats = useMemo(() => {
    const success = transactions.filter(t => t.status === "SUCCESS");
    const failed = transactions.filter(t => t.status === "FAILED");

    return {
      total: transactions.length,
      success: success.length,
      failed: failed.length,
      revenue: success.reduce((sum, t) => sum + Number(t.amount || 0), 0)
    };
  }, [transactions]);

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold tracking-tight">
            Transactions
          </h3>
          <p className="text-sm text-gray-500">
            Monitor all payment activity in real time
          </p>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ID, amount, status"
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
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Transactions" value={stats.total} />
        <StatCard title="Successful" value={stats.success} color="green" />
        <StatCard title="Failed" value={stats.failed} color="red" />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.revenue}`}
          color="emerald"
        />
      </div>

      {/* ANALYTICS */}
      <TransactionAnalytics transactions={transactions} />


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
                <th className="p-4 text-left">Transaction</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Method</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Time</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filtered.map((t) => (
                <motion.tr
                  key={t.id}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  className="transition"
                >
                  {/* TXN */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-50 text-green-600">
                        <CreditCard size={16} />
                      </div>
                      <span className="font-medium">{t.id}</span>
                    </div>
                  </td>

                  {/* AMOUNT */}
                  <td className="p-4 font-semibold">
                    ₹{t.amount}
                  </td>

                  {/* METHOD */}
                  <td className="p-4 text-gray-600">
                    {t.gateway_transaction_id ? "Gateway" : "UPI"}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <StatusBadge status={t.status} />
                  </td>

                  {/* TIME */}
                  <td className="p-4 text-gray-500">
                    {t.created_at
                      ? new Date(t.created_at).toLocaleString("en-IN")
                      : "--"}
                  </td>
                </motion.tr>
              ))}

              {/* EMPTY */}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">
                    No transactions match your search
                  </td>
                </tr>
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
    SUCCESS: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: <CheckCircle size={14} />
    },
    FAILED: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: <XCircle size={14} />
    },
    PENDING: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: <Clock size={14} />
    },
    REFUNDED: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: <Clock size={14} />
    }
  };

  const s = map[status] || map.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full
        text-xs font-semibold ${s.bg} ${s.text}`}
    >
      {s.icon}
      {status}
    </span>
  );
}
