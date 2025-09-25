// src/pages/ChatbotPage.jsx
import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { ArrowDown, Bot } from "lucide-react";

export default function ChatbotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [expandedMessage, setExpandedMessage] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);

  // Connect to backend WebSocket
  useEffect(() => {
    const username = localStorage.getItem("username") || "guest";
    const socket = new WebSocket(
      `ws://localhost:8000/chatServer/chat/${username}`,
    );
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setError(null);
    };

    socket.onmessage = (event) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== "loading"));
      const raw = event.data;

      if (raw.includes("```") && raw.includes("+---")) {
        // Handle table (optional)
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

  // Handle scroll event
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
  }, []);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      {/* Full page */}
      <div className="flex flex-col h-screen">
        {/* Back Button */}
        <div className="flex justify-end p-4 shrink-0">
          <button
            onClick={() => navigate("/home")}
            className="text-sm px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded"
          >
            ← Back to Home
          </button>
        </div>

        {/* Chatbox fills remaining height */}
        <div className="flex-1 flex flex-col px-4 pb-4">
          <div className="flex flex-col h-full bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden">
            {/* Header */}
            <div className="bg-orange-600 text-white p-3 rounded-t-xl flex justify-between items-center shrink-0">
              <h2 className="font-semibold">Chatbot</h2>
            </div>

            {/* Body */}
            <div
              ref={chatBodyRef}
              className="flex-1 min-h-0 p-4 overflow-y-auto space-y-3 bg-white flex flex-col justify-end"
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
                    onClick={() => setExpandedMessage(msg.text)}
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

            {/* Scroll to Bottom */}
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-28 right-8 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow"
              >
                <ArrowDown className="w-4 h-4 text-gray-700" />
              </button>
            )}

            {/* Input */}
            <div className="p-3 border-t border-gray-300 flex gap-2 bg-white shrink-0">
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
        </div>
      </div>

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
    </Layout>
  );
}
