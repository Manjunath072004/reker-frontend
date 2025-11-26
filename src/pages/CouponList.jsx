import { useEffect, useState } from "react";
import { listCoupons } from "../api/coupons";

export default function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function load() {
      const res = await listCoupons(token);
      setCoupons(res.data);
    }
    load();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">All Coupons</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Value</th>
            <th className="p-2 border">Expiry</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map((c) => (
            <tr key={c.code}>
              <td className="border p-2">{c.code}</td>
              <td className="border p-2">{c.discount_type}</td>
              <td className="border p-2">{c.discount_value}</td>
              <td className="border p-2">{c.expiry_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
