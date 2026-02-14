"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      if (error.status === 429) {
        setMessage("Too many attempts. Please try again in a few minutes.");
      } else {
        setMessage(error.message);
      }
    } else {
      setMessage("Magic link sent. Check your email.");
    }

    setEmail("");
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="card w-full max-w-md p-10 text-center">
        <h1 className="text-2xl font-semibold mb-2">Welcome</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8">
          Enter your email to sign in
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="name@example.com"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button disabled={loading} className="btn-primary">
            {loading ? "Sending link..." : "Continue with Email"}
          </button>
        </form>

        <div className="my-6 text-sm text-[var(--text-secondary)]">or</div>

        <button onClick={handleGoogleLogin} className="btn-outline w-full">
          Continue with Google
        </button>

        {message && (
          <p className="mt-6 text-sm text-[var(--text-secondary)]">{message}</p>
        )}
      </div>
    </main>
  );
}
