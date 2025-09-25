import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, ArrowDown, Bot } from "lucide-react";

export default function ChatbotButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [tableData, setTableData] = useState(null);

  const [expandedMessage, setExpandedMessage] = useState(null);

  const [showScrollButton, setShowScrollButton] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);

  // Connect to backend WebSocket
  useEffect(() => {
    const username = localStorage.getItem("username") || "guest";
    const socket = new WebSocket(
      `ws://localhost:8000/chatbot/chat/${username}`,
    );
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setError(null);
    };

    socket.onmessage = (event) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== "loading"));

      let raw = event.data;

      if (raw.includes("```") && raw.includes("+---")) {
        const tableText = raw.match(/```([\s\S]*?)```/);
        if (tableText) {
          const lines = tableText[1].split("\n").filter((l) => l.trim() !== "");
          const parsedTable = parseAsciiTable(lines);

          setTableData(parsedTable);
          setShowPopup(true);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), from: "bot", text: raw },
        ]);
      }

      setLoading(false);
    };

    socket.onerror = () => {
      setError("⚠️ Connection error. Please try again.");
      setLoading(false);
    };

    socket.onclose = () => {
      setConnected(false);
      setError("⚠️ Chat disconnected.");
      setLoading(false);
    };

    return () => socket.close();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle scroll event to show/hide button
  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody) return;

    const handleScroll = () => {
      const isNearBottom =
        chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight < 50;
      setShowScrollButton(!isNearBottom);
    };

    chatBody.addEventListener("scroll", handleScroll);
    return () => chatBody.removeEventListener("scroll", handleScroll);
  }, [open]);

  const handleSend = () => {
    if (!input.trim() || !connected) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: input },
    ]);

    setLoading(true);
    setError(null);

    try {
      socketRef.current?.send(input);
    } catch (err) {
      setError("⚠️ Failed to send message.");
      setLoading(false);
    }

    setInput("");
  };

  // ✅ ASCII Table Parser
  const parseAsciiTable = (lines) => {
    const content = lines.filter((line) => !line.startsWith("+"));
    return content.map((line) =>
      line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell.length > 0),
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg z-50"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chatbot Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-xl shadow-xl border border-gray-300 flex flex-col z-50">
          {/* Header */}
          <div className="bg-orange-600 text-white p-3 rounded-t-xl flex justify-between items-center">
            <h2 className="font-semibold">Chatbot</h2>
            <button
              onClick={() => setOpen(false)}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div
            ref={chatBodyRef}
            className="flex-1 p-4 overflow-y-auto overflow-x-hidden space-y-3 relative bg-white"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.from === "bot" && (
                  <div className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full mr-2">
                    <Bot className="w-5 h-5" />
                  </div>
                )}
                <div
                  onClick={() => setExpandedMessage(msg.text)} // 👈 Expand on click
                  className={`px-3 py-2 rounded-lg max-w-[70%] text-sm break-words cursor-pointer ${
                    msg.from === "bot"
                      ? "bg-gray-200 text-gray-800"
                      : "bg-orange-600 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {error && (
              <div className="text-red-500 text-xs text-center">{error}</div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm animate-pulse">
                  Sonic is processing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to Bottom Button */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-20 right-8 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow"
            >
              <ArrowDown className="w-4 h-4 text-gray-700" />
            </button>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-300 flex gap-2 bg-white">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
            />
            <button
              onClick={handleSend}
              className="bg-orange-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-orange-700"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Popup Modal for Command Output */}
      {showPopup && tableData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90vw] h-[80vh] shadow-lg flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Command Output
            </h3>

            <div className="flex-1 overflow-auto border rounded">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    {tableData[0].map((col, i) => (
                      <th
                        key={i}
                        className="border px-3 py-2 text-left font-mono"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.slice(1).map((row, r) => (
                    <tr key={r} className="hover:bg-gray-50">
                      {row.map((cell, c) => (
                        <td
                          key={c}
                          className="border px-3 py-2 font-mono whitespace-nowrap"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Message Modal */}
      {expandedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[95vw] h-[85vh] shadow-lg flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-orange-600">
              Expanded View
            </h3>

            <div className="flex-1 overflow-auto border rounded bg-white p-4">
              <pre className="whitespace-pre font-mono text-xs leading-snug text-gray-800">
                {expandedMessage}
              </pre>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setExpandedMessage(null)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
