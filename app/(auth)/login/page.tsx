"use client";

import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const sendLink = async () => {
    if (!email || loading) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({ email });

    setLoading(false);

    if (error) {
      setError("Too many attempts. Please wait a moment.");
    } else {
      setSent(true);
    }
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: location.origin },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-xl"
      >
        {!sent ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Binzo</h1>
              <p className="text-sm text-zinc-500">Sign in to your workspace</p>
            </div>

            {/* Email */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendLink();
              }}
              className="space-y-3"
            >
              <input
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm
                           focus:border-zinc-400 focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full rounded-xl bg-orange-500 py-3 text-sm font-medium
                           text-white transition hover:bg-orange-600
                           disabled:opacity-60"
              >
                {/* <Mail size={18} /> */}
                {loading ? "Sending link…" : "Send magic link"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs text-zinc-400">OR</span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            {/* Google */}
            <button
              onClick={loginWithGoogle}
              className="cursor-pointer w-full rounded-xl border border-zinc-300 py-3 text-sm
                         transition hover:bg-zinc-50 active:scale-[0.98]"
            >
              Continue with Google
            </button>

            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}
          </div>
        ) : (
          /* Success state */
          <div className="space-y-4 text-center">
            <Mail className="mx-auto text-orange-500" size={40} />
            <h2 className="text-xl font-semibold">Check your email</h2>
            <p className="text-sm text-zinc-500">
              We sent a sign-in link to <br />
              <span className="font-medium text-zinc-700">{email}</span>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
