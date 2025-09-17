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
        setStatus(mock);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/portOp/status-summary",
        );
        const data = await response.json();
        const formatted = {};
        data.ports.forEach((port) => {
          formatted[port.ifname] = port.oper_status;
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
    <div className="p-3 space-y-3">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search by interface name"
          className="w-64 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-900"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-900"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="up">Up</option>
          <option value="down">Down</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <div className="max-h-[280px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-center sticky top-0">
              <tr>
                <th className="px-3 py-2 font-semibold text-gray-700">
                  Interface
                </th>
                <th className="px-3 py-2 font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredStatus.length > 0 ? (
                filteredStatus.map(([iface, stat]) => (
                  <tr key={iface} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-800">
                      {iface}
                    </td>
                    <td
                      className={`px-3 py-2 font-semibold ${
                        stat === "UP" ? "text-green-600" : "text-red-600"
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
                    className="px-3 py-3 text-center text-gray-500 text-sm"
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
