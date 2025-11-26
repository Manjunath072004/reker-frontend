import { useEffect, useState } from "react";
import { listMerchants } from "../api/merchants";

export default function MerchantList() {
  const [merchants, setMerchants] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function load() {
      const res = await listMerchants(token);
      setMerchants(res.data);
    }
    load();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">Merchants</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Address</th>
          </tr>
        </thead>

        <tbody>
          {merchants.map((m, index) => (
            <tr key={index}>
              <td className="border p-2">{m.name}</td>
              <td className="border p-2">{m.business_type}</td>
              <td className="border p-2">{m.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
