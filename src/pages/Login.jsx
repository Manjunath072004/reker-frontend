import { useState, useContext } from "react";
import { login, checkPhoneRegistered } from "../api/auth";
import { useNavigate } from "react-router-dom";
import rekerPayLogo from "../assets/Reker-logo.png";
import loginBg from "../assets/reker_login_image.jpeg";
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

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // clear specific field error
  };

  // ---------------- LOGIN FORM VALIDATION --------------
  const validateLoginForm = () => {
    let newErrors = {};

    const phone = form.phone.trim();
    const password = form.password.trim();

    // PHONE VALIDATION
    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    // PASSWORD VALIDATION
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ---------------- LOGIN USING OTP ----------------
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

  // ---------------- NORMAL LOGIN ----------------
  const handleLogin = async () => {
    if (!validateLoginForm()) return; // stop if errors exist

    try {
      const res = await login(form);
      const token = res.data?.tokens?.access;

      if (!token) {
        alert("Login failed: No token received from server.");
        return;
      }

      saveToken(token);

      //  SHOW SUCCESS MESSAGE
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
    <div className="min-h-screen flex bg-white">

      {/* LEFT SIDE IMAGE */}
      <div className="w-1/2 relative">
        <img src={loginBg} className="w-full h-full object-cover" />

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
          <p className="text-sm text-gray-500 mb-1 text-left">Welcome to!</p>

          <div className="flex justify-start mb-6">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-500 to-green-600 bg-clip-text text-transparent tracking-wide">
              RekerPay
            </h1>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-6 text-left">
            Get started with Your Phone Number
          </h2>

          {/* PHONE FIELD */}
          <label className="text-sm font-medium text-gray-700">Phone Number</label>
          <div className="flex mt-2">
            <div className="inline-flex items-center px-3 border border-r-0 bg-gray-100 rounded-l">+91</div>
            <input
              type="text"
              name="phone"
              placeholder="Enter your 10 digit mobile number"
              className={`input-field p-3 w-full rounded-none rounded-r ${errors.phone ? "border border-red-500" : ""
                }`}
              onChange={handleChange}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
          )}

          {/* PASSWORD FIELD */}
          <label className="text-sm font-medium text-gray-700 mt-4 block">
            Password
          </label>

          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your RekerPay Password"
              className={`input-field p-3 w-full ${errors.password ? "border border-red-500" : ""
                }`}
              onChange={handleChange}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">
              {errors.password}
            </p>
          )}

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
