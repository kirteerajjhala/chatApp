// frontend/socket.js
import { io } from "socket.io-client";

// backend server URL (Node.js + Express + Socket.IO)
export const socket = io("http://localhost:5000"); 
