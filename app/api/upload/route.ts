import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(`${Date.now()}-${file.name}`, file);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(data.path);
  return NextResponse.json({ url: publicUrl });
}
