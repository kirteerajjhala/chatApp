// src/dashboard/DoctorDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import ChatWindow from "../chat/ChatWindow";

export default function DoctorDashboard({ onLogout }) {
  const [patients, setPatients] = useState([]);
  const [activePatient, setActivePatient] = useState(null);

  useEffect(() => {
    api
      .get("/assignments/doctor/patients")
      .then((res) => setPatients(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    // Remove token and user info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    // Trigger logout in App.jsx
    onLogout();
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 border-r bg-gray-100 flex flex-col justify-between">
        <div>
          <h2 className="p-4 font-semibold">My Patients</h2>
          {patients.map((p) => (
            <div
              key={p._id}
              onClick={() => setActivePatient(p)}
              className={`p-3 cursor-pointer hover:bg-gray-200 ${
                activePatient?._id === p._id ? "bg-gray-300" : ""
              }`}
            >
              {p.name}
            </div>
          ))}
        </div>

        {/* Logout Button at bottom */}
        <button
          onClick={handleLogout}
          className="m-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Chat */}
      <main className="flex-1">
        {activePatient ? (
          <ChatWindow peer={activePatient} peerRole="patient" />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a patient to start chat
          </div>
        )}
      </main>
    </div>
  );
}
