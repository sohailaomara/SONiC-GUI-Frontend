import { useEffect, useRef, useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function SpeedGauge() {
  const [speed, setSpeed] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/portOp/status-summary");
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSpeed(data.speed);
      } catch (err) {
        console.error("Invalid WebSocket speed data:", event.data);
      }
    };

    return () => socket.close();
  }, []);

  const maxSpeed = 1000;
  const percent = Math.min(speed / maxSpeed, 1);

  // Dynamic color based on percent
  const getColor = () => {
    if (percent < 0.4) return "#f44336"; // red
    if (percent < 0.75) return "#ff9800"; // orange
    return "#4caf50"; // green
  };

  return (
    <div className="w-64 p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Platform Speed
      </h2>

      <div className="w-40 h-40">
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
