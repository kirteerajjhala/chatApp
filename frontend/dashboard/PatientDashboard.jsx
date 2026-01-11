// src/dashboard/PatientDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import ChatWindow from "../chat/ChatWindow";

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [activeDoctor, setActiveDoctor] = useState(null);

  useEffect(() => {
    api
      .get("/assignments/patient/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 border-r bg-gray-100">
        <h2 className="p-4 font-semibold">My Doctors</h2>
        {doctors.map((d) => (
          <div
            key={d._id}
            onClick={() => setActiveDoctor(d)}
            className={`p-3 cursor-pointer hover:bg-gray-200 ${
              activeDoctor?._id === d._id ? "bg-gray-300" : ""
            }`}
          >
            {d.name}
          </div>
        ))}
      </aside>

      {/* Chat */}
      <main className="flex-1">
        {activeDoctor ? (
          <ChatWindow peer={activeDoctor} peerRole="doctor" />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a doctor to start chat
          </div>
        )}
      </main>
    </div>
  );
}
