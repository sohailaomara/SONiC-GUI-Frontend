import { useState } from "react";
import { MessageCircle, X, Bot } from "lucide-react";

export default function ChatbotButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: input },
    ]);

    setInput("");

    // Simulate bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "bot", text: "Got it! I'm working on that." },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg z-50"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
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
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-300 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
