import { MetadataRoute } from "next";
import { people } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://iistmanufacturing.vercel.app";

  const staticPages = [
    "",
    "/about",
    "/facilities",
    "/faculty",
    "/people",
    "/placements",
    "/research",
    "/media",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const peoplePages = people.map((person) => ({
    url: `${baseUrl}/people/${person.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...peoplePages];
}
