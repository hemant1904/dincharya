import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getAuthenticatedClient } from "@/app/utils/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { tasks } = await req.json();

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields" },
        { status: 400 }
      );
    }

    const auth = await getAuthenticatedClient();
    const sheets = google.sheets({ version: "v4", auth });

    const rows = tasks.map((t: any) => [
      t.title,
      t.date,
      t.startTime,
      t.endTime,
      "Pending"
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: "Sheet1!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: rows
      }
    });

    return NextResponse.json({
      status: "ok",
      added: rows.length
    });

  } catch (err: any) {
    console.error("Sheets ADD error:", err);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
