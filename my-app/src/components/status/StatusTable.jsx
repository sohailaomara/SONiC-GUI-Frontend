export default function StatusTable({ name, status }) {
  const statusColor =
    status === "UP"
      ? "text-green-600"
      : status === "DOWN"
        ? "text-red-600"
        : "text-gray-600";

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full max-w-xs">
      <div className="text-sm text-gray-500">Interface</div>
      <div className="text-lg font-semibold">{name}</div>
      <div className={`mt-2 font-bold ${statusColor}`}>{status}</div>
    </div>
  );
}
