import { Wind, Fan } from "lucide-react";
import { useEffect, useState } from "react";

export default function Fans() {
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

  const maxRPM = 5000;

  return (
    <div className="w-full p-3 bg-white rounded-xl shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-1">
        <Wind className="text-orange-500 w-4 h-4" /> Fans ({fans.length})
      </h2>

      <div className="grid grid-cols-5 gap-2">
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