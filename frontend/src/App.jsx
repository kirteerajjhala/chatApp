import { useState } from "react"
import Signup from "../auth/Signup"
import Login from "../auth/Login"
import DoctorDashboard from "../dashboard/DoctorDashboard"
import PatientDashboard from "../dashboard/PatientDashboard"

export default function App() {
  const [page, setPage] = useState("signup")
  const [user, setUser] = useState(null)

  if (!user) {
    return page === "signup" ? (
      <Signup onSwitch={setPage} />
    ) : (
      <Login onLogin={setUser} onSwitch={setPage} />
    )
  }

  return user.role === "doctor"
    ? <DoctorDashboard />
    : <PatientDashboard />
}
