import { useState, useEffect, useRef } from "react";

export default function CLI() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
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
    setInput("");
  };

  return (
    <div
      className="bg-black text-green-500 font-mono text-sm p-4 rounded-md shadow-md"
      style={{ width: '800px', height: '900px' }}
    >
      <div
        ref={containerRef}
        className="overflow-y-auto w-full h-full whitespace-pre"
        style={{ maxHeight: '500px', overflowX: 'auto' }}
      >
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
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
