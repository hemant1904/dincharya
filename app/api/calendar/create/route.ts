import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

type CalendarEvent = {
  title: string;
  startTime: string;
  endTime: string;
};

function readCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").map(c => c.trim());
  for (const c of cookies) {
    if (c.startsWith(name + "=")) {
      return decodeURIComponent(c.substring(name.length + 1));
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    // 1️⃣ Parse body
    const body = await req.json();

    if (!body || !Array.isArray(body.events)) {
      return NextResponse.json(
        { status: "error", message: "Invalid request body" },
        { status: 400 }
      );
    }

    const events: CalendarEvent[] = body.events;

    // 2️⃣ Read token cookie SAFELY
    const cookieHeader = req.headers.get("cookie");
    const tokenRaw = readCookie(cookieHeader, "google_tokens");

    if (!tokenRaw) {
      return NextResponse.json(
        { status: "error", message: "Not authenticated (cookie missing)" },
        { status: 401 }
      );
    }

    let access_token: string | undefined;
    try {
      access_token = JSON.parse(tokenRaw).access_token;
    } catch {
      return NextResponse.json(
        { status: "error", message: "Invalid token cookie" },
        { status: 400 }
      );
    }

    if (!access_token) {
      return NextResponse.json(
        { status: "error", message: "Access token missing" },
        { status: 401 }
      );
    }

    // 3️⃣ Google Calendar client
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token });

    const calendar = google.calendar({ version: "v3", auth });

    // 4️⃣ Create events
    const createdEvents = [];

    for (const ev of events) {
      const res = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: ev.title,
          start: { dateTime: ev.startTime },
          end: { dateTime: ev.endTime },
        },
      });

      createdEvents.push({
        id: res.data.id,
        htmlLink: res.data.htmlLink,
        summary: ev.title,
      });
    }

    return NextResponse.json({
      status: "ok",
      createdEvents,
    });
  } catch (err: any) {
    console.error("Calendar backend error:", err);
    return NextResponse.json(
      {
        status: "error",
        message: "Calendar creation failed",
        details: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
