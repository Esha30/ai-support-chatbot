import { scalekit } from "@/app/src/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL not defined" },
        { status: 500 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { message: "Authorization code not found" },
        { status: 400 }
      );
    }

    const redirectUri = `${baseUrl}/api/auth/callback`;

    // Exchange code for session
    const session = await scalekit.authenticateWithCode(code, redirectUri);

    console.log("Received session:", session);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "No access token received" },
        { status: 500 }
      );
    }

    // Redirect back to home page
    const response = NextResponse.redirect(new URL("/", baseUrl));

    // Set HTTP-only cookie valid for 30 days
    response.cookies.set("access_token", session.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: "/",
      sameSite: "lax",
    });

    // Optional: if session has refreshToken, set that too for 30 days
    if (session.refreshToken) {
      response.cookies.set("refresh_token", session.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
        sameSite: "lax",
      });
    }

    return response;

  } catch (error) {
    console.error("Callback Error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}