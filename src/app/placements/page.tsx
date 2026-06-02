import { PageFrame } from "@/components/site-shell";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { people } from "@/lib/data";

export default function PlacementsPage() {
  const publicPeople = people.filter((person) => person.cohort !== "2026-2028");
  const roles = Array.from(
    new Set(
      publicPeople
        .flatMap((person) => person.seekingRoles ?? [])
        .filter(Boolean),
    ),
  );

  return (
    <PageFrame>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <ScrollReveal>
          <SectionLabel className="mb-3">Recruitment</SectionLabel>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight text-[var(--ceramic)] sm:text-5xl">
            A recruiter-facing view of manufacturing skills, roles, and resume-ready profiles.
          </h1>
        </ScrollReveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <ScrollReveal variant="left" as="aside">
            <h2 className="font-display text-2xl font-bold text-[var(--ceramic)]">Role interests</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {roles.map((role) => (
                <span key={role} className="rounded-md bg-[var(--forge-amber-dim)] px-2.5 py-1 text-sm text-[var(--forge-amber)] transition-colors duration-200 hover:bg-[var(--forge-amber)] hover:text-white">
                  {role}
                </span>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal variant="right" as="section">
            <h2 className="font-display text-2xl font-bold text-[var(--ceramic)]">Batch readiness</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                ["2024-2026", "Outgoing batch", "Profiles ready for thesis, full-time, and project discussions."],
                ["2025-2027", "Current batch", "Open for internships, projects, and industry mentoring."],
              ].map(([batch, title, text]) => (
                <GlassCard key={batch}>
                  <SectionLabel color="amber" className="mb-2">{batch}</SectionLabel>
                  <h3 className="font-display text-xl font-semibold text-[var(--ceramic)]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--ceramic-muted)]">{text}</p>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </main>
    </PageFrame>
  );
}
