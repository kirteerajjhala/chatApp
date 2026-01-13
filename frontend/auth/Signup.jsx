import { useEffect, useState } from "react"
import api from "../api/axios"

export default function Signup({ onSwitch }) {
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    doctorIds: []
  })

  useEffect(() => {
    api.get("/auth/doctors").then(res => setDoctors(res.data))
  }, [])

  const toggleDoctor = (id) => {
    setForm(prev => ({
      ...prev,
      doctorIds: prev.doctorIds.includes(id)
        ? prev.doctorIds.filter(d => d !== id)
        : [...prev.doctorIds, id]
    }))
  }

  const signup = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Fill all fields")
      return
    }
    if (form.role === "patient" && form.doctorIds.length === 0) {
      alert("Select at least one doctor")
      return
    }

    await api.post("/auth/signup", form)
    alert("Account created. Please login.")
    onSwitch("login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

        <label className="block mb-2 text-gray-700">Role</label>
        <select
          className="w-full p-2 border rounded mb-4"
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        {form.role === "patient" && (
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Assign Doctors</label>
            {doctors.map(d => (
              <div key={d._id} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={form.doctorIds.includes(d._id)}
                  onChange={() => toggleDoctor(d._id)}
                />
                <span>{d.name}</span>
              </div>
            ))}
          </div>
        )}

        <input
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="w-full p-2 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={signup}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded mb-4 transition-colors"
        >
          Signup
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <span
            onClick={() => onSwitch("login")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}
