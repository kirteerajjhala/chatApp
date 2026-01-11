import { Assignment } from "../Model/Assignment.js"
import { User } from "../Model/User.js"

// PATIENT → GET ASSIGNED DOCTORS
export const getAssignedDoctors = async (req, res) => {
  if (req.user.role !== "patient")
    return res.status(403).json({ message: "Access denied" })

  const assignments = await Assignment
    .find({ patientId: req.user.id })
    .populate("doctorId", "name email")

  res.json(assignments.map(a => a.doctorId))
}

// DOCTOR → GET ASSIGNED PATIENTS
export const getAssignedPatients = async (req, res) => {
  if (req.user.role !== "doctor")
    return res.status(403).json({ message: "Access denied" })

  const assignments = await Assignment
    .find({ doctorId: req.user.id })
    .populate("patientId", "name email")

  res.json(assignments.map(a => a.patientId))
}
