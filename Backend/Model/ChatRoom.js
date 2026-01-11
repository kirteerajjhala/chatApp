import mongoose from "mongoose"

const chatRoomSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  roomId: { type: String, unique: true }
})

export const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema)
