import React, { useState } from "react";
import api from "../../api";

const GetPortOp = () => {
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPortOp = async () => {
    setLoading(true);
    try {
      const response = await api.get("/portOp/");

      const portList =
        response.data["sonic-port-oper:sonic-port-oper"]?.PORT_TABLE
          ?.PORT_TABLE_LIST || [];

      setPorts(portList);
    } catch (error) {
      if (error.response) {
        alert("Failed to fetch port-op data: " + error.response.data.detail);
      } else {
        console.error("Unknown error:", error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <button
        onClick={getPortOp}
        className="bg-orange-400 hover:bg-orange-500 text-white hover:px-5 py-2 rounded shadow mb-4"
      >
        {loading ? "Loading..." : "Get Port-Op Data"}
      </button>

    {ports.length > 0 ? (
      <div className="overflow-y-auto max-h-[300px] border border-gray-200 rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-orange-100 text-orange-700 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-center">Index</th>
              <th className="px-4 py-2 text-center">IfName</th>
              <th className="px-4 py-2 text-center">Alias</th>
              <th className="px-4 py-2 text-center">Admin Status</th>
              <th className="px-4 py-2 text-center">Operation Status</th>
              <th className="px-4 py-2 text-center">Description</th>
            </tr>
          </thead>
          <tbody className="text-gray-900">
            {ports.map((port, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{port.index}</td>
                <td className="px-4 py-2">{port.ifname}</td>
                <td className="px-4 py-2">{port.alias}</td>
                <td className="px-4 py-2 capitalize">{port.admin_status}</td>
                <td className="px-4 py-2 capitalize">{port.oper_status}</td>
                <td className="px-4 py-2">
                  {port.description || <span className="text-gray-400">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      !loading && (
        <p className="text-gray-500 text-sm">No Port-Op data found yet.</p>
      )
    )}

    </div>
  );
};

export default GetPortOp;
