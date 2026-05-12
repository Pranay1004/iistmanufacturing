import { PageFrame } from "@/components/site-shell";
import { people } from "@/lib/data";

export default function PlacementsPage() {
  const roles = Array.from(
    new Set(
      people
        .flatMap((person) => person.seekingRoles ?? [])
        .filter(Boolean),
    ),
  );

  return (
    <PageFrame>
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">Recruitment</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold leading-tight">
          A recruiter-facing view of manufacturing skills, roles, and resume-ready profiles.
        </h1>
        <div className="mt-10 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="border-t border-stone-300 pt-5">
            <h2 className="font-serif text-3xl font-semibold">Role interests</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {roles.map((role) => (
                <span key={role} className="rounded-sm bg-[#f0dfc2] px-2 py-1 text-sm text-[#70420f]">
                  {role}
                </span>
              ))}
            </div>
          </aside>
          <section className="border-t border-stone-300 pt-5">
            <h2 className="font-serif text-3xl font-semibold">Batch readiness</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                ["2024-2026", "Outgoing batch", "Profiles ready for thesis, full-time, and project discussions."],
                ["2025-2027", "Current batch", "Open for internships, projects, and industry mentoring."],
                ["2026-2028", "Incoming batch", "Reserved slots unlock after joining."],
              ].map(([batch, title, text]) => (
                <article key={batch} className="border-t border-stone-300 pt-4">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#8c1515]">{batch}</p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-700">{text}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </PageFrame>
  );
}
