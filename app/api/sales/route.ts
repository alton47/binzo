import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-org";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const user = await requireUser();

  const supabase = await createSupabaseServerClient();

  const { product_id, quantity } = await req.json();

  const { error } = await supabase.rpc("sell_product_atomic", {
    p_product_id: product_id,
    p_quantity: quantity,
    p_sold_by: user.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
