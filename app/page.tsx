import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-semibold mb-6">Nenga Inventory Manager</h1>

        <p className="text-lg `text-var(--text-secondary)` mb-10">
          Manage products, sales, users and stock in one clean dashboard.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/register" className="btn-primary px-6">
            Get Started
          </Link>

          {/* <Link href="/login" className="btn-outline px-6">
            Login
          </Link> */}
        </div>
      </div>
    </main>
  );
}
