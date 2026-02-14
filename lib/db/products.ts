import { createSupabaseServerClient } from "../supabase/server";

export async function getProducts(orgId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("organization_id", orgId);

  if (error) throw error;
  return data;
}
