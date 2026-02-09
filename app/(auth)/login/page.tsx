"use client";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const login = async () => {
    await supabase.auth.signInWithOtp({ email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Binzo Login</h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full border rounded px-3 py-2"
        />

        <button
          onClick={login}
          className="w-full bg-brand text-white py-2 rounded"
        >
          Send magic link
        </button>
      </div>
    </div>
  );
}
