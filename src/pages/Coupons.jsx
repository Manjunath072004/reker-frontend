import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { verifyCoupon } from "../api/coupons";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "../context/OrderContext";
import { connectSocket, disconnectSocket } from "../realtime/socket";
// import { QRCodeCanvas } from "qrcode.react";
import Barcode from "react-barcode";
import { getBestCouponBarcode } from "../api/coupons";


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

const getTimeLeft = (expiryDate) => {
  const now = new Date().getTime();
  const expiry = new Date(expiryDate).getTime();
  const diff = expiry - now;

  if (diff <= 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { hours, minutes, seconds };
};

/* ---------- EXPIRY CHECK ---------- */
const isExpiringSoon = (expiryDate) => {
  const now = new Date();
  const exp = new Date(expiryDate);
  return exp - now <= 24 * 60 * 60 * 1000; // 24 hours
};


export default function Coupons() {
  const [bestBarcode, setBestBarcode] = useState(null);
  const [otherBarcodes, setOtherBarcodes] = useState([]);
  const [showOtherBarcodes, setShowOtherBarcodes] = useState(false);


  const { token, user } = useContext(AuthContext);
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

  const fetchBestBarcode = async () => {
    setError("");
    setBestBarcode(null);

    if (!phone.trim()) {
      setError("Please enter customer phone number");
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
      const res = await getBestCouponBarcode(
        phone,
        Number(orderAmount),
        token
      );
      setBestBarcode(res.data.best_barcode);
      setOtherBarcodes(res.data.other_barcodes || []);
      setShowOtherBarcodes(false);

    } catch (err) {
      setError(err.response?.data?.error || "No applicable coupon found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    connectSocket({
      userId: user.id,
      onCoupon: (data) => {
        console.log("Live coupon update:", data);

        if (phone && orderAmount) {
          fetchCouponsByPhone();
        }
      },
    });

    return () => disconnectSocket();
  }, [user?.id, phone, orderAmount]);


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

        {/* -------------- BARCODE FIRST ------------- */}
        <div className="bg-white rounded-3xl shadow p-8">
          <h2 className="text-xl font-semibold mb-4">
            Scan Customer Coupon
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Best coupon is automatically selected for faster checkout
          </p>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <input
              placeholder="Customer Phone"
              value={phone}
              maxLength={10}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="flex-1 p-4 rounded-xl border"
            />

            <button
              onClick={fetchBestBarcode}
              disabled={loading}
              className="px-6 py-3 bg-black text-white rounded-xl font-semibold"
            >
              {loading ? "Finding Best Coupon..." : "Find Best Coupon"}
            </button>
          </div>

          {/*  SINGLE BEST BARCODE */}
          {bestBarcode && (
            <div className="bg-green-50 border border-green-400 rounded-2xl p-6 text-center max-w-md mx-auto">
              <h3 className="text-lg font-bold text-green-700 mb-2">
                🎯 Best Savings Applied Automatically
              </h3>

              {isExpiringSoon(bestBarcode.coupon.expiry_date) && (
                <div className="mb-2 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full inline-block">
                  ⏰ Expiring Today · Use now or lose it
                </div>
              )}

              <p className="text-sm text-gray-600 mb-3">
                {bestBarcode.coupon.code} — Save ₹{bestBarcode.discount}
              </p>


              <div className="flex justify-center">
                <Barcode
                  value={bestBarcode.barcode_value}
                  format="CODE128"
                  height={80}
                  displayValue
                />
              </div>

              <button
                onClick={() =>
                  navigate("/scan-coupon?code=" + bestBarcode.barcode_value)
                }
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl font-semibold"
              >
                Scan & Apply
              </button>
            </div>
          )}

          {/*  VIEW OTHER COUPONS BUTTON */}
          {otherBarcodes.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowOtherBarcodes(!showOtherBarcodes)}
                className="px-6 py-2 border rounded-xl font-semibold"
              >
                {showOtherBarcodes
                  ? "Hide Other Coupons"
                  : `View Other Coupons (${otherBarcodes.length})`}
              </button>
            </div>
          )}

          {/*  OTHER COUPON BARCODES */}
          {showOtherBarcodes && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {otherBarcodes.map((b, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-50 p-4 rounded-2xl border text-center"
                >
                  {isExpiringSoon(b.coupon.expiry_date) && (
                    <div className="mb-2 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full inline-block">
                      ⏰ Expiring Today · Use now or lose it
                    </div>
                  )}

                  <h3 className="font-bold text-sm mb-1">{b.coupon.code}</h3>

                  <p className="text-xs text-green-600 font-semibold mb-2">
                    Save ₹{b.discount}
                  </p>

                  <div className="flex justify-center">
                    <Barcode
                      value={b.barcode_value}
                      format="CODE128"
                      height={70}
                      displayValue={false}
                    />
                  </div>

                  <button
                    onClick={() =>
                      navigate("/scan-coupon?code=" + b.barcode_value)
                    }
                    className="mt-3 w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold"
                  >
                    Scan & Apply
                  </button>
                </motion.div>
              ))}
            </div>
          )}

        </div>

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
                  token={token}
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
                        token={token}
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
function CouponCard({ coupon, orderAmount, onApply, token }) {
  const [qrToken, setQrToken] = useState(null);

  const [timeLeft, setTimeLeft] = useState(
    getTimeLeft(coupon.expiry_date)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(coupon.expiry_date));
    }, 1000);

    return () => clearInterval(timer);
  }, [coupon.expiry_date]);

  const isExpired = !timeLeft;

  return (
    <motion.div
      whileHover={{ scale: !isExpired ? 1.02 : 1 }}
      className={`rounded-2xl border p-6 ${isExpired ? "opacity-50 bg-gray-100" : ""
        }`}
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

      <p className="text-sm text-green-600 font-semibold">
        Save ₹{calculateCouponDiscount(coupon, orderAmount)}
      </p>

      {isExpiringSoon(coupon.expiry_date) && !isExpired && (
        <div className="mt-2 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full inline-block">
          Expiring Soon - Use now or lose it
        </div>
      )}

      {/*  COUNTDOWN */}
      {timeLeft ? (
        <p className="mt-2 text-xs text-orange-600 font-semibold">
          ⏳ Expires in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </p>
      ) : (
        <p className="mt-2 text-xs text-red-600 font-semibold">
          Coupon Expired
        </p>
      )}

      <button
        disabled={isExpired}
        onClick={() => onApply(coupon)}
        className={`mt-4 w-full py-2 rounded-xl font-semibold ${isExpired
          ? "bg-gray-400 cursor-not-allowed text-white"
          : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
      >
        {isExpired ? "Expired" : "Apply to POS"}
      </button>
    </motion.div>
  );
}

