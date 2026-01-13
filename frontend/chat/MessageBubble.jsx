// src/chat/MessageBubble.jsx
export default function MessageBubble({ message, currentUserId }) {
  const isMine = message?.senderId?.toString() === currentUserId?.toString();

  if (!message) return null; 

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`px-3 py-2 rounded-lg max-w-xs text-sm break-words ${
          isMine
            ? "bg-green-500 text-white rounded-br-none"
            : "bg-gray-200 text-black rounded-bl-none"
        }`}
      >
        {message.text}
        <div className="text-[10px] opacity-70 mt-1 text-right">
          {message.createdAt 
            ? new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </div>
      </div>
    </div>
  );
}