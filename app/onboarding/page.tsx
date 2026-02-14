"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Call our ensure-profile/create-org API
    const res = await fetch("/api/auth/ensure-profile", {
      method: "POST",
      body: JSON.stringify({ shopName }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Failed to create shop");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center `bg-bg-main`">
      <div className="card-shadow bg-white p-10 rounded-3xl w-full max-w-md border border-(--border-light)">
        <h1 className="text-2xl font-bold mb-2">Configure Your Shop</h1>
        <p className="text-(--text-secondary) mb-8">
          What should we call your business?
        </p>
        <form onSubmit={handleCreateShop} className="space-y-4">
          <input
            className="input-base"
            placeholder="e.g. Kariakoo Electronics"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />
          <button disabled={loading} className="btn-black">
            {loading ? "Setting up..." : "Launch Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
