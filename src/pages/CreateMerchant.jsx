import { useState } from "react";
import { createMerchant } from "../api/merchants";

export default function CreateMerchant() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    business_type: "",
    gst_number: ""
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await createMerchant(form, token);
      alert("Merchant Created Successfully!");
      console.log(res.data);
    } catch (err) {
      alert("Failed to create merchant");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Create Merchant</h2>

      <input
        className="border p-2 w-full mt-3"
        placeholder="Business Name"
        name="name"
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full mt-3"
        placeholder="Address"
        name="address"
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full mt-3"
        placeholder="Business Type"
        name="business_type"
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full mt-3"
        placeholder="GST Number"
        name="gst_number"
        onChange={handleChange}
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Merchant
      </button>
    </div>
  );
}