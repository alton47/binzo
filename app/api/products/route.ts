import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-org";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  await requireUser();
  const supabase = createSupabaseServerClient();

  const { data } = await supabase.from("products").select("*");

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  await requireUser();
  const supabase = createSupabaseServerClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("products")
    .insert(body)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json(data);
}
