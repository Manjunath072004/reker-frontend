import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

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

    // 🔍 Check PHONE duplicate
    const phoneExists = await checkPhoneExists(form.phone);

    if (phoneExists) {
      setErrors((s) => ({
        ...s,
        phone: "Phone number is already registered",
      }));
      return;
    }

    // 🔍 Check EMAIL duplicate
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
    <div className="min-h-screen flex items-center justify-center bg-payuGray px-6 overflow-y-auto">
      <div className="w-full max-w-7xl flex gap-8">

        {/* LEFT PANEL */}
        <div className="flex-1 py-12 px-14">
          <div className="mb-10">
            <img src={rekerPayLogo} alt="RekerPay" className="h-20 object-contain" />
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
              <p>Accept payments via SMS, Email or WhatsApp with our No-Code payment solution</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center">✓</div>
              <p>Accept payments via 150+ payment methods</p>
            </li>
          </ul>

          <div className="mt-24 flex items-center space-x-6 max-w-xl">
            <div className="flex-grow border-t border-gray-300" />
            <div className="text-sm text-gray-500 px-4">Trusted by 5 lakh+ businesses</div>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <div className="overflow-hidden w-full mt-6">
            <div className="logo-slider flex items-center gap-10 animate-scroll">
              <img src={BlinkitPg} className="logo-item h-12" />
              <img src={ZomatoPg} className="logo-item h-12" />
              <img src={ShopifyPg} className="logo-item h-12" />
              <img src={NammaMetroPg} className="logo-item h-12" />
              <img src={MyntraPg} className="logo-item h-12" />
              <img src={SwiggyPg} className="logo-item h-12" />
              <img src={KFCPg} className="logo-item h-12" />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col w-100 overflow-y-auto pb-10">
          <div className="bg-white signup-card p-8 relative w-full shadow-sm rounded">

            <p className="text-sm text-gray-500 mb-1 text-left">Welcome to!</p>

            <div className="flex justify-start mb-6">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-500 to-green-600 bg-clip-text text-transparent">
                RekerPay
              </h1>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Already have an account?{" "}
              <span
                className="text-green-600 underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>

            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Get started with Email and Phone Number
            </h2>

            {/* EMAIL */}
            <label className="text-sm font-medium text-gray-700 block">Email*</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email id"
              className={`input-field mt-2 p-3 w-full ${errors.email ? "border border-red-500" : ""
                }`}
              onChange={handleChange}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}

            {/* PASSWORD */}
            <label className="text-sm font-medium text-gray-700 mt-4 block">Set a Password*</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your RekerPay Password"
                className={`input-field p-3 w-full ${errors.password ? "border border-red-500" : ""
                  }`}
                onChange={(e) => {
                  handleChange(e);
                  checkPasswordStrength(e.target.value);
                }}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* PASSWORD STRENGTH METER */}
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
                <p
                  className={`text-xs mt-1 ${passwordStrength.level === "Weak Password"
                    ? "text-red-600"
                    : passwordStrength.level === "Medium Strength"
                      ? "text-yellow-600"
                      : "text-green-600"
                    }`}
                >
                  {passwordStrength.level}
                </p>
              </div>
            )}

            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}

            {/* PHONE */}
            <label className="text-sm font-medium text-gray-700 mt-4 block">Mobile*</label>
            <div className="flex mt-2">
              <div className="inline-flex items-center px-3 border border-r-0 bg-gray-100 rounded-l">
                +91
              </div>
              <input
                type="text"
                name="phone"
                placeholder="Enter your 10 digit mobile number"
                className={`input-field p-3 w-full rounded-none rounded-r ${errors.phone ? "border border-red-500" : ""
                  }`}
                onChange={handleChange}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}

            {/* BUTTON */}
            <button
              onClick={handleSignup}
              className="mt-8 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold"
            >
              SEND OTP & CREATE ACCOUNT
            </button>

            <p className="text-xs text-gray-500 mt-4">
              By signing up, you agree to our{" "}
              <span className="underline">Terms & Conditions</span> and{" "}
              <span className="underline">Privacy Policy</span>.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
