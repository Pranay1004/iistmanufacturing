"use client";

import { useMemo, useState } from "react";
import { btechProjects, people } from "@/lib/data";

type ProgramFilter = "all" | "mtech" | "phd" | "btech";

type ResearchProject = {
  slug: string;
  program: "M.Tech" | "PhD" | "B.Tech";
  year: string;
  owner: string;
  context: string;
  title: string;
  summary: string;
  status: "Concept" | "Ongoing" | "Completed";
  supervisor?: string;
};

const programTabs: { label: string; value: ProgramFilter }[] = [
  { label: "All", value: "all" },
  { label: "M.Tech Projects", value: "mtech" },
  { label: "PhD Projects", value: "phd" },
  { label: "B.Tech Projects", value: "btech" },
];

const projects: ResearchProject[] = [
  ...people
    .filter((person) => person.type === "student" && person.projects.length)
    .map((person) => ({
      slug: person.slug,
      program: "M.Tech" as const,
      year: person.batch ?? "Unassigned",
      owner: person.name,
      context: person.specialization,
      title: person.projects[0].title,
      summary: person.projects[0].summary,
      status: person.projects[0].status,
    })),
  ...people
    .filter((person) => person.type === "phd" && person.projects.length)
    .map((person) => ({
      slug: person.slug,
      program: "PhD" as const,
      year: person.admissionYear ?? "PhD",
      owner: person.name,
      context: person.specialization,
      title: person.projects[0].title,
      summary: person.projects[0].summary,
      status: person.projects[0].status,
      supervisor: person.supervisor,
    })),
  ...btechProjects.map((project) => ({
    slug: project.slug,
    program: "B.Tech" as const,
    year: project.batch,
    owner: project.owner,
    context: project.specialization,
    title: project.title,
    summary: project.summary,
    status: project.status,
  })),
];

function matchesProgram(project: ResearchProject, filter: ProgramFilter) {
  if (filter === "all") return true;
  if (filter === "mtech") return project.program === "M.Tech";
  if (filter === "phd") return project.program === "PhD";
  return project.program === "B.Tech";
}

export function ResearchProjects() {
  const [program, setProgram] = useState<ProgramFilter>("all");
  const [year, setYear] = useState("All Batches");

  const years = useMemo(() => {
    const visible = projects.filter((project) => matchesProgram(project, program));
    return ["All Batches", ...Array.from(new Set(visible.map((project) => project.year))).sort().reverse()];
  }, [program]);

  const filtered = projects.filter((project) => {
    const programMatch = matchesProgram(project, program);
    const yearMatch = year === "All Batches" || project.year === year;
    return programMatch && yearMatch;
  });

  return (
    <section className="mt-10">
      <div className="border-y border-stone-300 bg-[#f3eee6]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {programTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setProgram(tab.value);
                  setYear("All Batches");
                }}
                className={[
                  "shrink-0 rounded-sm border px-3 py-2 text-sm font-semibold",
                  program === tab.value
                    ? "border-[#0b5d6b] bg-[#0b5d6b] text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-[#0b5d6b]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {years.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setYear(item)}
                className={[
                  "shrink-0 rounded-sm border px-3 py-2 font-mono text-xs uppercase tracking-[0.12em]",
                  year === item
                    ? "border-[#8c1515] bg-[#8c1515] text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-[#8c1515]",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-stone-500">
          {filtered.length} projects shown
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((project) => (
            <article key={project.slug} className="border-t border-stone-300 pt-4">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-stone-500">
                {project.program} | {project.year} | {project.context}
              </p>
              <h3 className="mt-2 font-serif text-2xl font-semibold">{project.title}</h3>
              <p className="mt-1 font-semibold text-[#0b5d6b]">{project.owner}</p>
              {project.supervisor && <p className="mt-1 text-sm text-stone-600">Supervisor: {project.supervisor}</p>}
              <p className="mt-2 text-sm leading-6 text-stone-700">{project.summary}</p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-[#8c1515]">{project.status}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
