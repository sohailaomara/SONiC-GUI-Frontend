import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";

export default function Usage() {
  const [usageData, setUsageData] = useState([
    { label: "CPU", value: 0 },
    { label: "Memory", value: 0 },
  ]);

  const maxVal = 100; // percentage scale

  // Pick color depending on usage %
  const getColor = (val) => {
    const percent = val / maxVal;
    if (percent <= 0.4) return "bg-green-500";
    if (percent < 0.7) return "bg-orange-500";
    return "bg-red-500";
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    const ws = new WebSocket(`ws://localhost:8000/switch/status/${username}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (
          data.cpu_used_percent !== undefined &&
          data.memory_used_percent !== undefined
        ) {
          setUsageData([
            { label: "CPU", value: Math.round(data.cpu_used_percent) },
            { label: "Memory", value: Math.round(data.memory_used_percent) },
          ]);
        }
      } catch (err) {
        console.error("Error parsing WS data:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Cpu className="text-orange-500" /> Usage
      </h2>

      <div className="space-y-3">
        {usageData.map((t, i) => (
          <div key={i}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {t.label}
              </span>
              <span className="text-sm text-gray-500">{t.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
              <div
                className={`${getColor(t.value)} h-5 rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${(t.value / maxVal) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
