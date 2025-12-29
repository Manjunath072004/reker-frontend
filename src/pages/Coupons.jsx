import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { verifyCoupon } from "../api/coupons";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

/* ---------- PHONE VALIDATION ---------- */
const isValidIndianPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

/* ---------- DISCOUNT CALCULATOR ---------- */
const calculateCouponDiscount = (coupon, amount) => {
  if (!coupon || !amount) return 0;

  if (coupon.discount_type === "flat") {
    return coupon.discount_value;
  }

  const percentDiscount = (amount * coupon.discount_value) / 100;
  return Math.min(percentDiscount, coupon.max_discount_amount || percentDiscount);
};

export default function Coupons() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showOthers, setShowOthers] = useState(false);

  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState(null);

  const [phone, setPhone] = useState("");
  const [orderAmount, setOrderAmount] = useState("");
  const [bestCoupon, setBestCoupon] = useState(null);
  const [otherCoupons, setOtherCoupons] = useState([]);

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
    setBestCoupon(null);
    setOtherCoupons([]);

    if (!phone.trim()) {
      setError("Please enter phone number");
      return;
    }
    if (!isValidIndianPhone(phone)) {
      setError("Enter valid 10-digit Indian phone number");
      return;
    }
    if (!orderAmount || isNaN(orderAmount) || Number(orderAmount) <= 0) {
      setError("Enter a valid order amount");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post(
        "/coupons/by-phone/",
        { phone, order_amount: parseFloat(orderAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;

      if (!data || data.length === 0) {
        setError("No applicable coupons for this phone number and order amount");
        return;
      }

      // Backend can optionally return best_coupon and other_coupons
      const best = data.best_coupon || data[0];
      const others = data.other_coupons || data.filter((c) => c.id !== best.id);

      setBestCoupon(best);
      setOtherCoupons(others);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- APPLY ---------- */
  const applyToPOS = (selectedCoupon) => {
    navigate("/pos", { state: { coupon: selectedCoupon } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white px-8 py-12">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Apply Discount Coupon</h1>
          <p className="text-gray-500">Best coupon is automatically recommended</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">{error}</div>
        )}

        {/* MANUAL COUPON */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold mb-4">Have a Coupon Code?</h2>

          <div className="flex gap-4">
            <input
              placeholder="Enter coupon code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 rounded-xl border"
            />
            <button
              onClick={handleVerify}
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold"
            >
              Verify
            </button>
          </div>

          {coupon && (
            <div className="mt-6">
              <CouponCard coupon={coupon} onApply={applyToPOS} orderAmount={orderAmount} />
            </div>
          )}
        </div>

        {/* ================= DIVIDER ================= */}
        <div className="flex items-center gap-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        {/* PHONE COUPONS */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold mb-4">Find Coupons by Phone</h2>

          <div className="flex gap-4 mb-4">
            <input
              placeholder="10-digit phone number"
              value={phone}
              maxLength={10}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="flex-1 p-4 rounded-xl border"
            />
            <input
              placeholder="Order amount"
              value={orderAmount}
              onChange={(e) => setOrderAmount(e.target.value.replace(/[^\d.]/g, ""))}
              className="flex-1 p-4 rounded-xl border"
            />
            <button
              onClick={fetchCouponsByPhone}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold"
            >
              {loading ? "Checking..." : "Check Coupons"}
            </button>
          </div>

          {/* BEST COUPON */}
          {bestCoupon && (
            <div className="mb-6 border-2 border-green-500 bg-green-50 rounded-2xl p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-green-700">⭐ Best Coupon</h3>
                  <p className="text-sm text-gray-700">
                    Save ₹{calculateCouponDiscount(bestCoupon, parseFloat(orderAmount))}
                  </p>
                </div>
                <button
                  onClick={() => applyToPOS(bestCoupon)}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold"
                >
                  Apply Best
                </button>
              </div>
            </div>
          )}

          {/* OTHER COUPONS TOGGLE */}
          {otherCoupons.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowOthers(!showOthers)}
                className="w-full py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                {showOthers ? "Hide Other Coupons" : `View Other Coupons (${otherCoupons.length})`}
              </button>
            </div>
          )}

          {showOthers && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
            >
              {otherCoupons.map((c) => (
                <CouponCard key={c.id} coupon={c} onApply={applyToPOS} orderAmount={orderAmount} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- COUPON CARD ---------- */
function CouponCard({ coupon, onApply, orderAmount }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl border bg-white shadow-lg p-6">
      <div className="text-sm font-bold text-emerald-600 mb-2">
        {coupon.discount_type === "percent"
          ? `${coupon.discount_value}% OFF`
          : `₹${coupon.discount_value} OFF`}
      </div>

      <h3 className="text-lg font-bold">{coupon.code}</h3>

      <p className="text-sm text-gray-600">Min Order: ₹{coupon.min_order_amount}</p>

      <p className="text-sm text-green-600 font-semibold">
        Save ₹{calculateCouponDiscount(coupon, parseFloat(orderAmount))}
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
