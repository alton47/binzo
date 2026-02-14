"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setState("loading");
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      setState("error");
      if (error.status === 429) {
        setMessage("Too many attempts. Try again in a few minutes.");
      } else {
        setMessage("Something went wrong. Try again.");
      }
    } else {
      setState("success");
      setMessage("Magic link sent. Check your email.");
    }

    setEmail("");
  };

  const handleGoogleLogin = async () => {
    setState("loading");
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
        {state === "success" ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Check your email</h2>
            <p className="text-[var(--text-secondary)]">{message}</p>
          </>
        ) : state === "error" ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Try again</h2>
            <p className="text-red-500 mb-6">{message}</p>
            <button
              onClick={() => setState("idle")}
              className="btn-primary w-full"
            >
              Back
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-2">Welcome</h1>

            <p className="text-sm text-[var(--text-secondary)] mb-8">
              Enter your email to sign in
            </p>

            <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="name@example.com"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                disabled={state === "loading"}
                className="btn-primary cursor-pointer"
              >
                {state === "loading" ? "Sending..." : "Continue with Email"}
              </button>
            </form>

            <div className="separator my-6">or</div>

            <button
              onClick={handleGoogleLogin}
              className="btn-outline w-full hover:bg-neutral-100 transition cursor-pointer"
            >
              Continue with Google
            </button>
          </>
        )}
      </div>
    </main>
  );
}
