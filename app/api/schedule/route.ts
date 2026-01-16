import { NextResponse } from "next/server";
import { requireFields, isNonEmptyString } from "@/app/utils/validation";
import { buildGeminiPrompt } from "@/app/utils/geminiPrompt";
import { parseGeminiResponse } from "@/app/utils/scheduleParser";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    /* 1️⃣ Validate input */
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

    /* 2️⃣ Build Gemini prompt */
    const geminiPrompt = buildGeminiPrompt(body.prompt);

    /* 3️⃣ Mock Gemini response (STRING ONLY) */
    const dummyGeminiText = JSON.stringify({
      events: [
        {
          title: "Study DSA",
          description: "DSA preparation",
          startTime: "18:00",
          endTime: "20:00",
        },
        {
          title: "Break",
          description: "Short rest",
          startTime: "20:00",
          endTime: "20:30",
        },
      ],
    });

    /* 4️⃣ Parse response */
    const parsed = parseGeminiResponse(dummyGeminiText);

    if (parsed.needsClarification) {
      return NextResponse.json(
        {
          status: "clarification_required",
          message: parsed.clarificationQuestion,
        },
        { status: 400 }
      );
    }

    /* 5️⃣ Success */
    return NextResponse.json({
      status: "ok",
      data: {
        originalPrompt: body.prompt,
        aiPrompt: geminiPrompt,
        events: parsed.events,
      },
    });
  } catch (err) {
    console.error("Schedule API error:", err);
    return NextResponse.json(
      { status: "error", message: "Invalid request" },
      { status: 400 }
    );
  }
}
