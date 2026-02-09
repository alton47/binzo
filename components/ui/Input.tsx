"use client";

export default function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm
                 focus:outline-none focus:border-zinc-400"
    />
  );
}
