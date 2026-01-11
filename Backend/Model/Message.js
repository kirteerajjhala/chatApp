import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  roomId: String,
  senderId: mongoose.Schema.Types.ObjectId,
  senderRole: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
})

export const Message = mongoose.model("Message", messageSchema)
