import { Wind, Fan } from "lucide-react";
import { useEffect, useState } from "react";

export default function Fans() {
  // Fan data (could later come from API/WebSocket)
  const [fans, setFans] = useState([
    { id: "Fan 1", speed: 3200 },
    { id: "Fan 2", speed: 2800 },
  ]);

  const maxRPM = 5000; // maximum fan speed for scaling animation

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Wind className="text-orange-500" /> Fans
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {fans.map((f, i) => {
          const speedPercent = Math.min(f.speed / maxRPM, 1);
          const rotationSpeed = `${2 - speedPercent * 1.5}s`; // faster at higher RPM
          return (
            <div key={i} className="flex flex-col items-center">
              <div
                className="w-16 h-16 flex items-center justify-center"
                style={{
                  animation: `spin ${rotationSpeed} linear infinite`,
                }}
              >
                <Fan className="text-orange-500 w-12 h-12" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">
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
