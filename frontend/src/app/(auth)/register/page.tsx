"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        // Auto sign-in
        await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
        {error && <div className="text-red-500 mb-4 p-3 bg-red-500/10 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="p-3 rounded-lg bg-white/5 border border-white/20"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-lg bg-white/5 border border-white/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-lg bg-white/5 border border-white/20"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <button type="submit" className="bg-primary hover:bg-primary-hover p-3 rounded-lg font-bold transition-colors">
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          Already have an account? <Link href="/login" className="text-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
