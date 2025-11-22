import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../api/auth";
import { useState } from "react";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const phone = location.state?.phone;

  const handleVerify = async () => {
    try {
      const res = await verifyOtp({ phone, otp });
      alert("Account Verified! Please login.");
      navigate("/login");
    } catch (err) {
      alert("OTP verification failed");
      console.log(err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold">OTP Verification</h1>

      <input
        type="text"
        placeholder="Enter OTP"
        className="border p-2 w-full mt-3"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        onClick={handleVerify}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Verify OTP
      </button>
    </div>
  );
}
