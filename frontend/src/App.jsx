// src/App.jsx
import { useState, useEffect } from "react";
import Signup from "../auth/Signup";
import Login from "../auth/Login";
import DoctorDashboard from "../dashboard/DoctorDashboard";
import PatientDashboard from "../dashboard/PatientDashboard";

export default function App() {
  const [page, setPage] = useState("signup");
  const [user, setUser] = useState(() => {
    // Check localStorage on load
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    return token && role && userId ? { _id: userId, role } : null;
  });

  const handleLogout = () => setUser(null);

  if (!user) {
    return page === "signup" ? (
      <Signup onSwitch={setPage} />
    ) : (
      <Login onLogin={setUser} onSwitch={setPage} />
    );
  }

  return user.role === "doctor" ? (
    <DoctorDashboard onLogout={handleLogout} />
  ) : (
    <PatientDashboard onLogout={handleLogout} />
  );
}
