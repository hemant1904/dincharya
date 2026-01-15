import { NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/app/utils/auth";
import { createCalendarEvent } from "@/app/utils/calendarHelpers";
import { calendar } from "googleapis/build/src/apis/calendar";

export async function POST(req: Request) {
  try {
    const { events } = await req.json();

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: "No events provided" },
        { status: 400 }
      );
    }

    // 1️⃣ Get authenticated Google client
    const authClient = await getAuthenticatedClient();

    // 2️⃣ Create multiple events
    const createdEvents = [];
    const cal = calendar({ version: "v3", auth: authClient });

    for (const e of events) {
      const res = await cal.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: e.title,
          description: e.description || "",
          start: {
            dateTime: `${e.date}T${e.startTime}:00`,
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: `${e.date}T${e.endTime}:00`,
            timeZone: "Asia/Kolkata",
          },
        },
      });

      createdEvents.push({
        ...e,
        calendarEventId: res.data.id, // ⭐ IMPORTANT
      });
    }

    // 3️⃣ Success response
    return NextResponse.json({
      status: "ok",
      createdCount: createdEvents.length,
      events: createdEvents
    });

  } catch (error) {
    console.error("Calendar create error:", error);
    return NextResponse.json(
      { error: "Failed to create calendar events" },
      { status: 500 }
    );
  }
}