// app/api/chat/route.ts

import connectDB from "@/app/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Settings from "@/app/src/lib/model/settings.model";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const KNOWLEDGE = `
Business Name: ${setting.businessName || "Not provided"}
Support Email: ${setting.supportEmail || "Not provided"}
Knowledge Base: ${setting.knowledge || "No knowledge provided"}
`;

    const systemPrompt = `You are a professional customer support assistant for "${setting.businessName}".
Use ONLY the provided knowledge base to answer questions. Be concise and friendly.
If the answer is not in the knowledge base, say "Please contact our support team at ${setting.supportEmail}."

KNOWLEDGE BASE:
${KNOWLEDGE}`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });

    // Pass conversation history - must start with 'user' role (Google AI requirement)
    const validHistory = history
      .map((msg: { role: string; text: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }))
      .filter((_: any, i: number, arr: any[]) => {
        // Drop everything before the first user message
        const firstUserIdx = arr.findIndex((m: any) => m.role === "user");
        return i >= firstUserIdx;
      });

    const chat = model.startChat({ history: validHistory });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

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