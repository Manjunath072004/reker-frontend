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
              <tr key={t.id}>
                <td className="py-3">{t.id}</td>
                <td>₹{t.amount}</td>
                <td>{t.method}</td>
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
                <td className="text-gray-500">{t.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
