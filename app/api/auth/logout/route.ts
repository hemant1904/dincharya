import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("google_tokens", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}
