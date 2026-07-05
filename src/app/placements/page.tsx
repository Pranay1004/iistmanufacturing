import Link from "next/link";
import { ArrowRight, Briefcase, GraduationCap, Mail, MapPin, Star, Users } from "lucide-react";
import { PageFrame } from "@/components/site-shell";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MetalButton } from "@/components/ui/MetalButton";
import { people } from "@/lib/data";

// Domain groups for roles/skills
const domainSkills = [
  {
    domain: "Additive Manufacturing",
    color: "arc-blue",
    roles: ["Metal AM Engineer", "Process Engineer", "AM Design Engineer", "DMLS Operator"],
  },
  {
    domain: "Composites & Materials",
    color: "forge-amber",
    roles: ["Composite Engineer", "Materials Analyst", "NDT Engineer", "Laminate Design Engineer"],
  },
  {
    domain: "Welding & Joining",
    color: "laser-green",
    roles: ["Welding Engineer", "Friction Stir Welding", "Weld Inspection Engineer", "Process Metallurgist"],
  },
  {
    domain: "CNC & Machining",
    color: "arc-blue",
    roles: ["CNC Programmer", "Manufacturing Engineer", "Tooling Engineer", "CAD-CAM Specialist"],
  },
  {
    domain: "Quality & Metrology",
    color: "forge-amber",
    roles: ["Quality Engineer", "Metrology Engineer", "PGET", "QA Analyst"],
  },
  {
    domain: "Systems & Operations",
    color: "laser-green",
    roles: ["Production Engineer", "Operations Engineer", "Smart Manufacturing Engineer", "Supply Chain Engineer"],
  },
];

const colorMap: Record<string, { badge: string; label: string; tag: string }> = {
  "arc-blue": {
    badge: "bg-[var(--arc-blue-dim)] border-[var(--arc-blue)]/20 text-[var(--arc-blue)]",
    label: "text-[var(--arc-blue)]",
    tag: "bg-[var(--arc-blue-dim)] text-[var(--arc-blue)] border-[var(--arc-blue)]/15",
  },
  "forge-amber": {
    badge: "bg-[var(--forge-amber-dim)] border-[var(--forge-amber)]/20 text-[var(--forge-amber)]",
    label: "text-[var(--forge-amber)]",
    tag: "bg-[var(--forge-amber-dim)] text-[var(--forge-amber)] border-[var(--forge-amber)]/15",
  },
  "laser-green": {
    badge: "bg-[rgba(47,139,95,0.07)] border-[var(--laser-green)]/20 text-[var(--laser-green)]",
    label: "text-[var(--laser-green)]",
    tag: "bg-[rgba(47,139,95,0.07)] text-[var(--laser-green)] border-[var(--laser-green)]/15",
  },
};

