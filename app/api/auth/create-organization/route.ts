import { NextResponse } from "next/server";
import { createOrganization } from "@/lib/db/organization";

export async function POST(req: Request) {
  const { name, currency } = await req.json();

  if (!name || !currency) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    const org = await createOrganization(name, currency);
    return NextResponse.json(org);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
