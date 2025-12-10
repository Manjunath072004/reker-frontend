import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resetPassword, resendOtp } from "../api/auth";
import { motion } from "framer-motion";
import Footer from "../components/Footer";


import rekerPayLogo from "../assets/Reker-logo.png";
import BlinkitPg from "../assets/Blinkit.png";
import ShopifyPg from "../assets/shopify.jpg";
import ZomatoPg from "../assets/Zomato-logo.png";
import NammaMetroPg from "../assets/Namma_Metro.png";
import MyntraPg from "../assets/Myntra-Logo.png";
import SwiggyPg from "../assets/Swiggy_Logo.png";
import KFCPg from "../assets/KFC_logo.png";

import { AuthContext } from "../context/AuthContext";

export default function OtpVerify() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const phone = state?.phone || "";
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const { saveToken } = useContext(AuthContext);

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
      setTimer(45);
    } catch (err) {
      alert("Failed to resend OTP");
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 4) {
      alert("Enter valid OTP");
      return;
    }
    try {
      const res = await verifyOtp({ phone, otp: finalOtp });

      if (state?.mode === "reset-password") {
        await resetPassword({ phone, new_password: state.newPassword });
        alert("Password Reset Successful! Please login.");
        navigate("/login");
        return;
      }

      if (state?.mode === "login") {
        const token = res.data?.tokens?.access;
        if (!token) {
          alert("Login failed: No token received from server.");
          return;
        }
        saveToken(token);
        alert("OTP verified successfully! Login Successful.");
        navigate("/merchant-dashboard");
        return;
      }

      // OTP for Signup
      alert("Account Verified! Please login.");
      navigate("/login");
    } catch (err) {
      alert("OTP verification failed");
      console.log(err);
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-white px-6">

        {/* FIXED LOGO */}
        <img src={rekerPayLogo} className="h-16 absolute top-6 left-[70px] z-20" />

        {/* Animated Blobs */}
        <motion.div
          className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-green-300 rounded-full blur-3xl opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6, scale: 1.1 }}
          transition={{ duration: 2 }}
        />
        <motion.div
          className="absolute bottom-[-150px] right-[-150px] w-[420px] h-[420px] bg-yellow-300 rounded-full blur-3xl opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5, scale: 1.1 }}
          transition={{ duration: 2 }}
        />

        <div className="w-full max-w-7xl flex gap-10 relative z-10">

          {/* LEFT PANEL */}
          <motion.div
            className="flex-1 flex flex-col justify-center px-14"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              Why Secure & Fast Verification
            </h3>

            <ul className="space-y-7 text-gray-700 text-lg">
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">✓</div>
                <p>OTP verification ensures your account is protected</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">✓</div>
                <p>Quick login without remembering passwords</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">✓</div>
                <p>Seamless access from any device in seconds</p>
              </li>
            </ul>

            <div className="mt-24 flex items-center space-x-6 max-w-xl">
              <div className="flex-grow border-t border-gray-300" />
              <div className="text-sm text-gray-500 px-4">
                Verified by thousands of users every day
              </div>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            <div className="w-full overflow-hidden mt-6 h-22">
              <div className="flex items-center gap-8 animate-scroll whitespace-nowrap">
                {[BlinkitPg, NammaMetroPg, ZomatoPg, ShopifyPg, MyntraPg, SwiggyPg, KFCPg].map((src, idx) => (
                  <img key={idx} src={src} className="inline-block h-10 object-contain mx-4" alt="partner logo" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div className="flex flex-col w-[420px]" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl shadow-xl p-10 w-full">
              <p className="text-sm text-gray-600">Welcome to!</p>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent mt-2 mb-4">RekerPay</h1>
              <p className="text-sm text-gray-700 mb-4">Enter the OTP sent to your mobile number to proceed</p>

              <label className="text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                disabled
                value={"+91 " + phone} className="mt-2 p-3 w-full rounded-xl bg-white/70 backdrop-blur border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none" />

              <label className="text-sm font-medium text-gray-700 mt-4 block">Enter OTP</label>
              <div className="flex gap-4 mt-2">
                {otp.map((digit, index) => (
                  <input key={index} id={`otp-${index}`} maxLength={1} value={digit} onChange={(e) => handleChange(e.target.value, index)}
                    className="w-[54px] h-[54px] border rounded-xl text-center text-xl font-medium outline-none focus:ring-2 focus:ring-green-500" />
                ))}
              </div>

              <div className="flex justify-between mt-5 items-center">
                <button className="text-green-700 font-semibold" onClick={() => navigate(-1)}>Back</button>
                {timer > 0 ? <p className="text-gray-500 text-sm">Resend OTP in 00:{timer.toString().padStart(2, "0")}</p> :
                  <button className="text-green-700 font-semibold" onClick={handleResend}>Resend OTP</button>}
              </div>

              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit}
                className="mt-8 w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition">
                VERIFY OTP
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
