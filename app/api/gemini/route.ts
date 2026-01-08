import { NextResponse } from "next/server";
import { requireFields, isNonEmptyString } from "@/app/utils/validation";
import { buildGeminiPrompt } from "@/app/utils/geminiPrompt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1️⃣ Required field check
    const requiredCheck = requireFields(body, ["prompt"]);
    if (!requiredCheck.valid) {
      return NextResponse.json(
        { status: "error", message: requiredCheck.message },
        { status: 400 }
      );
    }

    // 2️⃣ Type validation
    if (!isNonEmptyString(body.prompt)) {
      return NextResponse.json(
        { status: "error", message: "Prompt must be a non-empty string" },
        { status: 400 }
      );
    }

    // 3️⃣ Build Gemini Prompt (MAIN LOGIC)
    const finalPrompt = buildGeminiPrompt(body.prompt);

    // 4️⃣ Return generated prompt
    return NextResponse.json({
      status: "ok",
      message: "Gemini prompt generated successfully",
      data: {
        prompt: finalPrompt
      }
    });

  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Invalid request body" },
      { status: 400 }
    );
  }
}
