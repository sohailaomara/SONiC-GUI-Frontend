import { useEffect, useState } from "react";
import DescriptionCard from "../status/DescriptionCard";

export default function InterfaceDesc() {
  const [status, setStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // <-- added
  const useMockData = false;

  useEffect(() => {
    const fetchStatus = async () => {
      if (useMockData) {
        const mock = {
          eth0: "Uplink",
          eth1: "Core switch",
          eth2: "Firewall",
          eth3: "Unused",
          eth4: "Uplink",
          eth5: "Core switch",
          eth6: "Firewall",
          eth7: "Unused",
          eth8: "Edge",
          eth9: "Access",
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
          formatted[port.ifname] = port.description;
        });
        setStatus(formatted);
      } catch (error) {
        console.error("Failed to fetch interface descriptions:", error);
      }
    };

    fetchStatus();
  }, []);

  // filter by interface name OR description
  const filteredStatus = status
    ? Object.entries(status).filter(([iface, desc]) => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
          iface.toLowerCase().includes(lowerSearch) ||
          desc?.toLowerCase().includes(lowerSearch)
        );
      })
    : [];

  return (
    <div className="p-4 space-y-4">
      {/* search box */}
      <div className="flex flex-wrap gap-4 items-center text-gray-800">
        <input
          type="text"
          placeholder="Search by interface or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 border border-gray-300 px-3 py-2 rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-orange-300 
                     text-gray-700"
        />
      </div>

      {status ? (
        <div
          className="grid grid-cols-2 gap-4 overflow-y-auto"
          style={{ maxHeight: "400px" }} // 4 rows × 2 cards = 8 visible
        >
          {filteredStatus.length > 0 ? (
            filteredStatus.map(([iface, desc]) => (
              <DescriptionCard key={iface} name={iface} description={desc} />
            ))
          ) : (
            <p className="col-span-2 text-gray-500 text-center">
              No matches found
            </p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
