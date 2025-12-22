import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import { CheckCircle } from "lucide-react";
import KpiCard from "./KpiCard";

/* ---------- helper: build revenue graph from transactions ---------- */
function buildRevenueSeries(transactions) {
  const map = {};

  transactions.forEach((t) => {
    if (t.status !== "SUCCESS") return;

    const day = new Date(t.created_at).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    if (!map[day]) {
      map[day] = { day, revenue: 0, tx: 0 };
    }

    map[day].revenue += Number(t.final_amount || 0);
    map[day].tx += 1;
  });

  return Object.values(map);
}

export default function DashboardView({
  merchant,
  user,
  transactions = [],
  dateRange,
  kpis,
  setDateRange,
}) {
  const revenueSeries = buildRevenueSeries(transactions);

  const totalRevenue = transactions
    .filter(t => t.status === "SUCCESS")
    .reduce((sum, t) => sum + Number(t.final_amount || 0), 0);

  const successRate = transactions.length
    ? Math.round(
        (transactions.filter(t => t.status === "SUCCESS").length /
          transactions.length) * 100
      )
    : 0;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold tracking-tight">
            {merchant?.business_name || user?.email || "Dashboard"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            📞 {merchant?.phone || user?.phone || "—"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm bg-white shadow-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow">
            Export CSV
          </button>
        </div>
      </section>

      {/* KPI CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Earnings" value={`₹${totalRevenue.toFixed(2)}`} />
        <KpiCard title="Transactions" value={transactions.length} />
        <KpiCard title="Success Rate" value={`${successRate}%`} />
        <KpiCard
          title="Pending Settlements"
          value={`₹${Number(kpis.pending_settlements).toFixed(2)}`}
        />
      </section>

      {/* GRAPH + ACTIVITY */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAPH */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-lg">Revenue Trend</h4>
            <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
              ₹ per day
            </span>
          </div>

          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="tx"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LIVE ACTIVITY */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h4 className="font-semibold mb-4">Live Activity</h4>

          <ul className="space-y-4">
            {transactions.slice(0, 3).map((t) => (
              <li key={t.id} className="flex gap-3">
                <span
                  className={`h-3 w-3 mt-2 rounded-full ${
                    t.status === "SUCCESS"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium">
                    {t.status === "SUCCESS"
                      ? `₹${t.final_amount} payment received`
                      : "Payment failed"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(t.created_at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}

            {transactions.length === 0 && (
              <p className="text-gray-500 text-sm text-center">
                No recent activity
              </p>
            )}
          </ul>
        </div>
      </section>

      {/* TRANSACTIONS */}
      <section className="bg-white rounded-2xl shadow p-6">
        <h4 className="font-semibold mb-4">Recent Transactions</h4>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Txn ID</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Time</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {transactions.slice(0, 5).map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="p-3">{t.id}</td>
                  <td className="p-3">₹{t.final_amount}</td>
                  <td className="p-3">{t.gateway_transaction_id || "UPI"}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        t.status === "SUCCESS"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
