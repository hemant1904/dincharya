import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // ✅ FIX: await cookies()
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("google_tokens");

  if (!tokenCookie) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  let expires_at: number | undefined;
  try {
    const parsed = JSON.parse(tokenCookie.value);
    expires_at = parsed?.expires_at;
  } catch {
    // try to extract numeric expires_at from common formats
    try {
      const decoded = decodeURIComponent(tokenCookie.value);
      const m = decoded.match(/expires_at[^0-9]*([0-9]{10,})/);
      expires_at = m ? Number(m[1]) : undefined;
    } catch {
      expires_at = undefined;
    }
  }

  if (typeof expires_at !== 'number') {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    expired: Date.now() > expires_at,
  });
}
