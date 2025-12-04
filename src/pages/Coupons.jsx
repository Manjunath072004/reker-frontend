import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { verifyCoupon, applyCoupon, listCoupons } from "../api/coupons";
import { useNavigate } from "react-router-dom";

export default function Coupons() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // ----------------------------------
  // Loaded particular Coupon per -> user
  // ----------------------------------
  useEffect(() => {
    if (!token) return;

    listCoupons(token)
      .then((res) => {
        if (res.data.message) {
          setHistory([]); // no coupons available
        } else {
          setHistory(res.data); // normal case
        }
        console.log("History:", res.data);
      })
      .catch((err) => console.log("History load error:", err));
  }, [token]);

  // ----------------------------------
  // VERIFY COUPON
  // ----------------------------------
  const handleVerify = async () => {
    if (!code.trim()) {
      alert("Enter coupon code");
      return;
    }

    setLoading(true);

    try {
      const res = await verifyCoupon(code, token);
      console.log("Verify Response:", res.data);

      // FIX: Normalize response
      const data =
        res.data.coupon ||
        res.data.data?.coupon ||
        res.data; // fallback

      setCoupon(data);
    } catch (err) {
      console.log("Verify error:", err);
      alert(err.response?.data?.error || "Invalid coupon");
    }

    setLoading(false);
  };

  // ----------------------------------
  // APPLY COUPON → POS
  // ----------------------------------
  // APPLY COUPON → POS
  const handleApplyToPayment = () => {
    if (!coupon) {
      alert("Please verify a coupon first!");
      return;
    }

    navigate("/pos", {
      state: {
        coupon,
        applied: true
      },
    });
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Coupons</h1>

      {/* VERIFY BLOCK */}
      <div className="border rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Verify Coupon</h2>

        <div className="flex gap-4">
          <input
            type="text"
            className="border p-3 rounded w-64"
            placeholder="Enter Coupon Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            onClick={handleVerify}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>

      {/* COUPON DETAILS */}
      {coupon && (
        <div className="border rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Coupon Details</h2>

          <p>
            <strong>Status:</strong>{" "}
            {coupon.is_active ? "Active" : "Inactive"}
          </p>

          <p>
            <strong>Code:</strong> {coupon.code || "-"}
          </p>

          <p>
            <strong>Discount Type:</strong> {coupon.discount_type || "-"}
          </p>

          <p>
            <strong>Discount Value:</strong>{" "}
            {coupon.discount_type === "percent"
              ? `${coupon.discount_value}%`
              : `₹${coupon.discount_value}`}
          </p>

          <p>
            <strong>Minimum Order:</strong> ₹{coupon.min_order_amount || 0}
          </p>

          <p>
            <strong>Max Discount:</strong>{" "}
            ₹{coupon.max_discount_amount || 0}
          </p>

          <p>
            <strong>Valid Until:</strong>{" "}
            {coupon.expiry_date || "-"}
          </p>

          <p>
            <strong>Created By:</strong>{" "}
            {coupon.created_by || "-"}
          </p>

          <button
            onClick={handleApplyToPayment}
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
          >
            APPLY COUPON TO PAYMENT
          </button>
        </div>
      )}

      {/* COUPON HISTORY */}
      <div className="border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Coupon History</h2>

        {history.length === 0 ? (
          <div className="text-gray-500">No coupons available for your account</div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Value</th>
                <th className="p-3 text-left">Expiry</th>
                <th className="p-3 text-left">Usage</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {history.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="p-3">{c.code}</td>
                  <td className="p-3">{c.discount_type}</td>
                  <td className="p-3">
                    {c.discount_type === "percent"
                      ? `${c.discount_value}%`
                      : `₹${c.discount_value}`}
                  </td>
                  <td className="p-3">{new Date(c.expiry_date).toLocaleDateString()}</td>
                  <td className="p-3">{c.used_count} / {c.usage_limit}</td>
                  <td className="p-3">
                    {c.is_active ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}
