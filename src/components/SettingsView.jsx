import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Banknote,
  Store,
  Bell,
  Trash2,
  Save,
} from "lucide-react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function SettingsView({ merchant }) {
  const { token, logout } = useContext(AuthContext);

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

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-gray-500">
          Manage your business, payments & security
        </p>
      </div>

      {/* BUSINESS */}
      <GlassSection title="Business Profile" icon={<Store size={18} />}>
        <Input label="Business Name" name="business_name" value={form.business_name} onChange={handleChange} />
        <Input label="Merchant ID" value={merchant?.id} disabled />
        <Input label="Contact Email" name="email" value={form.email} onChange={handleChange} />
        <Input label="Contact Phone" name="phone" value={form.phone} onChange={handleChange} />
        <Textarea label="Address" name="address" value={form.address} onChange={handleChange} />
      </GlassSection>

      {/* PAYMENTS */}
      <GlassSection title="Payment & Notifications" icon={<Bell size={18} />}>
        <ToggleSwitch
          label="Auto Settlement"
          checked={form.auto_settlement}
          onChange={(v) => setForm({ ...form, auto_settlement: v })}
        />

        <Select
          label="Settlement Cycle"
          name="settlement_cycle"
          value={form.settlement_cycle}
          onChange={handleChange}
          options={["T+1", "T+2", "INSTANT"]}
        />

        <ToggleSwitch
          label="SMS Notifications"
          checked={form.notification_sms}
          onChange={(v) => setForm({ ...form, notification_sms: v })}
        />

        <Input label="Notification Email" name="notification_email" value={form.notification_email} onChange={handleChange} />
      </GlassSection>

      {/* BANK */}
      <GlassSection title="Bank Account" icon={<Banknote size={18} />}>
        <Input label="Account Holder Name" name="holder_name" value={form.holder_name} onChange={handleChange} />
        <Input label="Bank Name" name="bank_name" value={form.bank_name} onChange={handleChange} />
        <Input label="Account Number" name="account_number" value={form.account_number} onChange={handleChange} />
        <Input label="IFSC Code" name="ifsc" value={form.ifsc} onChange={handleChange} />
      </GlassSection>

      {/* SECURITY */}
      <GlassSection title="Security" icon={<ShieldAlert size={18} />}>
        <Input type="password" label="New Password"
          value={passwords.new_password}
          onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
        />
        <Input type="password" label="Confirm Password"
          value={passwords.confirm_password}
          onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
        />
        <button
          onClick={updatePassword}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Update Password
        </button>
      </GlassSection>

      {/* DANGER */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="border border-red-200 bg-red-50 rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
          <Trash2 size={18} /> Danger Zone
        </div>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Delete Account
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={deleteAccount} className="bg-red-700 text-white px-4 py-2 rounded-lg">
              Confirm Delete
            </button>
            <button onClick={() => setConfirmDelete(false)} className="border px-4 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        )}
      </motion.div>

      {/* SAVE */}
      <button
        onClick={saveSettings}
        disabled={saving}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl flex items-center gap-2"
      >
        <Save size={18} />
        {saving ? "Saving..." : "Save Changes"}
      </button>

      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function GlassSection({ title, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        boxShadow: "0 20px 30px rgba(0,0,0,0.08)",
      }}
      className="
        bg-white/80 backdrop-blur-xl
        border border-gray-100
        rounded-2xl shadow-lg
        p-6 space-y-4
        transition
      "
    >
      <div className="flex items-center gap-2 font-semibold">
        {icon} {title}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </motion.div>
  );
}

/* ---- TOGGLE SWITCH ---- */
function ToggleSwitch({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition
          ${checked ? "bg-green-500" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition
            ${checked ? "translate-x-6" : ""}`}
        />
      </button>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input {...props} className="w-full mt-1 px-3 py-2 border rounded-lg" />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="md:col-span-2">
      <label className="text-xs text-gray-500">{label}</label>
      <textarea {...props} className="w-full mt-1 px-3 py-2 border rounded-lg" />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <select {...props} className="w-full mt-1 px-3 py-2 border rounded-lg">
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
