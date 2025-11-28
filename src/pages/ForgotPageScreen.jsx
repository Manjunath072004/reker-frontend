import { useState } from "react";
import { useNavigate } from "react-router-dom";
import rekerPayLogo from "../assets/Reker-logo.png";
import loginBg from "../assets/reker_login_image.jpeg";
import API from "../api/axios"; // Your Axios instance
import { checkEmailRegistered } from "../api/auth";

export default function ForgotPasswordScreen() {
    const [form, setForm] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleResetPassword = async () => {
        const { email, newPassword, confirmPassword } = form;

        if (!email || !newPassword || !confirmPassword) {
            alert("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New Password and Confirm Password must match");
            return;
        }

        try {
            // Check if email exists
            const res = await checkEmailRegistered({ email });
            // Note: Backend should have a check-email endpoint returning { exists: true/false, phone }

            if (!res.data.exists) {
                alert("Email not registered");
                return;
            }

            // If email exists, navigate to OTP verify page
            navigate("/otp-verify", {
                state: { phone: res.data.phone, mode: "reset-password", email, newPassword },
            });

        } catch (err) {
            console.error("RESET PASSWORD ERROR:", err);
            alert("Server error while checking email");
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
                    <h1 className="text-4xl font-bold mt-6 leading-snug">
                        Powering Businesses. <br /> Touching Lives.
                    </h1>
                </div>
            </div>


            {/* RIGHT FORM CARD */}
            <div className="w-1/2 flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-lg p-10 w-[430px] relative">

                    {/* WELCOME TEXT */}
                    <p className="text-sm text-gray-500 mb-1 text-left">
                        Welcome to!
                    </p>

                    {/* REKERPAY TEXT - GOLD + GREEN GRADIENT */}
                    <div className="flex justify-start mb-6"> <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-500 to-green-600 bg-clip-text text-transparent tracking-wide">
                        RekerPay </h1>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-6 text-left">
                        Reset Your Password
                    </h2>

                    {/* EMAIL */}
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your registered email"
                        className="input-field p-3 w-full mb-4"
                        onChange={handleChange}
                    />

                    {/* NEW PASSWORD */}
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative mt-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            placeholder="Enter new password"
                            className="input-field p-3 w-full mb-4"
                            onChange={handleChange}
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer text-gray-600"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        className="input-field p-3 w-full mb-4"
                        onChange={handleChange}
                    />
                    

                    {/* RESET PASSWORD BUTTON */}
                    <button
                        onClick={handleResetPassword}
                        className="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold"
                    >
                        Reset Password
                    </button>

                    <p className="text-sm text-center mt-4 text-gray-600">
                        Remembered your password?{" "}
                        <span
                            className="text-green-600 underline cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
