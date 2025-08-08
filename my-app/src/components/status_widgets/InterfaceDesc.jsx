import { useEffect, useState } from "react";
import DescriptionCard from "../status/DescriptionCard"; // ✅ use new card

export default function InterfaceDesc() {
  const [status, setStatus] = useState(null);
  const useMockData = true;

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

  return (
    <div className="p-4 space-y-4">
      {status ? (
        <div className="flex flex-wrap gap-4">
          {Object.entries(status).map(([iface, desc]) => (
            <DescriptionCard key={iface} name={iface} description={desc} />
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
