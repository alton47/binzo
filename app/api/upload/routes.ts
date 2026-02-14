import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(`products/${Date.now()}-${file.name}`, file);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const publicUrl = supabase.storage
    .from("product-images")
    .getPublicUrl(data.path).data.publicUrl;

  return NextResponse.json({ url: publicUrl });
}
