export default function SettingsView({ merchant }) {
  return (
    <div>
      <h3 className="text-xl font-semibold">Settings</h3>

      <div className="bg-white p-4 rounded shadow mt-4 space-y-3">
        <p className="text-sm">Business Name: {merchant?.business_name}</p>
        <p className="text-sm">Phone: {merchant?.phone}</p>
        <p className="text-sm text-gray-500">More settings coming soon…</p>
      </div>
    </div>
  );
}
