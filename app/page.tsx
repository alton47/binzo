"use client";
import { supabase } from "@/lib/supabase/client";

export default function Home() {
  const login = async () => {
    await supabase.auth.signInWithOtp({
      email: "test@example.com",
    });
  };

  return (
    <button onClick={login} className="px-4 py-2 bg-brand text-black rounded">
      Login Test
    </button>
  );
}
