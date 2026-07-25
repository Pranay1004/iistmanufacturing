/**
 * Production Security Utilities
 *
 * Provides input sanitization, validation, rate limiting, and safe error
 * handling for server-side and client-side use.
 *
 * OWASP-aligned: prevents XSS and information disclosure through
 * generic error responses.
 */

// ─── Input Sanitization ────────────────────────────────────────────

/**
 * Strips HTML tags and trims whitespace. Use on all free-text user inputs
 * before persisting to any datastore.
 */
export function sanitizeInput(
  input: string,
  maxLength: number = 5000,
): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")           // strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // strip control chars
    .trim()
    .slice(0, maxLength);
}

// ─── Validation ────────────────────────────────────────────────────

/** Basic RFC 5322 email validation */
export function isValidEmail(email: string): boolean {
  if (typeof email !== "string" || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Only HTTPS URLs allowed (prevents javascript: and data: URI attacks) */
export function isValidUrl(url: string): boolean {
  if (typeof url !== "string" || url.length > 2048) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// ─── Safe Error Responses ──────────────────────────────────────────

/**
 * Logs the full error server-side and returns a generic message for the client.
 * Never expose stack traces, internal paths, or DB errors to users.
 */
export function safeErrorResponse(
  error: unknown,
  context: string,
  status: number = 500,
): { message: string; status: number } {
  // Log full detail on server (visible in Vercel logs, not to users)
  console.error(`[SECURITY][${context}]`, error);

  return {
    message: "Something went wrong. Please try again later.",
    status,
  };
}

// ─── Rate Limiter ──────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * Simple in-memory sliding window rate limiter.
 *
 * For production at scale, use Redis or Upstash Rate Limit.
 * This works well for Vercel serverless with low-to-moderate traffic.
 */
export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Returns true if the request should be BLOCKED (rate limited).
   */
  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const entry = this.store.get(identifier);

    // Cleanup stale entries periodically
    if (this.store.size > 10000) {
      for (const [key, val] of this.store) {
        if (now > val.resetAt) this.store.delete(key);
      }
    }

    if (!entry || now > entry.resetAt) {
      this.store.set(identifier, { count: 1, resetAt: now + this.windowMs });
      return false;
    }

    entry.count++;
    if (entry.count > this.maxRequests) {
      return true; // BLOCKED
    }

    return false;
  }

  /** Returns remaining requests for this identifier */
  remaining(identifier: string): number {
    const entry = this.store.get(identifier);
    if (!entry || Date.now() > entry.resetAt) return this.maxRequests;
    return Math.max(0, this.maxRequests - entry.count);
  }
}

// Pre-configured limiter for general use
export const apiGeneralLimiter = new RateLimiter(60, 60_000);  // 60 per minute

// ─── Request Helpers ───────────────────────────────────────────────

/**
 * Extracts client IP from request headers (works on Vercel, Cloudflare, etc.)
 */
export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/**
 * Adds security headers to a NextResponse-compatible headers object.
 */
export function securityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Permitted-Cross-Domain-Policies": "none",
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
  };
}
