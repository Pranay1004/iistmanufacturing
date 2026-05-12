import { PageFrame } from "@/components/site-shell";
import { academicEvents, collaborations, people } from "@/lib/data";

export default function ResearchPage() {
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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">Research</p>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
          Space-oriented manufacturing themes with room for student-led project dossiers.
        </h1>
        <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <section>
            <h2 className="border-t border-stone-300 pt-5 font-serif text-3xl font-semibold">Research areas</h2>
            <div className="mt-5 space-y-3">
              {areas.map((area) => (
                <p key={area} className="border-t border-stone-300 pt-3 leading-7 text-stone-700">
                  {area}
                </p>
              ))}
            </div>
          </section>
          <section>
            <h2 className="border-t border-stone-300 pt-5 font-serif text-3xl font-semibold">Active profile projects</h2>
            <div className="mt-5 space-y-5">
              {people
                .filter((person) => person.projects.length)
                .slice(0, 10)
                .map((person) => (
                  <article key={person.slug} className="border-t border-stone-300 pt-4">
                    <p className="font-semibold text-[#0b5d6b]">{person.name}</p>
                    <h3 className="mt-1 font-serif text-2xl font-semibold">{person.projects[0].title}</h3>
                    <p className="mt-2 leading-7 text-stone-700">{person.projects[0].summary}</p>
                  </article>
                ))}
            </div>
          </section>
        </div>
        <section className="mt-12 grid gap-10 border-t border-stone-300 pt-6 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">
              Conferences, seminars, workshops
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold">Department event record</h2>
            <div className="mt-5 space-y-4">
              {academicEvents.map((event) => (
                <article key={event.title} className="border-t border-stone-300 pt-4">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-stone-500">{event.date}</p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold">{event.title}</h3>
                  <p className="mt-1 text-sm text-[#0b5d6b]">{event.scope}</p>
                </article>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">
              MoUs and collaborations
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold">Relevant institutional links</h2>
            <div className="mt-5 space-y-4">
              {collaborations.map((item) => (
                <article key={item.partner} className="border-t border-stone-300 pt-4">
                  <h3 className="font-serif text-2xl font-semibold">{item.partner}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-700">{item.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
