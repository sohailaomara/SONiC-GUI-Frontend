import { Wind, Fan } from "lucide-react";
import { useEffect, useState } from "react";

export default function Fans() {
  const [fans, setFans] = useState([]);
  const maxRPM = 5000;

  useEffect(() => {
    const username = localStorage.getItem("username");
    const ws = new WebSocket(`ws://localhost:8000/switch/status/${username}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.fans) {
          // Convert the fan data from object to array format
          const fanArray = Object.entries(data.fans).map(([id, speed]) => {
            // Extract RPM value from percentage string (e.g., "40%" -> 2000 RPM)
            const speedPercent = parseInt(speed) || 0;
            const speedRPM = (speedPercent / 100) * maxRPM;

            return {
              id: id.replace(/_/g, " "), // Replace underscores with spaces for better display
              speed: Math.round(speedRPM),
              percentage: speedPercent,
            };
          });
          setFans(fanArray);
        }
      } catch (err) {
        console.error("Error parsing fan data:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="w-full p-3 bg-white rounded-xl shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-1">
        <Wind className="text-orange-500 w-4 h-4" /> Fans ({fans.length})
      </h2>

      <div className="grid grid-cols-6 gap-2">
        {fans.map((f, i) => {
          const speedPercent = Math.min(f.speed / maxRPM, 1);
          const rotationSpeed = `${2 - speedPercent * 1.5}s`;
          const isStopped = f.speed === 0;

          return (
            <div
              key={i}
              className="flex flex-col items-center p-1 bg-gray-50 rounded"
            >
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{
                  animation: !isStopped
                    ? `spin ${rotationSpeed} linear infinite`
                    : "none",
                }}
              >
                <Fan
                  className={`w-6 h-6 ${isStopped ? "text-gray-400" : "text-orange-500"}`}
                />
              </div>
              <span className="mt-1 text-xs font-medium text-gray-600 truncate w-full text-center">
                {f.id}
              </span>
              <span className="text-xs text-gray-500">{f.speed} RPM</span>
              <span className="text-xs text-gray-400">{f.percentage}%</span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
