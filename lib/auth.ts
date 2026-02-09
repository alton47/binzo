import { supabase } from "./supabase/client";

export async function createProfile(user: any) {
  const { data: org } = await supabase
    .from("organizations")
    .insert({ name: "Default Shop" })
    .select()
    .single();

  await supabase.from("profiles").insert({
    id: user.id,
    org_id: org.id,
    name: user.email,
    role: "seller",
  });
}
