import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Disable x-powered-by header (leaks framework info)
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              // unsafe-inline kept for Next.js style injection; unsafe-eval REMOVED
              "script-src 'self' 'unsafe-inline' https://apis.google.com https://*.firebaseapp.com;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "img-src 'self' blob: data: https://*.googleusercontent.com https://*.firebaseusercontent.com https://cdn.jsdelivr.net;",
              "font-src 'self' data: https://fonts.gstatic.com;",
              // Production: no localhost; Dev: allow localhost for HMR
              isDev
                ? "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com ws://localhost:* http://localhost:* ws://127.0.0.1:* http://127.0.0.1:*;"
                : "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com;",
              "frame-src 'self' https://*.firebaseapp.com;",
              "object-src 'none';",
              "base-uri 'self';",
              "form-action 'self';",
              "frame-ancestors 'none';",
              "upgrade-insecure-requests;",
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
