import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    phone: "",
    password: "",
    full_name: "",
    email: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const response = await signup(form);

      alert("OTP sent to your mobile");

      navigate("/otp-verify", { state: { phone: form.phone } });
    } catch (err) {
      alert("Signup Failed");
      console.log(err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Account</h1>

       <input
        type="text"
        name="phone"
        placeholder="Phone"
        className="border p-2 w-full mt-3"
        onChange={handleChange}
      />

       <input
        type="password"
        name="password"
        placeholder="Password"
        className="border p-2 w-full mt-3"
        onChange={handleChange}
      />
     <input
        type="text"
        name="full_name"
        placeholder="Full Name"
        className="border p-2 w-full mt-3"
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="border p-2 w-full mt-3"
        onChange={handleChange}
      />

      <button
        onClick={handleSignup}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Signup
      </button>
    </div>
  );
}

