import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  const token = localStorage.getItem("token");

  // Agar token nahi hai to connect mat karo
  if (!token) {
    console.error("🚫 No token found, skipping socket connection.");
    return null;
  }

  // Agar socket pehle se connected hai, to wahi return kardo
  if (socket && socket.connected) {
    return socket;
  }

  console.log("🔄 Connecting socket...");

  socket = io("http://localhost:5000", {
    auth: { token },
    transports: ["websocket", "polling"], // Polling fallback ke liye zaroori hai
    withCredentials: true,
    reconnection: true,             // Auto reconnect enable karein
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  // Ye error batayega ki backend ne kyu reject kiya (e.g., Unauthorized)
  socket.on("connect_error", (err) => {
    console.error("❌ Socket Connection Failed:", err.message);
    
    // Agar authentication fail hui, to retry mat karo
    if (err.message === "Unauthorized" || err.message === "No token") {
        socket.disconnect();
    }
  });

  socket.on("disconnect", (reason) => {
    console.warn("⚠️ Socket disconnected:", reason);
    if (reason === "io server disconnect") {
      // Backend ne khud disconnect kiya hai (shayad token invalid tha)
      socket.connect(); 
    }
  });

  return socket;
};