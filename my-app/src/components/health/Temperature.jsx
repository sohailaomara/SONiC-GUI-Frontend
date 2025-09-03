import { Thermometer } from "lucide-react";

export default function Temperature() {
  const temps = [
    { label: "CPU", value: 70 },
    { label: "GPU", value: 68 },
    { label: "System", value: 55 },
    { label: "Ambient", value: 40 },
    { label: "PSU", value: 62 },
    { label: "NVMe", value: 58 },
  ];

  const maxTemp = 100;

  const getColor = (val) => {
    const percent = val / maxTemp;
    if (percent <= 0.4) return "bg-green-500";
    if (percent < 0.7) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full p-3 bg-white rounded-xl shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-1">
        <Thermometer className="text-orange-500 w-4 h-4" /> Temperature
      </h2>

      <div className="grid grid-cols-3 gap-2">
        {temps.map((t, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-4 h-16 bg-gray-200 rounded-full relative overflow-hidden">
              <div
                className={`${getColor(t.value)} absolute bottom-0 w-full rounded-full`}
                style={{ height: `${(t.value / maxTemp) * 100}%` }}
              ></div>
            </div>
            <span className="mt-1 text-xs font-medium text-gray-600">
              {t.label}
            </span>
            <span className="text-xs text-gray-500">{t.value}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
}