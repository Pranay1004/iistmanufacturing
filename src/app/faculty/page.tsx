import { ExternalLink, Mail, Share2, Wrench } from "lucide-react";
import { getPeopleByType } from "@/lib/data";
import { PageFrame } from "@/components/site-shell";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Portrait } from "@/components/person-card";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function FacultyPage() {
  const faculty = getPeopleByType("faculty");
  const staff = getPeopleByType("staff");

  return (
    <PageFrame>
      <main>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <ScrollReveal>
            <SectionLabel className="mb-3">Faculty & Staff</SectionLabel>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight text-[var(--ceramic)] sm:text-5xl">
              Faculty anchors for manufacturing technology in aerospace engineering.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--ceramic-muted)] sm:text-lg sm:leading-8">
              Research, teaching, labs, and guidance are kept here as a dedicated faculty layer,
              separate from the yearwise student and PhD directory.
            </p>
          </ScrollReveal>
        </section>

        {/* Faculty Cards */}
        <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          {faculty.map((person) => (
            <GlassCard key={person.slug} className="flex h-full flex-col">
              <div className="flex items-start gap-4">
                <Portrait name={person.name} />
                <div className="min-w-0">
                  <p className="font-data text-[10px] uppercase tracking-[0.16em] text-[var(--forge-amber)]">
                    {person.role}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-[var(--ceramic)]">
                    {person.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--ceramic-muted)]">
                    {person.specialization}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {(person.researchInterests ?? person.skills).slice(0, 4).map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-[var(--edge)] bg-[var(--panel)] px-2 py-0.5 text-xs text-[var(--ceramic-muted)]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <p className="mt-5 flex-1 text-sm leading-6 text-[var(--ceramic-muted)]">
                {person.synopsis}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href={`mailto:${person.officialEmail}`}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-[var(--arc-blue)] px-3 text-sm font-medium text-white hover:brightness-90 hover:shadow-[var(--shadow-glow-blue)] sm:flex-none"
                >
                  <Mail size={16} aria-hidden />
                  Email
                </a>
                {person.linkedin && (
                  <a
                    href={person.linkedin}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-[var(--edge)] bg-[var(--panel)] px-3 text-sm font-medium text-[var(--ceramic)] hover:border-[var(--arc-blue)] sm:flex-none"
                  >
                    <Share2 size={16} aria-hidden />
                    LinkedIn
                  </a>
                )}
                {person.sourceUrl && (
                  <a
                    href={person.sourceUrl}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-[var(--edge)] bg-[var(--panel)] px-3 text-sm font-medium text-[var(--ceramic)] hover:border-[var(--forge-amber)] sm:flex-none"
                  >
                    <ExternalLink size={16} aria-hidden />
                    IIST Profile
                  </a>
                )}
              </div>
            </GlassCard>
          ))}
        </section>

        {/* Staff Section */}
        {staff.length > 0 && (
          <section className="border-t border-[var(--edge)] bg-[var(--void-deep)] surface-grid">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <ScrollReveal>
                <SectionLabel color="amber" className="mb-3">Lab Staff</SectionLabel>
                <h2 className="font-display text-3xl font-bold text-[var(--ceramic)]">
                  Technical Support & Laboratory Staff
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ceramic-muted)]">
                  Technical staff who maintain the laboratory ecosystem, support student experiments,
                  and keep the manufacturing facilities running at IIST.
                </p>
              </ScrollReveal>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {staff.map((person) => (
                  <ScrollReveal key={person.slug} variant="up">
                    <GlassCard className="flex flex-col h-full">
                      <div className="flex items-center gap-4">
                        <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-[var(--forge-amber-dim)] border border-[var(--forge-amber)]/20">
                          <Wrench size={22} className="text-[var(--forge-amber)]" aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <p className="font-data text-[10px] uppercase tracking-[0.16em] text-[var(--forge-amber)]">
                            {person.role}
                          </p>
                          <h3 className="mt-1 font-display text-xl font-bold leading-tight text-[var(--ceramic)]">
                            {person.name}
                          </h3>
                        </div>
                      </div>

                      <p className="mt-4 flex-1 text-sm leading-6 text-[var(--ceramic-muted)]">
                        {person.synopsis}
                      </p>

                      {person.location && (
                        <p className="mt-3 font-data text-[10px] uppercase tracking-wider text-[var(--ceramic-muted)]/70">
                          📍 {person.location}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap gap-2">
                        {person.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-[var(--edge)] bg-[var(--panel)] px-2 py-0.5 text-xs text-[var(--ceramic-muted)]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5">
                        <a
                          href={`mailto:${person.officialEmail}`}
                          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[var(--forge-amber)]/40 bg-[var(--forge-amber-dim)] px-3 text-sm font-medium text-[var(--forge-amber)] hover:bg-[var(--forge-amber)] hover:text-white transition-all duration-200"
                        >
                          <Mail size={15} aria-hidden />
                          Contact
                        </a>
                      </div>
                    </GlassCard>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </PageFrame>
  );
}
