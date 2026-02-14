"use client";

import { useState } from "react";

export default function AddProductForm({
  onsuccess,
}: {
  onsuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: Number(price),
          stock: Number(stock),
        }),
      });

      if (res.ok) {
        // Reset form fields
        setName("");
        setPrice("");
        setStock("");
        // Trigger the refresh in the parent page
        onsuccess();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add product");
      }
    } catch (error) {
      alert("Something went wrong. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-neutral-50 rounded-2xl border border-(--border-light) space-y-4"
    >
      <input
        required
        className="input-base w-full"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />
      <div className="flex gap-4">
        <input
          required
          className="input-base w-full"
          placeholder="Price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={loading}
        />
        <input
          required
          className="input-base w-full"
          placeholder="Initial Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          disabled={loading}
        />
      </div>
      <button type="submit" className="btn-black w-full" disabled={loading}>
        {loading ? "Adding..." : "Add to Inventory"}
      </button>
    </form>
  );
}
