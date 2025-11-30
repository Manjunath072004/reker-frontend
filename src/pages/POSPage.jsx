import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { verifyCoupon, applyCoupon } from "../api/coupons";
import { useLocation, useNavigate } from "react-router-dom";

export default function POSPage() {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // INPUTS
  const [amount, setAmount] = useState("");
  const [mobile, setMobile] = useState("");
  const [description, setDescription] = useState("");

  // COUPON STATE
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(null);

  // QR + PAYMENT
  const [qrCreated, setQrCreated] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("waiting");

  // ---------------------------------------
  // AUTO APPLY COUPON IF RETURNED FROM COUPON PAGE
  // ---------------------------------------
  useEffect(() => {
    if (location.state && location.state.coupon) {
      const c = location.state.coupon;
      setCoupon(c);

      // Auto calculate discount only after amount is entered
      if (amount) {
        calculateDiscount(c, amount);
      }
    }
  }, [location.state]);

  // ---------------------------------------
  // RECALCULATE WHEN AMOUNT CHANGES
  // ---------------------------------------
  useEffect(() => {
    if (coupon && amount) {
      calculateDiscount(coupon, amount);
    }
  }, [amount]);

  // ---------------------------------------
  // DISCOUNT CALCULATION FUNCTION
  // ---------------------------------------
  const calculateDiscount = (coupon, amt) => {
    let final = 0;

    if (coupon.discount_type === "flat") {
      final = coupon.discount_value;
    } else {
      const percentValue = (amt * coupon.discount_value) / 100;
      final = Math.min(percentValue, coupon.max_discount_amount || percentValue);
    }

    setDiscount(final);
    setFinalAmount(amt - final);
  };

  // ---------------------------------------
  // GENERATE QR
  // ---------------------------------------
  const handleGenerateQR = () => {
    if (!amount) {
      alert("Enter bill amount first");
      return;
    }

    setQrCreated(true);
    setPaymentStatus("waiting");

    setTimeout(() => {
      setPaymentStatus("success");
    }, 4000);
  };

  // ---------------------------------------
  // GO TO COUPON PAGE
  // ---------------------------------------
  const goToCouponPage = () => {
    navigate("/coupons", { state: { from: "pos" } });
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Payment / POS</h1>

      {/* MAIN INPUT BLOCK */}
      <div className="border rounded-xl p-6 shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">Enter Payment Details</h2>

        {/* Bill Amount */}
        <div className="mb-4">
          <label className="font-medium">Enter Bill Amount</label>
          <input
            type="number"
            className="border p-3 rounded w-full mt-1"
            placeholder="₹ Enter amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="font-medium">Customer Mobile (Optional)</label>
          <input
            type="text"
            className="border p-3 rounded w-full mt-1"
            placeholder="+91 XXXXX XXXXX"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        {/* USE COUPON BUTTON */}
        <button
          onClick={goToCouponPage}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mb-4"
        >
          Have a Coupon? Verify Here
        </button>

        {/* Display Applied Coupon */}
        {coupon && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <p><strong>Coupon Applied:</strong> {coupon.code}</p>
            <p><strong>Discount:</strong> ₹{discount}</p>
            <p><strong>Final Amount:</strong> ₹{finalAmount}</p>
          </div>
        )}

        {/* Description */}
        <div className="mb-4 mt-4">
          <label className="font-medium">Payment Description (Optional)</label>
          <input
            type="text"
            className="border p-3 rounded w-full mt-1"
            placeholder="e.g., Grocery bill, Restaurant bill"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Generate QR */}
        <button
          onClick={handleGenerateQR}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded text-lg mt-6"
        >
          GENERATE PAYMENT QR
        </button>
      </div>

      {/* QR BOX */}
      {qrCreated && (
        <div className="border rounded-xl p-6 shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">Dynamic UPI QR Code</h2>

          <div className="flex items-center justify-center mb-4">
            <div className="border p-6 rounded bg-white">
              <p className="text-center text-gray-400">[ QR CODE ]</p>
            </div>
          </div>

          <p><strong>Amount:</strong> ₹{amount}</p>
          <p><strong>Final Amount:</strong> ₹{finalAmount || amount}</p>
          <p><strong>Coupon Applied:</strong> {coupon ? "YES" : "NO"}</p>

          <div className="mt-6 p-4 rounded bg-gray-50 border">
            {paymentStatus === "waiting" && (
              <p className="text-yellow-600 font-semibold">
                Waiting for payment...
              </p>
            )}
            {paymentStatus === "success" && (
              <p className="text-green-600 font-bold">
                Payment Successful ✓
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
