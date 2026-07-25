import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Security Proxy (Next.js 16 Edge Proxy)
 * Fail-safe design: Never throws or breaks page loading on Vercel edge deployment.
 */

// Edge Rate Limiter Store
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 120;
const RATE_LIMIT_WINDOW = 60_000;

function checkRateLimit(key: string, max: number): boolean {
  try {
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (rateLimitStore.size > 10000) {
      for (const [k, v] of rateLimitStore) {
        if (now > v.resetAt) rateLimitStore.delete(k);
      }
    }

    if (!entry || now > entry.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
      return false;
    }

    entry.count++;
    return entry.count > max;
  } catch {
    return false; // Fail-open to avoid blocking users if map errors out
  }
}

// Known scanner user-agents (lowercase)
const BLOCKED_BOTS = [
  "sqlmap",
  "nikto",
  "nmap",
  "masscan",
  "zgrab",
  "gobuster",
  "dirbuster",
  "wpscan",
  "nuclei",
  "httpx",
];

export function proxy(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // ── 1. Bot Protection ──────────────────────────────────────────
    const ua = (request.headers.get("user-agent") || "").toLowerCase();
    if (BLOCKED_BOTS.some((bot) => ua.includes(bot))) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // ── 2. Edge Rate Limiting ──────────────────────────────────────
    const isApiRoute = request.nextUrl.pathname.startsWith("/api/");
    const limitKey = isApiRoute ? `api:${ip}` : `page:${ip}`;
    const maxReqs = isApiRoute ? 60 : RATE_LIMIT_MAX;

    if (checkRateLimit(limitKey, maxReqs)) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-Content-Type-Options": "nosniff",
          },
        },
      );
    }

    const response = NextResponse.next();

    // ── 3. Security Headers ────────────────────────────────────────
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    );
    response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

    if (process.env.NODE_ENV === "production") {
      response.headers.set(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload",
      );
    }

    // ── 4. Anti-indexing for private routes ────────────────────────
    if (
      request.nextUrl.pathname.startsWith("/admin")
    ) {
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
    } else {
      response.headers.set("X-Robots-Tag", "index, follow");
    }

    // ── 5. Cache control for API ───────────────────────────────────
    if (isApiRoute) {
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private",
      );
    }

    return response;
  } catch (err) {
    // Fail-safe: if any edge exception occurs, pass through to standard page render
    console.error("[Proxy Edge Error]", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|media|robots.txt|sitemap.xml).*)",
  ],
};
