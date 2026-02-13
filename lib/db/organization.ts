import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createOrganizationWithAdmin(
  userId: string,
  name: string,
) {
  const { data: org } = await supabaseAdmin
    .from("organizations")
    .insert({ name })
    .select()
    .single();

  await supabaseAdmin.from("profiles").insert({
    id: userId,
    organization_id: org.id,
    role: "admin",
    name: "Owner",
  });

  return org;
}
