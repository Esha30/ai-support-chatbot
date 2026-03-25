import { scalekit } from "@/app/src/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL is not defined" },
        { status: 500 }
      );
    }

    const redirectUri = `${baseUrl}/api/auth/callback`;

    // if getAuthorizationUrl is async
    const url = await scalekit.getAuthorizationUrl(redirectUri);

    console.log("Auth URL:", url);

    return NextResponse.redirect(url, 302); // explicit redirect status
  } catch (error) {
    console.error("Login Error:", error);

    return NextResponse.json(
      { error: "Failed to initiate login" },
      { status: 500 }
    );
  }
}