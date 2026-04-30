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

    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain") || "";

    const redirectUri = `${baseUrl}/api/auth/callback`;

    // Pass the domain to ScaleKit so it knows which SSO provider to use
    const url = await scalekit.getAuthorizationUrl(redirectUri, {
      domain: domain,
    });

    console.log("Auth URL:", url);

    return NextResponse.redirect(url, 302);
  } catch (error) {
    console.error("Login Error:", error);

    return NextResponse.json(
      { error: "Failed to initiate login" },
      { status: 500 }
    );
  }
}