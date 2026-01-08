import { NextResponse } from "next/server";

// Placeholder for calendar read/list endpoint. The POST/create handler
// has been moved to `app/api/calendar/create/route.ts`.
export async function GET() {
  return NextResponse.json({ message: 'Calendar list endpoint (placeholder)' })
}
