import { useState, useEffect, useRef } from "react";

export default function CLI() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const socketRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Replace with your backend host if needed
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
    // Auto-scroll to bottom
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setOutput((prev) => [...prev, `$ ${input}`]);
    socketRef.current?.send(input);
    setInput("");
  };

  return (
    <div
      className="bg-black text-green-500 p-4 rounded-lg font-mono h-[500px] overflow-y-auto shadow-md"
      ref={containerRef}
    >
      {output.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
      <form onSubmit={handleCommand} className="flex mt-2">
        <span className="mr-2 text-white">$</span>
        <input
          type="text"
          className="flex-grow bg-transparent outline-none text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
      </form>
    </div>
  );
}
