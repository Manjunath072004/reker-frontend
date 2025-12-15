import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function SettlementsView() {
  const { token } = useContext(AuthContext);
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    if (!token) return;

    API.get("/settlements/list/", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSettlements(res.data))
      .catch(err => console.error("Settlement fetch failed:", err));
  }, [token]);

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
            {settlements.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No settlements found
                </td>
              </tr>
            ) : (
              settlements.map((s) => (
                <tr key={s.id}>
                  <td className="py-3">{s.id}</td>
                  <td>₹{s.amount}</td>
                  <td>{new Date(s.settlement_date).toLocaleDateString()}</td>
                  <td
                    className={`text-sm ${
                      s.status === "PAID"
                        ? "text-green-600"
                        : s.status === "PENDING"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {s.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
