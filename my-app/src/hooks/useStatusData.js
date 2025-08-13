import { useEffect, useState } from "react";

export default function useStatusData({
  key,
  field,
  useMock = false,
  mockData,
}) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (useMock) {
        setStatus(mockData);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/portOp/status-summary",
        );
        const data = await response.json();
        const formatted = {};
        data.ports.forEach((port) => {
          formatted[port.ifname] = port[field];
        });
        setStatus(formatted);
      } catch (error) {
        console.error(`Failed to fetch ${key}:`, error);
      }
    };

    fetchStatus();
  }, [key, field, useMock, mockData]);

  return status;
}
