import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { useMemo } from "react";

export default function TransactionAnalytics({ transactions = [] }) {
  /* ---------- GROUP BY DATE ---------- */
  const data = useMemo(() => {
    const map = {};

    transactions.forEach((t) => {
      if (!t.created_at) return;

      const date = new Date(t.created_at).toLocaleDateString("en-IN");

      if (!map[date]) {
        map[date] = {
          date,
          total: 0,
          revenue: 0
        };
      }

      map[date].total += 1;

      if (t.status === "SUCCESS") {
        map[date].revenue += Number(t.amount || 0);
      }
    });

    return Object.values(map);
  }, [transactions]);

  if (data.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-xl border rounded-2xl shadow-lg p-6">
      <h4 className="text-lg font-semibold mb-4">
        Transaction Analytics
      </h4>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value, name) =>
              name === "revenue"
                ? [`₹${value}`, "Revenue"]
                : [value, "Transactions"]
            }
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#22c55e"
            fill="url(#revenue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
