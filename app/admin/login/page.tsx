"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 Starting login process...');
    console.log('🌐 Current environment:', process.env.NODE_ENV);
    console.log('🔗 Base URL:', window.location.origin);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include", // wajib biar cookie tersimpan
      });

      console.log('📡 Login response status:', res.status);
      console.log('📄 Response headers:', Object.fromEntries(res.headers.entries()));
      
      if (res.ok) {
        const data = await res.json();
        console.log('📄 Login response data:', data);
        
        // Store token in localStorage for client-side authentication
        if (data.token) {
          console.log('💾 Storing token in localStorage...');
          localStorage.setItem("token", data.token);
          console.log('✅ Token stored successfully');
          
          // Verify token was stored
          const storedToken = localStorage.getItem("token");
          console.log('🔍 Verification - token exists in localStorage:', !!storedToken);
          console.log('🔍 Token length:', storedToken?.length || 0);
        } else {
          console.log('❌ No token received in response');
          setError("Login failed - no token received");
          return;
        }
        
        console.log('🚀 Redirecting to admin dashboard...');
        // Small delay to ensure localStorage is set before redirect
        setTimeout(() => {
          window.location.href = "/admin";
        }, 100);
      } else {
        const data = await res.json();
        console.log('❌ Login failed:', data);
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error('🚨 Login error:', error);
      setError("Network error. Please check your connection and try again.");
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
