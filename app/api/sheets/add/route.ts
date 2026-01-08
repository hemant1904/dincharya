import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

// helper: cookie read (stable, no next/headers issue)
function getCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map(v => v.trim())
    .find(v => v.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export async function POST(req: Request) {
  try {
    // 1️⃣ Parse request body
    const body = await req.json();
    const { title, startTime, endTime, userEmail } = body;

    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2️⃣ Read google_tokens cookie
    const cookieHeader = req.headers.get("cookie");
    const tokenCookie = getCookie(cookieHeader, "google_tokens");

    if (!tokenCookie) {
      return NextResponse.json(
        { status: "error", message: "Not authenticated" },
        { status: 401 }
      );
    }

    // 3️⃣ Extract access token
    let access_token: string | undefined;
    try {
      access_token = JSON.parse(tokenCookie).access_token;
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

    // 4️⃣ Google auth client
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token });

    // 5️⃣ Sheets client
    const sheets = google.sheets({ version: "v4", auth });

    // 6️⃣ Append row to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: "Sheet1!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toLocaleString(),
          userEmail || "unknown-user",
          title,
          startTime,
          endTime,
          "Calendar"
        ]]
      }
    });

    // 7️⃣ Success response
    return NextResponse.json({ status: "ok" });

  } catch (err: any) {
    console.error("Sheets ADD error:", err);
    return NextResponse.json(
      {
        status: "error",
        message: "Server error",
        details: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
