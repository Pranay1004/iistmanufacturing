import { PageFrame } from "@/components/site-shell";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import { academicEvents, collaborations, people } from "@/lib/data";

export default function ResearchPage() {
  const mtechProjects = people.filter((person) => person.type === "student" && person.projects.length);
  const phdProjects = people.filter((person) => person.type === "phd" && person.projects.length);
  const areas = [
    "Additive manufacturing for aerospace structures",
    "Aerospace alloys, hot working, and deformation processing",
    "Composite manufacturing and inspection-ready quality workflows",
    "Welding, joining, and heat affected zone studies",
    "Manufacturing scheduling, operations research, and supply chain systems",
    "CAD-CAM, subtractive manufacturing, and hybrid process planning",
  ];

  return (
    <PageFrame>
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <ScrollReveal>
          <SectionLabel className="mb-3">Projects in Progress</SectionLabel>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight text-[var(--ceramic)] sm:text-5xl">
            Ongoing M.Tech and PhD work in aerospace manufacturing technology.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--ceramic-muted)] sm:text-lg sm:leading-8">
            This page tracks active student and doctoral projects, with profile-linked dossiers
            that can later include abstracts, reports, publications, media, and downloadable outputs.
          </p>
        </ScrollReveal>

        {/* ─── M.Tech Projects ─── */}
        <section className="mt-12">
          <ScrollReveal>
            <Divider className="mb-6" />
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <SectionLabel color="amber">M.Tech</SectionLabel>
                <h2 className="mt-3 font-display text-3xl font-bold text-[var(--ceramic)]">Current and outgoing project dossiers</h2>
              </div>
              <span className="font-data text-[11px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)]">
                {mtechProjects.length} active profiles
              </span>
            </div>
          </ScrollReveal>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {mtechProjects.slice(0, 16).map((person, i) => (
              <ScrollReveal key={person.slug} delay={i * 80}>
                <GlassCard variant="compact">
                  <span className="font-data text-[10px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)]">
                    {person.batch} · {person.specialization}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-bold text-[var(--ceramic)]">{person.projects[0].title}</h3>
                  <p className="mt-1 text-sm font-semibold text-[var(--arc-blue)]">{person.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--ceramic-muted)]">{person.projects[0].summary}</p>
                  <span className="mt-3 inline-block font-data text-[10px] uppercase tracking-[0.14em] text-[var(--forge-amber)]">
                    {person.projects[0].status}
                  </span>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ─── PhD Projects ─── */}
        <section className="mt-16">
          <ScrollReveal>
            <Divider className="mb-6" />
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <SectionLabel color="green">PhD</SectionLabel>
                <h2 className="mt-3 font-display text-3xl font-bold text-[var(--ceramic)]">Doctoral projects under manufacturing faculty</h2>
              </div>
              <span className="font-data text-[11px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)]">
                {phdProjects.length} doctoral profiles
              </span>
            </div>
          </ScrollReveal>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {phdProjects.map((person, i) => (
              <ScrollReveal key={person.slug} delay={i * 80}>
                <GlassCard variant="featured" accent="green">
                  <span className="font-data text-[10px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)]">
                    {person.admissionYear}
                    {person.mode ? ` · ${person.mode}` : ""}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-bold text-[var(--ceramic)]">{person.projects[0].title}</h3>
                  <p className="mt-1 text-sm font-semibold text-[var(--arc-blue)]">{person.name}</p>
                  <p className="mt-1 text-sm text-[var(--ceramic-muted)]">Supervisor: {person.supervisor}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--ceramic-muted)]">{person.projects[0].summary}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ─── Themes & Outputs ─── */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <ScrollReveal variant="left" as="section">
            <Divider className="mb-6" />
            <h2 className="font-display text-3xl font-bold text-[var(--ceramic)]">Project themes</h2>
            <div className="mt-5 space-y-3">
              {areas.map((area) => (
                <div key={area} className="flex gap-3 text-sm leading-7 text-[var(--ceramic-muted)]">
                  <span className="mt-2 block size-1.5 shrink-0 rounded-full bg-[var(--arc-blue)]" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal variant="right" as="section">
            <Divider className="mb-6" />
            <h2 className="font-display text-3xl font-bold text-[var(--ceramic)]">Publication-ready outputs</h2>
            <div className="mt-5 space-y-4">
              {[
                "Thesis synopsis and abstract pages for each M.Tech scholar",
                "Doctoral progress summaries under the relevant faculty supervisor",
                "Conference papers, journal submissions, posters, and technical reports when approved",
                "Project media, process sheets, lab notes, datasets, and downloadable public artifacts",
              ].map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-7 text-[var(--ceramic-muted)]">
                  <span className="mt-2 block size-1.5 shrink-0 rounded-full bg-[var(--forge-amber)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* ─── Events & Collaborations ─── */}
        <section className="mt-16 grid gap-12 lg:grid-cols-2">
          <ScrollReveal variant="left" as="div">
            <Divider className="mb-6" />
            <SectionLabel color="amber">Conferences, seminars, workshops</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-bold text-[var(--ceramic)]">Department event record</h2>
            <div className="mt-5 space-y-4">
              {academicEvents.map((event, i) => (
                <ScrollReveal key={event.title} delay={i * 60}>
                  <GlassCard variant="compact">
                    <span className="font-data text-[10px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)]">{event.date}</span>
                    <h3 className="mt-2 font-display text-xl font-bold text-[var(--ceramic)]">{event.title}</h3>
                    <p className="mt-1 text-sm text-[var(--arc-blue)]">{event.scope}</p>
                  </GlassCard>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal variant="right" as="div">
            <Divider className="mb-6" />
            <SectionLabel color="green">MoUs and collaborations</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-bold text-[var(--ceramic)]">Relevant institutional links</h2>
            <div className="mt-5 space-y-4">
              {collaborations.map((item, i) => (
                <ScrollReveal key={item.partner} delay={i * 60}>
                  <GlassCard variant="featured" accent="green">
                    <h3 className="font-display text-xl font-bold text-[var(--ceramic)]">{item.partner}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--ceramic-muted)]">{item.summary}</p>
                  </GlassCard>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </section>
      </main>
    </PageFrame>
  );
}
