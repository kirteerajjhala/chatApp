import dotenv from "dotenv";
dotenv.config(); 

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./sockets/chat.js"; 
const server = http.createServer(app);

connectDB();
initSocket(server);

server.listen(5000, () => {
  console.log("Backend running on port 5000");
});
