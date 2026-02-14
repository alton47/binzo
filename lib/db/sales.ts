import { createSupabaseServerClient } from "../supabase/server";

export async function getRecentSales(orgId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("sales")
    .select("*, products(name)")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}
