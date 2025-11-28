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

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSignup = async () => {
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
          {/* LOGO */}
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

          {/* SCROLLING LOGO SLIDER */}
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
        <div className="flex flex-col w-96 overflow-y-auto pb-10">
          <div className="bg-white signup-card p-8 relative w-full shadow-sm rounded">

            {/* DOT GRID */}
            <div className="absolute left-0 top-0 h-full w-14 dotted-grid pointer-events-none" />

            {/* WELCOME TEXT */}
            <p className="text-sm text-gray-500 mb-1 text-left">Welcome to!</p>

            {/* GRADIENT BRAND TEXT */}
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
              className="input-field mt-2 p-3 w-full"
              onChange={handleChange}
            />

            {/* PASSWORD */}
            <label className="text-sm font-medium text-gray-700 mt-4 block">Set a Password*</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your RekerPay Password"
                className="input-field p-3 w-full"
                onChange={handleChange}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

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
                className="input-field p-3 w-full rounded-none rounded-r"
                onChange={handleChange}
              />
            </div>

            {/* SUBMIT */}
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
