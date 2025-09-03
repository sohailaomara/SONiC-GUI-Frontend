import { Wind, Fan } from "lucide-react";
import { useEffect, useState } from "react";

export default function Fans() {
  // Fan data (could later come from API/WebSocket)
  const [fans, setFans] = useState([
    { id: "Fan 1", speed: 3200 },
    { id: "Fan 2", speed: 2800 },
    { id: "Fan 3", speed: 1400 },
    { id: "Fan 4", speed: 3600 },
    { id: "Fan 5", speed: 0 },
    { id: "Fan 6", speed: 4200 },
    { id: "Fan 7", speed: 1800 },
    { id: "Fan 8", speed: 2500 },
    { id: "Fan 9", speed: 3900 },
    { id: "Fan 10", speed: 3100 },
  ]);

  const maxRPM = 5000; // maximum fan speed for scaling animation

  return (
    <div className="w-full p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Wind className="text-orange-500" /> Fans ({fans.length})
      </h2>

      <div className="grid grid-cols-5 gap-3">
        {fans.map((f, i) => {
          const speedPercent = Math.min(f.speed / maxRPM, 1);
          const rotationSpeed = `${2 - speedPercent * 1.5}s`; // faster at higher RPM
          const isStopped = f.speed === 0;

          return (
            <div
              key={i}
              className="flex flex-col items-center p-2 bg-gray-50 rounded-lg"
            >
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{
                  animation: !isStopped
                    ? `spin ${rotationSpeed} linear infinite`
                    : "none",
                }}
              >
                <Fan
                  className={`w-8 h-8 ${isStopped ? "text-gray-400" : "text-orange-500"}`}
                />
              </div>
              <span className="mt-1 text-xs font-medium text-gray-600 truncate w-full text-center">
                {f.id}
              </span>
              <span className="text-xs text-gray-500">{f.speed} RPM</span>
            </div>
          );
        })}
      </div>

      {/* spin animation */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
