import { NextResponse } from "next/server";

export async function GET() {
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`;

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/spreadsheets",
    ].join(" "),
  });

  const googleAuthUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();

  return NextResponse.redirect(googleAuthUrl);
}
