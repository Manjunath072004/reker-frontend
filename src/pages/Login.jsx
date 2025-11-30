import { useState, useContext  } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import rekerPayLogo from "../assets/Reker-logo.png";
import loginBg from "../assets/reker_login_image.jpeg";
import { checkPhoneRegistered } from "../api/auth";
import { AuthContext } from "../context/AuthContext";


export default function Login() {
  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { saveToken } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const handleLoginUsingOtp = async () => {
    if (!form.phone || form.phone.length !== 10) {
      alert("Please enter your 10 digit phone number");
      return;
    }

    try {
      // 🔥 CALL CHECK PHONE API
      const res = await checkPhoneRegistered({ phone: form.phone });

      // 🔥 If phone exists → go to OTP page
      if (res.data.exists === true) {
        navigate("/otp-verify", {
          state: { phone: form.phone, mode: "login" },
        });
      } else {
        alert("Phone number not registered. Please sign up.");
      }

    } catch (err) {
      console.error("CHECK PHONE ERROR:", err);
      alert("Server error while checking phone number");
    }
  };


  const handleLogin = async () => {
    try {
      const res = await login(form);
      console.log("LOGIN RESPONSE:", res.data);
      const token = res.data?.tokens?.access;

       if (!token) {
        alert("Login failed: No token received from backend.");
        return;
      }
      saveToken(token);
      navigate("/merchant-dashboard");
    } catch (err) {
      console.log("💥 FULL ERROR OBJECT:", err);

      if (err.response) {
        console.log("💥 BACKEND STATUS:", err.response.status);
        console.log("💥 BACKEND ERROR DATA:", err.response.data);

        alert(
          err.response.data?.message ||
          err.response.data?.detail ||
          JSON.stringify(err.response.data) ||
          "Login Failed (Server Error)"
        );
      } else {
        console.log("💥 NO RESPONSE FROM SERVER");
        alert("Network error — Backend not reachable");
      }
    }

  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* LEFT SIDE IMAGE */}
      <div className="w-1/2 relative">
        <img
          src={loginBg}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-10 left-10">
          <img src={rekerPayLogo} className="h-20" />
        </div>

        <div className="absolute bottom-20 left-14 text-white max-w-lg">
          <p className="text-sm bg-yellow-400 px-3 py-1 text-black w-max">
            EVENT UPDATE
          </p>

          <h1 className="text-4xl font-bold mt-6 leading-snug">
            Powering Businesses. <br /> Touching Lives.
          </h1>

          <p className="mt-6 text-lg opacity-90">
            Supercharge your business growth with RekerPay
          </p>

          <button className="mt-6 text-white underline text-sm">
            MORE DETAILS &gt;
          </button>
        </div>
      </div>

      {/* RIGHT LOGIN CARD */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-10 w-[430px] relative">

          <div className="absolute left-0 top-0 h-full w-14 dotted-grid opacity-40 pointer-events-none"></div>

          {/* WELCOME TEXT */}
          <p className="text-sm text-gray-500 mb-1 text-left">
            Welcome to!
          </p>

          {/* REKERPAY TEXT - GOLD + GREEN GRADIENT */}
          <div className="flex justify-start mb-6"> <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-500 to-green-600 bg-clip-text text-transparent tracking-wide">
            RekerPay </h1>
          </div>

          {/* NEW PAGE TITLE */}
          <h2 className="text-lg font-semibold text-gray-800 mb-6 text-left">
            Get started with Your Phone Number
          </h2>

          {/* PHONE FIELD */}
          <label className="text-sm font-medium text-gray-700">Phone Number</label>

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

          {/* PASSWORD FIELD */}
          <label className="text-sm font-medium text-gray-700 mt-4 block">
            Password
          </label>

          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your RekerPay Password"
              className="input-field p-3 w-full"
              onChange={handleChange}
            />

            {/* Eye Icon */}
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* LINKS */}
          <div className="flex justify-between mt-3 text-sm">
            <span
              className="text-green-600 cursor-pointer underline"
              onClick={handleLoginUsingOtp}
            >
              Login using OTP
            </span>

            <span
              className="text-green-600 cursor-pointer underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password
            </span>

          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            className="mt-8 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold"
          >
            LOGIN
          </button>

          {/* SIGNUP LINK */}
          <p className="text-sm text-center mt-4 text-gray-600">
            Don’t have an account with RekerPay?{" "}
            <span
              className="text-green-600 underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
