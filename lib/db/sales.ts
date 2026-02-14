import { createSupabaseServerClient } from "../supabase/server";

export async function sellProduct(
  productId: string,
  quantity: number,
  userId: string,
) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.rpc("sell_product_atomic", {
    p_product_id: productId,
    p_quantity: quantity,
    p_sold_by: userId,
  });

  if (error) throw error;
}
