import express from "express"
import {
  getAssignedDoctors,
  getAssignedPatients
} from "../controllers/assignmentController.js"

import { protect } from "../middlewares/auth.js"

const router = express.Router()

router.get("/patient/doctors", protect, getAssignedDoctors)
router.get("/doctor/patients", protect, getAssignedPatients)

export default router
