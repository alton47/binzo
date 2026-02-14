import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen `bg-bg-main` flex flex-col items-center justify-center text-center px-6">
      <div className="space-y-4 mb-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          Kariakoo<span className="text-neutral-400">POS</span>
        </h1>
        <p className="text-(--text-secondary) max-w-lg mx-auto text-lg">
          The stealth inventory system for modern Tanzanian shops. Fast,
          multi-tenant and atomic.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/login" className="btn-black px-1 py-4">
          Open Your Shop
        </Link>
        {/*   <Link
          href="/login"
          className="px-1 py-4 border border-(--border-light) rounded-xl font-medium hover:bg-white transition-all"
        >
          View Demo
        </Link> */}
      </div>
    </main>
  );
}
