"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include", // wajib biar cookie tersimpan
    });

    if (res.ok) {
      window.location.href = "/admin"; // <--- redirect langsung ke dashboard
    } else {
      const data = await res.json();
      setError(data.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-6 rounded shadow-md w-96 text-white"
      >
        <h1 className="text-2xl mb-4 font-bold">Admin Login</h1>

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-3 bg-gray-800 rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 bg-gray-800 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-yellow-400 text-black p-2 rounded font-bold"
        >
          Login
        </button>
      </form>
    </div>
  );
}
