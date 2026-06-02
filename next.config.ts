import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseapp.com;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "img-src 'self' blob: data: https://*.googleusercontent.com https://*.firebaseusercontent.com;",
              "font-src 'self' data: https://fonts.gstatic.com;",
              "connect-src 'self' https://*.googleapis.com wss://*.firebaseio.com https://*.firebaseio.com wss://*.hotjar.com wss://localhost:* ws://localhost:* wss://127.0.0.1:* ws://127.0.0.1:* http://localhost:* http://127.0.0.1:*;",
              "frame-src 'self' https://*.firebaseapp.com;",
              "object-src 'none';",
              "base-uri 'self';",
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

