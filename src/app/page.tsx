import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Building2, FileText, Users } from "lucide-react";
import { PageFrame } from "@/components/site-shell";
import { Portrait } from "@/components/person-card";
import { getPeopleByType, industrialVisits, people, programHighlights } from "@/lib/data";

export default function Home() {
  const faculty = getPeopleByType("faculty");
  const currentStudents = people.filter((person) => person.cohort === "2025-2027");
  const featureRows: [LucideIcon, string, string][] = [
    [Users, "Talent directory", "Search current students, outgoing batches, incoming placeholders, and PhD scholars by skill area."],
    [FileText, "Claimable profiles", "Each member can later update synopsis, skills, projects, contact visibility, photo, and resume PDF."],
    [Building2, "ISRO context", `Program exposure highlights ISRO centres including ${industrialVisits.join(", ")}.`],
  ];

  return (
    <PageFrame>
      <main>
        <section className="border-b border-stone-300 bg-[#efe6d7]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#8c1515]">
                M.Tech Program | Department of Aerospace Engineering
              </p>
              <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[1.02] text-[#172426] sm:text-6xl">
                Manufacturing Technology for aerospace systems, space missions, and national capability.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
                A structured IIST academic directory for faculty, M.Tech scholars, PhD researchers,
                facilities, projects, skills, resumes, and industry-facing opportunities.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/people"
                  className="inline-flex h-11 items-center gap-2 rounded-sm bg-[#8c1515] px-4 text-sm font-semibold text-white hover:bg-[#6d1010]"
                >
                  Explore Profiles
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex h-11 items-center rounded-sm border border-[#0b5d6b] px-4 text-sm font-semibold text-[#0b5d6b] hover:bg-[#0b5d6b] hover:text-white"
                >
                  Program Overview
                </Link>
              </div>
            </div>
            <div className="border-l-0 border-stone-300 lg:border-l lg:pl-10">
              <div className="grid grid-cols-3 border-y border-stone-300 text-center">
                {[
                  ["3", "Core Faculty"],
                  ["28", "Student Profiles"],
                  ["10", "PhD Scholars"],
                ].map(([value, label]) => (
                  <div key={label} className="border-r border-stone-300 px-3 py-5 last:border-r-0">
                    <p className="font-serif text-4xl font-semibold text-[#0b5d6b]">{value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-600">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-4">
                {programHighlights.map((highlight) => (
                  <div key={highlight} className="flex gap-3 border-t border-stone-300 pt-4">
                    <span className="mt-2 size-2 shrink-0 bg-[#b85c28]" />
                    <p className="leading-7 text-stone-700">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">Faculty</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">Academic leadership</h2>
            <p className="mt-4 leading-7 text-stone-700">
              The program is anchored by additive manufacturing, metallurgy, quality engineering,
              manufacturing systems, and aerospace process expertise.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {faculty.map((person) => (
              <Link key={person.slug} href={`/people/${person.slug}`} className="border-t border-stone-300 pt-5 hover:border-[#8c1515]">
                <Portrait name={person.name} />
                <h3 className="mt-4 font-serif text-2xl font-semibold">{person.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[#0b5d6b]">{person.role}</p>
                <p className="mt-3 text-sm leading-6 text-stone-700">{person.specialization}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-300 bg-[#f3eee6]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
            {featureRows.map(([Icon, title, text]) => (
              <div key={title} className="border-t border-stone-300 pt-5">
                <Icon className="text-[#b85c28]" size={24} aria-hidden />
                <h3 className="mt-4 font-serif text-2xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-stone-700">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 border-b border-stone-300 pb-5 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">2025-2027</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold">Current M.Tech cohort</h2>
            </div>
            <Link href="/people" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8c1515]">
              View full directory <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {currentStudents.slice(0, 8).map((person) => (
              <Link key={person.slug} href={`/people/${person.slug}`} className="border-t border-stone-300 pt-4">
                <p className="font-serif text-xl font-semibold">{person.name}</p>
                <p className="mt-1 text-sm text-[#0b5d6b]">{person.specialization}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
