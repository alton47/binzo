// import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getMyProfile() {
  return {
    id: "3ef67fa2-1f2a-4e82-84b4-2093e4132215",
    organization_id: "c5dacf8f-4bd0-4b02-acf4-68f33db24c54",
    role: "admin",
  };
}

// export async function getMyProfile() {
//   const supabase = await createSupabaseServerClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) return null;

//   const { data: profile } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("id", user.id)
//     .single();

//   return profile;
// }
