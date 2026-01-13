import bcrypt from "bcryptjs"
import { User } from "../Model/User.js"
import { Assignment } from "../Model/Assignment.js"
import { generateToken } from "../utils/jwt.js"

// SIGNUP
export const signup = async (req, res) => {
  const { name, email, password, role, doctorIds } = req.body

  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: "Email already exists" })

  const hashed = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashed,
    role
  })

  // IF PATIENT → ASSIGN MULTIPLE DOCTORS
  if (role === "patient" && doctorIds?.length) {
    const assignments = doctorIds.map(docId => ({
      patientId: user._id,
      doctorId: docId
    }))
    await Assignment.insertMany(assignments)
  }

  res.status(201).json({
    token: generateToken(user),
    user: { id: user._id, role: user.role }
  })
}

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ message: "Invalid credentials" })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(400).json({ message: "Invalid credentials" })

  res.json({
    token: generateToken(user),
    user: { id: user._id, role: user.role }
  })
}

// get doctores
export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("_id name")
    res.json(doctors)
  } catch (err) {
    res.status(500).json({ message: "Server Error" })
  }
}
