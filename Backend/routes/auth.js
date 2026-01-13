import express from "express"
import { signup, login ,getDoctors } from "../controllers/authController.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/doctors", getDoctors) 

export default router
