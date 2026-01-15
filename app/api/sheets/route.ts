import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getValidGoogleAccessToken } from "@/app/utils/auth";

const SHEET_RANGE = "Sheet1!A:E";

export async function GET() {
  try {
    const accessToken = await getValidGoogleAccessToken();
    if (!accessToken) {
      return NextResponse.json({ habits: [] });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: SHEET_RANGE,
    });

    const rows = res.data.values || [];

    const today = new Date().toLocaleDateString();

    const habits = rows
      .filter((r) => r[0] === today)
      .map((r, i) => ({
        id: i.toString(),
        text: r[1],
        done: r[4] === "TRUE",
      }));

    return NextResponse.json({ habits });
  } catch (e) {
    console.error("Sheets GET error", e);
    return NextResponse.json({ habits: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const accessToken = await getValidGoogleAccessToken();

    if (!accessToken) {
      return NextResponse.json({ status: "error", message: "Not authenticated" }, { status: 401 });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: SHEET_RANGE,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toLocaleDateString(),
          body.text || body.title,
          body.startTime || "",
          body.endTime || "",
          body.done ? "TRUE" : "FALSE",
        ]],
      },
    });

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("Sheets API error:", err.message);
    return NextResponse.json(
      { status: "error", message: "Failed to write to sheets" },
      { status: 500 }
    );
  }
}
