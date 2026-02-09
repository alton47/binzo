"use client";

export default function Button({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm transition
        ${
          variant === "primary"
            ? "bg-brand text-white hover:opacity-90"
            : "hover:bg-zinc-100"
        }`}
    >
      {children}
    </button>
  );
}
