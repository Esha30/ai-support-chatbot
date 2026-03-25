import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();

  // ✅ delete cookies properly
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token"); // optional but recommended

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_APP_URL not defined" },
      { status: 500 }
    );
  }

  // ✅ correct redirect
  return NextResponse.redirect(new URL("/", baseUrl));
}