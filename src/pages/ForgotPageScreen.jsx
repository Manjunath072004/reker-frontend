import { useState } from "react";
import { useNavigate } from "react-router-dom";
import rekerPayLogo from "../assets/Reker-logo.png";
import loginBg from "../assets/reker_login_image.jpeg";
import { checkEmailRegistered } from "../api/auth";

export default function ForgotPasswordScreen() {
    const [form, setForm] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        level: "",
        color: "",
    });

    const navigate = useNavigate();

    // ---------------- HANDLE CHANGE ----------------
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // clear error

        if (name === "newPassword") checkPasswordStrength(value);
    };

    // ---------------- PASSWORD STRENGTH CHECK ----------------
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

    // ---------------- EMAIL VALIDATION ----------------
    const validateEmail = (email) => {
        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
        const invalid = [
            /^[^@]+@[^@]+@/,
            /\.\./,
            /^[@.]/,
            /[@.]$/,
        ];
        return emailRegex.test(email) && !invalid.some((p) => p.test(email));
    };

    // ---------------- PASSWORD VALIDATION ----------------
    const validatePassword = (password) => {
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\\\/~]/.test(password);
        const longEnough = password.length >= 8;

        const weakWords = ["password", "123456", "qwerty", "111111", "abc123"];

        const repeating = /^([a-zA-Z0-9])\1+$/.test(password);
        const sequential =
            "1234567890".includes(password) ||
            "abcdefghijklmnopqrstuvwxyz".includes(password.toLowerCase());

        return (
            hasUpper &&
            hasLower &&
            hasNumber &&
            hasSpecial &&
            longEnough &&
            !weakWords.includes(password.toLowerCase()) &&
            !repeating &&
            !sequential
        );
    };

    // ---------------- VALIDATION ----------------
    const validateForm = () => {
        const { email, newPassword, confirmPassword } = form;
        let newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(email.trim())) {
            newErrors.email = "Enter a valid email address";
        }

        if (!newPassword.trim()) {
            newErrors.newPassword = "New Password is required";
        } else if (!validatePassword(newPassword.trim())) {
            newErrors.newPassword =
                "Password must be 8+ chars with uppercase, lowercase, number & symbol.";
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm your password";
        } else if (newPassword.trim() !== confirmPassword.trim()) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ---------------- RESET PASSWORD ----------------
    const handleResetPassword = async () => {
        if (!validateForm()) return;

        const { email, newPassword } = form;

        try {
            // SHOW PROCESS MESSAGE
            alert("Checking email, please wait...");

            const res = await checkEmailRegistered({ email });

            if (!res.data.exists) {
                setErrors((prev) => ({
                    ...prev,
                    email: "Email is not registered"
                }));
                return;
            }

            // SUCCESS MESSAGE
            alert("OTP sent! Please verify to reset your password.");

            navigate("/otp-verify", {
                state: {
                    phone: res.data.phone,
                    mode: "reset-password",
                    email,
                    newPassword,
                },
            });

        } catch (err) {
            console.error("RESET PASSWORD ERROR:", err);
            alert("Server error while checking email. Try again.");
        }
    };


    return (
        <div className="min-h-screen flex bg-white">

            {/* LEFT IMAGE */}
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

                    <p className="text-sm text-gray-500 mb-1 text-left">Welcome to!</p>

                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-500 to-green-600 bg-clip-text text-transparent tracking-wide mb-6">
                        RekerPay
                    </h1>

                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                        Reset Your Password
                    </h2>

                    {/* EMAIL */}
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your registered email"
                        className={`input-field p-3 w-full mb-1 ${errors.email ? "border border-red-500" : ""
                            }`}
                        onChange={handleChange}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-600 mb-2">{errors.email}</p>
                    )}

                    {/* NEW PASSWORD */}
                    <label className="text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <div className="relative mt-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            placeholder="Enter new password"
                            className={`input-field p-3 w-full mb-1 ${errors.newPassword ? "border border-red-500" : ""
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

                    {/* PASSWORD STRENGTH METER */}
                    {form.newPassword && (
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

                    {errors.newPassword && (
                        <p className="text-xs text-red-600 mb-2">{errors.newPassword}</p>
                    )}

                    {/* CONFIRM PASSWORD */}
                    <label className="text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        className={`input-field p-3 w-full mb-1 ${errors.confirmPassword ? "border border-red-500" : ""
                            }`}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-600 mb-4">
                            {errors.confirmPassword}
                        </p>
                    )}

                    {/* RESET BUTTON */}
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
