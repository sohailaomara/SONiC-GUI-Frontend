import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminStatus() {
  const [interfaces, setInterfaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const useMockData = false;

  // Normalize admin status values coming from backend or mock data
  const mapAdminStatus = (status) => {
    if (!status) return "";
    return status.toLowerCase() === "up"
      ? "Enabled"
      : status.toLowerCase() === "down"
        ? "Disabled"
        : status;
  };

  useEffect(() => {
    const fetchInterfaces = async () => {
      if (useMockData) {
        // Mock data for testing without backend
        const mockArray = [
          { ifname: "Ethernet0", admin_status: "Enabled" },
          { ifname: "Ethernet4", admin_status: "Disabled" },
          { ifname: "Ethernet8", admin_status: "Enabled" },
          { ifname: "Ethernet12", admin_status: "Disabled" },
        ];
        setInterfaces(mockArray);
        return;
      }
      try {
        const response = await api.get("/portOp/status-summary");
        // Map raw API response into normalized admin status
        const mapped = (response.data.ports || []).map((iface) => ({
          ...iface,
          admin_status: mapAdminStatus(iface.admin_status),
        }));
        setInterfaces(mapped);
      } catch (error) {
        console.error("Error fetching admin status:", error);
      }
    };
    fetchInterfaces();
  }, []);
  // Apply both search filter (by interface name) and dropdown filter (Enabled/Disabled/All)
  const filteredInterfaces = interfaces.filter((iface) => {
    const matchesSearch = iface.ifname
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      iface.admin_status?.toUpperCase() === filter.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4 items-center text-gray-800">
        <input
          type="text"
          placeholder="Search by interface name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-200"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="All">All</option>
          <option value="Enabled">Enabled</option>
          <option value="Disabled">Disabled</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <div className="max-h-[300px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
            <thead className="bg-gray-100 text-center text-gray-700 sticky top-0">
              <tr>
                <th className="py-2 px-4 font-semibold">Interface</th>
                <th className="py-2 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredInterfaces.map((iface, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium text-gray-800">
                    {iface.ifname}
                  </td>
                  <td
                    className="py-2 px-4 font-semibold"
                    style={{
                      color:
                        iface.admin_status?.toUpperCase() === "ENABLED"
                          ? "green"
                          : "red",
                    }}
                  >
                    {iface.admin_status}
                  </td>
                </tr>
              ))}
              {filteredInterfaces.length === 0 && (
                <tr>
                  <td
                    colSpan="2"
                    className="px-4 py-4 text-center text-gray-500"
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
