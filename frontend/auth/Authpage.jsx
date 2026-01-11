import { useState } from "react"
import api from "../api/axios"

export default function AuthPage({ onAuth }) {
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "patient"
  })

  const submit = async (isSignup) => {
    const url = isSignup ? "/auth/signup" : "/auth/login"
    const { data } = await api.post(url, form)
    localStorage.setItem("token", data.token)
    onAuth(data.user)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded w-80">
        <select className="w-full mb-2"
          onChange={e => setForm({...form, role: e.target.value})}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <input placeholder="Email" className="input"
          onChange={e => setForm({...form, email: e.target.value})} />

        <input type="password" placeholder="Password" className="input"
          onChange={e => setForm({...form, password: e.target.value})} />

        <button onClick={() => submit(false)} className="btn">Login</button>
        <button onClick={() => submit(true)} className="btn mt-2">Signup</button>
      </div>
    </div>
  )
}
