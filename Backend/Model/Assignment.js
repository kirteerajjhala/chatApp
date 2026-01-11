import mongoose from "mongoose"

const assignmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})

export const Assignment = mongoose.model("Assignment", assignmentSchema)
