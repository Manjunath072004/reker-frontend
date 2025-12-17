import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function SettingsView({ merchant }) {
  const { token, logout } = useContext(AuthContext);

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

  /* 🔐 CHANGE PASSWORD */
  const [passwords, setPasswords] = useState({
    new_password: "",
    confirm_password: "",
  });

  /* ☠️ DANGER ZONE */
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  /* ---------------- PREFILL DATA ---------------- */
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
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ---------------- SAVE SETTINGS ---------------- */
  const saveSettings = async () => {
    setSaving(true);
    setMessage("");

    try {
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
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- CHANGE PASSWORD ---------------- */
  const updatePassword = async () => {
    if (passwords.new_password !== passwords.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    try {
      await API.post("/auth/reset-password/", {
        phone: merchant.phone,
        new_password: passwords.new_password,
      });

      alert("✅ Password updated successfully");
      setPasswords({ new_password: "", confirm_password: "" });
    } catch (err) {
      alert("❌ Failed to update password");
    }
  };

  /* ---------------- DELETE ACCOUNT ---------------- */
  const deleteAccount = async () => {
    try {
      await API.delete(`/merchants/${merchant.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      logout();
      window.location.href = "/login";
    } catch (err) {
      alert("❌ Failed to delete account");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Settings</h3>

      {/* BUSINESS PROFILE */}
      <Section title="Business Profile Settings">
        <Input label="Business Name" name="business_name" value={form.business_name} onChange={handleChange} />
        <Input label="Merchant ID" value={merchant?.id} disabled />
        <Input label="Contact Email" name="email" value={form.email} onChange={handleChange} />
        <Input label="Contact Phone" name="phone" value={form.phone} onChange={handleChange} />
        <Textarea label="Address" name="address" value={form.address} onChange={handleChange} />
      </Section>

      {/* PAYMENT SETTINGS */}
      <Section title="Payment Settings">
        <Checkbox label="Auto Settlement" name="auto_settlement" checked={form.auto_settlement} onChange={handleChange} />
        <Select
          label="Settlement Cycle"
          name="settlement_cycle"
          value={form.settlement_cycle}
          onChange={handleChange}
          options={["T+1", "T+2", "INSTANT"]}
        />
        <Checkbox label="SMS Notifications" name="notification_sms" checked={form.notification_sms} onChange={handleChange} />
        <Input label="Notification Email" name="notification_email" value={form.notification_email} onChange={handleChange} />
      </Section>

      {/* BANK DETAILS */}
      <Section title="Bank Account Settings">
        <Input label="Account Holder Name" name="holder_name" value={form.holder_name} onChange={handleChange} />
        <Input label="Bank Name" name="bank_name" value={form.bank_name} onChange={handleChange} />
        <Input label="Account Number" name="account_number" value={form.account_number} onChange={handleChange} />
        <Input label="IFSC Code" name="ifsc" value={form.ifsc} onChange={handleChange} />
      </Section>

      {/* 🔐 CHANGE PASSWORD */}
      <Section title="Security – Change Password">
        <Input
          type="password"
          label="New Password"
          value={passwords.new_password}
          onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
        />
        <Input
          type="password"
          label="Confirm Password"
          value={passwords.confirm_password}
          onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
        />
        <button onClick={updatePassword} className="bg-red-600 text-white px-4 py-2 rounded">
          Update Password
        </button>
      </Section>

      {/* ☠️ DANGER ZONE */}
      <Section title="Danger Zone">
        <p className="text-sm text-red-600">
          Deleting your account is irreversible. All data will be permanently removed.
        </p>

        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="bg-red-700 text-white px-4 py-2 rounded">
            Delete Account
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={deleteAccount} className="bg-red-800 text-white px-4 py-2 rounded">
              Confirm Delete
            </button>
            <button onClick={() => setConfirmDelete(false)} className="border px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        )}
      </Section>

      {/* SAVE SETTINGS */}
      <div className="mt-6">
        <button onClick={saveSettings} disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded">
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Section({ title, children }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-6 space-y-4">
      <h4 className="font-semibold">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input {...props} className="w-full border rounded px-3 py-2 mt-1" />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="md:col-span-2">
      <label className="text-sm text-gray-600">{label}</label>
      <textarea {...props} className="w-full border rounded px-3 py-2 mt-1" />
    </div>
  );
}

function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <select {...props} className="w-full border rounded px-3 py-2 mt-1">
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
