import { NextResponse } from "next/server"
import { google } from "googleapis"
import { getValidGoogleAccessToken } from "@/app/utils/auth"

export const runtime = "nodejs"

export async function GET() {
  const access_token = await getValidGoogleAccessToken()

  if (!access_token) {
    return NextResponse.json(
      { status: "error", message: "Not authenticated" },
      { status: 401 }
    )
  }

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token })

  const calendar = google.calendar({ version: "v3", auth })

  try {
    const res = await calendar.events.list({
      calendarId: "primary",
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
    })

    const events =
      res.data.items?.map(e => ({
        id: e.id,
        title: e.summary,
        start: e.start?.dateTime || e.start?.date,
        end: e.end?.dateTime || e.end?.date,
        link: e.htmlLink,
      })) || []

    return NextResponse.json({ status: "ok", events })
  } 
  catch (err: any) {
    console.error("Calendar API error:", err.message)
    return NextResponse.json(
      { status: "error", message: "Calendar fetch failed" },
      { status: 500 }
    )
  }
}
export async function POST(req: Request) {
  try {
    const { events } = await req.json();
    const access_token = await getValidGoogleAccessToken();

    if (!access_token) {
      return NextResponse.json(
        { status: "error", message: "Not authenticated" },
        { status: 401 }
      );
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token });

    const calendar = google.calendar({ version: "v3", auth });

    for (const e of events) {
      await calendar.events.insert({
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
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("Calendar POST error:", err.message);
    return NextResponse.json(
      { status: "error", message: "Failed to create calendar events" },
      { status: 500 }
    );
  }
}
