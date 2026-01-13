// src/dashboard/PatientDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import ChatWindow from "../chat/ChatWindow";

export default function PatientDashboard({ onLogout }) {
  const [doctors, setDoctors] = useState([]);
  const [activeDoctor, setActiveDoctor] = useState(null);

  useEffect(() => {
    api
      .get("/assignments/patient/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    onLogout();
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 border-r bg-gray-100 flex flex-col justify-between">
        <div>
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
