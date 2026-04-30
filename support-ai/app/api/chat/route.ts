// app/api/chat/route.ts

import connectDB from "@/app/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Settings from "@/app/src/lib/model/settings.model";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ... (withCors helper stays same)

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
      return withCors(NextResponse.json({ message: "Not configured" }, { status: 400 }));
    }

    const KNOWLEDGE = `
Business Name: ${setting.businessName || "Not provided"}
Support Email: ${setting.supportEmail || "Not provided"}
Knowledge: ${setting.knowledge || "No knowledge provided"}
`;

    const prompt = `
You are a professional customer support assistant for "${setting.businessName}".
Use ONLY the provided knowledge to answer. Be concise and friendly.
If the answer isn't in the knowledge, say "Please contact support at ${setting.supportEmail}."

KNOWLEDGE:
${KNOWLEDGE}

Customer Question: ${message}`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format history for the official SDK
    const chat = model.startChat({
      history: history.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return withCors(NextResponse.json({ reply: text }));
  } catch (error: any) {
    console.error("❌ Chat Error Detail:", error.message || error);
    return withCors(NextResponse.json({ 
      message: `Server Error: ${error.message || "Unknown error"}`,
      debug: error.stack
    }, { status: 500 }));
  }
}

// ✅ Handle preflight (VERY IMPORTANT for frontend)
export const OPTIONS = async () => {
  return withCors(new NextResponse(null, { status: 204 }));
};

// ✅ Optional GET (for testing)
export async function GET() {
  return withCors(
    NextResponse.json({ message: "API is working" })
  );
}