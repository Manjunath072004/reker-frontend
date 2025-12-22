import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

export default function AnalyticsView({ data = [] }) {
  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h3 className="text-3xl font-bold tracking-tight">
          Analytics
        </h3>
        <p className="text-sm text-gray-500">
          Revenue performance & growth trends
        </p>
      </div>

      {/* ================= CHART CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl border border-gray-100
          rounded-2xl shadow-lg p-6"
      >
        <h4 className="text-lg font-semibold mb-4">
          Revenue Analytics
        </h4>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="revenueLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Revenue"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb"
                }}
              />
              <Legend />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                fill="url(#revenueLine)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
}
