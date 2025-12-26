import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/* ================= HELPERS ================= */
function buildRevenueSeries(transactions = []) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const map = {};
  days.forEach((d) => (map[d] = { day: d, revenue: 0, tx: 0 }));

  transactions.forEach((t) => {
    if (t.status !== "SUCCESS") return;
    const day = new Date(t.created_at).toLocaleDateString("en-IN", {
      weekday: "short",
    });
    if (map[day]) {
      map[day].revenue += Number(t.final_amount || 0);
      map[day].tx += 1;
    }
  });

  return Object.values(map);
}

function buildPulse(transactions = []) {
  const success = transactions.filter((t) => t.status === "SUCCESS");
  const failed = transactions.length - success.length;

  return {
    health:
      failed === 0
        ? "Excellent"
        : failed < success.length / 3
        ? "Stable"
        : "Attention",
    momentum: success.length > 15 ? "Growing" : "Early",
    confidence: Math.min(99, 65 + success.length * 2),
  };
}

function buildBehavior(transactions = []) {
  const success = transactions.filter((t) => t.status === "SUCCESS");
  const highValue = success.filter((t) => Number(t.final_amount) > 1000);

  return {
    avgTicket:
      success.length > 0
        ? (
            success.reduce((s, t) => s + Number(t.final_amount), 0) /
            success.length
          ).toFixed(0)
        : 0,
    premiumShare:
      success.length > 0
        ? ((highValue.length / success.length) * 100).toFixed(0)
        : 0,
  };
}

/* ================= DASHBOARD ================= */
export default function MerchantDashboard({ merchant, user, transactions = [] }) {
  const revenueSeries = buildRevenueSeries(transactions);
  const pulse = buildPulse(transactions);
  const behavior = buildBehavior(transactions);

  const totalVolume = transactions
    .filter((t) => t.status === "SUCCESS")
    .reduce((s, t) => s + Number(t.final_amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-8 space-y-10">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div>
          <p className="uppercase tracking-widest text-xs text-green-400">
            Merchant Dashboard
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-1">
            {merchant?.business_name || user?.email}
          </h1>
        </div>
        <span
          className={`px-5 py-2 rounded-full text-sm font-semibold shadow-lg ${
            pulse.health === "Excellent"
              ? "bg-emerald-100 text-emerald-700"
              : pulse.health === "Stable"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          System {pulse.health}
        </span>
      </header>

      {/* HERO KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HeroCard
          label="Total Processed"
          value={`₹${totalVolume.toLocaleString()}`}
          hint="Successful payments"
          gradient="from-green-600 to-green-700"
        />
        <HeroCard
          label="Business Momentum"
          value={pulse.momentum}
          hint="Transaction velocity"
          gradient="from-emerald-500 to-teal-500"
        />
        <HeroCard
          label="Confidence Index"
          value={`${pulse.confidence}%`}
          hint="Platform reliability"
          gradient="from-amber-500 to-orange-500"
        />
      </section>

      {/* REVENUE TREND + LIVE ACTIVITY */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REVENUE TREND */}
        <div className="lg:col-span-2 relative overflow-hidden bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/60 via-transparent to-white/60 pointer-events-none" />
          <div className="relative flex items-center justify-between mb-6">
            <div>
              <h4 className="font-semibold text-xl text-gray-900">Revenue Trend</h4>
              <p className="text-sm text-gray-500 mt-1">
                Daily revenue performance & transaction flow
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                ₹ / day
              </span>
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                Last 7 days
              </span>
            </div>
          </div>

          <div className="relative h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: "#fff",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                    fontSize: "12px",
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3.5}
                  dot={false}
                  activeDot={{ r: 7 }}
                  fill="url(#revenueGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="tx"
                  stroke="#16a34a"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="relative flex justify-between items-center mt-5">
            <div className="flex gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Revenue
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-600" />
                Transactions
              </span>
            </div>
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              ▲ Growing
            </span>
          </div>
        </div>

        {/* LIVE ACTIVITY */}
        <LiveActivity transactions={transactions} />
      </section>

      {/* TRANSACTIONS TABLE */}
      <section className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 shadow-lg">
        <h3 className="font-semibold mb-4 text-lg">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead className="text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="text-left py-3">Transaction ID</th>
                <th className="text-left">Method</th>
                <th className="text-left">Time</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 6).map((t) => {
                const success = t.status === "SUCCESS";
                const highValue = Number(t.final_amount) > 1000;
                const method = t.payment_method?.toUpperCase() || "UPI";

                return (
                  <tr
                    key={t.id}
                    className="transition-all hover:shadow-lg hover:bg-green-50 rounded-xl"
                  >
                    <td className="font-mono py-3 px-2">{t.id}</td>
                    <td className="px-2">
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {method}
                      </span>
                    </td>
                    <td className="px-2">
                      {new Date(t.created_at).toLocaleTimeString([], {
                        hour12: true,
                      })}
                    </td>
                    <td className={`px-2 font-medium ${highValue ? "text-amber-600" : ""}`}>
                      ₹{t.final_amount.toLocaleString()}
                    </td>
                    <td className="px-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          success
                            ? highValue
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ================= UI BLOCKS ================= */
function HeroCard({ label, value, hint, gradient }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className={`rounded-3xl p-6 text-white shadow-xl bg-gradient-to-br ${gradient} transition-transform`}
    >
      <p className="text-sm opacity-80">{label}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
      <p className="text-xs mt-2 opacity-70">{hint}</p>
    </motion.div>
  );
}

function LiveActivity({ transactions }) {
  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-lg p-6">
      <div className="flex justify-between mb-5">
        <h4 className="font-semibold text-lg">Live Activity</h4>
        <span className="text-xs text-green-500 font-medium">Real-time</span>
      </div>

      <ul className="space-y-6 relative">
        <div className="absolute left-[6px] top-2 bottom-2 w-px bg-gradient-to-b from-green-200 to-transparent" />
        {transactions.slice(0, 4).map((t) => {
          const success = t.status === "SUCCESS";
          return (
            <li key={t.id} className="flex gap-4">
              <span
                className={`h-3 w-3 mt-2 rounded-full ${
                  success
                    ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]"
                    : "bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.2)]"
                }`}
              />
              <div className="flex-1 p-3 rounded-xl hover:bg-green-50 transition">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">
                    {success
                      ? `₹${t.final_amount} payment received`
                      : "Payment failed"}
                  </p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      success
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(t.created_at).toLocaleString("en-IN")}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
