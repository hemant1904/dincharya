// Helper for exchanging a Google authorization code for tokens.
// This file is server-side only and does not call Calendar or Sheets APIs.

export type TokenResponse = {
  access_token?: string
  expires_in?: number
  refresh_token?: string
  scope?: string
  token_type?: string
  id_token?: string
  // computed expiry timestamp (ms since epoch)
  expiry_date?: number
  error?: string
  error_description?: string
}

// Exchanges an authorization code for tokens using Google's OAuth2 token endpoint.
export async function exchangeCodeForTokens(code: string): Promise<TokenResponse> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    return { error: 'missing_env', error_description: 'Missing Google OAuth environment variables' }
  }

  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  })

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  let data: any
  try {
    data = await resp.json()
  } catch (err) {
    return { error: 'invalid_response', error_description: 'Failed to parse token response' }
  }

  if (!resp.ok) {
    return {
      error: data?.error || 'token_exchange_failed',
      error_description: data?.error_description || JSON.stringify(data),
    }
  }

  const result: TokenResponse = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    scope: data.scope,
    token_type: data.token_type,
    id_token: data.id_token,
  }

  if (data.expires_in) {
    result.expiry_date = Date.now() + Number(data.expires_in) * 1000
  }

  return result
}
