import { NextResponse } from "next/server";
import { requireFields, isNonEmptyString } from "@/app/utils/validation";
import { buildGeminiPrompt } from "@/app/utils/geminiPrompt";
import { parseGeminiResponse } from "@/app/utils/scheduleParser";
import { GeminiScheduleResponse } from "@/app/types/gemini";
import { getAuthenticatedClient } from "@/app/utils/auth";
import { google } from "googleapis";
import { addTasksToSheet } from "@/app/utils/sheetsHelpers";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

console.log("✅ Gemini key loaded:", !!process.env.GEMINI_API_KEY);

/* ---------------- Helper: ensure endTime ---------------- */
function ensureEndTime(startTime: string, endTime?: string) {
  if (endTime && endTime.length === 5) return endTime;

  const [h, m] = startTime.split(":").map(Number);
  const d = new Date();
  d.setHours(h + 1, m, 0, 0); // default +1 hour
  return d.toTimeString().slice(0, 5);
}

export async function POST(req: Request) {
  try {
    /* ---------------- 1️⃣ Validate input ---------------- */
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

    /* ---------------- 2️⃣ Build Gemini prompt ---------------- */
    const finalPrompt = buildGeminiPrompt(body.prompt);

    /* ---------------- 3️⃣ Call Gemini (ONCE) ---------------- */
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
              "🚦 Gemini API limit reached. Please wait a minute and try again.",
          },
          { status: 429 }
        );
      }
      throw err;
    }

    /* ---------------- 4️⃣ Parse Gemini response ---------------- */
    const parsedResponse: GeminiScheduleResponse =
      parseGeminiResponse(rawText);

    console.log("📅 Gemini parsed response:", parsedResponse);

    if (!parsedResponse.events || parsedResponse.events.length === 0) {
      return NextResponse.json(
        { status: "error", message: "No events generated" },
        { status: 400 }
      );
    }

    /* ---------------- 5️⃣ Google Auth ---------------- */
    const auth = await getAuthenticatedClient();

    /* ---------------- 6️⃣ Calendar Sync (IST SAFE) ---------------- */
    const calendar = google.calendar({ version: "v3", auth });

    for (const event of parsedResponse.events) {
      const safeEndTime = ensureEndTime(
        event.startTime,
        event.endTime
      );

      console.log("📌 Calendar insert:", {
        date: event.date,
        start: event.startTime,
        end: safeEndTime,
      });

      await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: event.title,
          description: event.description || "",
          start: {
            dateTime: `${event.date}T${event.startTime}:00`,
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: `${event.date}T${safeEndTime}:00`,
            timeZone: "Asia/Kolkata",
          },
        },
      });
    }

    /* ---------------- 7️⃣ Sheets Sync ---------------- */
    await addTasksToSheet(auth, parsedResponse.events);

    /* ---------------- 8️⃣ Success ---------------- */
    return NextResponse.json({
      status: "ok",
      data: parsedResponse,
    });

  } catch (error) {
    console.error("❌ Gemini route error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
