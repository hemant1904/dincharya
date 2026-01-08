/**
 * validation.ts
 *
 * Purpose: Request validation helpers used across backend API routes.
 * This file contains small, pure utility functions for common checks
 * (string presence, email format, JSON parsing) so route handlers
 * can stay focused on business logic.
 */
/*
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidEmail(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRe.test(value);
}

export function tryParseJSON<T = unknown>(text: unknown): T | null {
  if (typeof text !== 'string') return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}
*/
export function requireFields(body: any, fields: string[]) {
  const missingFields = fields.filter(
    (field) => !(field in body)
  );

  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `Missing fields: ${missingFields.join(", ")}`
    };
  }

  return { valid: true };
}

export function isNonEmptyString(value: any) {
  return typeof value === "string" && value.trim().length > 0;
}
