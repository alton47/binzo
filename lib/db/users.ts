import { createSupabaseServerClient } from "../supabase/server";

export async function getUsers(orgId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("organization_id", orgId);

  if (error) throw error;
  return data;
}
