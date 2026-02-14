import { supabaseAdmin } from "../supabase/admin";

export async function createOrganization(name: string, currency: string) {
  const { data, error } = await supabaseAdmin
    .from("organizations")
    .insert({ name, currency })
    .select()
    .single();

  if (error) throw error;
  return data;
}
