import Link from "next/link";
import { Mail, ExternalLink, Download } from "lucide-react";
import type { Person } from "@/lib/data";

export function Portrait({ name, large = false }: { name: string; large?: boolean }) {
  const initials = name
    .replace("Dr.", "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <div
      className={[
        "relative grid shrink-0 place-items-center overflow-hidden rounded-sm border border-stone-300 bg-[#e8ded0]",
        large ? "size-36 sm:size-44" : "size-20",
      ].join(" ")}
      aria-label={`${name} portrait placeholder`}
    >
      <div className="absolute inset-x-0 top-0 h-1/3 bg-[#0b5d6b]" />
      <div className="absolute bottom-0 h-2/3 w-3/4 rounded-t-full bg-[#b85c28]" />
      <div className="absolute top-[22%] size-1/3 rounded-full bg-[#f3c79d]" />
      <span className="relative mt-auto mb-3 bg-[#172426]/80 px-2 py-1 font-mono text-xs font-semibold text-white">
        {initials}
      </span>
    </div>
  );
}

export function PersonCard({
  person,
  onPreview,
}: {
  person: Person;
  onPreview?: (person: Person) => void;
}) {
  return (
    <article className="group border-t border-stone-300 py-5">
      <button
        type="button"
        onClick={() => onPreview?.(person)}
        className="grid w-full gap-4 text-left sm:grid-cols-[80px_1fr]"
      >
        <Portrait name={person.name} />
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-serif text-xl font-semibold text-[#172426] group-hover:text-[#8c1515]">
              {person.name}
            </span>
            <span className="rounded-sm bg-[#f0dfc2] px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#70420f]">
              {person.batch ?? person.type}
            </span>
          </span>
          <span className="mt-1 block text-sm font-semibold text-[#0b5d6b]">{person.role}</span>
          <span className="mt-2 block text-sm leading-6 text-stone-700">{person.specialization}</span>
          <span className="mt-3 flex flex-wrap gap-2">
            {person.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="rounded-sm border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700">
                {skill}
              </span>
            ))}
          </span>
        </span>
      </button>
    </article>
  );
}

export function ProfileActions({ person }: { person: Person }) {
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={`mailto:${person.officialEmail}`}
        className="inline-flex h-10 items-center gap-2 rounded-sm bg-[#0b5d6b] px-3 text-sm font-semibold text-white hover:bg-[#084854]"
      >
        <Mail size={16} aria-hidden />
        Email
      </a>
      {person.portfolio && (
        <a
          href={person.portfolio}
          className="inline-flex h-10 items-center gap-2 rounded-sm border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-800 hover:border-[#8c1515]"
        >
          <ExternalLink size={16} aria-hidden />
          Portfolio
        </a>
      )}
      {person.resumeUrl && (
        <a
          href={person.resumeUrl}
          className="inline-flex h-10 items-center gap-2 rounded-sm border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-800 hover:border-[#8c1515]"
        >
          <Download size={16} aria-hidden />
          Resume
        </a>
      )}
      <Link
        href={`/people/${person.slug}`}
        className="inline-flex h-10 items-center gap-2 rounded-sm border border-[#8c1515] px-3 text-sm font-semibold text-[#8c1515] hover:bg-[#8c1515] hover:text-white"
      >
        Full Profile
      </Link>
    </div>
  );
}
