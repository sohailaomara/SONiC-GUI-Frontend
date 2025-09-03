import { BatteryCharging, AlertCircle, CheckCircle } from "lucide-react";

export default function PSU() {
  const psus = [
    {
      id: "PSU 1",
      power: 79.0,
      status: "OK",
      led: "green"
    },
    {
      id: "PSU 2", 
      power: 0.0,
      status: "NOT OK",
      led: "red"
    }
  ];

  return (
    <div className="w-full p-3 bg-white rounded-xl shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-1">
        <BatteryCharging className="text-orange-500 w-4 h-4" /> PSU
      </h2>

      <div className="space-y-2">
        {psus.map((psu, index) => (
          <div key={index} className={`p-2 rounded-lg border ${psu.status === "OK" ? "border-green-100 bg-green-50" : "border-red-100 bg-red-50"}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-800">{psu.id}</span>
              <div className="flex items-center gap-1">
                {psu.status === "OK" ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-red-600" />
                )}
                <span className={`text-xs font-medium ${psu.status === "OK" ? "text-green-700" : "text-red-700"}`}>
                  {psu.status}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Power:</span>
              <span className="text-xs font-bold">{psu.power} W</span>
            </div>
            
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-600">LED:</span>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${psu.led === "green" ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-xs font-medium capitalize">{psu.led}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}