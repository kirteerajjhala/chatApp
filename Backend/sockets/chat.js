import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Message } from "../Model/Message.js";
import { redisPub, redisSub } from "../config/redis.js";
import { getRoomId } from "../utils/roomId.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // ================= JWT AUTH =================
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // {_id, role}
      next();
    } catch (err) {
      console.log("❌ JWT Error:", err.message);
      next(new Error("Unauthorized"));
    }
  });

  // ================= CONNECTION =================
  io.on("connection", (socket) => {
    const userId = socket.user._id || socket.user.id;
    const role = socket.user.role;

    console.log("✅ User connected:", userId, role);

    // -------- JOIN ROOM --------
    socket.on("joinRoom", async ({ peerId }) => {
      try {
        let doctorId, patientId;

        if (role === "doctor") {
          doctorId = userId;
          patientId = peerId;
        } else {
          patientId = userId;
          doctorId = peerId;
        }

        const roomId = getRoomId(doctorId, patientId);
        socket.join(roomId);

        console.log("📌 Joined room:", roomId);

        const messages = await Message.find({ roomId }).sort("createdAt");
        socket.emit("oldMessages", messages);
      } catch (err) {
        console.log("❌ joinRoom error:", err.message);
      }
    });

    // -------- SEND MESSAGE --------
    socket.on("sendMessage", async ({ peerId, text }) => {
      try {
        let doctorId, patientId;

        if (role === "doctor") {
          doctorId = userId;
          patientId = peerId;
        } else {
          patientId = userId;
          doctorId = peerId;
        }

        const roomId = getRoomId(doctorId, patientId);

        const msg = await Message.create({
          roomId,
          senderId: userId,
          senderRole: role,
          text,
        });

        redisPub.publish("CHAT", JSON.stringify(msg));
      } catch (err) {
        console.log("❌ sendMessage error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", userId);
    });
  });

  // ================= REDIS BROADCAST =================
  redisSub.subscribe("CHAT");

  redisSub.on("message", (channel, message) => {
    const msg = JSON.parse(message);
    io.to(msg.roomId).emit("newMessage", msg);
  });
};
