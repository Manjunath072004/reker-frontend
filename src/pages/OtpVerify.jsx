// import { useLocation, useNavigate } from "react-router-dom";
// import { verifyOtp } from "../api/auth";
// import { useState } from "react";

// export default function OtpVerify() {
//   const [otp, setOtp] = useState("");
//   const location = useLocation();
//   const navigate = useNavigate();

//   const phone = location.state?.phone;

//   const handleVerify = async () => {
//     try {
//       const res = await verifyOtp({ phone, otp });
//       alert("Account Verified! Please login.");
//       navigate("/login");
//     } catch (err) {
//       alert("OTP verification failed");
//       console.log(err);
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto">
//       <h1 className="text-xl font-bold">OTP Verification</h1>

//       <input
//         type="text"
//         placeholder="Enter OTP"
//         className="border p-2 w-full mt-3"
//         onChange={(e) => setOtp(e.target.value)}
//       />

//       <button
//         onClick={handleVerify}
//         className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
//       >
//         Verify OTP
//       </button>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resetPassword, resendOtp  } from "../api/auth";   // ✅ ADDED BACK
import rekerPayLogo from "../assets/Reker-logo.png";
import BlinkitPg from "../assets/Blinkit.png";
import ShopifyPg from "../assets/shopify.jpg";
import ZomatoPg from "../assets/Zomato-logo.png";
import NammaMetroPg from "../assets/Namma_Metro.png";
import MyntraPg from "../assets/Myntra-Logo.png";
import SwiggyPg from "../assets/Swiggy_Logo.png";
import KFCPg from "../assets/KFC_logo.png";

export default function OtpVerify() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const phone = state?.phone || "";
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleResend = async () => {
    if (!phone) {
      alert("Phone number missing!");
      return;
    }

    try {
      await resendOtp({ phone });

      alert("OTP resent successfully!");
      setTimer(45); // reset timer
    } catch (err) {
      alert("Failed to resend OTP");
      console.log(err);
    }
  };


  // 🔥 FIXED — REAL VERIFY OTP API CALL
  const handleSubmit = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) {
      alert("Enter valid OTP");
      return;
    }

    try {
      // 1️⃣ Verify OTP first
      const res = await verifyOtp({
        phone: phone,
        otp: finalOtp,
      });

      // 2️⃣ If this OTP is for resetting password
      if (state?.mode === "reset-password") {
        const resetRes = await resetPassword({
          phone: phone,
          new_password: state.newPassword,
        });

        alert("Password Reset Successful! Please login.");
        navigate("/login");
        return;
      }

      // 3️⃣ If OTP Verify is for Login
      if (state?.mode === "login") {
        localStorage.setItem("token", res.data.token);
        alert("Login Successful!");
        navigate("/merchant-dashboard");
        return;
      }

      // 4️⃣ OTP for Signup
      alert("Account Verified! Please login.");
      navigate("/login");

    } catch (err) {
      alert("OTP verification failed");
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-payuGray px-6 overflow-y-auto">
      <div className="w-full max-w-7xl flex gap-8">

        {/* LEFT PANEL */}
        <div className="flex-1 py-12 px-14">
          <div className="mb-10">
            <img
              src={rekerPayLogo}
              alt="RekerPay"
              className="h-20 object-contain"
            />
          </div>

          <h3 className="text-2xl font-semibold mb-6 text-gray-800">
            Why choose RekerPay for payments
          </h3>

          <ul className="space-y-8 text-gray-700 max-w-xl">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center">✓</div>
              <p>Get started with 100% online onboarding</p>
            </li>

            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center">✓</div>
              <p>Accept payments via SMS, Email or Whatsapp with our No Code payment solution</p>
            </li>

            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center">✓</div>
              <p>Accept payments via 150+ payment methods</p>
            </li>
          </ul>

          <div className="mt-24 flex items-center space-x-6 max-w-xl">
            <div className="flex-grow border-t border-gray-300" />
            <div className="text-sm text-gray-500 px-4">
              Trusted by 5 lakh+ businesses
            </div>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <div className="overflow-hidden w-full mt-6">
            <div className="logo-slider">
              <img src={BlinkitPg} className="logo-item" />
              <img src={ZomatoPg} className="logo-item" />
              <img src={ShopifyPg} className="logo-item" />
              <img src={NammaMetroPg} className="logo-item" />
              <img src={MyntraPg} className="logo-item" />
              <img src={SwiggyPg} className="logo-item" />
              <img src={KFCPg} className="logo-item" />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col w-96 overflow-y-auto pb-10">
          <div className="bg-white signup-card p-8 relative w-full shadow-sm rounded">

            <div className="absolute left-0 top-0 h-full w-14 dotted-grid pointer-events-none" />

            <p className="text-sm text-gray-500 mb-1 text-left">
              Welcome to!
            </p>

            <div className="flex justify-start mb-6">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-500 to-green-600 bg-clip-text text-transparent tracking-wide">
                RekerPay
              </h1>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-6 text-left">
              Verify Phone Number to Get started
            </h2>

            <div className="bg-[#ecf5ff] border border-[#d4e5ff] text-[#3a77ff] text-sm p-3 rounded">
              We have sent an OTP to your mobile number
            </div>

            <p className="text-sm text-gray-600 mt-6">Mobile Number</p>
            <input
              disabled
              value={"+91 " + phone}
              className="mt-1 border rounded-md px-3 py-2 text-gray-700 w-full bg-gray-100"
            />

            <p className="mt-6 text-sm text-gray-600">Enter OTP</p>

            <div className="flex gap-4 mt-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="w-[54px] h-[54px] border rounded-md text-center text-xl font-medium outline-none focus:ring-2 focus:ring-green-500"
                />
              ))}
            </div>

            <div className="flex justify-between mt-5 items-center">
              <button
                className="text-green-700 font-semibold"
                onClick={() => navigate(-1)}
              >
                Back
              </button>

              {timer > 0 ? (
                <p className="text-gray-500 text-sm">
                  Resend OTP in 00:{timer.toString().padStart(2, "0")}
                </p>
              ) : (
                <button
                  className="text-green-700 font-semibold"
                  onClick={handleResend}
                >
                  Resend OTP
                </button>

              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#0e9f4a] text-white py-4 rounded-full text-sm font-semibold mt-8"
            >
              VERIFY OTP
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

