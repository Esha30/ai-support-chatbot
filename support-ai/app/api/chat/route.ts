// app/api/chat/route.ts

import connectDB from "@/app/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Settings from "@/app/src/lib/model/settings.model";
import { GoogleGenAI } from "@google/genai";

// ✅ Helper for CORS
function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body safely
    const body = await req.json().catch(() => null);
    if (!body) {
      return withCors(
        NextResponse.json(
          { message: "Invalid JSON in request body" },
          { status: 400 }
        )
      );
    }

    const { message, ownerId } = body;

    if (!message || !ownerId) {
      return withCors(
        NextResponse.json(
          { message: "Message and ownerId are required!" },
          { status: 400 }
        )
      );
    }

    // Connect DB
    await connectDB();

    // Get settings
    const setting = await Settings.findOne({ ownerId });

    if (!setting) {
      return withCors(
        NextResponse.json(
          { message: "Chatbot is not configured yet!" },
          { status: 400 }
        )
      );
    }

    // Knowledge
    const KNOWLEDGE = `
Business Name: ${setting.businessName || "Not provided"}
Support Email: ${setting.supportEmail || "Not provided"}
Additional Knowledge:
${setting.knowledge || "No knowledge provided"}
`;

    // Prompt
    const prompt = `
You are a professional customer support assistant for this business.

Use ONLY the information provided below to answer the customer's question.
Do NOT invent anything.

If unrelated, reply exactly:
"Please contact support."

--------------------
${KNOWLEDGE}
--------------------
Question: ${message}
Answer:
`;

    // Gemini init
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Generate response
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // ✅ Extract actual text safely
    const text =
      aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Please contact support.";

    // Return clean response
    return withCors(
      NextResponse.json({
        reply: text,
      })
    );

  } catch (error: any) {
    return withCors(
      NextResponse.json(
        {
          message: `Error processing message: ${error.message}`,
        },
        { status: 500 }
      )
    );
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