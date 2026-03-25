// app/api/settings/get/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/src/lib/db";
import Settings from "@/app/src/lib/model/settings.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB(); // ensure MongoDB is connected

    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId");

    if (!ownerId) {
      return NextResponse.json(
        { message: "ownerId is required" },
        { status: 400 }
      );
    }

    const setting = await Settings.findOne({ ownerId });

    if (!setting) {
      return NextResponse.json(
        { message: "Settings not found for this ownerId" },
        { status: 404 }
      );
    }

    return NextResponse.json(setting, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching settings:", error.message);
    return NextResponse.json(
      { message: `Error fetching settings: ${error.message}` },
      { status: 500 }
    );
  }
}