import { Thermometer } from "lucide-react";
import { useEffect, useState } from "react";

export default function Temperature() {
  const [temps, setTemps] = useState([]);
  const maxTemp = 100;

  useEffect(() => {
    const username = localStorage.getItem("username");
    const ws = new WebSocket(`ws://localhost:8000/switch/status/${username}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.temp) {
          // Convert the temperature data from object to array format
          const tempArray = Object.entries(data.temp).map(([label, value]) => ({
            label: label.replace(/_/g, " ").replace(/temp sensor/gi, "Sensor"), // Clean up labels
            value: parseFloat(value) || 0,
          }));
          setTemps(tempArray);
        }
      } catch (err) {
        console.error("Error parsing temperature data:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => ws.close();
  }, []);

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
                style={{
                  height: `${Math.min((t.value / maxTemp) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <span className="mt-1 text-xs font-medium text-gray-600 truncate text-center">
              {t.label}
            </span>
            <span className="text-xs text-gray-500">{t.value}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
}
