export default function SettlementsView() {
  const items = [
    { id: "S-001", amount: 15000, date: "2025-11-25", status: "Pending" },
    { id: "S-002", amount: 5400, date: "2025-11-24", status: "Paid" },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold">Settlements</h3>

      <div className="bg-white p-4 rounded shadow mt-4">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-500">
            <tr>
              <th>Settle ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {items.map((i) => (
              <tr key={i.id}>
                <td className="py-3">{i.id}</td>
                <td>₹{i.amount}</td>
                <td>{i.date}</td>
                <td
                  className={`text-sm ${i.status === "Paid" ? "text-green-600" : "text-yellow-600"
                    }`}
                >
                  {i.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
