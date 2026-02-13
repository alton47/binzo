import { NextResponse } from "next/server";
import { productSchema } from "@/lib/validations/product.schema";
import { getMyProfile } from "@/lib/auth/get-profile";
import { canManageProducts } from "@/lib/auth/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const profile = await getMyProfile();

  if (!profile || !canManageProducts(profile.role)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 },
      );
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
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
