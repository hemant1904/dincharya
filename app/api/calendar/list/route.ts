import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

// Safe cookie reader
function getCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map(v => v.trim())
    .find(v => v.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export async function GET(req: Request) {
  try {
    // 1️⃣ Read token from cookie
    const cookieHeader = req.headers.get("cookie");
    const tokenCookie = getCookie(cookieHeader, "google_tokens");

    if (!tokenCookie) {
      return NextResponse.json(
        { status: "error", message: "Not authenticated" },
        { status: 401 }
      );
    }

    let access_token: string | undefined;
    try {
      const parsed = JSON.parse(tokenCookie);
      access_token = parsed?.access_token || parsed?.token || undefined;
    } catch {
      // fallback: try to extract access_token with a regex from common formats
      try {
        const decoded = decodeURIComponent(tokenCookie);
        const m = decoded.match(/access_token[^A-Za-z0-9_-]*([A-Za-z0-9._-]+)/);
        access_token = m ? m[1] : undefined;
      } catch {
        access_token = undefined;
      }
    }

    if (!access_token) {
      return NextResponse.json(
        { status: "error", message: "Access token missing" },
        { status: 401 }
      );
    }

    // 2️⃣ Google Calendar client
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token });

    const calendar = google.calendar({
      version: "v3",
      auth,
    });

    // 3️⃣ Fetch events (NO FILTER)
    const res = await calendar.events.list({
      calendarId: "primary",
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
    });

    // 4️⃣ Normalize response for frontend
    const events =
      res.data.items?.map(e => ({
        id: e.id,
        title: e.summary,
        start: e.start?.dateTime || e.start?.date,
        end: e.end?.dateTime || e.end?.date,
        link: e.htmlLink,
      })) || [];

    return NextResponse.json({
      status: "ok",
      events,
    });
  } catch (err: any) {
  console.error("Calendar API error:", err?.message || err);

  // 🔐 Token expired or invalid
  if (
    err?.code === 401 ||
    err?.message?.includes("Invalid Credentials") ||
    err?.message?.includes("Unauthorized")
  ) {
    return NextResponse.json(
      {
        status: "error",
        message: "Session expired. Please login again.",
      },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      status: "error",
      message: "Calendar service error",
    },
    { status: 500 }
  );
}
}
