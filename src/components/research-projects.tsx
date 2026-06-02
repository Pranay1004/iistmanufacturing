"use client";

import { useMemo, useState } from "react";
import { btechProjects, people } from "@/lib/data";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

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
  { label: "Combined", value: "all" },
  { label: "M.Tech Projects", value: "mtech" },
  { label: "PhD Projects", value: "phd" },
  { label: "B.Tech Projects", value: "btech" },
];

const projects: ResearchProject[] = [
  ...people
    .filter((person) => person.type === "student" && person.cohort !== "2026-2028" && person.projects.length)
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

function statusClass(status: ResearchProject["status"]) {
  if (status === "Completed") return "text-[var(--laser-green)]";
  if (status === "Ongoing") return "text-[var(--forge-amber)]";
  return "text-[var(--arc-blue)]";
}

export function ResearchProjects() {
  const [program, setProgram] = useState<ProgramFilter>("all");
  const [year, setYear] = useState<string | null>(null);

  const years = useMemo(() => {
    const visible = projects.filter((project) => matchesProgram(project, program));
    return Array.from(new Set(visible.map((project) => project.year))).sort().reverse();
  }, [program]);

  const selectedYear = year && years.includes(year) ? year : years[0];

  const filtered = projects.filter((project) => {
    const programMatch = matchesProgram(project, program);
    const yearMatch = project.year === selectedYear;
    return programMatch && yearMatch;
  });

  return (
    <section className="mt-10">
      <div className="border-y border-[var(--edge)] bg-[var(--void-deep)] surface-grid">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {programTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setProgram(tab.value);
                  setYear(null);
                }}
                className={[
                  "shrink-0 rounded-md border px-3 py-2 text-sm font-medium transition-all duration-200",
                  program === tab.value
                    ? "border-[var(--arc-blue)] bg-[var(--arc-blue)] text-white shadow-[var(--shadow-glow-blue)]"
                    : "border-[var(--edge)] bg-[var(--panel)] text-[var(--ceramic-muted)] hover:border-[var(--arc-blue)] hover:text-[var(--ceramic)]",
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
                  "shrink-0 rounded-md border px-3 py-2 font-data text-xs uppercase tracking-[0.12em] transition-all duration-200",
                  selectedYear === item
                    ? "border-[var(--forge-amber)] bg-[var(--forge-amber)] text-white shadow-[var(--shadow-glow-amber)]"
                    : "border-[var(--edge)] bg-[var(--panel)] text-[var(--ceramic-muted)] hover:border-[var(--forge-amber)] hover:text-[var(--ceramic)]",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-4 font-data text-xs uppercase tracking-[0.18em] text-[var(--ceramic-muted)]">
          {filtered.length} projects shown
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((project) => (
            <GlassCard key={project.slug} className="relative overflow-hidden">
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--laser-green)]/40 to-transparent" />
              <SectionLabel color="muted" className="mb-2">
                {project.program} | {project.year} | {project.context}
              </SectionLabel>
              <h3 className="font-display text-xl font-semibold leading-tight text-[var(--ceramic)]">
                {project.title}
              </h3>
              <p className="mt-2 font-medium text-[var(--arc-blue)]">{project.owner}</p>
              {project.supervisor && (
                <p className="mt-1 text-sm text-[var(--ceramic-muted)]">Supervisor: {project.supervisor}</p>
              )}
              <p className="mt-3 text-sm leading-6 text-[var(--ceramic-muted)]">{project.summary}</p>
              <p className={`mt-4 font-data text-[11px] uppercase tracking-[0.16em] ${statusClass(project.status)}`}>
                {project.status}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
