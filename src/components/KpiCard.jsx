import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

/* ---------- number count animation ---------- */
function useCountUp(value, duration = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value.toString().replace(/[^\d.-]/g, ""));
    if (isNaN(end)) return;

    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return value.toString().includes("₹")
    ? `₹${count.toLocaleString()}`
    : count.toLocaleString();
}

/* ---------- KPI CARD ---------- */
export default function KpiCard({ title, value }) {
  const animatedValue = useCountUp(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 font-medium">
          {title}
        </div>
        <div className="bg-green-50 text-green-600 p-2 rounded-lg">
          <TrendingUp size={18} />
        </div>
      </div>

      <div className="text-3xl font-bold mt-4 text-gray-900">
        {animatedValue}
      </div>

      <div className="text-xs text-gray-400 mt-2">
        Compared to last period
      </div>
    </motion.div>
  );
}
