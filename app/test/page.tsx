"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function TestPage() {
  const [status, setStatus] = useState("testing...");

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .then(({ error }) => {
        if (error) setStatus("❌ Error: " + error.message);
        else setStatus("✅ Supabase connected!");
      });
  }, []);

  return <div className="p-6 text-xl">{status}</div>;
}
