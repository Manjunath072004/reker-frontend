import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import {
  Store,
  Bell,
  Banknote,
  ShieldAlert,
  Trash2,
  Save,
} from "lucide-react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const sections = [
  { id: "business", label: "Business Profile", icon: <Store size={20} /> },
  { id: "payments", label: "Payments & Notifications", icon: <Bell size={20} /> },
  { id: "bank", label: "Bank Account", icon: <Banknote size={20} /> },
  { id: "security", label: "Security", icon: <ShieldAlert size={20} /> },
  { id: "danger", label: "Danger Zone", icon: <Trash2 size={20} /> },
];

export default function SettingsView({ merchant }) {
  const { token, logout } = useContext(AuthContext);

  const [activeSection, setActiveSection] = useState("business");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    business_name: "",
    phone: "",
    email: "",
    address: "",
    auto_settlement: true,
    settlement_cycle: "T+1",
    notification_sms: true,
    notification_email: "",
    bank_name: "",
    account_number: "",
    ifsc: "",
    holder_name: "",
  });

  const [passwords, setPasswords] = useState({
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (!merchant) return;
    setForm({
      business_name: merchant.business_name || "",
      phone: merchant.phone || "",
      email: merchant.email || "",
      address: merchant.address || "",
      auto_settlement: merchant.settings?.auto_settlement ?? true,
      settlement_cycle: merchant.settings?.settlement_cycle || "T+1",
      notification_sms: merchant.settings?.notification_sms ?? true,
      notification_email: merchant.settings?.notification_email || "",
      bank_name: merchant.bank_accounts?.[0]?.bank_name || "",
      account_number: merchant.bank_accounts?.[0]?.account_number || "",
      ifsc: merchant.bank_accounts?.[0]?.ifsc || "",
      holder_name: merchant.bank_accounts?.[0]?.name || "",
    });
  }, [merchant]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage("");
      await API.put(
        `/merchants/${merchant.id}/`,
        {
          business_name: form.business_name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          settings: {
            auto_settlement: form.auto_settlement,
            settlement_cycle: form.settlement_cycle,
            notification_sms: form.notification_sms,
            notification_email: form.notification_email,
          },
          bank_accounts: [
            {
              name: form.holder_name,
              bank_name: form.bank_name,
              account_number: form.account_number,
              ifsc: form.ifsc,
              is_primary: true,
            },
          ],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Settings updated successfully");
    } catch {
      setMessage("❌ Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    if (passwords.new_password !== passwords.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    await API.post("/auth/reset-password/", {
      phone: merchant.phone,
      new_password: passwords.new_password,
    });
    alert("✅ Password updated");
    setPasswords({ new_password: "", confirm_password: "" });
  };

  const deleteAccount = async () => {
    await API.delete(`/merchants/${merchant.id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logout();
    window.location.href = "/login";
  };

  /* ------------------ Render Section Content ------------------ */
  const renderSection = () => {
    switch (activeSection) {
      case "business":
        return (
          <Card>
            <Input label="Business Name" name="business_name" value={form.business_name} onChange={handleChange} />
            <Input label="Merchant ID" value={merchant?.id} disabled />
            <Input label="Contact Email" name="email" value={form.email} onChange={handleChange} />
            <Input label="Contact Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Textarea label="Address" name="address" value={form.address} onChange={handleChange} />
          </Card>
        );
      case "payments":
        return (
          <Card>
            <ToggleSwitch label="Auto Settlement" checked={form.auto_settlement} onChange={(v) => setForm({ ...form, auto_settlement: v })} />
            <Select label="Settlement Cycle" name="settlement_cycle" value={form.settlement_cycle} onChange={handleChange} options={["T+1", "T+2", "INSTANT"]} />
            <ToggleSwitch label="SMS Notifications" checked={form.notification_sms} onChange={(v) => setForm({ ...form, notification_sms: v })} />
            <Input label="Notification Email" name="notification_email" value={form.notification_email} onChange={handleChange} />
          </Card>
        );
      case "bank":
        return (
          <Card>
            <Input label="Account Holder Name" name="holder_name" value={form.holder_name} onChange={handleChange} />
            <Input label="Bank Name" name="bank_name" value={form.bank_name} onChange={handleChange} />
            <Input label="Account Number" name="account_number" value={form.account_number} onChange={handleChange} />
            <Input label="IFSC Code" name="ifsc" value={form.ifsc} onChange={handleChange} />
          </Card>
        );
      case "security":
        return (
          <Card>
            <Input type="password" label="New Password" value={passwords.new_password} onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })} />
            <Input type="password" label="Confirm Password" value={passwords.confirm_password} onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })} />
            <button onClick={updatePassword} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition">
              Update Password
            </button>
          </Card>
        );
      case "danger":
        return (
          <Card danger>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition">
                Delete Account
              </button>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <button onClick={deleteAccount} className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg font-semibold transition">
                  Confirm Delete
                </button>
                <button onClick={() => setConfirmDelete(false)} className="border px-6 py-2 rounded-lg font-semibold transition">
                  Cancel
                </button>
              </div>
            )}
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="md:w-64 bg-white border-r border-gray-200 shadow-sm px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
        <nav className="flex flex-col gap-3">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-left font-medium transition
                ${activeSection === sec.id ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {sec.icon} {sec.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 md:p-12 space-y-6">
        {renderSection()}

        {/* Save Button */}
        {activeSection !== "danger" && (
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              <Save size={20} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {message && <p className="text-sm text-gray-700">{message}</p>}
      </main>
    </div>
  );
}

/* ------------------ UI Components ------------------ */
function Card({ children, danger }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 15px 25px rgba(0,0,0,0.08)" }}
      className={`bg-white p-6 rounded-2xl border shadow-sm transition ${danger ? "border-red-200 bg-red-50" : "border-gray-100"}`}
    >
      {children}
    </motion.div>
  );
}

function ToggleSwitch({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm text-gray-600">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition ${checked ? "bg-green-500" : "bg-gray-300"}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${checked ? "translate-x-6" : ""}`} />
      </button>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      <input {...props} className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none transition" />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      <textarea {...props} className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none transition" />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div className="mb-4">
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      <select {...props} className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none transition">
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
