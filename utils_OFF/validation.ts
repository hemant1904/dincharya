// `requireFields` helper used by server routes.
// Returns `{ valid: boolean, message?: string }` to match route expectations.
export function requireFields(obj: Record<string, any> | null | undefined, fields: string[]) {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, message: 'Request body must be an object' }
  }

  const missing = fields.filter((f) => obj[f] === undefined || obj[f] === null)
  if (missing.length) {
    return { valid: false, message: `Missing required fields: ${missing.join(', ')}` }
  }

  return { valid: true }
}
