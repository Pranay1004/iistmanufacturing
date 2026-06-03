import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "Google-Extended",
          "Anthropic-AI",
          "cohere-ai",
          "PerplexityBot",
          "YouBot",
          "Bingbot",
        ],
        allow: "/",
      },
    ],
    sitemap: "https://iistmanufacturing.vercel.app/sitemap.xml",
  };
}
