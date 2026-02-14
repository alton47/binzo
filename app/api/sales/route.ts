import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/auth/get-profile";

export async function POST(req: Request) {
  const profile = await getMyProfile();
  if (!profile)
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { product_id, quantity } = await req.json();

  const supabase = await createSupabaseServerClient();

  // Call the ATOMIC SQL function we made earlier
  const { error } = await supabase.rpc("sell_product_atomic", {
    p_product_id: product_id,
    p_quantity: quantity,
    p_sold_by: profile.id,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
