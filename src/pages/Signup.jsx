import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
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

export default function Signup() {
  const [form, setForm] = useState({
    phone: "",
    password: "",
    full_name: "",
    email: "",
    collect: "no",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    level: "",
    color: "",
  });

  const navigate = useNavigate();

  // ---------------------- HANDLE INPUT CHANGE ----------------------
  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setErrors((s) => ({ ...s, [e.target.name]: "" })); // clear specific field error
  };

  // ---------------------- PASSWORD STRENGTH METER ----------------------
  const checkPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>_\-+=\\\/~]/.test(password)) score++;

    if (score <= 2) {
      setPasswordStrength({ level: "Weak Password", color: "bg-red-500" });
    } else if (score === 3 || score === 4) {
      setPasswordStrength({ level: "Medium Strength", color: "bg-yellow-500" });
    } else {
      setPasswordStrength({ level: "Strong Password", color: "bg-green-600" });
    }
  };

  // ---------------------- VALIDATION ----------------------
  const validateForm = () => {
    let newErrors = {};

    // ---------- EMAIL VALIDATION ----------
    const email = form.email.trim();
    if (!email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

      const invalidPatterns = [
        /^[^@]+@[^@]+@/, // two @
        /\.\./,          // double dots
        /^[@.]/,         // starts with @ or .
        /[@.]$/,         // ends with @ or .
      ];

      if (!emailRegex.test(email) || invalidPatterns.some((p) => p.test(email))) {
        newErrors.email = "Enter a valid email address";
      }
    }

    // ---------- PASSWORD VALIDATION ----------
    const password = form.password.trim();
    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\\\/~]/.test(password);
      const isLongEnough = password.length >= 8;

      const commonWeakPasswords = [
        "password", "123456", "qwerty", "111111", "123123", "abc123",
        "password1", "000000", "iloveyou"
      ];

      const isCommon = commonWeakPasswords.includes(password.toLowerCase());
      const isRepeating = /^([a-zA-Z0-9])\1+$/.test(password);
      const isSequential =
        "1234567890".includes(password) ||
        "abcdefghijklmnopqrstuvwxyz".includes(password.toLowerCase());

      if (
        !hasUpper ||
        !hasLower ||
        !hasNumber ||
        !hasSpecial ||
        !isLongEnough ||
        isCommon ||
        isRepeating ||
        isSequential
      ) {
        newErrors.password =
          "Password must be 8+ characters with uppercase, lowercase, number & special character. Avoid simple or common patterns.";
      }
    }

    // ---------- PHONE VALIDATION ----------
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------- CHECK PHONE WITH BACKEND ----------------------
  const checkPhoneExists = async (phone) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/check-phone/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      return data.exists; // true | false
    } catch (e) {
      console.error("Phone check failed", e);
      return false;
    }
  };

  // ---------------------- CHECK EMAIL WITH BACKEND ----------------------
  const checkEmailExists = async (email) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/check-email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      return data.exists; // true | false
    } catch (e) {
      console.error("Email check failed", e);
      return false;
    }
  };


  const handleSignup = async () => {
    if (!validateForm()) return;

    //  Check PHONE duplicate
    const phoneExists = await checkPhoneExists(form.phone);

    if (phoneExists) {
      setErrors((s) => ({
        ...s,
        phone: "Phone number is already registered",
      }));
      return;
    }

    //  Check EMAIL duplicate
    const emailExists = await checkEmailExists(form.email);

    if (emailExists) {
      setErrors((s) => ({
        ...s,
        email: "Email is already registered",
      }));
      return;
    }

    // Proceed with signup
    try {
      await signup(form);
      alert("OTP sent to your mobile");
      navigate("/otp-verify", { state: { phone: form.phone } });
    } catch (err) {
      alert("Signup Failed");
      console.error(err);
    }
  };



  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-white px-6">


        {/* FIXED LOGO AT TOP-LEFT */}
        <img
          src={rekerPayLogo}
          className="h-16 absolute top-6 left-[70px] z-20"
        />


        {/* Animated Blobs Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6, scale: 1.1 }}
          transition={{ duration: 2 }}
          className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-green-300 rounded-full blur-3xl opacity-30"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5, scale: 1.1 }}
          transition={{ duration: 2 }}
          className="absolute bottom-[-150px] right-[-150px] w-[420px] h-[420px] bg-yellow-300 rounded-full blur-3xl opacity-20"
        />

        <div className="w-full max-w-7xl flex gap-10 relative z-10">

          {/* LEFT PANEL */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="flex-1 flex flex-col justify-center px-14"
          >

            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              Why choose RekerPay for payments
            </h3>

            <ul className="space-y-7 text-gray-700 text-lg">
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">✓</div>
                <p>100% online onboarding to get started quickly</p>
              </li>

              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">✓</div>
                <p>Accept payments via WhatsApp, SMS, Email with No-Code tools</p>
              </li>

              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">✓</div>
                <p>150+ payment methods supported</p>
              </li>
            </ul>

            <div className="mt-24 flex items-center space-x-6 max-w-xl">
              <div className="flex-grow border-t border-gray-300" />
              <div className="text-sm text-gray-500 px-4">Trusted by 5 lakh+ businesses</div>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            <div className="w-full overflow-hidden mt-6 h-22">
              <div className="flex items-center gap-8 animate-scroll whitespace-nowrap">
                {[BlinkitPg, ZomatoPg, ShopifyPg, NammaMetroPg, MyntraPg, SwiggyPg, KFCPg]
                  .map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      className="inline-block h-10 object-contain mx-4"
                      alt="partner logo"
                    />
                  ))}
              </div>
            </div>

          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col w-[420px]"
          >
            <div className="
            backdrop-blur-xl bg-white/40 
            border border-white/30 
            rounded-2xl shadow-xl p-10 w-full
          ">
              <p className="text-sm text-gray-600">Welcome to!</p>

              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent mt-2 mb-4">
                RekerPay
              </h1>

              <p className="text-sm text-gray-700 mb-4">
                Already have an account?{" "}
                <span className="text-green-700 underline cursor-pointer" onClick={() => navigate("/login")}>
                  Login
                </span>
              </p>

              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Create your RekerPay Account
              </h2>

              {/* EMAIL */}
              <label className="text-sm font-medium text-gray-700">Email*</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email id"
                onChange={handleChange}
                className={`mt-2 p-3 w-full rounded-xl bg-white/70 backdrop-blur border ${errors.email ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-400 outline-none`}
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}

              {/* PASSWORD */}
              <label className="text-sm font-medium text-gray-700 mt-4 block">Password*</label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  className={`p-3 w-full rounded-xl bg-white/70 backdrop-blur border ${errors.password ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-400 outline-none`}
                  onChange={(e) => {
                    handleChange(e);
                    checkPasswordStrength(e.target.value);
                  }}
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {form.password && (
                <div className="mt-2">
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className={`h-2 rounded ${passwordStrength.color}`}
                      style={{
                        width:
                          passwordStrength.level === "Weak Password"
                            ? "33%"
                            : passwordStrength.level === "Medium Strength"
                              ? "66%"
                              : "100%",
                      }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1">{passwordStrength.level}</p>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}

              {/* PHONE */}
              <label className="text-sm font-medium text-gray-700 mt-4 block">Mobile*</label>
              <div className="flex mt-2">
                <div className="inline-flex items-center px-4 bg-gray-100 border border-gray-300 rounded-l-lg">
                  +91
                </div>
                <input
                  type="text"
                  name="phone"
                  placeholder="10-digit phone number"
                  className={`p-3 w-full rounded-r-lg bg-white/70 backdrop-blur border ${errors.phone ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-400 outline-none`}
                  onChange={handleChange}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}

              {/* BUTTON */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="mt-8 w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition"
                onClick={handleSignup}
              >
                SEND OTP & CREATE ACCOUNT
              </motion.button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By signing up you agree to our{" "}
                <span className="underline">Terms</span> &{" "}
                <span className="underline">Privacy Policy</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
