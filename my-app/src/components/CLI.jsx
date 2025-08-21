import { useState, useEffect, useRef } from "react";

export default function CLI() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("cli_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [connected, setConnected] = useState(false);
  const [shouldReconnect, setShouldReconnect] = useState(false);

  const socketRef = useRef(null);
  const containerRef = useRef(null);

  const connectWS = () => {
    const username = localStorage.getItem("username");
    const socket = new WebSocket(
      `ws://localhost:8000/switch/status/${username}`,
    );
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setShouldReconnect(false);
      setOutput((prev) => [...prev, "Connected to server"]);
    };

    socket.onmessage = (event) => {
      if (event.data === "__RECONNECT__") {
        setOutput((prev) => [...prev, "SSH session ended. Please reconnect."]);
        setConnected(false);
        setShouldReconnect(true);
        socket.close();
        return;
      }
      setOutput((prev) => [...prev, event.data]);
    };

    socket.onerror = () => {
      setOutput((prev) => [...prev, "WebSocket error"]);
    };

    socket.onclose = () => {
      if (!shouldReconnect) {
        setOutput((prev) => [...prev, "** Connection closed **"]);
      }
      setConnected(false);
    };
  };

  useEffect(() => {
    connectWS();
    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim() || !connected) return;

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
        if (historyIndex === -1) return; // already at newest
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

  return (
    <div
      className="bg-black text-green-500 font-mono text-sm p-4 rounded-md shadow-md"
      style={{ width: "800px" }}
      ref={containerRef}
    >
      <pre className="font-mono whitespace-pre">{output.join("\n")}</pre>

      {connected ? (
        // Command input
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
      ) : shouldReconnect ? (
        <button
          onClick={connectWS}
          className="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded"
        >
          Reconnect
        </button>
      ) : (
        <p className="mt-3 text-gray-400">Disconnected</p>
      )}
    </div>
  );
}
