import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Security Headers Proxy
 * Adds critical security and SEO headers to all responses
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Content Security Policy - prevents XSS attacks
  response.headers.set(
    "Content-Security-Policy",
    process.env.NODE_ENV === "development"
      ? "default-src 'self' http://127.0.0.1:*; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' data: cdn.jsdelivr.net; connect-src 'self' http://127.0.0.1:* https:; frame-ancestors 'none';"
      : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' data: cdn.jsdelivr.net; connect-src 'self' https:; frame-ancestors 'none';"
  );

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer policy - privacy conscious
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );

  // Feature policy - restrict dangerous features
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(), usb=()"
  );

  // HSTS - enforce HTTPS (only in production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // SEO: Allow indexing on public pages, block on admin
  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/login")
  ) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  } else {
    response.headers.set("X-Robots-Tag", "index, follow");
  }

  // Remove sensitive headers
  response.headers.delete("X-Powered-By");
  response.headers.delete("Server");

  return response;
}

// Apply proxy to all routes except static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|robots.txt|sitemap.xml).*)",
  ],
};
