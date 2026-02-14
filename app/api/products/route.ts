import { NextResponse } from "next/server";
import { productSchema } from "@/lib/validations/product.schema";
import { getMyProfile } from "@/lib/auth/get-profile";
import { canManageProducts } from "@/lib/auth/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const profile = await getMyProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("organization_id", profile.organization_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const profile = await getMyProfile();

  if (!profile || !canManageProducts(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...parsed.data,
      organization_id: profile.organization_id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
