import { NextResponse } from "next/server";
import { requireFields, isNonEmptyString } from "@/app/utils/validation";
import { buildGeminiPrompt } from "@/app/utils/geminiPrompt";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    /* 1️⃣ Validate input */
    const body = await req.json();

    const requiredCheck = requireFields(body, ["prompt"]);
    if (!requiredCheck.valid) {
      return NextResponse.json(
        { status: "error", message: requiredCheck.message },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(body.prompt)) {
      return NextResponse.json(
        { status: "error", message: "Prompt must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { status: "error", message: "Gemini API key missing" },
        { status: 500 }
      );
    }

    /* 2️⃣ Build prompt */
    const finalPrompt = buildGeminiPrompt(body.prompt);

    /* 3️⃣ Call Gemini */
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });

    let rawText = "";

    try {
      const result = await model.generateContent(finalPrompt);
      rawText = result.response.text();
    } catch (err: any) {
      const msg = err?.message || "";

      if (msg.includes("429") || msg.includes("quota")) {
        return NextResponse.json(
          {
            status: "error",
            message:
              "🚦 Gemini API limit reached. Please wait and try again.",
          },
          { status: 429 }
        );
      }
      throw err;
    }

    /* 4️⃣ Return RAW Gemini text ONLY */
    return NextResponse.json({
      status: "ok",
      rawText,
    });

  } catch (error) {
    console.error("❌ Gemini route error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
