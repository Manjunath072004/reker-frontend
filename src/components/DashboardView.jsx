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
    <>
      {/* HEADER */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold">
            {merchant?.business_name || user?.email || "User"}
          </h3>
          <p className="text-sm text-gray-500">
            Phone: {merchant?.phone || user?.phone || "—"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Export CSV
          </button>
        </div>
      </section>

      {/* KPI CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <KpiCard title="Total Earnings" value={`₹${totalRevenue.toFixed(2)}`} />
        <KpiCard title="Transactions" value={transactions.length} />
        <KpiCard title="Success Rate" value={`${successRate}%`} />
        <KpiCard title="Pending Settlements" value="—" />
      </section>

      {/* GRAPH + LIVE ACTIVITY */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REVENUE GRAPH */}
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Revenue Trend</h4>
            <div className="text-sm text-gray-500">₹ per day</div>
          </div>

          <div style={{ height: 260 }}>
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
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-3">Live Activity</h4>

          <ul className="space-y-3 text-sm text-gray-700">
            {transactions.slice(0, 3).map((t) => (
              <li key={t.id} className="flex items-start gap-3">
                <CheckCircle
                  size={16}
                  className={
                    t.status === "SUCCESS"
                      ? "text-green-600"
                      : "text-red-500"
                  }
                />

                <div>
                  <div className="font-medium">
                    {t.status === "SUCCESS"
                      ? `Payment ₹${t.final_amount} received`
                      : `Payment failed`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(t.created_at).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}

            {transactions.length === 0 && (
              <li className="text-gray-500 text-center">
                No recent activity
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* RECENT TRANSACTIONS */}
      <section className="mt-6 bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-3">Recent Transactions</h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500">
              <tr>
                <th>Txn ID</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {transactions.slice(0, 5).map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="py-3">{t.id}</td>
                  <td>₹{t.final_amount}</td>
                  <td>{t.gateway_transaction_id || "UPI"}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        t.status === "SUCCESS"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="text-gray-500">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
