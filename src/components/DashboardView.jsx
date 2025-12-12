import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import { CheckCircle, Receipt, Ticket } from "lucide-react";
import KpiCard from "./KpiCard";

export default function DashboardView({
  merchant,
  user,
  revenueSeries,
  transactions,
  dateRange,
  setDateRange,
}) {
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
        <KpiCard title="Today's Earnings" value={"₹" + (Math.floor(Math.random() * 8000) + 200)} />
        <KpiCard title="Transactions" value={transactions.length} />

        <KpiCard
          title="Success Rate"
          value={
            transactions.length
              ? Math.round(
                  (transactions.filter(t => t.status === "SUCCESS").length /
                    transactions.length) * 100
                ) + "%"
              : "0%"
          }
        />

        <KpiCard title="Pending Settlements" value={"₹" + (Math.floor(Math.random() * 20000))} />
      </section>

      {/* GRAPH + LIVE FEED */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LINE CHART */}
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Revenue (last 7 days)</h4>
            <div className="text-sm text-gray-500">Amounts in ₹</div>
          </div>

          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot />
                <Line type="monotone" dataKey="tx" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ACTIVITY FEED */}
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-3">Live Activity</h4>

          <ul className="space-y-3 text-sm text-gray-700">
            {transactions.slice(0, 3).map((t) => (
              <li key={t.id} className="flex items-start gap-3">
                <CheckCircle
                  size={16}
                  className={t.status === "SUCCESS" ? "text-green-600" : "text-red-500"}
                />

                <div>
                  <div className="font-medium">
                    {t.status === "SUCCESS"
                      ? `Payment of ₹${t.final_amount} received`
                      : `Failed payment ${t.id}`}
                  </div>

                  <div className="text-xs text-gray-500">
                    {new Date(t.created_at).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}

            {transactions.length === 0 && (
              <li className="text-gray-500 text-center">No recent activity</li>
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
                <th className="py-2">Txn ID</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No transactions
                  </td>
                </tr>
              ) : (
                transactions.slice(0, 5).map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="py-3">{t.id}</td>

                    <td>₹{t.final_amount}</td>

                    {/* UPDATED: payment method */}
                    <td>{t.gateway_transaction_id || "UPI"}</td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          t.status === "SUCCESS"
                            ? "bg-green-50 text-green-700"
                            : t.status === "FAILED"
                            ? "bg-red-50 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td className="text-gray-500">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
