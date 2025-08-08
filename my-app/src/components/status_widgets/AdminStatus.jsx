import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminStatus() {
  const [interfaces, setInterfaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const useMockData = true;

  useEffect(() => {
    const fetchInterfaces = async () => {
      if (useMockData) {
        const mock = {
          Ethernet0: "Enabled",
          Ethernet4: "Disabled",
          Ethernet8: "Enabled",
          Ethernet12: "Disabled",
        };

        // Convert the object to array of { Interface, Status }
        const mockArray = Object.entries(mock).map(([key, value]) => ({
          Interface: key,
          Status: value,
        }));

        setInterfaces(mockArray);
        return;
      }
      try {
        const response = await api.get("/get/interfaces/admin-status");
        setInterfaces(response.data);
      } catch (error) {
        console.error("Error fetching admin status:", error);
      }
    };
    fetchInterfaces();
  }, []);

  const filteredInterfaces = interfaces.filter((iface) => {
    const matchesSearch = iface.Interface.toLowerCase().includes(
      searchTerm.toLowerCase(),
    );
    const matchesFilter =
      filter === "All" || iface.Status.toUpperCase() === filter.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by interface name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All</option>
          <option value="ENABLED">Enabled</option>
          <option value="DISABLED">Disabled</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-left text-gray-700">
            <tr>
              <th className="py-2 px-4 font-semibold">Interface</th>
              <th className="py-2 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredInterfaces.map((iface, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 font-medium text-gray-800">
                  {iface.Interface}
                </td>
                <td
                  className="py-2 px-4 font-semibold"
                  style={{
                    color:
                      iface.Status.toUpperCase() === "ENABLED"
                        ? "green"
                        : "red",
                  }}
                >
                  {iface.Status.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
