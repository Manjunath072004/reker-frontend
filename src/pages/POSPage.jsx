import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { createPayment, verifyPayment } from "../api/payments";
import { useLocation, useNavigate } from "react-router-dom";
import { createTransaction } from "../api/transactions";

export default function POSPage({ refreshTransactions }) {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [mobile, setMobile] = useState("");
  const [description, setDescription] = useState("");

  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(null);

  const [paymentId, setPaymentId] = useState(null);
  const [qrCreated, setQrCreated] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle");

  const QR_TIME = 120; // seconds (2 minutes)
  const [timeLeft, setTimeLeft] = useState(QR_TIME);
  const [qrExpired, setQrExpired] = useState(false);


  const quickAmounts = [100, 200, 500, 1000];

  /* ---------------- COUPON LOAD ---------------- */
  useEffect(() => {
    if (location.state?.coupon) {
      const c = location.state.coupon;
      setCoupon(c);
      if (amount) calculateDiscount(c, Number(amount));
    }
  }, [location.state]);

  useEffect(() => {
    if (coupon && amount) calculateDiscount(coupon, Number(amount));
  }, [amount]);

  const calculateDiscount = (c, amt) => {
    const d =
      c.discount_type === "flat"
        ? Number(c.discount_value)
        : Math.min((amt * c.discount_value) / 100, c.max_discount_amount || amt);

    setDiscount(d);
    setFinalAmount(amt - d);
  };

  useEffect(() => {
    if (!qrCreated || paymentStatus !== "waiting") return;

    setTimeLeft(QR_TIME);
    setQrExpired(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setQrExpired(true);
          setPaymentStatus("idle");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [qrCreated, paymentStatus]);

  /* ---------------- PAYMENT ---------------- */
  const handleGenerateQR = async () => {
    if (!amount) return alert("Enter bill amount");

    try {
      const res = await createPayment(
        { amount: Number(amount), coupon_code: coupon?.code || "" },
        token
      );

      const paymentId = res.payment.id;

      //  CREATE TRANSACTION IN DB
      await createTransaction(paymentId);

      setPaymentId(paymentId);
      setQrCreated(true);
      setQrExpired(false);
      setPaymentStatus("waiting");

      setTimeout(() => confirmPayment(paymentId), 4000);

    } catch {
      alert("Payment initiation failed");
    }
  };


  const confirmPayment = async (id) => {
    await verifyPayment(id, "SUCCESS", token);
    setPaymentStatus("success");
    refreshTransactions?.();
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 to-white px-8 py-12 overflow-hidden">

      {/* Background blobs */}
      <motion.div
        className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-green-300 rounded-full blur-3xl opacity-30"
        animate={{ scale: 1.1 }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-[460px] h-[460px] bg-yellow-300 rounded-full blur-3xl opacity-20"
        animate={{ scale: 1.1 }}
      />

      {/* GRID */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ================= BILL INPUT ================= */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:col-span-2 backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold mb-4">Enter Bill Amount</h2>

          <input
            type="number"
            placeholder="₹ 0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-4xl font-semibold p-6 rounded-xl bg-white/70 border focus:ring-2 focus:ring-green-400 outline-none"
          />

          {/* Quick amounts */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className="px-5 py-2 rounded-full bg-white/60 border hover:bg-green-100 hover:border-green-400 transition text-sm font-medium"
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <input
              placeholder="Customer Mobile (optional)"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="p-3 rounded-xl bg-white/70 border"
            />
            <input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-3 rounded-xl bg-white/70 border"
            />
          </div>

          {/* Coupon */}
          <div className="mt-6 flex items-center justify-between">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/coupons", { state: { from: "pos" } })}
              className="px-5 py-2 rounded-full bg-green-100 text-green-700 font-medium hover:bg-green-200 transition"
            >
              🎟️ Apply Coupon
            </motion.button>

            {coupon && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-300 px-4 py-1 rounded-full text-sm">
                <span className="font-medium">{coupon.code}</span>
                <button
                  onClick={() => {
                    setCoupon(null);
                    setDiscount(0);
                    setFinalAmount(null);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* ================= SUMMARY ================= */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl shadow-xl p-8"
        >
          <h3 className="text-xl font-semibold mb-4">Payment Summary</h3>

          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Bill Amount</span>
              <span>₹{amount || "0.00"}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">- ₹{discount}</span>
            </div>

            <hr />

            <div className="flex justify-between text-lg font-bold">
              <span>Total Payable</span>
              <span>₹{finalAmount ?? amount ?? "0.00"}</span>
            </div>
          </div>

          {/* Status bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Status</span>
              <span className={
                paymentStatus === "waiting"
                  ? "text-yellow-600"
                  : paymentStatus === "success"
                    ? "text-green-600"
                    : "text-gray-500"
              }>
                {paymentStatus === "idle" && "Not started"}
                {paymentStatus === "waiting" && "Awaiting payment"}
                {paymentStatus === "success" && "Completed"}
              </span>
            </div>

            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${paymentStatus === "waiting"
                  ? "w-2/3 bg-yellow-400"
                  : paymentStatus === "success"
                    ? "w-full bg-green-500"
                    : "w-0"
                  }`}
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerateQR}
            className="mt-8 w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold shadow-lg"
          >
            GENERATE UPI QR
          </motion.button>
        </motion.div>

        {/* ================= QR ================= */}

        {qrCreated && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="lg:col-span-3 backdrop-blur-xl bg-white/40
      border border-white/30 rounded-2xl shadow-xl
      p-10 text-center"
          >
            <h3 className="text-xl font-semibold mb-2">
              Scan & Pay
            </h3>

            {/* TIMER */}
            {!qrExpired && paymentStatus === "waiting" && (
              <p className="text-sm text-gray-600 mb-4">
                QR expires in{" "}
                <span className="font-bold text-red-600">
                  {formatTime(timeLeft)}
                </span>
              </p>
            )}

            {/* QR BOX */}
            <div className="relative mx-auto w-52 h-52 flex items-center justify-center
      bg-white rounded-2xl shadow-md mb-6"
            >
              {/* Pulse animation */}
              {paymentStatus === "waiting" && !qrExpired && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-green-400"
                  animate={{ opacity: [0.2, 0.7, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}

              {/* QR OR EXPIRED */}
              {!qrExpired ? (
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=UPI-DUMMY-PAYMENT"
                  alt="UPI QR"
                  className="w-44 h-44"
                />
              ) : (
                <div className="text-center">
                  <p className="text-red-600 font-semibold mb-2">
                    QR Expired
                  </p>
                  <button
                    onClick={handleGenerateQR}
                    className="px-4 py-2 bg-green-600 text-white
              rounded-full text-sm font-medium"
                  >
                    Generate New QR
                  </button>
                </div>
              )}
            </div>

            {paymentStatus === "waiting" && !qrExpired && (
              <p className="text-yellow-600 font-semibold">
                Waiting for customer to complete payment…
              </p>
            )}

            {paymentStatus === "success" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-green-700 font-bold text-2xl"
              >
                ✓ Payment Successful
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
