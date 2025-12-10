import { useState, useContext } from "react";
import { login, checkPhoneRegistered } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";


import rekerPayLogo from "../assets/Reker-logo.png";

import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { saveToken } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateLoginForm = () => {
    let newErrors = {};

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginUsingOtp = async () => {
    if (!form.phone || form.phone.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        phone: "Enter a valid 10-digit phone number",
      }));
      return;
    }

    try {
      const res = await checkPhoneRegistered({ phone: form.phone });

      if (res.data.exists === true) {
        navigate("/otp-verify", {
          state: { phone: form.phone, mode: "login" },
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number not registered. Please sign up.",
        }));
      }
    } catch (err) {
      alert("Server error while checking phone number");
    }
  };

  const handleLogin = async () => {
    if (!validateLoginForm()) return;

    try {
      const res = await login(form);
      const token = res.data?.tokens?.access;

      if (!token) {
        alert("Login failed: No token received.");
        return;
      }

      saveToken(token);
      alert("Login Successful!");
      navigate("/merchant-dashboard");

    } catch (err) {
      if (err.response) {
        alert(
          err.response.data?.message ||
          err.response.data?.detail ||
          "Invalid phone number or password"
        );
      } else {
        alert("Network error — Backend not reachable");
      }
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-white px-6">

        {/* FIXED LOGO */}
        <img
          src={rekerPayLogo}
          className="h-16 absolute top-6 left-[70px] z-20"
        />

        {/* TOP-LEFT BLOB */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6, scale: 1.1 }}
          transition={{ duration: 2 }}
          className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-green-300 rounded-full blur-3xl opacity-30"
        />

        {/* BOTTOM-RIGHT BLOB */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5, scale: 1.1 }}
          transition={{ duration: 2 }}
          className="absolute bottom-[-150px] right-[-150px] w-[420px] h-[420px] bg-yellow-300 rounded-full blur-3xl opacity-20"
        />

        {/* ---------------- CENTER LOGIN CARD ---------------- */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col w-[420px] relative z-10"
        >
          <div className="
          backdrop-blur-xl bg-white/40 
          border border-white/30 
          rounded-2xl shadow-xl p-10 w-full
        ">

            <p className="text-sm text-gray-600">Welcome back!</p>

            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent mt-2 mb-4">
              RekerPay
            </h1>

            <p className="text-sm text-gray-700 mb-4">
              New to RekerPay?{" "}
              <span className="text-green-700 underline cursor-pointer" onClick={() => navigate("/signup")}>
                Sign Up
              </span>
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Login to your RekerPay Account
            </h2>

            {/* PHONE */}
            <label className="text-sm font-medium text-gray-700">Phone*</label>
            <div className="flex mt-2">
              <div className="inline-flex items-center px-4 bg-gray-100 border border-gray-300 rounded-l-lg">+91</div>
              <input
                type="text"
                name="phone"
                placeholder="Enter your mobile number"
                className={`p-3 w-full rounded-r-lg bg-white/70 backdrop-blur border ${errors.phone ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-400 outline-none`}
                onChange={handleChange}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}

            {/* PASSWORD */}
            <label className="text-sm font-medium text-gray-700 mt-4 block">Password*</label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your RekerPay password"
                className={`p-3 w-full rounded-xl bg-white/70 backdrop-blur border ${errors.password ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-400 outline-none`}
                onChange={handleChange}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}

            {/* LINKS */}
            <div className="flex justify-between mt-3 text-sm">
              <span className="text-green-600 underline cursor-pointer" onClick={handleLoginUsingOtp}>
                Login using OTP
              </span>

              <span className="text-green-600 underline cursor-pointer" onClick={() => navigate("/forgot-password")}>
                Forgot Password
              </span>
            </div>

            {/* LOGIN BUTTON */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleLogin}
              className="mt-8 w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition"
            >
              LOGIN
            </motion.button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Using your phone number means faster & secure authentication.
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
