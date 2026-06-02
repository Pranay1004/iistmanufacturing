import type { Person } from "./data";

/**
 * Generate JSON-LD Schema.org structured data for a person.
 * Helps search engines and LLMs understand the content.
 */
export function generatePersonSchema(person: Person) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://domain.com";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/people/${person.slug}`,
    name: person.name,
    jobTitle: person.role,
    description: person.synopsis,
    affiliation: {
      "@type": "Organization",
      name: "IIST Aerospace Engineering",
      url: baseUrl,
    },
    knowsAbout: person.skills,
    expertise: person.specialization,
    email: person.officialEmail,
    url: `${baseUrl}/people/${person.slug}`,
    ...(person.linkedin && { sameAs: person.linkedin }),
    ...(person.portfolio && {
      sameAs: [person.portfolio, person.linkedin].filter(Boolean),
    }),
    ...(person.location && {
      address: {
        "@type": "PostalAddress",
        addressLocality: person.location,
        addressCountry: "India",
      },
    }),
  };

  if (person.skills.length > 0) {
    schema["keywords"] = person.skills.join(", ");
  }

  if (person.researchInterests?.length) {
    schema["knowsAbout"] = [
      ...(schema["knowsAbout"] || []),
      ...person.researchInterests,
    ];
  }

  return schema;
}

/**
 * Generate metadata for person profile pages.
 */
export function generatePersonMetadata(person: Person) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://domain.com";
  const title = `${person.name} – ${person.role} | IIST`;
  const description =
    person.synopsis || `Profile of ${person.name} at IIST.`;
  const url = `${baseUrl}/people/${person.slug}`;

  const keywords = [
    person.name,
    person.role,
    person.specialization,
    "IIST",
    "Manufacturing",
    "Aerospace",
    "India",
    ...person.skills.slice(0, 5),
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      images: [],
    },
    twitter: { card: "summary", title, description },
    canonical: url,
  };
}

/**
 * Generate metadata for research project pages.
 */
export function generateProjectMetadata(project: {
  title: string;
  summary: string;
  slug: string;
  specialization?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://domain.com";
  const title = `${project.title} – IIST Manufacturing`;
  const description = project.summary.substring(0, 160);
  const url = `${baseUrl}/research/${project.slug}`;

  return {
    title,
    description,
    keywords: [
      project.title,
      project.specialization,
      "IIST",
      "Manufacturing",
      "Research",
      "India",
    ].join(", "),
    openGraph: { title, description, url, type: "article" },
    canonical: url,
  };
}

/**
 * Generate BreadcrumbList schema for navigation.
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
