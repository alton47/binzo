"use client";

import { ReactNode } from "react";

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-md bg-white dark:bg-neutral-900 p-10 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800">
      {children}
    </div>
  );
}
