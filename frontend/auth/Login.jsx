import { useState } from "react"
import api from "../api/axios"

export default function Login({ onLogin, onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" })

  const login = async () => {
    const { data } = await api.post("/auth/login", form)
    localStorage.setItem("token", data.token)
    onLogin(data.user)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <label className="block mb-2 text-gray-700">Email</label>
        <input
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <label className="block mb-2 text-gray-700">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={login}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded mb-4 transition-colors"
        >
          Login
        </button>

        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <span
            onClick={() => onSwitch("signup")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  )
}
