import { cookies } from "next/headers"
import { refreshAccessToken } from "./googleOAuth"
import { google } from "googleapis";
export async function getValidGoogleAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get("google_tokens")?.value

  if (!tokenCookie) return null

  let tokens: any
  try {
    tokens = JSON.parse(decodeURIComponent(tokenCookie))
  } catch {
    return null
  }

  // ⏰ Check expiry
  if (tokens.expiry_date && Date.now() < tokens.expiry_date - 60_000) {
    return tokens.access_token
  }

  // 🔄 Refresh token
  if (!tokens.refresh_token) return null

  const refreshed = await refreshAccessToken(tokens.refresh_token)
  if (!refreshed.access_token) return null

  // ♻️ Update cookie
  cookieStore.set(
    "google_tokens",
    encodeURIComponent(
      JSON.stringify({
        ...tokens,
        access_token: refreshed.access_token,
        expiry_date: refreshed.expiry_date,
      })
    ),
    {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    }
  )

  return refreshed.access_token
}


export async function getAuthenticatedClient() {
  const oauth2Client = await getOAuthClientWithValidToken();
  return oauth2Client;
}

async function getOAuthClientWithValidToken() {
  const accessToken = await getValidGoogleAccessToken();

  if (!accessToken) {
    throw new Error("No valid Google access token found");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  return oauth2Client;
}
