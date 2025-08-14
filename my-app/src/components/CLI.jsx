import { useState, useEffect, useRef } from "react";

export default function CLI() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("cli_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [historyIndex, setHistoryIndex] = useState(-1);
  const socketRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/ssh");
    socketRef.current = socket;

    socket.onmessage = (event) => {
      setOutput((prev) => [...prev, event.data]);
    };

    socket.onerror = (err) => {
      setOutput((prev) => [...prev, "Error: WebSocket connection failed"]);
    };

    socket.onclose = () => {
      setOutput((prev) => [...prev, "** Connection closed **"]);
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

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
      className="bg-black text-green-500 font-mono text-sm p-4 rounded-md shadow-md resize overflow-auto"
      style={{ width: "800px" }}
      ref={containerRef} // scroll container includes output + input
    >
      <pre className="font-mono whitespace-pre">
        {output.join("\n")}
      </pre>

      {/* Command input inline at bottom */}
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
    </div>
  );
}