import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { verifyCoupon } from "../api/coupons";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

/* ---------- PHONE VALIDATION ---------- */
const isValidIndianPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

export default function Coupons() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState(null);

  const [phone, setPhone] = useState("");
  const [phoneCoupons, setPhoneCoupons] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- VERIFY COUPON ---------- */
  const handleVerify = async () => {
    if (!code.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setLoading(true);
    setError("");
    setCoupon(null);

    try {
      const res = await verifyCoupon(code, token);
      setCoupon(res.data.coupon);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid coupon code");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- FETCH COUPONS BY PHONE ---------- */
  const fetchCouponsByPhone = async () => {
    setError("");
    setPhoneCoupons([]);

    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    if (!/^\d+$/.test(phone)) {
      setError("Phone number must contain only digits");
      return;
    }

    if (!isValidIndianPhone(phone)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post(
        "/coupons/by-phone/",
        { phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data || res.data.length === 0) {
        setError("No coupons available for this phone number");
        return;
      }

      setPhoneCoupons(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Coupon does not exist for this phone number"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------- APPLY ---------- */
  const applyToPOS = (selectedCoupon) => {
    navigate("/pos", { state: { coupon: selectedCoupon } });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 to-white px-8 py-12">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Apply Discount Coupon
          </h1>
          <p className="text-gray-500 mt-1">
            Verify coupon or find available offers
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* MANUAL COUPON */}
        <motion.div className="bg-white/70 rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold mb-4">Have a Coupon Code?</h2>

          <div className="flex gap-4">
            <input
              placeholder="Enter coupon code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 rounded-xl border focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            <button
              onClick={handleVerify}
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold"
            >
              {loading ? "Verifying..." : "Verify"}
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

        {/* PHONE COUPONS */}
        <motion.div className="bg-white/70 rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold mb-4">
            Find Coupons by Phone Number
          </h2>

          <div className="flex gap-4 mb-6">
            <input
              placeholder="10-digit phone number"
              value={phone}
              maxLength={10}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, ""))
              }
              className="flex-1 p-4 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <button
              onClick={fetchCouponsByPhone}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold"
            >
              {loading ? "Checking..." : "Check Coupons"}
            </button>
          </div>

          {phoneCoupons.length > 0 && (
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

/* ---------- COUPON CARD ---------- */
function CouponCard({ coupon, onApply }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl border bg-white shadow-lg p-6"
    >
      <div className="text-sm font-bold text-emerald-600 mb-2">
        {coupon.discount_type === "percent"
          ? `${coupon.discount_value}% OFF`
          : `₹${coupon.discount_value} OFF`}
      </div>

      <h3 className="text-lg font-bold">{coupon.code}</h3>

      <p className="text-sm text-gray-600">
        Min Order: ₹{coupon.min_order_amount}
      </p>

      <p className="text-sm text-gray-600">
        Valid till:{" "}
        {new Date(coupon.expiry_date).toLocaleDateString("en-IN")}
      </p>

      <button
        onClick={() => onApply(coupon)}
        className="mt-4 w-full py-2 bg-orange-500 text-white rounded-xl font-semibold"
      >
        Apply to POS
      </button>
    </motion.div>
  );
}
