import { useEffect, useState } from "react";

export default function InterfaceStatus() {
  const [status, setStatus] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const useMockData = false;

  useEffect(() => {
    const fetchStatus = async () => {
      if (useMockData) {
        const mock = {
          eth0: "UP",
          eth1: "DOWN",
          eth2: "UP",
          eth3: "DOWN",
        };
        setStatus(mock); // ✅ direct set of object
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/portOp/status-summary",
        );
        const data = await response.json();
        const formatted = {};
        data.ports.forEach((port) => {
          formatted[port.ifname] = port.oper_status; // or another relevant field
        });
        setStatus(formatted);
      } catch (error) {
        console.error("Failed to fetch interface status:", error);
      }
    };

    fetchStatus();
  }, []);

  const filteredStatus = status
    ? Object.entries(status).filter(([iface, stat]) => {
        const matchesSearch = iface
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesFilter = filter === "all" || stat === filter;
        return matchesSearch && matchesFilter;
      })
    : [];

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by interface name"
          className="w-72 border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="w-20 border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="up">Up</option>
          <option value="down">Down</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <div className="max-h-[300px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
            <thead className="bg-gray-100 text-center text-gray-700 sticky top-0">
              <tr>
                <th className="px-4 py-2 font-semibold text-gray-700">
                  Interface
                </th>
                <th className="px-4 py-2 font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredStatus.length > 0 ? (
                filteredStatus.map(([iface, stat]) => (
                  <tr key={iface}>
                    <td className="px-4 py-2 font-medium text-gray-800">
                      {iface}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        stat === "UP"
                          ? "text-[rgb(0,128,0)]"
                          : "text-[rgb(255,0,0)]"
                      }`}
                    >
                      {stat}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="px-4 py-2 text-center text-gray-500"
                  >
                    No interfaces found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
