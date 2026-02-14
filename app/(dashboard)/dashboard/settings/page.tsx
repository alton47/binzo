import { getMyProfile } from "@/lib/auth/get-profile";

export default async function SettingsPage() {
  const profile = await getMyProfile();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-(--text-secondary)">
          Manage your shop configuration
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="font-semibold text-lg">Shop Profile</h3>
        <div className="p-6 bg-white rounded-3xl border border-(--border-light) space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-neutral-400">
              Shop Name
            </label>
            <input
              className="input-base mt-1"
              defaultValue={profile?.organizations?.name}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-neutral-400">
              Currency
            </label>
            <select className="input-base mt-1">
              <option>TSH (Tanzanian Shilling)</option>
              <option>USD (US Dollar)</option>
            </select>
          </div>
          <button className="btn-black w-auto! px-8">Save Changes</button>
        </div>
      </section>
    </div>
  );
}
