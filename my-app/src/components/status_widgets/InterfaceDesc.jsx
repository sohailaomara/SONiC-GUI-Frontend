import { useEffect, useState } from "react";
import DescriptionCard from "../status/DescriptionCard";

export default function InterfaceDesc() {
  const [status, setStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
    <div className="p-3 space-y-3">
      {/* search box */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search by interface or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {status ? (
        <div
          className="grid grid-cols-2 gap-3 overflow-y-auto"
          style={{ maxHeight: "350px" }}
        >
          {filteredStatus.length > 0 ? (
            filteredStatus.map(([iface, desc]) => (
              <DescriptionCard key={iface} name={iface} description={desc} />
            ))
          ) : (
            <p className="col-span-2 text-gray-500 text-center text-sm py-3">
              No interfaces found.
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Loading...</p>
      )}
    </div>
  );
}
