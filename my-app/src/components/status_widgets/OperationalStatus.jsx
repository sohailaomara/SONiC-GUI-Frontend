import { useEffect, useState } from "react";

export default function OperationalStatus() {
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
        const mockList = Object.entries(mock).map(([ifname, oper_status]) => ({
          ifname,
          oper_status:
            oper_status.charAt(0) + oper_status.slice(1).toLowerCase(),
        }));
        setStatus(mockList);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/portOp/status-summary",
        );
        const data = await response.json();
        const formatted = data.ports.map((port) => ({
          ifname: port.ifname,
          oper_status:
            port.oper_status.charAt(0) +
            port.oper_status.slice(1).toLowerCase(),
        }));
        setStatus(formatted);
      } catch (error) {
        console.error("Failed to fetch port status summary:", error);
      }
    };

    fetchStatus();
  }, []);

  const filteredStatus = status.filter(({ ifname, oper_status }) => {
    const matchesSearch = ifname.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || oper_status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-3 space-y-3">
      {/* Search and Filter Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search by interface name"
          className="w-64 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="up">Up</option>
          <option value="down">Down</option>
        </select>
      </div>

      {/* Status Table */}
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
              {filteredStatus.map(({ ifname, oper_status }) => (
                <tr key={ifname} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-800">
                    {ifname}
                  </td>
                  <td
                    className={`px-3 py-2 font-semibold ${
                      oper_status === "UP" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {oper_status}
                  </td>
                </tr>
              ))}
              {filteredStatus.length === 0 && (
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
