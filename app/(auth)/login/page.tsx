"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const supabase = createClient();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setLoading(false);
    setMsg(error ? error.message : "Check your email for the magic link!");
  };

  const handleGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl border border-(--border-light) card-shadow">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-(--text-secondary) text-center mb-8 text-sm">
          Sign in to manage your shop
        </p>

        <form onSubmit={handleMagicLink} className="space-y-4">
          <input
            type="email"
            placeholder="name@company.com"
            required
            className="input-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button disabled={loading} className="btn-black">
            {loading ? "Sending..." : "Continue with Email"}
          </button>
        </form>

        <div className="relative my-8 text-center text-xs text-(--text-secondary) uppercase tracking-widest">
          <span className="bg-white px-2 relative z-10">Or</span>
          <div className="absolute top-1/2 left-0 w-full h-px bg-(--border-light)"></div>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full py-3 px-6 border border-(--border-light) rounded-xl font-medium hover:bg-neutral-50 transition-all"
        >
          Continue with Google
        </button>

        {msg && (
          <p className="mt-6 text-center text-sm font-medium text-blue-600">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
