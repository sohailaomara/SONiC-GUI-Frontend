import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Bot } from "lucide-react";

export default function ChatbotButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const socketRef = useRef(null);

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
      // remove loading bubble if exists
      setMessages((prev) => prev.filter((msg) => msg.id !== "loading"));
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "bot", text: event.data },
      ]);
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

  const handleSend = () => {
    if (!input.trim() || !connected) return;

    // Add user message
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
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
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
                  className={`px-3 py-2 rounded-lg max-w-[70%] text-sm ${
                    msg.from === "bot"
                      ? "bg-gray-200 text-gray-800"
                      : "bg-orange-600 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Error message */}
            {error && (
              <div className="text-red-500 text-xs text-center">{error}</div>
            )}

            {/* Loading bubble (animated) */}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm animate-pulse">
                  Bot is typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-300 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
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
    </>
  );
}
