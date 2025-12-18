import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { verifyCoupon } from "../api/coupons";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Coupons() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState(null);

  const [phone, setPhone] = useState("");
  const [phoneCoupons, setPhoneCoupons] = useState([]);

  const [loading, setLoading] = useState(false);

  /* ---------------- VERIFY MANUAL COUPON ---------------- */
  const handleVerify = async () => {
    if (!code.trim()) return alert("Enter coupon code");

    setLoading(true);
    try {
      const res = await verifyCoupon(code, token);
      setCoupon(res.data.coupon);
    } catch (err) {
      alert(err.response?.data?.error || "Invalid coupon");
    }
    setLoading(false);
  };

  /* ---------------- FETCH COUPONS BY PHONE ---------------- */
  const fetchCouponsByPhone = async () => {
    if (!phone.trim()) return alert("Enter phone number");

    setLoading(true);
    try {
      const res = await API.post(
        "/coupons/by-phone/",
        { phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPhoneCoupons(res.data || []);
    } catch {
      alert("Failed to fetch coupons");
    }
    setLoading(false);
  };

  /* ---------------- APPLY TO POS ---------------- */
  const applyToPOS = (selectedCoupon) => {
    navigate("/pos", {
      state: {
        coupon: selectedCoupon,
        applied: true,
      },
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Coupons</h1>

      {/* MANUAL COUPON */}
      <div className="border rounded-lg p-6 mb-10">
        <h2 className="font-semibold mb-4">Have a Coupon?</h2>

        <div className="flex gap-3 mb-4">
          <input
            className="border p-2 rounded w-64"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={handleVerify}
            className="bg-green-600 text-white px-5 rounded"
          >
            Verify
          </button>
        </div>

        {coupon && (
          <CouponTable coupons={[coupon]} onApply={applyToPOS} />
        )}
      </div>

      {/* OR DIVIDER */}
      <div className="my-10 flex items-center max-w-xl mx-auto">
        <div className="flex-grow border-t border-gray-300" />
        <span className="text-sm text-gray-500 px-4">OR</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      {/* PHONE BASED COUPONS */}
      <div className="border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Find Coupons by Phone</h2>

        <div className="flex gap-3 mb-6">
          <input
            className="border p-2 rounded w-64"
            placeholder="Customer phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            onClick={fetchCouponsByPhone}
            className="bg-blue-600 text-white px-5 rounded"
          >
            Check Available Coupons
          </button>
        </div>

        {phoneCoupons.length === 0 ? (
          <p className="text-gray-500">No coupons found</p>
        ) : (
          <CouponTable coupons={phoneCoupons} onApply={applyToPOS} />
        )}
      </div>
    </div>
  );
}

/* ---------------- COUPON TABLE ---------------- */

function CouponTable({ coupons, onApply }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Code</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Value</th>
            <th className="p-3 text-left">Min Order</th>
            <th className="p-3 text-left">Max Discount</th>
            <th className="p-3 text-left">Valid Until</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map((c) => (
            <tr key={c.id} className="border-t hover:bg-gray-50">
              <td className="p-3">
                {c.is_active ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </td>

              <td className="p-3 font-mono">{c.code}</td>

              <td className="p-3 capitalize">{c.discount_type}</td>

              <td className="p-3">
                {c.discount_type === "percent"
                  ? `${c.discount_value}%`
                  : `₹${c.discount_value}`}
              </td>

              <td className="p-3">₹{c.min_order_amount}</td>

              <td className="p-3">
                {c.max_discount_amount
                  ? `₹${c.max_discount_amount}`
                  : "—"}
              </td>

              <td className="p-3">
                {new Date(c.expiry_date).toLocaleDateString("en-IN")}
              </td>

              <td className="p-3">
                <button
                  onClick={() => onApply(c)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded"
                >
                  Apply
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
