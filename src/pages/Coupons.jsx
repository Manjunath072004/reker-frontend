import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { verifyCoupon } from "../api/coupons";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "../context/OrderContext";

/* ---------- PHONE VALIDATION ---------- */
const isValidIndianPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

/* ---------- DISCOUNT CALCULATOR ---------- */
const calculateCouponDiscount = (coupon, amount) => {
  if (!coupon || !amount) return 0;

  if (coupon.discount_type === "flat") {
    return coupon.discount_value;
  }

  const percentDiscount = (amount * coupon.discount_value) / 100;
  return Math.min(
    percentDiscount,
    coupon.max_discount_amount || percentDiscount
  );
};

export default function Coupons() {
  const { token } = useContext(AuthContext);
  const { orderAmount } = useContext(OrderContext);
  const navigate = useNavigate();

  const [showOthers, setShowOthers] = useState(false);
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [phone, setPhone] = useState("");

  const [bestCoupon, setBestCoupon] = useState(null);
  const [otherCoupons, setOtherCoupons] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- VALIDATE ORDER AMOUNT FROM POS ---------- */
  useEffect(() => {
    if (!orderAmount || Number(orderAmount) <= 0) {
      setError("Note: Please enter order amount in POS before applying coupons");
    } else {
      setError("");
    }
  }, [orderAmount]);

  /* ---------- VERIFY MANUAL COUPON ---------- */
  const handleVerify = async () => {
    if (!code.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    if (!orderAmount || Number(orderAmount) <= 0) {
      setError("Order amount missing. Please enter amount in POS.");
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
    if (!orderAmount || Number(orderAmount) <= 0) {
      setError("Order amount missing. Please enter amount in POS.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post(
        "/coupons/by-phone/",
        {
          phone,
          order_amount: Number(orderAmount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;

      if (!data?.best_coupon && (!data?.other_coupons || data.other_coupons.length === 0)) {
        setError("No applicable coupons found");
        return;
      }

      setBestCoupon(data.best_coupon || null);
      setOtherCoupons(data.other_coupons || []);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- APPLY COUPON ---------- */
  const applyToPOS = (selectedCoupon) => {
    navigate("/pos", {
      state: { coupon: selectedCoupon },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Coupons</h1>
            <p className="text-gray-500">
              Apply best discounts for your order
            </p>
          </div>

          {/* ORDER AMOUNT BADGE */}
          <div className="bg-white shadow rounded-2xl px-6 py-4 text-center">
            <p className="text-xs text-gray-400">Order Amount</p>
            <p className="text-2xl font-bold text-emerald-600">
              ₹{orderAmount || 0}
            </p>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* MANUAL COUPON */}
          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-xl font-semibold mb-6">Enter Coupon Code</h2>

            <div className="flex gap-3">
              <input
                placeholder="COUPON2025"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 p-4 rounded-xl border focus:ring-2 focus:ring-emerald-400"
              />
              <button
                onClick={handleVerify}
                disabled={loading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold"
              >
                Verify
              </button>
            </div>

            {coupon && (
              <div className="mt-6">
                <CouponCard
                  coupon={coupon}
                  orderAmount={orderAmount}
                  onApply={applyToPOS}
                />
              </div>
            )}
          </div>

          {/* PHONE COUPONS */}
          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-xl font-semibold mb-6">
              Coupons for Phone Number
            </h2>

            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <input
                placeholder="10-digit phone"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="flex-1 p-4 rounded-xl border"
              />

              <button
                onClick={fetchCouponsByPhone}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
              >
                {loading ? "Checking..." : "Find Coupons"}
              </button>
            </div>

            {/* BEST COUPON */}
            {bestCoupon && (
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl p-6 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs opacity-80">Best Savings</p>
                    <h3 className="text-xl font-bold">{bestCoupon.code}</h3>
                    <p className="text-sm">
                      Save ₹{calculateCouponDiscount(bestCoupon, orderAmount)}
                    </p>
                  </div>
                  <button
                    onClick={() => applyToPOS(bestCoupon)}
                    className="bg-white text-emerald-700 px-5 py-2 rounded-xl font-semibold"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* OTHER COUPONS */}
            {otherCoupons.length > 0 && (
              <>
                <button
                  onClick={() => setShowOthers(!showOthers)}
                  className="w-full py-3 border rounded-xl font-semibold"
                >
                  {showOthers
                    ? "Hide Other Coupons"
                    : `View Other Coupons (${otherCoupons.length})`}
                </button>

                {showOthers && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {otherCoupons.map((c) => (
                      <CouponCard
                        key={c.id}
                        coupon={c}
                        orderAmount={orderAmount}
                        onApply={applyToPOS}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- COUPON CARD ---------- */
function CouponCard({ coupon, orderAmount, onApply }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl border p-6">
      <div className="text-sm font-bold text-emerald-600 mb-2">
        {coupon.discount_type === "percent"
          ? `${coupon.discount_value}% OFF`
          : `₹${coupon.discount_value} OFF`}
      </div>

      <h3 className="text-lg font-bold">{coupon.code}</h3>
      <p className="text-sm text-gray-600">Min Order: ₹{coupon.min_order_amount}</p>
      <p className="text-sm text-green-600 font-semibold">
        Save ₹{calculateCouponDiscount(coupon, orderAmount)}
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
