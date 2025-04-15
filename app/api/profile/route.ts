import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/user/user";

export async function GET() {
  const profile = await getCurrentUserProfile();
  return NextResponse.json(profile);
}
