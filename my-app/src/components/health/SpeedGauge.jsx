import { useEffect, useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CircleGauge } from "lucide-react";

export default function SpeedGauge() {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const fetchSpeed = async () => {
      try {
        const res = await fetch("http://localhost:8000/portOp/status-summary");
        const data = await res.json();
        if (data.ports?.length > 0) {
          setSpeed(Number(data.ports[0].speed) || 0);
        }
      } catch (err) {
        console.error("Error fetching speed:", err);
      }
    };

    fetchSpeed();
    const interval = setInterval(fetchSpeed, 2000);
    return () => clearInterval(interval);
  }, []);

  const maxSpeed = 40000;
  const percent = Math.min(speed / maxSpeed, 1);

  const getColor = () => {
    if (percent < 0.4) return "#f44336";
    if (percent < 0.75) return "#ff9800";
    return "#4caf50";
  };

  return (
    <div className="p-3 bg-white rounded-xl shadow-sm">
      {/* Title aligned to the left */}
      <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-1">
        <CircleGauge className="text-orange-500 w-4 h-4" /> Speed
      </h2>
      
      {/* Gauge centered within the container */}
      <div className="flex justify-center">
        <div className="w-28 h-28 flex items-center justify-center">
          <CircularProgressbarWithChildren
            value={percent * 100}
            strokeWidth={10}
            styles={buildStyles({
              pathColor: getColor(),
              trailColor: "#eee",
            })}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-gray-800">{speed}</span>
              <span className="text-xs text-gray-500">Mbps</span>
            </div>
          </CircularProgressbarWithChildren>
        </div>
      </div>
    </div>
  );
}