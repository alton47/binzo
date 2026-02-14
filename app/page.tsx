import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Inventory Manager</h1>
      <p className="text-neutral-500 max-w-xl mb-10">
        Manage products, track sales, control stock, and scale your business
        with a powerful dashboard.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black"
        >
          Get Started
        </Link>

        <Link
          href="/login"
          className="px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
