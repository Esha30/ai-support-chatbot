// app/api/chat/route.ts

import connectDB from "@/app/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Settings from "@/app/src/lib/model/settings.model";
import { GoogleGenAI } from "@google/genai";

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

    const { message, ownerId, history = [] } = body;

    if (!message || !ownerId) {
      return withCors(NextResponse.json({ message: "Missing required fields" }, { status: 400 }));
    }

    await connectDB();
    const setting = await Settings.findOne({ ownerId });

    if (!setting) {
      return withCors(NextResponse.json({ message: "Not configured. Please fill your Dashboard settings." }, { status: 404 }));
    }

    const systemPrompt = `You are a professional customer support assistant for "${setting.businessName || "this business"}".
Answer ONLY using the knowledge base below. Be concise and friendly.
If the answer is not in the knowledge base, say: "Please contact support at ${setting.supportEmail || "our support team"}."

KNOWLEDGE BASE:
Business Name: ${setting.businessName || "Not provided"}
Support Email: ${setting.supportEmail || "Not provided"}
Info: ${setting.knowledge || "No knowledge provided"}`;

    // Build the full contents array including history
    // Only include valid user/model pairs (must start with user)
    const userMessages = (history as { role: string; text: string }[]).filter(
      (m) => m.role === "user"
    );

    // Build contents: alternating user/model pairs from history + current message
    const validPairs: { role: string; parts: { text: string }[] }[] = [];
    for (const msg of history as { role: string; text: string }[]) {
      if (validPairs.length === 0 && msg.role !== "user") continue; // skip leading model msgs
      validPairs.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      });
    }

    // Add the current user message
    const contents = [
      ...validPairs,
      { role: "user", parts: [{ text: `${systemPrompt}\n\nCustomer: ${message}` }] },
    ];

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents,
    });

    const text =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
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