import { NextResponse } from "next/server";
import { getMyProfile } from "@/lib/auth/get-profile";
import { getUsers } from "@/lib/db/users";

export async function GET() {
  const profile = await getMyProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await getUsers(profile.organization_id);
  return NextResponse.json(users);
}
