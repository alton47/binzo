import Sidebar from "@/components/dashboard/Sidebar";

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Settings</h1>

        <p className="text-sm text-zinc-500">
          App settings, branding, notifications, and preferences will live here.
        </p>
      </main>
    </div>
  );
}
