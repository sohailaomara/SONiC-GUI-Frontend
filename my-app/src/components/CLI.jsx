import { useState, useEffect, useRef } from "react";

export default function CLI() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("cli_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [firstConnection, setfirstConnection] = useState(true);

  const socketRef = useRef(null);
  const containerRef = useRef(null);

  // Get token from localStorage or your auth context
  const getToken = () => {
    return localStorage.getItem("token");
  };

  const connectToSSH = async () => {
    if (!password.trim()) {
      setOutput((prev) => [...prev, "** Password required **"]);
      return;
    }

    const token = getToken();
    if (!token) {
      setOutput((prev) => [
        ...prev,
        "** Authentication token not found. Please login again. **",
      ]);
      return;
    }

    setIsConnecting(true);
    setShowPasswordModal(false);

    const socket = new WebSocket("ws://localhost:8000/ws/ssh");
    socketRef.current = socket;

    socket.onopen = () => {
      const authData = {
        token: token,
        password: password,
      };
      socket.send(JSON.stringify(authData));
    };

    socket.onmessage = (event) => {
      if (event.data.includes("** Authentication failed")) {
        setIsConnected(false);
        setIsConnecting(false);
        setPassword("");
      } else if (event.data === "__RECONNECT__") {
        setIsConnected(false);
        setOutput((prev) => [
          ...prev,
          "** Connection lost. Click 'Connect' to reconnect **",
        ]);
      } else if (!isConnected && !event.data.includes("**")) {
        setIsConnected(true);
        setIsConnecting(false);
      }
      setOutput((prev) => [...prev, event.data]);
    };

    socket.onerror = (err) => {
      setOutput((prev) => [
        ...prev,
        "** Error: WebSocket connection failed **",
      ]);
      setIsConnected(false);
      setIsConnecting(false);
    };

    socket.onclose = () => {
      setOutput((prev) => [...prev, "** Connection closed **"]);
      setIsConnected(false);
      setIsConnecting(false);
      setfirstConnection(true);
    };
  };
  useEffect(() => {
    if (!isConnected && !isConnecting && firstConnection) {
      setShowPasswordModal(true);
      setfirstConnection(false);
    }
  }, [isConnected, isConnecting]);

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    setIsConnected(false);
    setfirstConnection(false);
    setPassword("");
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim() || !isConnected) return;

    setOutput((prev) => [...prev, `$ ${input}`]);
    socketRef.current?.send(input);

    const newHistory = [...history, input];
    setHistory(newHistory);
    localStorage.setItem("cli_history", JSON.stringify(newHistory));
    setHistoryIndex(-1);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex =
          historyIndex === -1
            ? history.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length > 0) {
        if (historyIndex === -1) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    connectToSSH();
    setPassword("");
  };

  return (
    <div className="flex flex-col" style={{ width: "800px" }}>
      {/* Control buttons */}
      <div className="flex gap-2 mb-4">
        {!isConnected && !isConnecting && (
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Connect
          </button>
        )}

        {isConnecting && (
          <button
            disabled
            className="px-4 py-2 bg-yellow-600 text-white rounded opacity-75 cursor-not-allowed"
          >
            Connecting...
          </button>
        )}
        {isConnected && (
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Disconnect
          </button>
        )}
        <div className="flex items-center">
          <span
            className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
          ></span>
          <span className="ml-2 text-sm">
            {isConnected
              ? "Connected"
              : isConnecting
                ? "Connecting..."
                : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Terminal */}
      <div
        className="bg-black text-green-500 font-mono text-sm p-4 rounded-md shadow-md"
        style={{ width: "800px" }}
        ref={containerRef}
      >
        <pre className="font-mono whitespace-pre">{output.join("\n")}</pre>

        <div className="whitespace-pre-wrap">
          {/* Command input inline at bottom */}
          {isConnected && (
            <form onSubmit={handleCommand} className="flex mt-2">
              <span className="mr-2 text-white">$</span>
              <input
                type="text"
                className="flex-grow bg-transparent outline-none text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </form>
          )}
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              SSH Authentication
            </h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Enter SSH Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Connect
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword("");
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
