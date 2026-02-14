import { getMyProfile } from "@/lib/auth/get-profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function UsersPage() {
  const profile = await getMyProfile();
  const supabase = await createSupabaseServerClient();

  const { data: team } = await supabase
    .from("profiles")
    .select("*")
    .eq("organization_id", profile?.organization_id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <button className="btn-black w-auto!">Invite Seller</button>
      </div>

      <div className="grid gap-4">
        {team?.map((member) => (
          <div
            key={member.id}
            className="bg-white p-4 rounded-2xl border border-(--border-light) flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{member.name || member.email}</p>
              <p className="text-xs text-(--text-secondary) uppercase">
                {member.role}
              </p>
            </div>
            <span className="text-xs bg-neutral-100 px-3 py-1 rounded-full text-neutral-500">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
