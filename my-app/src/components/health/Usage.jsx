import { Cpu } from "lucide-react";

export default function Usage() {
  const temps = [
    { label: "CPU", value: 70 },
    { label: "Memory", value: 55 },
  ];

  const maxTemp = 100;

  const getColor = (val) => {
    const percent = val / maxTemp;
    if (percent <= 0.4) return "bg-green-500";
    if (percent < 0.7) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Cpu className="text-orange-500" /> Usage
      </h2>

      <div className="space-y-3">
        {temps.map((t, i) => (
          <div key={i}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {t.label}
              </span>
              <span className="text-sm text-gray-500">{t.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-5">
              <div
                className={`${getColor(t.value)} h-5 rounded-full`}
                style={{ width: `${(t.value / maxTemp) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
