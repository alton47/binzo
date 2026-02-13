import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-org";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createOrganizationWithAdmin } from "@/lib/db/organization";

export async function POST() {
  const user = await requireUser();

  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (existing) {
    return NextResponse.json({ ok: true });
  }

  const org = await createOrganizationWithAdmin(user.id, "My Shop");

  return NextResponse.json({ org });
}
