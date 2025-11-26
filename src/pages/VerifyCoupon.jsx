import { useState } from "react";
import { verifyCoupon } from "../api/coupons";

export default function VerifyCoupon() {
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const token = localStorage.getItem("token");

  const handleVerify = async () => {
    try {
      const res = await verifyCoupon(code, token);
      setCoupon(res.data);
    } catch {
      alert("Invalid Coupon");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Verify Coupon</h2>

      <input
        className="border p-2 w-full mt-3"
        placeholder="Coupon Code"
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={handleVerify}
        className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
      >
        Verify
      </button>

      {coupon && (
        <div className="mt-5 border p-4 bg-gray-100">
          <p>Code: {coupon.code}</p>
          <p>Status: {coupon.status}</p>
          <p>Discount: {coupon.discount_value}</p>
          <p>Type: {coupon.discount_type}</p>
        </div>
      )}
    </div>
  );
}
