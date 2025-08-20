import { Thermometer } from "lucide-react";

export default function Temperature() {
  // Example temperature values
  const temps = [
    { label: "CPU", value: 70 },
    { label: "System", value: 55 },
    { label: "Ambient", value: 40 },
  ];

  const maxTemp = 100; // scaling reference

  // Decide color based on temperature thresholds
  const getColor = (val) => {
    const percent = val / maxTemp;
    if (percent <= 0.4) return "bg-green-500";
    if (percent < 0.7) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Thermometer className="text-orange-500" /> Temperature
      </h2>

      <div className="grid grid-cols-3 gap-6">
        {temps.map((t, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-6 h-32 bg-gray-200 rounded-full relative overflow-hidden">
              <div
                className={`${getColor(t.value)} absolute bottom-0 w-full rounded-full`}
                style={{ height: `${(t.value / maxTemp) * 100}%` }}
              ></div>
            </div>
            <span className="mt-2 text-sm font-medium text-gray-600">
              {t.label}
            </span>
            <span className="text-xs text-gray-500">{t.value}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
}
