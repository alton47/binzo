import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-org";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const user = await requireUser();
  const supabase = createSupabaseServerClient();
  const { product_id, quantity } = await req.json();

  // atomic stock reduction
  const { error: stockError } = await supabase.rpc("sell_product_atomic", {
    p_product_id: product_id,
    p_quantity: quantity,
  });

  if (stockError) throw stockError;

  const { data } = await supabase
    .from("sales")
    .insert({
      product_id,
      quantity,
      sold_by: user.id,
    })
    .select()
    .single();

  return NextResponse.json(data);
}
