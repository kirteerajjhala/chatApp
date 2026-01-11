// src/chat/ChatWindow.jsx
import { useEffect, useState, useRef } from "react";
import { connectSocket } from "../socket/socket";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ peer, peerRole }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef();

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const s = connectSocket();
    setSocket(s);

    // Join room with peer
    s.emit("joinRoom", { peerId: peer._id, peerRole });

    s.on("oldMessages", (msgs) => setMessages(msgs));
    s.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => s.disconnect();
  }, [peer, peerRole, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    socket.emit("sendMessage", { peerId: peer._id, peerRole, text });
    setText("");
  };

  return (
    <div className="flex flex-col h-full border rounded">
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} currentUserId={currentUserId} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 flex border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={send}
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
