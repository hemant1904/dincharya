import { GeminiScheduleResponse } from "@/app/types/gemini";

/* Helper: round current time to next hour */
function getNextHour(): string {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);
  return now.toTimeString().slice(0, 5); // HH:mm
}

/* Helper: add 1 hour */
function addOneHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  d.setHours(d.getHours() + 1);
  return d.toTimeString().slice(0, 5);
}

export function parseGeminiResponse(rawText: string): GeminiScheduleResponse {
  try {
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const json = JSON.parse(cleaned);

    if (!Array.isArray(json.events)) {
      throw new Error("Events missing");
    }

    const today = new Date().toISOString().split("T")[0];

    const events = json.events.map((e: any) => {
      let date = e.date || today;

      let startTime = e.startTime;
      let endTime = e.endTime;

      // 🚨 SAFETY: Fix missing or invalid times
      if (!startTime || !/^\d{2}:\d{2}$/.test(startTime)) {
        startTime = getNextHour();
      }

      if (!endTime || !/^\d{2}:\d{2}$/.test(endTime)) {
        endTime = addOneHour(startTime);
      }

      return {
        title: e.title || "Task",
        description: e.description || "",
        date,
        startTime,
        endTime,
      };
    });

    return {
      needsClarification: false,
      events,
    };
  } catch (err) {
    console.error("Gemini parse error:", rawText);

    return {
      needsClarification: true,
      clarificationQuestion:
        "Please clarify time, e.g. '10 pm today' or '3:30 am tomorrow'",
    };
  }
}
