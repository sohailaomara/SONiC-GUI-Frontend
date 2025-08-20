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
      {/* Terminal */}
      <div
        className="bg-black text-green-500 font-mono text-sm p-4 rounded-md shadow-md"
        style={{ width: "800px", minHeight: "400px" }}
        ref={containerRef}
      >
        <pre className="font-mono whitespace-pre">{output.join("\n")}</pre>

        <div className="whitespace-pre-wrap">
          {/* Password prompt when disconnected */}
          {!isConnected && !isConnecting && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                connectToSSH();
              }}
              className="flex mt-2"
            >
              <span className="mr-2 text-white">Password:</span>
              <input
                type="password"
                className="flex-grow bg-transparent outline-none text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </form>
          )}

          {/* Command input when connected */}
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

      {/* Action buttons */}
      <div className="flex justify-center mt-4">
        {!isConnected && !isConnecting && (
          <button
            onClick={connectToSSH}
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
      </div>
    </div>
  );
}
