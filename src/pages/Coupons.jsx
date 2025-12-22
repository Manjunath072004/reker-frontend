import { useState, useContext } from "react";
import { motion } from "framer-motion";
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

  /* ---------- VERIFY COUPON ---------- */
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

  /* ---------- FETCH BY PHONE ---------- */
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

  /* ---------- APPLY ---------- */
  const applyToPOS = (selectedCoupon) => {
    navigate("/pos", {
      state: { coupon: selectedCoupon },
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 to-white px-8 py-12 overflow-hidden">

      {/* Decorative blur */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-emerald-300 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] bg-lime-300 rounded-full blur-3xl opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">

        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Apply Discount Coupon
          </h1>
          <p className="text-gray-500 mt-1">
            Verify coupon or find available offers for customer
          </p>
        </div>

        {/* ================= MANUAL COUPON ================= */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-xl font-semibold mb-4">Have a Coupon Code?</h2>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              placeholder="Enter coupon code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 rounded-xl border bg-white/70 focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            <button
              onClick={handleVerify}
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow"
            >
              {loading ? "Verifying..." : "Verify Coupon"}
            </button>
          </div>

          {coupon && (
            <div className="mt-6">
              <CouponCard coupon={coupon} onApply={applyToPOS} />
            </div>
          )}
        </motion.div>

        {/* ================= DIVIDER ================= */}
        <div className="flex items-center gap-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        {/* ================= PHONE COUPONS ================= */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-xl font-semibold mb-4">
            Find Coupons by Phone Number
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              placeholder="Customer phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 p-4 rounded-xl border bg-white/70 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <button
              onClick={fetchCouponsByPhone}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow"
            >
              {loading ? "Checking..." : "Check Coupons"}
            </button>
          </div>

          {phoneCoupons.length === 0 ? (
            <p className="text-gray-500">No coupons found for this number</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {phoneCoupons.map((c) => (
                <CouponCard key={c.id} coupon={c} onApply={applyToPOS} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ================= COUPON CARD ================= */

function CouponCard({ coupon, onApply }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl border bg-white/70 shadow-lg p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 px-4 py-1 text-xs font-semibold rounded-bl-xl
        bg-emerald-600 text-white">
        {coupon.discount_type === "percent"
          ? `${coupon.discount_value}% OFF`
          : `₹${coupon.discount_value} OFF`}
      </div>

      <h3 className="text-lg font-bold mb-2">{coupon.code}</h3>

      <p className="text-sm text-gray-600 mb-1">
        Min Order: ₹{coupon.min_order_amount}
      </p>

      <p className="text-sm text-gray-600 mb-1">
        Max Discount:{" "}
        {coupon.max_discount_amount
          ? `₹${coupon.max_discount_amount}`
          : "No limit"}
      </p>

      <p className="text-sm text-gray-600">
        Valid till:{" "}
        {new Date(coupon.expiry_date).toLocaleDateString("en-IN")}
      </p>

      <button
        onClick={() => onApply(coupon)}
        className="mt-4 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold"
      >
        Apply to POS
      </button>
    </motion.div>
  );
}
