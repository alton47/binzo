"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import AuthCard from "@/components/ui/AuthCard";

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
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
        setMessage("Too many requests. Come back in a few minutes.");
      } else {
        setMessage(error.message);
      }
    } else {
      setMessage("Magic link sent. Check your email.");
    }

    setEmail(""); // clear input always
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
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-black px-4">
      <AuthCard>
        <h1 className="text-2xl font-semibold text-center mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-neutral-500 text-center mb-8">
          Sign in to your inventory manager
        </p>

        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="name@example.com"
            className="px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90 transition"
          >
            {loading ? "Sending..." : "Continue with Email"}
          </button>
        </form>

        <div className="my-6 text-center text-sm text-neutral-400">or</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          Continue with Google
        </button>

        {message && (
          <p className="mt-6 text-sm text-center text-neutral-500">{message}</p>
        )}
      </AuthCard>
    </main>
  );
}
