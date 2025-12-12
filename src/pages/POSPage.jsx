import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { verifyCoupon } from "../api/coupons";
import { createPayment, verifyPayment } from "../api/payments";   // NEW API
import { useLocation, useNavigate } from "react-router-dom";

export default function POSPage(refreshTransactions ) {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // INPUTS
  const [amount, setAmount] = useState("");
  const [mobile, setMobile] = useState("");
  const [description, setDescription] = useState("");

  // COUPON
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(null);

  // PAYMENT FLOW
  const [paymentId, setPaymentId] = useState(null);
  const [qrCreated, setQrCreated] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle");

 
  // LOAD COUPON FROM COUPON PAGE
  
  useEffect(() => {
    if (location.state && location.state.coupon) {
      const c = location.state.coupon;
      setCoupon(c);

      if (amount) calculateDiscount(c, Number(amount));
    }
  }, [location.state]);

 
  // RECALCULATE WHEN AMOUNT CHANGES
 
  useEffect(() => {
    if (coupon && amount) {
      calculateDiscount(coupon, Number(amount));
    }
  }, [amount]);

  
  // DISCOUNT CALCULATION
  
  const calculateDiscount = (c, amt) => {
    let final;

    if (c.discount_type === "flat") {
      final = Number(c.discount_value);
    } else {
      const percentVal = (amt * c.discount_value) / 100;
      final = Math.min(
        percentVal,
        c.max_discount_amount || percentVal
      );
    }

    setDiscount(final);
    setFinalAmount(amt - final);
  };

 
  // CREATE PAYMENT IN BACKEND

  const handleGenerateQR = async () => {
    if (!amount) {
      alert("Please enter amount");
      return;
    }

    try {
      const body = {
        amount: Number(amount),
        coupon_code: coupon ? coupon.code : "",
      };

      const res = await createPayment(body, token);

      setPaymentId(res.payment.id);
      setQrCreated(true);
      setPaymentStatus("waiting");

      // Simulate payment success after 4s
      setTimeout(() => {
        confirmPayment(res.payment.id);
      }, 4000);

    } catch (err) {
      console.log("Payment error:", err);
      alert("Payment initiation failed");
    }
  };

 
  // CONFIRM PAYMENT STATUS IN BACKEND
  
  const confirmPayment = async (id) => {
    try {
      const res = await verifyPayment(id, "SUCCESS", token);
      setPaymentStatus("success");
      if (refreshTransactions) refreshTransactions();
    } catch (err) {
      console.log("Verify error:", err);
    }
  };

  
  // OPEN COUPON PAGE
  
  const goToCouponPage = () => {
    if (!amount) {
      alert("Enter amount before selecting coupon");
      return;
    }
    navigate("/coupons", { state: { from: "pos" } });
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">POS Payment</h1>

      {/* MAIN BLOCK */}
      <div className="border rounded-xl p-6 shadow mb-10 bg-white">

        <h2 className="text-xl font-semibold mb-4">Enter Payment Details</h2>

        {/* Amount */}
        <div className="mb-4">
          <label className="font-medium">Bill Amount</label>
          <input
            type="number"
            className="border p-3 rounded w-full mt-1"
            placeholder="₹ Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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

        {/* Apply Coupon */}
        <button
          onClick={goToCouponPage}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mb-4"
        >
          Apply Coupon
        </button>

        {/* Coupon Display */}
        {coupon && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <p><strong>Coupon:</strong> {coupon.code}</p>
            <p><strong>Discount:</strong> ₹{discount}</p>
            <p><strong>Final Payable:</strong> ₹{finalAmount}</p>
          </div>
        )}

        {/* Description */}
        <div className="mb-4 mt-4">
          <label className="font-medium">Description (Optional)</label>
          <input
            type="text"
            className="border p-3 rounded w-full mt-1"
            placeholder="e.g., Restaurant bill"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* QR BUTTON */}
        <button
          onClick={handleGenerateQR}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded text-lg mt-6"
        >
          GENERATE QR
        </button>

      </div>

      {/* QR + STATUS */}
      {qrCreated && (
        <div className="border rounded-xl p-6 shadow bg-white">
          <h2 className="text-xl font-semibold mb-4">UPI QR Code</h2>

          <div className="flex items-center justify-center mb-4">
            <div className="border p-6 rounded bg-white">
              <p className="text-center text-gray-400">[ QR CODE ]</p>
            </div>
          </div>

          <p><strong>Bill Amount:</strong> ₹{amount}</p>
          <p><strong>Final Amount:</strong> ₹{finalAmount || amount}</p>
          <p><strong>Payment ID:</strong> {paymentId}</p>
          <p><strong>Coupon Applied:</strong> {coupon ? "YES" : "NO"}</p>

          <div className="mt-6 p-4 rounded bg-gray-50 border">
            {paymentStatus === "waiting" && (
              <p className="text-yellow-600 font-semibold">
                Waiting for customer to complete payment...
              </p>
            )}

            {paymentStatus === "success" && (
              <p className="text-green-600 font-bold text-lg">
                Payment Successful ✓
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}