export default function PlacementsPage() {
  const outgoingBatch = people.filter((p) => p.cohort === "2024-2026");
  const currentBatch = people.filter((p) => p.cohort === "2025-2027");

  const stats = [
    { value: "85.7%", label: "Placement Rate (2024-26)", icon: Star },
    { value: String(outgoingBatch.length), label: "Outgoing Scholars", icon: GraduationCap },
    { value: String(currentBatch.length), label: "Intern-ready Scholars", icon: Users },
    { value: "20+", label: "Roles Matched", icon: Briefcase },
  ];

  return (
    <PageFrame>
      <main>
        {/* ─── HERO ─── */}
        <section className="relative border-b border-[var(--edge)] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--arc-blue-dim)_0%,_transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 surface-grid pointer-events-none opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <ScrollReveal>
              <h1 className="mt-2 max-w-4xl font-display text-4xl font-bold leading-tight text-[var(--ceramic)] sm:text-5xl lg:text-6xl">
                Hire manufacturing engineers{" "}
                <span className="gradient-shimmer">FORGED in all domains.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-[var(--ceramic-muted)] sm:text-lg">
                Our M.Tech students are engineered for precision and forged across aerospace, automobile,
                machinery, industrial systems, operations, biomedical engineering, CAD/CAM, and advanced manufacturing.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <MetalButton href="mailto:sooraj@iist.ac.in" variant="primary">
                  Contact Program Coordinator
                  <ArrowRight size={16} />
                </MetalButton>
                <MetalButton href="/people" variant="secondary">
                  Browse All Profiles
                </MetalButton>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section className="border-b border-[var(--edge)] bg-[var(--void-deep)]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-[var(--edge)] lg:grid-cols-4 lg:divide-y-0 px-4 sm:px-6 lg:px-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center py-8 text-center gap-2">
                <Icon size={20} className="text-[var(--arc-blue)]" aria-hidden />
                <p className="font-display text-4xl font-bold text-[var(--ceramic)]">{value}</p>
                <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[var(--ceramic-muted)]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── PLACEMENT POSTER SHOWCASE (2024–2026) ─── */}
        <section className="border-b border-[var(--edge)] bg-[var(--void-deep)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <ScrollReveal>
              <div className="flex flex-col gap-2 mb-8">
                <SectionLabel color="amber" className="mb-2">Official Placement Announcement</SectionLabel>
                <h2 className="font-display text-3xl font-bold text-[var(--ceramic)]">
                  M.Tech Manufacturing Technology — Class of 2024–2026
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-[var(--ceramic-muted)]">
                  85.7% placement achievement across leading aerospace, defense, precision engineering firms, and prestigious doctoral research offers.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="up">
              <div className="overflow-hidden rounded-2xl border border-[var(--edge)] bg-black/40 shadow-2xl transition-all hover:border-[var(--forge-amber)]/40">
                <img
                  src="/media/photos/placed-2024-2026.jpeg"
                  alt="M.Tech Manufacturing Technology 2024-2026 Placements Announcement Poster"
                  className="w-full h-auto object-contain max-h-[850px] mx-auto"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── OUTGOING BATCH ─── */}
        <section className="border-b border-[var(--edge)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <ScrollReveal>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-10">
                <div>
                  <SectionLabel color="amber" className="mb-2">Class of 2024–2026</SectionLabel>
                  <h2 className="font-display text-3xl font-bold text-[var(--ceramic)]">
                    Outgoing batch — Career Destinations
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--ceramic-muted)]">
                    Scholars completing their M.Tech thesis work with placement offers and higher studies destinations.
                  </p>
                </div>
                <MetalButton href="/people" variant="ghost">
                  View full profiles <ArrowRight size={14} />
                </MetalButton>
              </div>
            </ScrollReveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {outgoingBatch.map((person) => (
                <ScrollReveal key={person.slug} variant="up">
                  <Link
                    href={`/people/${person.slug}`}
                    className="group block rounded-xl border border-[var(--edge)] bg-[var(--void-deep)] p-5 transition-all duration-200 hover:border-[var(--forge-amber)] hover:shadow-[var(--shadow-glow-amber)] hover:-translate-y-0.5"
                  >
                    {/* Avatar placeholder */}
                    <div className="mb-4 grid size-12 place-items-center rounded-xl bg-[var(--forge-amber-dim)] border border-[var(--forge-amber)]/15 font-display text-lg font-bold text-[var(--forge-amber)]">
                      {person.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>

                    <p className="font-display text-base font-semibold text-[var(--ceramic)] group-hover:text-[var(--forge-amber)] transition-colors">
                      {person.name}
                    </p>
                    <p className="mt-0.5 font-data text-[10px] uppercase tracking-wider text-[var(--forge-amber)]">
                      {person.specialization}
                    </p>

                    {person.placedAt && (
                      <div className="mt-3 rounded-lg border border-[var(--forge-amber)]/25 bg-[var(--forge-amber-dim)]/40 p-2.5">
                        <p className="font-data text-[9px] uppercase tracking-widest text-[var(--forge-amber)] font-bold">
                          Destination
                        </p>
                        <p className="text-xs font-semibold text-[var(--ceramic)] mt-0.5">
                          {person.placedAt}
                        </p>
                        {person.placedRole && (
                          <p className="text-[11px] text-[var(--ceramic-muted)]">
                            {person.placedRole}
                          </p>
                        )}
                      </div>
                    )}

                    {person.internship && (
                      <div className="mt-2.5">
                        <p className="font-data text-[9px] uppercase tracking-widest text-[var(--ceramic-muted)]">
                          Thesis / Project
                        </p>
                        <p className="text-[11px] leading-relaxed text-[var(--ceramic-muted)] line-clamp-2 mt-0.5">
                          {person.internship}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-[var(--forge-amber)]/20 bg-[var(--forge-amber-dim)] px-2 py-0.5 text-[10px] font-medium text-[var(--forge-amber)]">
                        {person.placedAt ? "Placed" : "Open to roles"}
                      </span>
                      {person.linkedin && (
                        <span className="rounded-full border border-[var(--edge)] px-2 py-0.5 text-[10px] text-[var(--ceramic-muted)]">
                          LinkedIn ↗
                        </span>
                      )}
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CURRENT BATCH (INTERNS) ─── */}
        <section className="border-b border-[var(--edge)] bg-[var(--void-deep)] surface-grid">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <ScrollReveal>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-10">
                <div>
                  <SectionLabel color="blue" className="mb-2">Class of 2025–2027</SectionLabel>
                  <h2 className="font-display text-3xl font-bold text-[var(--ceramic)]">
                    Current batch — open for internships
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--ceramic-muted)]">
                    These scholars are in their second semester, available for industry internships,
                    summer projects, and thesis collaborations starting mid-2026.
                  </p>
                </div>
                <MetalButton href="/people" variant="ghost">
                  View full profiles <ArrowRight size={14} />
                </MetalButton>
              </div>
            </ScrollReveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {currentBatch.map((person) => (
                <ScrollReveal key={person.slug} variant="up">
                  <Link
                    href={`/people/${person.slug}`}
                    className="group block rounded-xl border border-[var(--edge)] bg-white p-5 transition-all duration-200 hover:border-[var(--arc-blue)] hover:shadow-[var(--shadow-glow-blue)] hover:-translate-y-0.5"
                  >
                    <div className="mb-4 grid size-12 place-items-center rounded-xl bg-[var(--arc-blue-dim)] border border-[var(--arc-blue)]/15 font-display text-lg font-bold text-[var(--arc-blue)]">
                      {person.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>

                    <p className="font-display text-base font-semibold text-[var(--ceramic)] group-hover:text-[var(--arc-blue)] transition-colors">
                      {person.name}
                    </p>
                    <p className="mt-0.5 font-data text-[10px] uppercase tracking-wider text-[var(--arc-blue)]">
                      {person.specialization}
                    </p>

                    <div className="mt-3">
                      <span className="rounded-full border border-[var(--arc-blue)]/20 bg-[var(--arc-blue-dim)] px-2 py-0.5 text-[10px] font-medium text-[var(--arc-blue)]">
                        Open to internships
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SKILL DOMAINS ─── */}
        <section className="border-b border-[var(--edge)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <ScrollReveal>
              <SectionLabel className="mb-3">Skill Matrix</SectionLabel>
              <h2 className="font-display text-3xl font-bold text-[var(--ceramic)]">
                Core competency domains
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ceramic-muted)]">
                Profiles are distributed across six core manufacturing competency domains, versatile enough for high-tech sectors spanning aerospace, automotive, machinery, biomedical systems, CAD/CAM, and industrial operations.
              </p>
            </ScrollReveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {domainSkills.map((domain) => {
                const colors = colorMap[domain.color];
                return (
                  <ScrollReveal key={domain.domain} variant="up">
                    <GlassCard className="h-full">
                      <div className={`mb-4 inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${colors.badge}`}>
                        {domain.domain}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {domain.roles.map((role) => (
                          <span
                            key={role}
                            className={`rounded-md border px-2.5 py-1 text-xs font-medium ${colors.tag}`}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </GlassCard>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── PROGRAM CONTEXT ─── */}
        <section className="border-b border-[var(--edge)] bg-[var(--void-deep)] surface-grid">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 items-start">
              <ScrollReveal variant="left">
                <SectionLabel color="amber" className="mb-3">Program Context</SectionLabel>
                <h2 className="font-display text-3xl font-bold text-[var(--ceramic)]">
                  Why IIST Manufacturing Technology?
                </h2>
                <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--ceramic-muted)]">
                  <p>
                    The M.Tech Manufacturing Technology program at the Indian Institute of Space
                    Science & Technology (IIST) is a 2-year postgraduate program embedded in the
                    Aerospace Engineering department, focusing on multi-disciplinary engineering excellence.
                  </p>
                  <p>
                    While our roots lie in handling demanding aerospace-grade challenges with exposure to ISRO facilities (VSSC, LPSC, CMSE, IISU), the training builds a core foundation of versatility. Our students are prepared to tackle precision engineering in automobile, biomedical devices, heavy machinery, and industrial operations.
                  </p>
                  <p>
                    Graduates are equipped for diverse, high-impact roles in aerospace and defense production, automotive manufacturing, advanced biomedical machinery, operations management, CAD/CAM software development, and cutting-edge R&D labs.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="right">
                <div className="space-y-4">
                  {[
                    ["ISRO Centre Exposure", "Industrial visits to VSSC, LPSC, IISU, CMSE"],
                    ["Hands-on Labs", "Composite, welding, additive, metrology facilities"],
                    ["Thesis Projects", "Real aerospace manufacturing challenges"],
                    ["PhD Pathways", "Aligned PhD research opportunities at IIST"],
                  ].map(([title, desc]) => (
                    <div
                      key={title}
                      className="flex items-start gap-4 rounded-xl border border-[var(--edge)] bg-white p-4"
                    >
                      <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--arc-blue-dim)]">
                        <Star size={15} className="text-[var(--arc-blue)]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--ceramic)]">{title}</p>
                        <p className="mt-0.5 text-sm text-[var(--ceramic-muted)]">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="bg-gradient-to-br from-[var(--arc-blue)] to-[var(--cool-zone)]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Ready to hire from IIST?
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-base text-white/80 leading-7">
                Reach out to the program coordinator to discuss campus recruitment, project
                sponsorships, and internship programs.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <a
                  href="mailto:sooraj@iist.ac.in"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[var(--arc-blue)] hover:bg-white/90 transition-all shadow-lg"
                >
                  <Mail size={16} />
                  Email Program Coordinator
                </a>
                <a
                  href="https://www.iist.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all"
                >
                  <MapPin size={16} />
                  Visit IIST Website
                </a>
              </div>

              <p className="mt-8 font-data text-[10px] uppercase tracking-[0.2em] text-white/50">
                Indian Institute of Space Science and Technology · Valiamala, Thiruvananthapuram
              </p>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
