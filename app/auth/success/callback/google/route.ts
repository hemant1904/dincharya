import { NextResponse } from "next/server"
import { exchangeCodeForTokens } from "@/app/utils/googleOAuth"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 })
  }

  // ✅ Use YOUR OWN helper (best practice)
  const tokens = await exchangeCodeForTokens(code)

  if (!tokens.access_token) {
    return NextResponse.json(
      { error: tokens.error_description || "Token exchange failed" },
      { status: 500 }
    )
  }

  /**
   * IMPORTANT:
   * Preserve refresh_token forever
   */
  const cookieValue = encodeURIComponent(
    JSON.stringify({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token, // may be undefined ONLY first time
      expiry_date: tokens.expiry_date,
    })
  )

  const response = NextResponse.redirect(
    new URL("/auth/success", req.url)
  )

  response.headers.set(
    "Set-Cookie",
    `google_tokens=${cookieValue}; Path=/; HttpOnly; SameSite=Lax`
  )

  return response
}
