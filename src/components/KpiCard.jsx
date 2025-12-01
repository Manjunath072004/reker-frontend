export default function KpiCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      <div className="text-xs text-gray-400 mt-2">Compared to last period</div>
    </div>
  );
}
