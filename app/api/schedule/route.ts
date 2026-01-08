import { NextResponse } from "next/server";
import { requireFields, isNonEmptyString } from "@/app/utils/validation";
import { buildGeminiPrompt } from "@/app/utils/geminiPrompt";
import { parseGeminiSchedule } from "@/app/utils/scheduleParser";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1️⃣ Validate input
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

    // 2️⃣ Build Gemini prompt
    const geminiPrompt = buildGeminiPrompt(body.prompt);

    // 3️⃣ Dummy Gemini response (mock AI output)
    const dummyGeminiResponse = {
      tasks: [
        {
          title: "Study DSA",
          startTime: "18:00",
          endTime: "20:00",
          category: "study"
        },
        {
          title: "Break",
          startTime: "20:00",
          endTime: "20:30",
          category: "break"
        }
      ]
    };

    // 4️⃣ Parse AI response
    const parsed = parseGeminiSchedule(dummyGeminiResponse);
    if (!parsed.valid || !parsed.tasks) {
      return NextResponse.json(
        { status: "error", message: parsed.message },
        { status: 500 }
      );
    }

    // 5️⃣ Send tasks to Calendar (mock)
    const calendarEvents = parsed.tasks.map((task, index) => ({
      id: `mock-event-${index + 1}`,
      title: task.title,
      startTime: task.startTime,
      endTime: task.endTime,
      status: "created"
    }));

    // 6️⃣ Log habits to Sheets (mock)
    const habitLogs = parsed.tasks.map((task) => ({
      habit: task.title,
      date: new Date().toISOString().split("T")[0],
      status: "logged"
    }));

    // 7️⃣ Final combined response
    return NextResponse.json({
      status: "ok",
      message: "Schedule created, calendar updated, habits logged",
      data: {
        originalPrompt: body.prompt,
        aiPrompt: geminiPrompt,
        calendar: calendarEvents,
        sheets: habitLogs
      }
    });

  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid request body" },
      { status: 400 }
    );
  }
}
