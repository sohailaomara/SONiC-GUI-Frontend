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
    const interval = setInterval(fetchSpeed, 2000); // refresh every 2s
    return () => clearInterval(interval);
  }, []);

  const maxSpeed = 40000;
  const percent = Math.min(speed / maxSpeed, 1);

  const getColor = () => {
    if (percent < 0.4) return "#f44336"; // red
    if (percent < 0.75) return "#ff9800"; // orange
    return "#4caf50"; // green
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 self-start">
        <CircleGauge className="text-orange-500" /> Speed
      </h2>
      <div className="w-40 h-40 flex items-center justify-center">
        <CircularProgressbarWithChildren
          value={percent * 100}
          strokeWidth={12}
          styles={buildStyles({
            pathColor: getColor(),
            trailColor: "#eee",
          })}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gray-800">{speed}</span>
            <span className="text-sm text-gray-500">Mbps</span>
          </div>
        </CircularProgressbarWithChildren>
      </div>
    </div>
  );
}
