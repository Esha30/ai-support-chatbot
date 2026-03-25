// app/api/settings/route.ts
import Settings from "@/app/src/lib/model/settings.model";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/src/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { ownerId, businessName, supportEmail, knowledge } = await req.json();

    if (!ownerId) {
      return NextResponse.json(
        { message: "Owner ID is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Update or create settings
    const settings = await Settings.findOneAndUpdate(
      { ownerId },
      { businessName, supportEmail, knowledge },
      {
        returnDocument: "after", // ✅ replaces deprecated 'new: true'
        upsert: true,            // creates if not exists
      }
    );

    return NextResponse.json(settings, { status: 200 });
  } catch (error: any) {
    console.error("Settings error:", error);
    return NextResponse.json(
      { message: error.message || "Settings error" },
      { status: 500 }
    );
  }
}