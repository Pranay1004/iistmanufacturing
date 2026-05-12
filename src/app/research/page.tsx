import { ResearchProjects } from "@/components/research-projects";
import { PageFrame } from "@/components/site-shell";
import { academicEvents, collaborations, industrialVisits } from "@/lib/data";

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
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">Projects in Progress</p>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
          Ongoing M.Tech, PhD, and B.Tech work in aerospace manufacturing technology.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">
          This page tracks active student and doctoral projects year-wise, with profile-linked dossiers
          that can later include abstracts, reports, publications, media, and downloadable outputs.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {industrialVisits.map((centre) => (
            <span key={centre} className="rounded-sm bg-[#f0dfc2] px-2 py-1 font-mono text-xs uppercase tracking-[0.14em] text-[#70420f]">
              {centre}
            </span>
          ))}
        </div>

        <ResearchProjects />

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <section>
            <h2 className="border-t border-stone-300 pt-5 font-serif text-3xl font-semibold">Project themes</h2>
            <div className="mt-5 space-y-3">
              {areas.map((area) => (
                <p key={area} className="border-t border-stone-300 pt-3 leading-7 text-stone-700">
                  {area}
                </p>
              ))}
            </div>
          </section>
          <section>
            <h2 className="border-t border-stone-300 pt-5 font-serif text-3xl font-semibold">Publication-ready outputs</h2>
            <div className="mt-5 space-y-5">
              {[
                "Thesis synopsis and abstract pages for each M.Tech scholar",
                "Doctoral progress summaries under the relevant faculty supervisor",
                "Conference papers, journal submissions, posters, and technical reports when approved",
                "Project media, process sheets, lab notes, datasets, and downloadable public artifacts",
              ].map((item) => (
                <p key={item} className="border-t border-stone-300 pt-4 leading-7 text-stone-700">
                  {item}
                </p>
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
