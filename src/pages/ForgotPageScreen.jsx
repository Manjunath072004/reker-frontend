import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";


import rekerPayLogo from "../assets/Reker-logo.png";
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
        <>
            <div className="relative min-h-screen flex bg-gradient-to-br from-green-50 to-white overflow-hidden px-6 py-12">
                {/* Top Left Logo */}
                <img
                    src={rekerPayLogo}
                    className="h-16 absolute top-6 left-[70px] z-20"
                />

                {/* Decorative Blobs */}
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

                <div className="flex w-full max-w-7xl gap-12 relative z-10 mx-auto">

                    {/* ---------------- LEFT PANEL ---------------- */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        className="flex-[0.6] flex flex-col justify-center px-8 lg:px-14"
                    >
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">
                            Secure Your Account
                        </h3>

                        <ul className="space-y-6 text-gray-700 text-lg">
                            <li className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">🔒</div>
                                <p>Reset your password safely using OTP verification.</p>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">💡</div>
                                <p>Choose a strong password to protect your account.</p>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">⚡</div>
                                <p>Quickly regain access and continue managing payments.</p>
                            </li>
                        </ul>

                        <div className="mt-16 text-center">
                            <img
                                src="https://img.icons8.com/fluency/300/password.png"
                                alt="Password Security"
                                className="h-36 mx-auto"
                            />
                            <p className="mt-4 text-gray-500 text-sm">
                                Strong passwords keep your business and customers safe.
                            </p>
                        </div>
                    </motion.div>

                    {/* ---------------- RIGHT FORM CARD ---------------- */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex-[0.4] flex flex-col"
                    >
                        <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl shadow-xl p-10 w-full">
                            <p className="text-sm text-gray-600">Reset your password</p>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent mt-2 mb-4">
                                RekerPay
                            </h1>
                            <p className="text-sm text-gray-700 mb-6">
                                Remembered your password?{" "}
                                <span className="text-green-700 underline cursor-pointer" onClick={() => navigate("/login")}>
                                    Login
                                </span>
                            </p>

                            {/* EMAIL */}
                            <label className="text-sm font-medium text-gray-700">Email*</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your registered email"
                                onChange={handleChange}
                                className={`mt-2 p-3 w-full rounded-xl bg-white/70 backdrop-blur border ${errors.email ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-400 outline-none`}
                            />
                            {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}

                            {/* NEW PASSWORD */}
                            <label className="text-sm font-medium text-gray-700 mt-4 block">New Password*</label>
                            <div className="relative mt-2">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    onChange={handleChange}
                                    className={`p-3 w-full rounded-xl bg-white/70 backdrop-blur border ${errors.newPassword ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-400 outline-none`}
                                />
                                <span
                                    className="absolute right-3 top-3 cursor-pointer text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </span>
                            </div>

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
                                        />
                                    </div>
                                    <p className="text-xs mt-1">{passwordStrength.level}</p>
                                </div>
                            )}
                            {errors.newPassword && <p className="text-xs text-red-600 mt-1">{errors.newPassword}</p>}

                            {/* CONFIRM PASSWORD */}
                            <label className="text-sm font-medium text-gray-700 mt-4 block">Confirm Password*</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                onChange={handleChange}
                                className={`mt-2 p-3 w-full rounded-xl bg-white/70 backdrop-blur border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-400 outline-none`}
                            />
                            {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}

                            {/* RESET BUTTON */}
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={handleResetPassword}
                                className="mt-8 w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition"
                            >
                                SEND OTP & RESET PASSWORD
                            </motion.button>
                        </div>
                    </motion.div>

                </div>
            </div>
            <Footer />
        </>
    );
}
