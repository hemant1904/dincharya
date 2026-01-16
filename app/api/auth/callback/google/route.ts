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

    const { access_token, refresh_token, expires_in } = tokens;
    const expires_at = Date.now() + (expires_in as number) * 1000;

    const response = NextResponse.redirect(
      new URL("/auth/success", process.env.NEXT_PUBLIC_BASE_URL!)
    );

    response.cookies.set(
      "google_tokens",
      JSON.stringify({ access_token, refresh_token, expires_at }),
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return response;
  } catch (err) {
    console.error("OAuth Callback Error:", err);
    return NextResponse.json(
      { error: "Google OAuth failed" },
      { status: 500 }
    );
  }
}
