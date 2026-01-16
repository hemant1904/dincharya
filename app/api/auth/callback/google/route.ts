import { NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/app/utils/googleOAuth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code missing" },
        { status: 400 }
      );
    }

    const tokens = await exchangeCodeForTokens(code);

    const access_token = tokens.access_token;
    const refresh_token = tokens.refresh_token;
    const expires_in = tokens.expires_in as number;

    const expires_at = Date.now() + expires_in * 1000;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    const response = NextResponse.redirect(
      `${baseUrl}/auth/success`
    );

    response.cookies.set(
      "google_tokens",
      JSON.stringify({
        access_token,
        refresh_token,
        expires_at,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return response;
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    return NextResponse.json(
      { error: "Google OAuth failed" },
      { status: 500 }
    );
  }
}
