import React, { useState, useEffect, useRef } from "react";
import { socket } from "../socket";

export default function ChatBox({ role }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    // Join with role
    socket.emit("join", { role });

    // Listen incoming messages
    socket.on("chat-message", ({ role, message, time }) => {
      setMessages((prev) => [...prev, { role, message, time }]);
    });

    return () => socket.off("chat-message");
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Emit to server
    socket.emit("chat-message", { message: input, time });

    // Add to sender's chat
    setMessages((prev) => [...prev, { role, message: input, time }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto border rounded-lg shadow-lg bg-gray-50">
      <div className="bg-green-500 text-white text-center py-2 rounded-t-lg font-bold">
        Chat Room
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === role ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                m.role === role
                  ? "bg-green-200 text-gray-800"
                  : "bg-white text-gray-900 border"
              }`}
            >
              {m.role !== role && (
                <div className="text-xs font-semibold text-gray-500">{m.role}</div>
              )}
              <div>{m.message}</div>
              <div className="text-right text-xs text-gray-400 mt-1">{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="flex p-2 border-t">
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
