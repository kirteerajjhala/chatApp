// src/dashboard/DoctorDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import ChatWindow from "../chat/ChatWindow";

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [activePatient, setActivePatient] = useState(null);

  useEffect(() => {
    api
      .get("/assignments/doctor/patients")
      .then((res) => setPatients(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 border-r bg-gray-100">
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
