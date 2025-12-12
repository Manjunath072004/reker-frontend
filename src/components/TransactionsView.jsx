export default function TransactionsView({ transactions }) {
  return (
    <div>
      <h3 className="text-xl font-semibold">Transactions</h3>

      <div className="bg-white p-4 rounded shadow mt-4 overflow-x-auto">
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
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">

                {/* TRANSACTION ID */}
                <td className="py-3">{t.id}</td>

                {/* AMOUNT */}
                <td>₹{t.amount}</td>

                {/* METHOD - backend field → gateway_transaction_id */}
                <td>{t.gateway_transaction_id || "UPI"}</td>

                {/* STATUS */}
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      t.status === "SUCCESS"
                        ? "bg-green-50 text-green-700"
                        : t.status === "FAILED"
                        ? "bg-red-50 text-red-700"
                        : t.status === "REFUNDED"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>

                {/* TIME - backend field → created_at */}
                <td className="text-gray-500">
                  {t.created_at
                    ? new Date(t.created_at).toLocaleString()
                    : "--"}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
