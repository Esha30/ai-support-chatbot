// app/api/chat/route.ts

import connectDB from "@/app/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Settings from "@/app/src/lib/model/settings.model";

// ✅ CORS Helper
function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return withCors(NextResponse.json({ message: "Invalid JSON" }, { status: 400 }));
    }

    const { message, ownerId } = body;

    if (!message || !ownerId) {
      return withCors(NextResponse.json({ message: "Missing required fields" }, { status: 400 }));
    }

    await connectDB();
    const setting = await Settings.findOne({ ownerId });

    if (!setting) {
      return withCors(NextResponse.json({ message: "Not configured. Please fill your Dashboard settings." }, { status: 404 }));
    }

    const prompt = `You are a helpful customer support assistant for "${setting.businessName || "this business"}".
Answer ONLY using the knowledge base below. Be concise and friendly.
If the answer is not in the knowledge base, say: "Please contact support at ${setting.supportEmail || "our support team"}."

KNOWLEDGE BASE:
Business Name: ${setting.businessName || "Not provided"}
Support Email: ${setting.supportEmail || "Not provided"}
Info: ${setting.knowledge || "No knowledge provided"}

Customer Question: ${message}
Assistant:`;

    // ✅ Direct REST API call — bypasses SDK v1beta issues entirely
    const apiKey = process.env.GEMINI_API_KEY?.replace(/"/g, "").trim();
    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
        }),
      }
    );

    const data = await apiRes.json();

    if (!apiRes.ok) {
      console.error("❌ Gemini API Error:", JSON.stringify(data));
      return withCors(NextResponse.json({
        message: `AI Error: ${data?.error?.message || "Unknown AI error"}`,
      }, { status: 500 }));
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    return withCors(NextResponse.json({ reply: text }));

  } catch (error: any) {
    console.error("❌ Chat Error:", error.message || error);
    return withCors(NextResponse.json({
      message: `Server Error: ${error.message || "Unknown error"}`,
    }, { status: 500 }));
  }
}

// ✅ Handle CORS preflight
export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

// ✅ Health check
export async function GET() {
  return withCors(NextResponse.json({ message: "Chat API is running ✅" }));
}