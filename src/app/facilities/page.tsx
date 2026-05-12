import { PageFrame } from "@/components/site-shell";
import { facilities, industrialVisits } from "@/lib/data";

export default function FacilitiesPage() {
  return (
    <PageFrame>
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">Facilities</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold leading-tight">
          Labs, equipment culture, and ISRO exposure for manufacturing technology.
        </h1>
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {facilities.map((facility) => (
            <article key={facility.name} className="border-t border-stone-300 pt-5">
              <h2 className="font-serif text-3xl font-semibold">{facility.name}</h2>
              <p className="mt-3 leading-7 text-stone-700">{facility.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {facility.capabilities.map((capability) => (
                  <span key={capability} className="rounded-sm border border-stone-300 bg-white px-2 py-1 text-sm">
                    {capability}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
        <section className="mt-12 border-t border-stone-300 pt-6">
          <h2 className="font-serif text-3xl font-semibold">Industrial and ISRO centre exposure</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-5">
            {industrialVisits.map((centre) => (
              <div key={centre} className="border-y border-stone-300 bg-[#f3eee6] px-4 py-5 text-center font-serif text-2xl font-semibold text-[#8c1515]">
                {centre}
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
