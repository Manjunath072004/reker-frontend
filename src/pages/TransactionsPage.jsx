import { useEffect, useState } from "react";
import TransactionsView from "../components/TransactionsView";
import { fetchMerchantTransactions } from "../api/transactions";
import { motion } from "framer-motion";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH FROM DJANGO ================= */
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await fetchMerchantTransactions();

      /* 🔁 MAP DJANGO → UI FORMAT */
      const mapped = data.map((t) => ({
        id: t.id,
        amount: t.final_amount,                 // use final_amount
        status: t.status,
        gateway_transaction_id: t.gateway_transaction_id,
        created_at: t.created_at,
        logs: t.logs,
      }));

      setTransactions(mapped);
    } catch (err) {
      console.error(err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-20">
        {error}
      </div>
    );
  }

  /* ================= UI ================= */
  return <TransactionsView transactions={transactions} />;
}
