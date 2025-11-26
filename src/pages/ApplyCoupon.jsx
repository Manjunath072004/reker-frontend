import { useState } from "react";
import { applyCoupon } from "../api/coupons";

export default function ApplyCoupon() {
  const [code, setCode] = useState("");
  const [orderAmount, setOrderAmount] = useState("");
  const [result, setResult] = useState(null);

  const token = localStorage.getItem("token");

  const handleApply = async () => {
    try {
      const res = await applyCoupon(
        { code: code, order_amount: orderAmount },
        token
      );
      setResult(res.data);
    } catch (err) {
      alert("Invalid or expired coupon");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Apply Coupon</h2>

      <input
        className="border p-2 w-full mt-2"
        placeholder="Coupon Code"
        onChange={(e) => setCode(e.target.value)}
      />

      <input
        className="border p-2 w-full mt-2"
        placeholder="Order Amount"
        onChange={(e) => setOrderAmount(e.target.value)}
      />

      <button
        onClick={handleApply}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Apply
      </button>

      {result && (
        <div className="mt-4 bg-gray-200 p-4 rounded">
          <p>Discount: ₹{result.discount}</p>
          <p>Final Amount: ₹{result.final_amount}</p>
        </div>
      )}
    </div>
  );
}
