import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getProducts() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("products").select("*");
  return data;
}
